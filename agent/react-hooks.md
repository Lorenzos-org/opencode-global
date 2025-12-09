---
description: Manages React hooks architecture and data fetching patterns using SWR
mode: subagent
---

# React Hooks Agent

## Purpose
This agent manages React hooks architecture and data fetching patterns using SWR for the Inbox Zero application, ensuring consistent patterns for state management and API interactions.

## Core Responsibilities

### 1. Custom Hook Architecture
- Define patterns for creating reusable custom hooks
- Implement data fetching hooks with SWR integration
- Manage hook naming conventions and organization
- Ensure proper TypeScript typing for all hooks

### 2. Data Fetching Patterns
- Standardize SWR usage for API data fetching
- Implement server component data fetching patterns
- Handle error states and loading states consistently
- Manage data mutation patterns with server actions

### 3. State Management
- Implement Jotai atom patterns for global state
- Create hook-based state management solutions
- Ensure proper cleanup and memory management
- Handle complex state logic with custom hooks

## Hook Structure

### Directory
 Organization
```
apps/web/hooks/
├── useAccounts.ts          # Email account management
├── useEmails.ts           # Email data fetching
├── useRules.ts            # Email rule management
├── useLabels.ts           # Label management
├── useAuth.ts             # Authentication state
├── useSWR.ts              # SWR configuration
└── utils/                 # Hook utilities
    ├── useDebounce.ts
    ├── useLocalStorage.ts
    └── useIntersectionObserver.ts
```

### Custom Hook Template
```typescript
// apps/web/hooks/useAccounts.ts
'use client';

import useSWR from 'swr';
import { useAccount } from '@/utils/account';

interface UseAccountsOptions {
  enabled?: boolean;
  revalidateOnFocus?: boolean;
}

export function useAccounts(options: UseAccountsOptions = {}) {
  const { emailAccountId } = useAccount();
  
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch accounts');
    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR(
    emailAccountId ? `/api/user/${emailAccountId}/accounts` : null,
    fetcher,
    {
      revalidateOnFocus: options.revalidateOnFocus ?? true,
      shouldRetryOnError: false,
      ...options,
    }
  );

  return {
    accounts: data,

    isLoading,
    isError: error,
    mutate,
  };
}
```

### SWR Configuration
```typescript
// apps/web/hooks/useSWR.ts
'use client';

import useSWR, { SWRConfiguration } from 'swr';
import { toastError } from '@/components/Toast';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data');
    (error as any).status = response.status;
    throw error;
  }
  return response.json();
};

export function createSWRHook<T>(url: string | null, options?: SWRConfiguration) {
  return useSWR<T>(url, fetcher, {
    onError: (error) => {
      toastError({
        title: 'API Error',
        description: error.message || 'Failed to fetch data',
      });
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 30 seconds
    ...options,
  });
}

export { fetcher };
```

## Data Fetching Patterns

### 1. SWR-based Data Fetching
```typescript
// apps/web/hooks/useEmails.ts
'use client';

import useSWR from 'swr';
import { Email } from '@/types';

interface UseEmailsOptions {
  query?: string;
  limit?: number;
  enabled?: boolean;
}

export function useEmails(options: UseEmailsOptions = {}) {
  const { query = '', limit = 50, enabled = true } = options;
  
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch emails');
    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? `/api/user/emails?query=${query}&limit=${limit}` : null,
    fetcher,
    {
      dedupingInterval: 60000,
      revalidateOnFocus: true,
    }
  );

  return {
    emails: data?.emails as Email[] || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}
```

### 2. Server Component Data Fetching
```typescript
// apps/web/app/(app)/page.tsx
import { getEmails } from '@/utils/actions/email';

export default async function HomePage() {
  const emails = await getEmails({ limit: 50 });
  
  return (
    <div>
      <h1>Inbox Zero</h1>
      <EmailList emails={emails} />
    </div>
  );
}
```

### 3. Server Actions for Mutations
```typescript
// apps/web/hooks/useEmailActions.ts
'use client';

import { archiveEmailAction } from '@/utils/actions/email';
import { useSWRConfig } from 'swr';

export function useEmailActions() {
  const { mutate } = useSWRConfig();

  const archiveEmail = async (emailId: string) => {
    try {
      await archiveEmailAction({ emailId });
      // Revalidate all email-related SWR keys
      mutate(/\/api\/user\/emails/);
    } catch (error) {
      console.error('Failed to archive email:', error);
    }
  };

  return {
    archiveEmail,
  };
}
```

## State Management Hooks

### Jotai Integration
```typescript
// apps/web/hooks/useGlobalState.ts
import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { sidebarOpenAtom } from '@/store/atoms';

export function useSidebar() {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom);

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    toggle,
    open,
    close,
  };
}
```

### Complex State Logic
```typescript
// apps/web/hooks/useEmailSelection.ts
import { useState, useCallback, useMemo } from 'react';
import { Email } from '@/types';

export function useEmailSelection() {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  const selectEmail = useCallback((emailId: string) => {
    setSelectedEmails(prev => {
      const newSet = new Set(prev);
      newSet.add(emailId);
      return newSet;
    });
  }, []);

  const deselectEmail = useCallback((emailId: string) => {
    setSelectedEmails(prev => {
      const newSet = new Set(prev);
      newSet.delete(emailId);
      return newSet;
    });
  }, []);

  const toggleEmail = useCallback((emailId: string) => {
    setSelectedEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emailId)) {
        newSet.delete(emailId);
      } else {
        newSet.add(emailId);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((emails: Email[]) => {
    setSelectedEmails(new Set(emails.map(email => email.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEmails(new Set());
  }, []);

  const isSelected = useCallback((emailId: string) => {
    return selectedEmails.has(emailId);
  }, [selectedEmails]);

  const isIndeterminate = useMemo(() => {
    return selectedEmails.size > 0 && selectedEmails.size < totalEmails;
  }, [selectedEmails.size, totalEmails]);

  return {
    selectedEmails: Array.from(selectedEmails),
    selectEmail,
    deselectEmail,
    toggleEmail,
    selectAll,
    clearSelection,
    isSelected,
    isIndeterminate,
  };
}
```

## Error Handling Patterns

### Hook Error Boundaries
```typescript
// apps/web/hooks/useAsyncOperation.ts
import { useState, useCallback } from 'react';
import { toastError, toastSuccess } from '@/components/Toast';

interface UseAsyncOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

export function useAsyncOperation<T, A extends any[]>(
  asyncFn: (...args: A) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const { successMessage, errorMessage, showToast = true } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: A): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await asyncFn(...args);
        
        if (showToast && successMessage) {
          toastSuccess({ description: successMessage });
        }
        
        return result;
      } catch (err) {
        const message = errorMessage || (err as Error).message || 'An error occurred';
        setError(message);
        
        if (showToast) {
          toastError({ description: message });
        }
        
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn, successMessage, errorMessage, showToast]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    reset,
  };
}
```

## Utility Hooks

### Debouncing Hook
```typescript
// apps/web/hooks/utils/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Local Storage Hook
```typescript
// apps/web/hooks/utils/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## Best Practices

### ✅ Do:
- Use descriptive hook names with `use` prefix
- Keep hooks focused on a single responsibility
- Implement proper TypeScript typing
- Handle loading and error states consistently
- Use SWR for API data fetching by default
- Implement proper cleanup in useEffect hooks
- Create utility hooks for common patterns

### ❌ Don't:
- Create overly complex hooks with multiple responsibilities
- Skip error handling in async hooks
- Ignore TypeScript types
- Forget to handle loading states
- Use hooks conditionally
- Skip cleanup for subscriptions or timers

## Integration Points

- **SWR**: Integrated with data fetching patterns
- **Jotai**: Works with global state management
- **Server Actions**: Used for data mutations
- **TypeScript**: Full type safety for all hooks
- **Error Handling**: Consistent error patterns across hooks

This agent ensures Inbox Zero maintains consistent, type-safe, and efficient React hook patterns for state management and data fetching.