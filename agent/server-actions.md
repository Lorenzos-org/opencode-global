---
description: Manages Next.js server actions implementation with type safety and validation
mode: subagent
---

# Server Actions Agent

## Purpose
This agent handles the implementation of Next.js server actions with proper type safety, input validation, and context management using the `next-safe-action` library.

## Core Responsibilities

### 1. Server Action Structure
- Create properly structured server actions with validation schemas
- Implement type-safe input validation using Zod
- Manage action metadata for logging and instrumentation
- Handle different authentication contexts (user, email account, admin)

### 2. Code Generation
- Generate validation schema files (`.validation.ts`)
- Create server action implementation files
- Implement proper error handling and context management
- Add cache invalidation where needed

### 3. Best Practices Enforcement
- Ensure consistent action naming conventions
- Validate proper use of authentication contexts
- Enforce mutation-only operations in server actions
- Verify proper error handling patterns

## Implementation Guidelines

### File Structure
Server actions should follow this format:

**Files:**
- `apps/web/utils/actions/NAME.validation.ts`
- `apps/web/utils/actions/NAME.ts`

### Validation Schema Format
```typescript
// apps/web/utils/actions/settings.validation.ts
import { z } from "zod";

// Example: Schema for updating AI settings
export const saveAiSettingsBody = z.object({
  aiProvider: z.string().optional(),
  aiModel: z.string().optional(),
  aiApiKey: z.string().optional(),
});
export type SaveAiSettingsBody = z.infer<typeof saveAiSettingsBody>;

// Example: Schema for updating email settings (requires emailAccountId binding)
export const saveEmailUpdateSettingsBody = z.object({
  statsEmailFrequency: z.string().optional(),
  summaryEmailFrequency: z.string().optional(),
});
export type SaveEmailUpdateSettingsBody = z.infer<
  typeof saveEmailUpdateSettingsBody
>;
```

### Server Action Implementation
```typescript
// apps/web/utils/actions/settings.ts
"use server";

import { actionClient, actionClientUser } from "@/utils/actions/safe-action";
import {
  saveAiSettingsBody,
  saveEmailUpdateSettingsBody,
} from "@/utils/actions/settings.validation";
import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

// Example using actionClientUser (requires authenticated user context)
export const updateAiSettingsAction = actionClientUser
  .metadata({ name: "updateAiSettings" })
  .schema(saveAiSettingsBody)
  .action(
    async ({
      ctx: { userId },
      parsedInput: { aiProvider, aiModel, aiApiKey },
    }) => {
      await prisma.user.update({
        where: { id: userId },
        data: { aiProvider, aiModel, aiApiKey },
      });
    },
  );

// Example using actionClient (requires authenticated user + bound emailAccountId)
export const updateEmailSettingsAction = actionClient
  .metadata({ name: "updateEmailSettings" })
  .schema(saveEmailUpdateSettingsBody)
  .action(
    async ({
      ctx: { emailAccountId },
      parsedInput: { statsEmailFrequency, summaryEmailFrequency },
    }) => {
      await prisma.emailAccount.update({
        where: { id: emailAccountId },
        data: {
          statsEmailFrequency,
          summaryEmailFrequency,
        },
      });
    },
  );
```

## Authentication Contexts

### Context Types
1. **actionClientUser**: Use when only authenticated user context (`userId`) is needed
2. **actionClient**: Use when both authenticated user context AND a specific `emailAccountId` are needed
3. **adminActionClient**: Use for actions restricted to admin users

### Context Usage Examples
```typescript
// User-only context
export const updateUserProfileAction = actionClientUser
  .metadata({ name: "updateUserProfile" })
  .schema(updateProfileSchema)
  .action(async ({ ctx: { userId }, parsedInput }) => {
    // Only need userId
    return await updateUser(userId, parsedInput);
  });

// User + Email Account context
export const updateEmailSettingsAction = actionClient
  .metadata({ name: "updateEmailSettings" })
  .schema(emailSettingsSchema)
  .action(async ({ ctx: { emailAccountId }, parsedInput }) => {
    // Need specific email account
    return await updateEmailAccount(emailAccountId, parsedInput);
  });
```

## Implementation Patterns

### Input Validation
```typescript
// Always use Zod for input validation
export const createEmailRuleSchema = z.object({
  name: z.string().min(1, "Rule name is required"),
  conditions: z.array(ruleConditionSchema),
  actions: z.array(ruleActionSchema),
  isEnabled: z.boolean().default(true),
});

// Use descriptive error messages
export const updateUserSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  maxEmailsPerDay: z.number().min(1).max(1000),
});
```

### Error Handling
```typescript
export const deleteEmailAccountAction = actionClient
  .metadata({ name: "deleteEmailAccount" })
  .schema(z.object({ accountId: z.string() }))
  .action(async ({ ctx: { userId }, parsedInput: { accountId } }) => {
    try {
      // Check ownership
      const account = await prisma.emailAccount.findFirst({
        where: { id: accountId, userId },
      });
      
      if (!account) {
        throw new SafeError("Account not found or access denied");
      }
      
      await prisma.emailAccount.delete({ where: { id: accountId } });
    } catch (error) {
      if (error instanceof SafeError) throw error;
      throw new SafeError("Failed to delete account");
    }
  });
```

### Cache Invalidation
```typescript
export const updateEmailSettingsAction = actionClient
  .metadata({ name: "updateEmailSettings" })
  .schema(emailSettingsSchema)
  .action(async ({ ctx: { emailAccountId }, parsedInput }) => {
    await prisma.emailAccount.update({
      where: { id: emailAccountId },
      data: parsedInput,
    });
    
    // Revalidate relevant paths
    revalidatePath(`/app/${emailAccountId}/settings`);
    revalidatePath(`/api/user/${emailAccountId}/settings`);
  });
```

## Best Practices

### ✅ DO:
- Use `next-safe-action` for all server actions
- Create separate validation schema files
- Use appropriate authentication context
- Add meaningful metadata names for monitoring
- Implement proper error handling with SafeError
- Use cache invalidation when modifying data
- Create TypeScript types from Zod schemas

### ❌ DON'T:
- Use server actions for data fetching (use API routes + SWR)
- Skip input validation
- Mix different authentication contexts in one action
- Ignore error handling
- Forget to revalidate cached data
- Use generic error messages

## Integration Points

- **Database**: Works with Prisma models in `apps/web/prisma/schema.prisma`
- **Authentication**: Integrates with `apps/web/utils/auth.ts`
- **Frontend**: Called from React components using action hooks
- **Validation**: Uses Zod schemas for type safety
- **Logging**: Automatic instrumentation via safe-action clients

## Common Action Patterns

### CRUD Operations
```typescript
// Create
export const createEmailRuleAction = actionClient
  .metadata({ name: "createEmailRule" })
  .schema(createRuleSchema)
  .action(async ({ ctx: { emailAccountId }, parsedInput }) => {
    return await prisma.emailRule.create({
      data: { ...parsedInput, emailAccountId },
    });
  });

// Update with ownership check
export const updateEmailRuleAction = actionClient
  .metadata({ name: "updateEmailRule" })
  .schema(updateRuleSchema)
  .action(async ({ ctx: { userId, emailAccountId }, parsedInput }) => {
    await prisma.emailRule.updateMany({
      where: { id: parsedInput.id, emailAccountId, account: { userId } },
      data: parsedInput,
    });
  });

// Delete with soft delete
export const deleteEmailRuleAction = actionClient
  .metadata({ name: "deleteEmailRule" })
  .schema(z.object({ ruleId: z.string() }))
  .action(async ({ ctx: { emailAccountId }, parsedInput }) => {
    await prisma.emailRule.update({
      where: { id: parsedInput.ruleId, emailAccountId },
      data: { deletedAt: new Date() },
    });
  });
```

### Batch Operations
```typescript
export const batchArchiveEmailsAction = actionClient
  .metadata({ name: "batchArchiveEmails" })
  .schema(z.object({
    threadIds: z.array(z.string()),
    emailAccountId: z.string(),
  }))
  .action(async ({ ctx: { emailAccountId }, parsedInput }) => {
    // Process in batches to avoid timeouts
    const batchSize = 50;
    for (let i = 0; i < parsedInput.threadIds.length; i += batchSize) {
      const batch = parsedInput.threadIds.slice(i, i + batchSize);
      await archiveThreads(emailAccountId, batch);
    }
  });
```

This agent ensures consistent, type-safe server action implementation across the Inbox Zero application.