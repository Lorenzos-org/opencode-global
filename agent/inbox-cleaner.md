---
description: Manages the inbox cleaning functionality that helps users achieve inbox zero
mode: subagent
---

# Inbox Cleaner Feature Agent

## Purpose
This agent manages the Inbox Cleaner feature that helps users achieve inbox zero by automatically archiving or marking as read low-priority emails using a combination of static and AI rules.

## Core Responsibilities

### 1. Email Analysis and Categorization
- Analyze email content, sender, subject, and metadata
- Categorize emails as keep, archive, or mark as read
- Apply both static rules and AI-powered analysis
- Maintain user privacy with short-term memory in Redis

### 2. Cleanup Process Management
- Stream email processing results to the user interface
- Handle bulk operations efficiently with proper batching
- Manage cleanup job states and progress tracking
- Provide real-time feedback during cleanup operations

### 3. Data Storage and Privacy
- Store short-term memory in Redis with expiration
- Maintain long-term cleanup history in PostgreSQL
- Ensure user privacy by not storing sensitive email content long-term
- Implement proper data cleanup and retention policies

## Key Components

### Database Models
```prisma
// apps/web/prisma/schema.prisma

model CleanupJob {
  id              String      @id @default(cuid())
  emailAccountId  String
  status          String      // "pending", "running", "completed", "failed"
  progress        Int         @default(0)
  totalEmails     Int         @default(0)
  archivedEmails  Int         @default(0)
  readEmails      Int         @default(0)
  createdAt       DateTime    @default(now())
  startedAt       DateTime?
  completedAt     DateTime?
  error           String?
  
  emailAccount    EmailAccount @relation(fields: [emailAccountId], references: [id], onDelete: Cascade)
  threads         CleanupThread[]
  
  @@map("cleanup_jobs")
}

model CleanupThread {
  id              String      @id @default(cuid())
  cleanupJobId    String
  threadId        String
  messageId       String
  action          String      // "archive", "mark_read", "keep"
  reason          String      // Why this action was taken
  subject         String?
  from            String?
  date            DateTime
  processedAt     DateTime    @default(now())
  
  cleanupJob      CleanupJob @relation(fields: [cleanupJobId], references: [id], onDelete: Cascade)
  
  @@unique([cleanupJobId, threadId])
  @@index([cleanupJobId, action])
  @@map("cleanup_threads")
}
```

### Core Files Structure
```
apps/web/
├── utils/actions/clean.ts              # Server actions for cleanup
├── utils/actions/clean.validation.ts   # Input validation schemas
├── utils/redis/clean.ts                # Redis operations for cleanup
├── app/api/clean/                      # API endpoints for cleanup
│   ├── start/route.ts                  # Start cleanup process
│   ├── progress/route.ts               # Get cleanup progress
│   ├── cancel/route.ts                 # Cancel cleanup
│   └── results/route.ts                # Get cleanup results
├── app/(app)/clean/                    # Cleanup UI pages
│   ├── page.tsx                        # Main cleanup interface
│   ├── components/                     # Cleanup components
│   │   ├── CleanupProgress.tsx         # Progress display
│   │   ├── CleanupResults.tsx          # Results display
│   │   └── CleanupSettings.tsx         # Cleanup configuration
│   └── hooks/
│       └── useCleanup.ts               # Cleanup state management
└── ...
```

## Implementation Details

### 1. Cleanup Algorithm
```typescript
// apps/web/utils/ai/clean/ai-clean.ts
import { getModel } from "@/utils/llms/model";
import { EmailForLLM } from "@/utils/types";

export async function analyzeEmailForCleanup(
  emailAccount: EmailAccountWithAI,
  email: EmailForLLM
): Promise<{
  action: 'archive' | 'mark_read' | 'keep';
  reason: string;
  confidence: number;
}> {
  const model = getModel(emailAccount);
  
  // Create AI prompt for email analysis
  const prompt = `
Analyze this email and determine if it should be archived, marked as read, or kept:

Email Subject: ${email.subject}
From: ${email.from}
Date: ${email.date}
Snippet: ${email.snippet}

Consider:
- Is this a newsletter or promotional email?
- Is this a personal email that requires attention?
- Is this a notification that can be marked as read?
- Is this time-sensitive or actionable?

Respond with JSON:
{
  "action": "archive" | "mark_read" | "keep",
  "reason": "Brief explanation",
  "confidence": 0-1
}
  `;
  
  const result = await model.generateObject({
    prompt,
    schema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['archive', 'mark_read', 'keep'] },
        reason: { type: 'string' },
        confidence: { type: 'number', minimum: 0, maximum: 1 }
      },
      required: ['action', 'reason', 'confidence']
    }
  });
  
  return result;
}
```

### 2. Redis Operations
```typescript
// apps/web/utils/redis/clean.ts
import { Redis } from "@upstash/redis";

export class CleanupRedis {
  private redis: Redis;
  private readonly TTL = 3600; // 1 hour

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async setEmailAnalysis(
    cleanupJobId: string,
    threadId: string,
    analysis: {
      action: string;
      reason: string;
      confidence: number;
    }
  ): Promise<void> {
    const key = `cleanup:${cleanupJobId}:${threadId}`;
    await this.redis.setex(key, this.TTL, JSON.stringify(analysis));
  }

  async getEmailAnalysis(
    cleanupJobId: string,
    threadId: string
  ): Promise<any> {
    const key = `cleanup:${cleanupJobId}:${threadId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async setCleanupProgress(
    cleanupJobId: string,
    progress: {
      current: number;
      total: number;
      status: string;
    }
  ): Promise<void> {
    const key = `cleanup:progress:${cleanupJobId}`;
    await this.redis.setex(key, this.TTL * 2, JSON.stringify(progress));
  }
}
```

### 3. Server Actions
```typescript
// apps/web/utils/actions/clean.validation.ts
import { z } from "zod";

export const startCleanInboxSchema = z.object({
  emailAccountId: z.string(),
  analysisType: z.enum(['ai', 'static', 'both']),
  maxEmails: z.number().min(1).max(10000),
  includeOlderThan: z.number().min(1).max(365), // days
  excludeLabels: z.array(z.string()).optional(),
  includeLabels: z.array(z.string()).optional(),
});

export const cancelCleanInboxSchema = z.object({
  cleanupJobId: z.string(),
});

// apps/web/utils/actions/clean.ts
"use server";

import { actionClient } from "@/utils/actions/safe-action";
import { startCleanInboxSchema, cancelCleanInboxSchema } from "./clean.validation";
import prisma from "@/utils/prisma";
import { startCleanupProcess } from "@/utils/clean/process";
import { cancelCleanupJob } from "@/utils/clean/cancel";

export const startCleanInboxAction = actionClient
  .metadata({ name: "startCleanInbox" })
  .schema(startCleanInboxSchema)
  .action(async ({ ctx: { emailAccountId }, parsedInput }) => {
    // Create cleanup job
    const cleanupJob = await prisma.cleanupJob.create({
      data: {
        emailAccountId,
        status: "pending",
        totalEmails: parsedInput.maxEmails,
        ...parsedInput,
      },
    });

    // Start cleanup process asynchronously
    startCleanupProcess(cleanupJob.id, parsedInput);

    return { cleanupJobId: cleanupJob.id };
  });

export const cancelCleanInboxAction = actionClient
  .metadata({ name: "cancelCleanInbox" })
  .schema(cancelCleanInboxSchema)
  .action(async ({ ctx: { emailAccountId }, parsedInput }) => {
    await cancelCleanupJob(parsedInput.cleanupJobId, emailAccountId);
  });
```

### 4. Cleanup Process
```typescript
// apps/web/utils/clean/process.ts
import { processEmailBatch } from "./batch";
import { updateCleanupProgress, getCleanupJob } from "./job";

export async function startCleanupProcess(
  cleanupJobId: string,
  options: {
    analysisType: string;
    maxEmails: number;
    includeOlderThan: number;
    excludeLabels?: string[];
    includeLabels?: string[];
  }
) {
  try {
    // Update job status
    await updateCleanupProgress(cleanupJobId, {
      status: "running",
      startedAt: new Date(),
    });

    // Get emails to analyze
    const emails = await getEmailsForCleanup(cleanupJobId, options);

    // Process in batches
    const batchSize = 50;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      // Check if job was cancelled
      const job = await getCleanupJob(cleanupJobId);
      if (job.status === "cancelled") break;

      await processEmailBatch(cleanupJobId, batch, options.analysisType);
      
      // Update progress
      await updateCleanupProgress(cleanupJobId, {
        current: i + batch.length,
        status: "running",
      });
    }

    // Complete job
    await updateCleanupProgress(cleanupJobId, {
      status: "completed",
      completedAt: new Date(),
    });

  } catch (error) {
    await updateCleanupProgress(cleanupJobId, {
      status: "failed",
      error: error.message,
      completedAt: new Date(),
    });
  }
}
```

## User Interface Components

### 1. Main Cleanup Page
```tsx
// apps/web/app/(app)/clean/page.tsx
import { useCleanup } from "./hooks/useCleanup";
import { CleanupSettings } from "./components/CleanupSettings";
import { CleanupProgress } from "./components/CleanupProgress";
import { CleanupResults } from "./components/CleanupResults";

export default function CleanPage() {
  const {
    cleanupJob,
    startCleanup,
    cancelCleanup,
    isAnalyzing,
    results
  } = useCleanup();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Inbox Cleaner</h1>
      
      {!cleanupJob ? (
        <CleanupSettings onStartCleanup={startCleanup} />
      ) : cleanupJob.status === "running" ? (
        <CleanupProgress
          cleanupJob={cleanupJob}
          onCancel={cancelCleanup}
        />
      ) : (
        <CleanupResults
          cleanupJob={cleanupJob}
          results={results}
        />
      )}
    </div>
  );
}
```

### 2. Cleanup Progress Component
```tsx
// apps/web/app/(app)/clean/components/CleanupProgress.tsx
import { useEffect } from "react";

interface CleanupProgressProps {
  cleanupJob: CleanupJob;
  onCancel: () => void;
}

export function CleanupProgress({ cleanupJob, onCancel }: CleanupProgressProps) {
  const progress = (cleanupJob.progress / cleanupJob.totalEmails) * 100;

  useEffect(() => {
    // Poll for progress updates
    const interval = setInterval(() => {
      // Fetch updated progress
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Cleaning in Progress</h2>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          {cleanupJob.progress} of {cleanupJob.totalEmails} emails processed
        </p>
        
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cancel Cleanup
        </button>
      </div>
      
      <CleanupResultsList cleanupJobId={cleanupJob.id} />
    </div>
  );
}
```

## Best Practices

### Performance Optimization
1. **Batch Processing**: Process emails in batches of 50-100 to avoid timeouts
2. **Redis Caching**: Cache AI analysis results for quick UI updates
3. **Database Indexing**: Index cleanup job and thread tables for performance
4. **Progressive Loading**: Stream results to UI as they're processed

### Error Handling
1. **Graceful Failures**: Continue processing if individual emails fail
2. **Retry Logic**: Implement exponential backoff for API failures
3. **User Feedback**: Provide clear error messages and recovery options
4. **Logging**: Comprehensive logging for debugging and monitoring

### Privacy and Security
1. **Data Minimization**: Don't store email content longer than necessary
2. **Access Control**: Ensure users can only access their own cleanup data
3. **Redis TTL**: Set appropriate expiration times for cached data
4. **Audit Trail**: Log cleanup operations for accountability

## Integration Points

- **Gmail API**: Integrates with Gmail message operations
- **AI Rules**: Uses AI rule engine for email analysis
- **Redis**: Uses Redis for caching and progress tracking
- **Prisma**: Stores cleanup jobs and results in PostgreSQL
- **Server Actions**: Provides user interface for cleanup operations

## Future Enhancements

1. **Smart Suggestions**: Learn from user feedback to improve cleanup accuracy
2. **Scheduled Cleanup**: Allow users to schedule automatic cleanup sessions
3. **Advanced Filtering**: Add more sophisticated email filtering options
4. **Export Results**: Allow users to export cleanup results for review
5. **Team Cleanup**: Support for team or shared inbox cleanup

This agent ensures users can efficiently achieve inbox zero while maintaining control over their email organization preferences.
```

<tool_call>
<function=edit_file>
<parameter=display_description>
Fix UI Components agent YAML header
</parameter>
<parameter=path>
inbox-zero/.opencode/agent/ui-components.md
</parameter>
<parameter=mode>
overwrite
</parameter>
</function>
</tool_call>