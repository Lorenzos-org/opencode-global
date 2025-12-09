---
description: Manages complete fullstack workflow combining API routes, server actions, data fetching, and form handling
mode: subagent
---

# Fullstack Development Workflow Agent

## Purpose
This agent manages the complete fullstack workflow for building features in the Inbox Zero application, ensuring consistent patterns from API routes to UI components with proper authentication, validation, and error handling.

## Core Responsibilities

### 1. API Route Architecture
- Design and implement GET API routes with proper authentication
- Ensure type-safe responses with automatic type inference
- Implement consistent error handling and middleware patterns
- Manage API route organization and naming conventions

### 2. Server Actions Implementation
- Create type-safe server actions with proper validation
- Implement authentication context handling
- Ensure proper error handling and response patterns
- Manage action naming and organization conventions

### 3. Data Fetching Strategy
- Implement SWR-based data fetching patterns
- Create custom hooks for API integration
- Manage data caching and invalidation strategies
- Handle loading and error states consistently

### 4. Form Handling Architecture
- Design form components with React Hook Form
- Implement Zod validation schemas
- Create reusable form utilities and components
- Ensure accessibility and user experience standards

## Complete Feature Implementation

### 1. API Route Implementation

#### Basic API Route Template
```typescript
// apps/web/app/api/user/examples/route.ts
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { withEmailAccount } from "@/utils/middleware";

// Auto-generate response type for client use
export type GetExamplesResponse = Awaited<ReturnType<typeof getExamplesData>>;

export const GET = withEmailAccount(async (request) => {
  const { emailAccountId } = request.auth;
  
  const result = await getExamplesData({ emailAccountId });
  return NextResponse.json(result);
});

// Standalone function for type inference
async function getExamplesData({ emailAccountId }: { emailAccountId: string }) {
  const examples = await prisma.example.findMany({
    where: { emailAccountId },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return { examples };
}
```

#### API Route with Query Parameters
```typescript
// apps/web/app/api/user/examples/search/route.ts
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { withEmailAccount } from "@/utils/middleware";

export type SearchExamplesResponse = Awaited<ReturnType<typeof searchExamples>>;

export const GET = withEmailAccount(async (request) => {
  const { emailAccountId } = request.auth;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  
  const result = await searchExamples({ 
    emailAccountId, 
    query, 
    page, 
    limit 
  });
  return NextResponse.json(result);
});

async function searchExamples({ 
  emailAccountId, 
  query, 
  page, 
  limit 
}: { 
  emailAccountId: string; 
  query: string; 
  page: number; 
  limit: number; 
}) {
  const skip = (page - 1) * limit;
  
  const [examples, total] = await Promise.all([
    prisma.example.findMany({
      where: {
        emailAccountId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.example.count({
      where: {
        emailAccountId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    }),
  ]);

  return { 
    examples, 
    total, 
    page, 
    limit, 
    totalPages: Math.ceil(total / limit) 
  };
}
```

### 2. Server Actions Implementation

#### Validation Schema Template
```typescript
// apps/web/utils/actions/example.validation.ts
import { z } from "zod";

// Create examples
export const createExampleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
});

export type CreateExampleInput = z.infer<typeof createExampleSchema>;

// Update examples
export const updateExampleSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
  isEnabled: z.boolean().optional(),
});

export type UpdateExampleInput = z.infer<typeof updateExampleSchema>;

// Delete example
export const deleteExampleSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type DeleteExampleInput = z.infer<typeof deleteExampleSchema>;
```

#### Server Action Implementation
```typescript
// apps/web/utils/actions/example.ts
"use server";

import { actionClient } from "@/utils/actions/safe-action";
import { 
  createExampleSchema, 
  updateExampleSchema, 
  deleteExampleSchema 
} from "@/utils/actions/example.validation";
import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

// Create example action
export const createExampleAction = actionClient
  .metadata({ name: "createExample" })
  .schema(createExampleSchema)
  .action(async ({ 
    ctx: { emailAccountId }, 
    parsedInput: { name, description, priority, tags } 
  }) => {
    const example = await prisma.example.create({
      data: {
        name,
        description,
        priority,
        tags: tags || [],
        emailAccountId,
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/app/${emailAccountId}/examples`);
    revalidatePath(`/api/user/examples`);

    return { example };
  });

// Update example action
export const updateExampleAction = actionClient
  .metadata({ name: "updateExample" })
  .schema(updateExampleSchema)
  .action(async ({ 
    ctx: { emailAccountId }, 
    parsedInput: { id, ...data } 
  }) => {
    const example = await prisma.example.updateMany({
      where: { 
        id, 
        emailAccountId // Ensure user owns this example
      },
      data,
    });

    if (example.count === 0) {
      throw new Error("Example not found or access denied");
    }

    // Revalidate relevant paths
    revalidatePath(`/app/${emailAccountId}/examples`);
    revalidatePath(`/api/user/examples`);
    revalidatePath(`/app/${emailAccountId}/examples/${id}`);

    return { success: true };
  });

// Delete example action
export const deleteExampleAction = actionClient
  .metadata({ name: "deleteExample" })
  .schema(deleteExampleSchema)
  .action(async ({ 
    ctx: { emailAccountId }, 
    parsedInput: { id } 
  }) => {
    const example = await prisma.example.deleteMany({
      where: { 
        id, 
        emailAccountId 
      },
    });

    if (example.count === 0) {
      throw new Error("Example not found or access denied");
    }

    // Revalidate relevant paths
    revalidatePath(`/app/${emailAccountId}/examples`);
    revalidatePath(`/api/user/examples`);

    return { success: true };
  });

// Bulk operations
export const bulkDeleteExamplesAction = actionClient
  .metadata({ name: "bulkDeleteExamples" })
  .schema(z.object({
    ids: z.array(z.string()),
  }))
  .action(async ({ 
    ctx: { emailAccountId }, 
    parsedInput: { ids } 
  }) => {
    if (ids.length === 0) {
      throw new Error("No examples selected");
    }

    const result = await prisma.example.deleteMany({
      where: { 
        id: { in: ids }, 
        emailAccountId 
      },
    });

    // Revalidate relevant paths
    revalidatePath(`/app/${emailAccountId}/examples`);
    revalidatePath(`/api/user/examples`);

    return { deletedCount: result.count };
  });
```

### 3. Data Fetching Implementation

#### SWR Hook Template
```typescript
// apps/web/hooks/useExamples.ts
'use client';

import useSWR from 'swr';
import { GetExamplesResponse } from '@/app/api/user/examples/route';
import { SearchExamplesResponse } from '@/app/api/user/examples/search/route';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data');
    (error as any).status = response.status;
    throw error;
  }
  return response.json();
};

export function useExamples(emailAccountId?: string) {
  const url = emailAccountId ? `/api/user/examples` : null;
  
  return useSWR<GetExamplesResponse>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    retryOnFocus: false,
    shouldRetryOnError: false,
  });
}

export function useSearchExamples(
  emailAccountId?: string,
  query = '',
  page = 1,
  limit = 20
) {
  const searchParams = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });
  
  const url = emailAccountId 
    ? `/api/user/examples/search?${searchParams}`
    : null;
  
  return useSWR<SearchExamplesResponse>(url, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    shouldRetryOnError: false,
  });
}

export function useExample(emailAccountId?: string, exampleId?: string) {
  const url = emailAccountId && exampleId 
    ? `/api/user/examples/${exampleId}`
    : null;
  
  return useSWR(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
}
```

#### Mutations Hook
```typescript
// apps/web/hooks/useExampleMutations.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createExampleAction, 
  updateExampleAction, 
  deleteExampleAction 
} from '@/utils/actions/example';
import { toast } from '@/components/ui/toast';

export function useExampleMutations() {
  const queryClient = useQueryClient();

  const createExample = useMutation({
    mutationFn: createExampleAction,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Example created successfully',
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['examples'] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create example',
      });
    },
  });

  const updateExample = useMutation({
    mutationFn: updateExampleAction,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Example updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['examples'] });
      queryClient.invalidateQueries({ queryKey: ['example'] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update example',
      });
    },
  });

  const deleteExample = useMutation({
    mutationFn: deleteExampleAction,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Example deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['examples'] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete example',
      });
    },
  });

  return {
    createExample,
    updateExample,
    deleteExample,
  };
}
```

### 4. Form Implementation

#### Form Component Template
```tsx
// apps/web/components/ExampleForm.tsx
'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

import { 
  createExampleSchema, 
  updateExampleSchema,
  type CreateExampleInput 
} from '@/utils/actions/example.validation';
import { createExampleAction, updateExampleAction } from '@/utils/actions/example';

interface ExampleFormProps {
  initialData?: Partial<CreateExampleInput>;
  onSuccess?: () => void;
  emailAccountId: string;
}

export function ExampleForm({ 
  initialData, 
  onSuccess, 
  emailAccountId 
}: ExampleFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateExampleInput>({
    resolver: zodResolver(createExampleSchema),
    defaultValues: {
      name: '',
      description: '',
      priority: 'medium',
      tags: [],
      ...initialData,
    },
  });

  const selectedTags = watch('tags', []);

  const onSubmit: SubmitHandler<CreateExampleInput> = async (data) => {
    try {
      setIsSubmitting(true);

      if (initialData?.id) {
        await updateExampleAction({
          id: initialData.id,
          ...data,
        });
      } else {
        await createExampleAction({
          ...data,
          emailAccountId,
        });
      }

      toast({
        title: initialData?.id ? 'Updated' : 'Created',
        description: `Example ${initialData?.id ? 'updated' : 'created'} successfully`,
      });

      onSuccess?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || `Failed to ${initialData?.id ? 'update' : 'create'} example`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setValue('tags', [...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter example name"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter example description"
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Priority Field */}
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={watch('priority')}
          onValueChange={(value) => setValue('priority', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-sm text-destructive">{errors.priority.message}</p>
        )}
      </div>

      {/* Tags Field */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {['work', 'personal', 'urgent', 'follow-up'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                disabled={selectedTags.includes(suggestion)}
                className="text-sm px-2 py-1 rounded border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
        {errors.tags && (
          <p className="text-sm text-destructive">{errors.tags.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Reset form
          }}
        >
          Reset
        </Button>
        <Button 
          type="submit" 
          disabled={!isDirty || !isValid || isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?.id ? 'Update' : 'Create'} Example
        </Button>
      </div>
    </form>
  );
}
```

## Complete Integration Example

### Feature Page Implementation
```tsx
// apps/web/app/(app)/examples/page.tsx
'use client';

import React from 'react';
import { useExamples, useSearchExamples } from '@/hooks/useExamples';
import { useExampleMutations } from '@/hooks/useExampleMutations';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export default function ExamplesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  
  const { data, isLoading, error } = useSearchExamples(
    'user-email-account-id', 
    searchQuery
  );
  
  const { deleteExample } = useExampleMutations();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this example?')) {
      await deleteExample.mutateAsync({ id });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No selection',
        description: 'Please select examples to delete',
      });
      return;
    }

    if (confirm(`Delete ${selectedIds.length} examples?`)) {
      // Implement bulk delete
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Examples</h1>
          <p className="text-muted-foreground">
            Manage your examples and configure their behavior
          </p>
        </div>
        <Button>Create Example</Button>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="flex items-center space-x-4 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search examples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Examples List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.examples.map((example) => (
          <Card key={example.id}>
            <CardHeader>
              <CardTitle>{example.name}</CardTitle>
              <CardDescription>
                Priority: {example.priority}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {example.description && (
                <p className="text-sm text-muted-foreground">
                  {example.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {example.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Edit example */}}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(example.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-destructive">
          Failed to load examples: {error.message}
        </div>
      )}

      {data?.examples.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          No examples found. Create your first example to get started.
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### ✅ Do:
- Use consistent naming conventions for API routes, actions, and hooks
- Implement proper error handling at every layer
- Use TypeScript for type safety throughout the stack
- Implement proper authentication and authorization
- Use SWR for efficient data fetching and caching
- Create reusable form components and validation schemas
- Implement proper loading and error states
- Use optimistic updates for better UX

### ❌ Don't:
- Skip validation on server actions
- Forget to handle authentication in API routes
- Ignore error states in UI components
- Skip TypeScript types
- Forget to invalidate cache after mutations
- Use inline styles in components
- Skip accessibility considerations
- Forget to test edge cases

## Integration Points

- **Authentication**: Integrated with NextAuth and email account context
- **Database**: Uses Prisma ORM with proper relationships
- **State Management**: Uses SWR for client-side state
- **Forms**: Uses React Hook Form with Zod validation
- **UI Components**: Integrates with design system components
- **Error Handling**: Consistent error handling across all layers
- **Type Safety**: Full TypeScript coverage from API to UI

This agent ensures Inbox Zero maintains consistent, type-safe, and efficient fullstack development patterns that provide excellent developer experience and user experience.
```

Now let me create a constitutional compliance agent:

<tool_call>
<function=edit_file>
<parameter=display_description>
Create Constitutional Compliance agent
</parameter>
<parameter=path>
inbox-zero/.opencode/agent/constitutional-compliance.md
</parameter>
<parameter=mode>
create
</parameter>
</function>
</tool_call>