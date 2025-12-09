---
description: Manages form handling patterns, validation, and submission workflows
mode: subagent
---

# Form Handling Command

## Purpose
This command manages form handling patterns, validation, and submission workflows for the Inbox Zero application, ensuring consistent and accessible form implementations across the application.

## Usage
```bash
# Generate a new form component
npx opencode handle-forms --generate --name="EmailSettings"

# Validate form patterns in existing code
npx opencode handle-forms --validate

# Check form accessibility compliance
npx opencode handle-forms --check-accessibility

# Generate form validation schema
npx opencode handle-forms --generate-schema --type="email-rule"
```

## Form Architecture

### Directory Structure
```
apps/web/components/
├── forms/
│   ├── EmailSettingsForm/
│   │   ├── EmailSettingsForm.tsx
│   │   ├── emailSettingsSchema.ts
│   │   ├── emailSettingsUtils.ts
│   │   └── EmailSettingsForm.test.tsx
│   ├── EmailRuleForm/
│   ├── AccountForm/
│   └── components/
│       ├── InputField.tsx
│       ├── SelectField.tsx
│       ├── TextareaField.tsx
│       └── FormError.tsx
├── hooks/
│   └── useFormValidation.ts
└── utils/
    ├── formValidation.ts
    └── formHelpers.ts
```

### Form Component Template
```tsx
// apps/web/components/forms/EmailSettingsForm/EmailSettingsForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toast';
import { Loader2 } from 'lucide-react';

import { 
  emailSettingsSchema, 
  type EmailSettingsFormData 
} from './emailSettingsSchema';
import { updateEmailSettingsAction } from '@/utils/actions/email-settings';

interface EmailSettingsFormProps {
  defaultValues?: Partial<EmailSettingsFormData>;
  onSuccess?: () => void;
}

export function EmailSettingsForm({ 
  defaultValues, 
  onSuccess 
}: EmailSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<EmailSettingsFormData>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      summaryEmailFrequency: 'weekly',
      statsEmailFrequency: 'monthly',
      enableNotifications: true,
      maxEmailsPerDay: 100,
      ...defaultValues,
    },
  });

  const onSubmit = async (data: EmailSettingsFormData) => {
    try {
      setIsSubmitting(true);
      
      await updateEmailSettingsAction(data);
      
      toast({
        title: 'Settings Updated',
        description: 'Your email settings have been saved successfully.',
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update settings',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Summary Email Frequency */}
      <div className="space-y-2">
        <Label htmlFor="summaryEmailFrequency">
          Summary Email Frequency
        </Label>
        <select
          id="summaryEmailFrequency"
          {...register('summaryEmailFrequency')}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        {errors.summaryEmailFrequency && (
          <p className="text-sm text-destructive">
            {errors.summaryEmailFrequency.message}
          </p>
        )}
      </div>

      {/* Stats Email Frequency */}
      <div className="space-y-2">
        <Label htmlFor="statsEmailFrequency">
          Analytics Email Frequency
        </Label>
        <select
          id="statsEmailFrequency"
          {...register('statsEmailFrequency')}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        {errors.statsEmailFrequency && (
          <p className="text-sm text-destructive">
            {errors.statsEmailFrequency.message}
          </p>
        )}
      </div>

      {/* Enable Notifications */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="enableNotifications">
            Enable Email Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications for important emails
          </p>
        </div>
        <Switch
          id="enableNotifications"
          {...register('enableNotifications')}
        />
        {errors.enableNotifications && (
          <p className="text-sm text-destructive">
            {errors.enableNotifications.message}
          </p>
        )}
      </div>

      {/* Max Emails Per Day */}
      <div className="space-y-2">
        <Label htmlFor="maxEmailsPerDay">
          Maximum Emails Per Day
        </Label>
        <Input
          id="maxEmailsPerDay"
          type="number"
          {...register('maxEmailsPerDay', { valueAsNumber: true })}
          placeholder="100"
        />
        {errors.maxEmailsPerDay && (
          <p className="text-sm text-destructive">
            {errors.maxEmailsPerDay.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
```

### Form Validation Schema
```tsx
// apps/web/components/forms/EmailSettingsForm/emailSettingsSchema.ts
import { z } from 'zod';

export const emailSettingsSchema = z.object({
  summaryEmailFrequency: z.enum(['daily', 'weekly', 'monthly']),
  statsEmailFrequency: z.enum(['weekly', 'monthly']),
  enableNotifications: z.boolean().default(true),
  maxEmailsPerDay: z
    .number()
    .min(1, 'Must be at least 1')
    .max(1000, 'Cannot exceed 1000'),
});

export type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;
```

## Form Validation Patterns

### Zod Schema Examples
```typescript
// apps/web/components/forms/EmailRuleForm/emailRuleSchema.ts
import { z } from 'zod';

const conditionSchema = z.object({
  field: z.enum(['from', 'subject', 'to', 'body']),
  operator: z.enum(['contains', 'equals', 'startsWith', 'endsWith']),
  value: z.string().min(1, 'Condition value is required'),
});

const actionSchema = z.object({
  type: z.enum(['archive', 'mark_read', 'label', 'forward', 'delete']),
  value: z.string().optional(),
});

export const emailRuleSchema = z.object({
  name: z
    .string()
    .min(1, 'Rule name is required')
    .max(100, 'Rule name cannot exceed 100 characters'),
  conditions: z.array(conditionSchema).min(1, 'At least one condition is required'),
  actions: z.array(actionSchema).min(1, 'At least one action is required'),
  isEnabled: z.boolean().default(true),
  priority: z.number().min(1).max(100).default(10),
});

export type EmailRuleFormData = z.infer<typeof emailRuleSchema>;
```

### Custom Validation Functions
```typescript
// apps/web/utils/formValidation.ts
import { z } from 'zod';

export const customValidations = {
  email: z.string().email('Invalid email address'),
  
  url: z.string().url('Invalid URL format'),
  
  positiveNumber: z
    .number()
    .positive('Must be a positive number')
    .finite('Must be a finite number'),
  
  notEmptyArray: <T>(schema: z.ZodSchema<T>) =>
    z.array(schema).min(1, 'At least one item is required'),
  
  uniqueArray: <T>(errorMessage: string = 'Items must be unique') =>
    z.array(z.any()).refine(
      (arr) => new Set(arr).size === arr.length,
      errorMessage
    ),
  
  conditional: <T, U>(
    condition: (data: T) => boolean,
    schema: z.ZodSchema<U>,
    errorMessage: string
  ) =>
    z.any().refine(
      (val, ctx) => {
        if (condition(ctx.parent as T)) {
          return schema.safeParse(val).success;
        }
        return true;
      },
      errorMessage
    ),
};
```

## Form State Management

### Form Hook
```typescript
// apps/web/components/hooks/useFormValidation.ts
import { useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function useFormValidation<T extends Record<string, any>>(
  schema: any,
  defaultValues?: Partial<T>,
  onSubmit?: (data: T) => void | Promise<void>
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const handleSubmit = useCallback(
    async (data: T) => {
      try {
        await onSubmit?.(data);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      }
    },
    [onSubmit]
  );

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
```

### Form Persistence
```typescript
// apps/web/components/hooks/useFormPersistence.ts
import { useEffect } from 'react';

export function useFormPersistence<T>(
  form: UseFormReturn<T>,
  key: string,
  ttl: number = 3600000 // 1 hour
) {
  const { watch, reset, formState } = form;

  useEffect(() => {
    const subscription = watch((data) => {
      const now = Date.now();
      
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: now,
      }));
    });

    return () => subscription.unsubscribe();
  }, [watch, key]);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const { data, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < ttl) {
          reset(data);
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    }
  }, [reset, key, ttl]);
}
```

## Accessibility Features

### ARIA Attributes
```tsx
// apps/web/components/forms/EmailRuleForm/EmailRuleForm.tsx
export function EmailRuleForm() {
  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-labelledby="email-rule-form-title"
    >
      <h2 id="email-rule-form-title" className="sr-only">
        Email Rule Configuration
      </h2>
      
      {/* Form fields with proper ARIA labels */}
      <div className="space-y-2">
        <Label htmlFor="rule-name">
          Rule Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="rule-name"
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-required="true"
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>
    </form>
  );
}
```

### Keyboard Navigation
```typescript
// apps/web/components/forms/utils/keyboardNavigation.ts
export function handleFormNavigation(event: React.KeyboardEvent) {
  const { key, target } = event;
  const form = (target as HTMLElement).closest('form');
  
  if (!form) return;
  
  const focusableElements = form.querySelectorAll(
    'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
  );
  
  const currentIndex = Array.from(focusableElements).indexOf(target as Element);
  
  switch (key) {
    case 'Enter':
      if ((target as HTMLElement).tagName === 'INPUT') {
        event.preventDefault();
        const nextElement = focusableElements[currentIndex + 1] as HTMLElement;
        nextElement?.focus();
      }
      break;
    case 'Escape':
      // Reset form or close modal
      break;
  }
}
```

## Error Handling

### Form Error Component
```tsx
// apps/web/components/forms/components/FormError.tsx
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message: string;
  className?: string;
}

export function FormError({ message, className = '' }: FormErrorProps) {
  return (
    <div 
      className={`flex items-center space-x-2 rounded-md bg-destructive/10 p-3 text-destructive ${className}`}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
```

### Error Boundary
```tsx
// apps/web/components/forms/FormErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { FormError } from './components/FormError';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class FormErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Form error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <FormError message="Something went wrong with this form. Please try again." />
      );
    }

    return this.props.children;
  }
}
```

## Advanced Form Patterns

### Dynamic Form Fields
```tsx
// apps/web/components/forms/EmailRuleForm/components/ConditionBuilder.tsx
'use client';

import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function ConditionBuilder() {
  const { control, register } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'conditions',
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Conditions</h3>
        <button
          type="button"
          onClick={() => append({
            field: 'from',
            operator: 'contains',
            value: '',
          })}
          className="text-sm text-primary hover:text-primary/80"
        >
          + Add Condition
        </button>
      </div>
      
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor={`conditions.${index}.field`}>Field</Label>
            <select
              id={`conditions.${index}.field`}
              {...register(`conditions.${index}.field`)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="from">From</option>
              <option value="subject">Subject</option>
              <option value="to">To</option>
              <option value="body">Body</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`conditions.${index}.operator`}>Operator</Label>
            <select
              id={`conditions.${index}.operator`}
              {...register(`conditions.${index}.operator`)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
              <option value="startsWith">Starts With</option>
              <option value="endsWith">Ends With</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`conditions.${index}.value`}>Value</Label>
            <Input
              id={`conditions.${index}.value`}
              {...register(`conditions.${index}.value`)}
              placeholder="Enter value"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-sm text-destructive hover:text-destructive/80"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### File Upload Forms
```tsx
// apps/web/components/forms/FileUploadForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export function FileUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: '',
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['text/csv', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    setUploading(true);
    
    try {
      // Upload files
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', data.description);
        
        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
      }
      
      alert('Files uploaded successfully!');
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="files">Select Files</Label>
        <Input
          id="files"
          type="file"
          multiple
          accept=".csv,.pdf"
          onChange={handleFileSelect}
        />
        <p className="text-sm text-muted-foreground">
          Supported formats: CSV, PDF. Maximum 5MB per file.
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files</Label>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          rows={3}
          placeholder="Enter description..."
        />
      </div>

      <Button type="submit" disabled={files.length === 0 || uploading}>
        {uploading ? 'Uploading...' : 'Upload Files'}
      </Button>
    </form>
  );
}
```

## Testing Forms

### Form Testing Utilities
```typescript
// apps/web/components/forms/utils/testUtils.ts
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function fillForm<T extends Record<string, any>>(
  formData: Partial<T>
) {
  for (const [name, value] of Object.entries(formData)) {
    const field = screen.getByLabelText(new RegExp(name, 'i')) || 
                  screen.getByRole('textbox', { name: new RegExp(name, 'i') });
    
    if (field) {
      await userEvent.clear(field);
      await userEvent.type(field, String(value));
    }
  }
}

export function expectFormError(field: string, message: string) {
  const errorElement = screen.getByText(message);
  expect(errorElement).toBeInTheDocument();
  expect(errorElement).toHaveAttribute('role', 'alert');
}
```

### Form Test Example
```tsx
// apps/web/components/forms/EmailSettingsForm/EmailSettingsForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from '@/components/ui/toast';

import { EmailSettingsForm } from './EmailSettingsForm';

// Mock the toast and action
jest.mock('@/components/ui/toast');
jest.mock('@/utils/actions/email-settings');

const mockToast = toast as jest.MockedFunction<typeof toast>;
const mockUpdateAction = updateEmailSettingsAction as jest.MockedFunction<
  typeof updateEmailSettingsAction
>;

describe('EmailSettingsForm', () => {
  const defaultProps = {
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    mockToast.mockClear();
    mockUpdateAction.mockClear();
  });

  it('renders with default values', () => {
    render(<EmailSettingsForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/summary email frequency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enable notifications/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<EmailSettingsForm {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await userEvent.click(submitButton);
    
    // Should show validation errors
    expect(screen.getByText(/must be at least 1/i)).toBeInTheDocument();
  });

  it('submits successfully with valid data', async () => {
    mockUpdateAction.mockResolvedValue(undefined);
    
    render(<EmailSettingsForm {...defaultProps} />);
    
    await userEvent.selectOptions(
      screen.getByLabelText(/max emails per day/i),
      '100'
    );
    
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    
    expect(mockUpdateAction).toHaveBeenCalledWith({
      summaryEmailFrequency: 'weekly',
      statsEmailFrequency: 'monthly',
      enableNotifications: true,
      maxEmailsPerDay: 100,
    });
    
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Settings Updated',
      description: 'Your email settings have been saved successfully.',
    });
  });
});
```

## Best Practices

### ✅ Do:
- Use proper form validation with Zod schemas
- Implement accessible form elements with ARIA attributes
- Provide clear error messages and validation feedback
- Use appropriate input types for better UX
- Implement form persistence for long forms
- Add loading states during form submission
- Use proper semantic HTML form structure
- Implement keyboard navigation and shortcuts

### ❌ Don't:
- Skip form validation or use only client-side validation
- Ignore accessibility requirements
- Use generic error messages
- Forget to handle form submission errors
- Skip form reset functionality
- Ignore mobile form usability
- Use overly complex form layouts
- Forget to test form interactions

## Integration Points

- **Validation**: Works with Zod schemas and React Hook Form
- **UI Components**: Integrates with design system components
- **Server Actions**: Connects with Next.js server actions for submission
- **State Management**: Uses React Hook Form for state management
- **Accessibility**: Implements WCAG 2.1 AA standards
- **Testing**: Provides comprehensive testing utilities

This command ensures Inbox Zero maintains consistent, accessible, and user-friendly form implementations throughout the application.