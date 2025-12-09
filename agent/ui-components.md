---
description: Manages React component architecture, styling patterns, and UI consistency
mode: subagent
---

# UI Components Agent

## Purpose
This agent manages the React component architecture, styling patterns, and UI consistency across the Inbox Zero application using Tailwind CSS and modern React patterns.

## Core Responsibilities

### 1. Component Architecture
- Define component structure and organization patterns
- Implement consistent prop interfaces and TypeScript types
- Manage component composition and reusability
- Handle component state management strategies

### 2. Styling System
- Maintain Tailwind CSS configuration and customizations
- Implement design system tokens and spacing scales
- Ensure responsive design patterns
- Manage component-specific styling approaches

### 3. UI Consistency
- Enforce consistent visual patterns across components
- Maintain accessibility standards (WCAG 2.1 AA)
- Implement proper semantic HTML structure
- Ensure cross-browser compatibility

## Component Structure

### Directory Organization
```
apps/web/components/
├── ui/                     # Reusable UI primitives
│   ├── button/
│   │   ├── Button.tsx      # Main component
│   │   ├── button.types.ts # TypeScript interfaces
│   │   ├── button.utils.ts # Utility functions
│   │   └── button.test.tsx # Component tests
│   ├── input/
│   ├── modal/
│   ├── table/
│   └── ...
├── layout/                 # Layout components
│   ├── header/
│   ├── sidebar/
│   └── footer/
├── features/               # Feature-specific components
│   ├── email/
│   │   ├── email-list/
│   │   ├── email-item/
│   │   └── email-content/
│   ├── rules/
│   └── settings/
└── shared/                 # Shared utility components
    ├── loading/
    ├── error/
    └── empty-state/
```

### Component Template
```tsx
// apps/web/components/ui/button/Button.tsx
'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utils/styles';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### Component Types
```tsx
// apps/web/components/ui/button/button.types.ts
export interface ButtonLoadingState {
  loading: boolean;
  loadingText?: string;
}

export interface ButtonIconProps {
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
}

export interface ButtonAnalyticsProps {
  'data-analytics-event'?: string;
  'data-analytics-label'?: string;
}
```

## Styling System

### Tailwind Configuration
```javascript
// apps/web/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@tremor/react/dist/theme.cjs',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};
```

### Utility Classes
```typescript
// apps/web/utils/styles.ts
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const focusRing = {
  light: 'focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
  dark: 'focus:ring-2 focus:ring-primary/30 focus:ring-offset-1',
};

export const transition = {
  smooth: 'transition-all duration-200 ease-in-out',
  fast: 'transition-all duration-100 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
};

export const spacing = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8',
};
```

## Component Patterns

### 1. Compound Components
```tsx
// apps/web/components/ui/tabs/Tabs.tsx
'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/utils/styles';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
```

### 2. Context Providers
```tsx
// apps/web/components/ui/theme/ThemeProvider.tsx
'use client';

import * as React from 'react';
import {ThemeProvider as NextThemeProvider} from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemeProvider>) {
  return (
    <NextThemeProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
```

### 3. Higher-Order Components
```tsx
// apps/web/components/hoc/withAuth.tsx
'use client';

import React from 'react';
import { useSession } from 'next-auth/data';
import { useRouter } from 'next/navigation';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const AuthenticatedComponent = (props: P) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    React.useEffect(() => {
      if (status === 'loading') return; // Still loading
      if (!session) router.push('/auth/signin');
    }, [session, status, router]);

    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!session) return null;

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
}
```

## Accessibility Guidelines

### ARIA Attributes
```tsx
// apps/web/components/accessibility/index.ts
export const ariaLabels = {
  closeButton: 'Close',
  menuButton: 'Open menu',
  searchButton: 'Search',
  loading: 'Loading content',
  error: 'Error occurred',
};

export const ariaRoles = {
  navigation: 'navigation',
  dialog: 'dialog',
  alert: 'alert',
  status: 'status',
  button: 'button',
  link: 'link',
};
```

### Keyboard Navigation
```tsx
// apps/web/components/hooks/useKeyboardNavigation.ts
import { useCallback } from 'react';

export function useKeyboardNavigation(options: {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
}) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        options.onEscape?.();
        break;
      case 'Enter':
        options.onEnter?.();
        break;
      case 'ArrowUp':
        options.onArrowUp?.();
        break;
      case 'ArrowDown':
        options.onArrowDown?.();
        break;
    }
  }, [options]);

  return { handleKeyDown };
}
```

## Responsive Design

### Breakpoint Utilities
```typescript
// apps/web/utils/responsive.ts
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const responsiveClasses = {
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
  '2xl': '2xl:',
};

export const useResponsive = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoints.md);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return { isMobile };
};
```

### Responsive Component Example
```tsx
// apps/web/components/layout/Sidebar.tsx
'use client';

import { useResponsive } from '@/utils/responsive';

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isMobile } = useResponsive();

  return (
    <aside 
      className={cn(
        'bg-background border-r border-border transition-all duration-300',
        isMobile ? 'w-0 overflow-hidden' : 'w-64'
      )}
    >
      <div className="p-4">
        {children}
      </div>
    </aside>
  );
}
```

## Performance Optimization

### Lazy Loading
```tsx
// apps/web/components/lazy/index.ts
import React, { Suspense } from 'react';

export const LazyComponent = ({
  component: Component,
  fallback = <div className="skeleton h-64 w-full" />,
  ...props
}: {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
}) => {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

export const lazyLoad = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  return React.lazy(importFn);
};
```

### Memoization
```tsx
// apps/web/components/ui/EmailList.tsx
'use client';

import React, { memo, useMemo } from 'react';

interface EmailListProps {
  emails: Email[];
  selectedEmailId?: string;
  onSelectEmail: (emailId: string) => void;
}

const EmailList = memo<EmailListProps>(({ emails, selectedEmailId, onSelectEmail }) => {
  const sortedEmails = useMemo(() => {
    return [...emails].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [emails]);

  return (
    <div className="divide-y divide-border">
      {sortedEmails.map((email) => (
        <EmailItem
          key={email.id}
          email={email}
          isSelected={email.id === selectedEmailId}
          onClick={() => onSelectEmail(email.id)}
        />
      ))}
    </div>
  );
});

EmailList.displayName = 'EmailList';
```

## Testing Guidelines

### Component Testing
```tsx
// apps/web/components/ui/button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-destructive');
  });
});
```

## Best Practices

### ✅ Do:
- Use semantic HTML elements
- Implement proper TypeScript interfaces
- Follow accessibility guidelines
- Use consistent naming conventions
- Implement proper error boundaries
- Optimize for performance with memoization
- Write comprehensive tests
- Document component usage

### ❌ Don't:
- Skip accessibility considerations
- Use inline styles
- Ignore responsive design
- Create overly complex components
- Skip TypeScript types
- Ignore error handling
- Forget to test edge cases
- Use magic numbers or strings

## Integration Points

- **Design System**: Integrates with Tailwind CSS and design tokens
- **State Management**: Works with Jotai for component state
- **Routing**: Compatible with Next.js App Router
- **Testing**: Uses React Testing Library and Vitest
- **Accessibility**: Implements WCAG 2.1 AA standards

This agent ensures Inbox Zero maintains high-quality, accessible, and performant UI components that provide excellent user experience.