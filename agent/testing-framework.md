---
description: Manages comprehensive testing framework including unit, integration, and e2e tests
mode: subagent
---

# Testing Framework Agent

## Purpose
This agent manages the comprehensive testing framework for the Inbox Zero application, ensuring high code quality through unit tests, integration tests, end-to-end tests, and AI-powered test generation.

## Core Responsibilities

### 1. Test Architecture Design
- Design and maintain test pyramid structure (unit → integration → e2e)
- Implement test utilities and helpers for consistent patterns
- Manage test data factories and fixtures
- Create test configuration and setup files

### 2. Test Execution Management
- Configure and optimize test runners (Vitest, Playwright)
- Implement parallel test execution and performance optimization
- Manage test coverage reporting and thresholds
- Set up continuous integration testing

### 3. Test Quality Assurance
- Enforce test best practices and patterns
- Implement test linting and code review automation
- Monitor test reliability and flakiness
- Maintain test documentation and examples

## Test Structure

### Directory Organization
```
apps/web/
├── __tests__/
│   ├── unit/                    # Unit tests for individual components
│   │   ├── components/          # Component unit tests
│   │   ├── utils/              # Utility function tests
│   │   └── hooks/              # Hook function tests
│   ├── integration/            # Integration tests
│   │   ├── api/                # API endpoint tests
│   │   ├── database/           # Database operation tests
│   │   └── features/           # Feature integration tests
│   ├── e2e/                    # End-to-end tests
│   │   ├── user-flows/         # User journey tests
│   │   ├── email-workflow/     # Email processing tests
│   │   └── authentication/     # Auth flow tests
│   ├── fixtures/               # Test data fixtures
│   │   ├── users.json
│   │   ├── emails.json
│   │   └── rules.json
│   └── helpers/                # Test utilities
│       ├── setup.ts           # Test environment setup
│       ├── factories.ts       # Test data factories
│       ├── mocks.ts           # Mock implementations
│       └── assertions.ts      # Custom assertions
└── vitest.config.mts          # Test configuration
```

### Test Configuration
```typescript
// apps/web/vitest.config.mts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./__tests__/helpers/setup.ts'],
    include: ['**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**'],
    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '__tests__/',
        'vitest.config.*',
        '**/*.test.{js,ts,tsx}',
        '**/*.spec.{js,ts,tsx}',
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        'src/components/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        },
        'src/utils/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './__tests__')
    }
  }
})
```

## Test Types and Patterns

### 1. Unit Tests
```typescript
// apps/web/__tests__/unit/utils/formatEmail.test.ts
import { describe, it, expect } from 'vitest'
import { formatEmail } from '@/utils/formatEmail'

describe('formatEmail utility', () => {
  it('should format email address correctly', () => {
    const result = formatEmail('John Doe', 'john@example.com')
    expect(result).toBe('John Doe <john@example.com>')
  })

  it('should handle email without name', () => {
    const result = formatEmail('', 'test@example.com')
    expect(result).toBe('test@example.com')
  })

  it('should trim whitespace', () => {
    const result = formatEmail('  John Doe  ', '  john@example.com  ')
    expect(result).toBe('John Doe <john@example.com>')
  })

  it('should handle special characters', () => {
    const result = formatEmail('José María', 'josé@example.com')
    expect(result).toBe('José María <josé@example.com>')
  })
})
```

### 2. Component Tests
```typescript
// apps/web/__tests__/unit/components/EmailList.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailList } from '@/components/EmailList'
import { createMockEmail } from '../../helpers/factories'

describe('EmailList component', () => {
  const mockEmails = [
    createMockEmail({ id: '1', subject: 'Hello World' }),
    createMockEmail({ id: '2', subject: 'Test Email' }),
  ]

  const defaultProps = {
    emails: mockEmails,
    selectedEmailId: '1',
    onSelectEmail: vi.fn(),
    onArchiveEmail: vi.fn(),
  }

  it('renders email list correctly', () => {
    render(<EmailList {...defaultProps} />)
    
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('Test Email')).toBeInTheDocument()
  })

  it('handles email selection', async () => {
    const user = userEvent.setup()
    render(<EmailList {...defaultProps} />)

    const emailItem = screen.getByText('Test Email').closest('[role="button"]')
    await user.click(emailItem!)

    expect(defaultProps.onSelectEmail).toHaveBeenCalledWith('2')
  })

  it('shows loading state', () => {
    render(<EmailList {...defaultProps} isLoading />)
    expect(screen.getByTestId('email-list-loading')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<EmailList {...defaultProps} emails={[]} />)
    expect(screen.getByText('No emails found')).toBeInTheDocument()
  })
})
```

### 3. Integration Tests
```typescript
// apps/web/__tests__/integration/api/email-api.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { createTestServer } from '../../helpers/server'
import { createTestUser } from '../../helpers/auth'
import { createTestEmail } from '../../helpers/factories'

describe('Email API Integration', () => {
  let server: any
  let db: any
  let user: any

  beforeEach(async () => {
    const setup = await createTestServer()
    server = setup.server
    db = setup.db
    user = await createTestUser(db)
  })

  it('should fetch user emails', async () => {
    // Create test data
    const email = await db.email.create({
      data: {
        id: 'test-email-1',
        subject: 'Test Email',
        from: 'sender@example.com',
        to: user.email,
        emailAccountId: user.accounts[0].id,
      }
    })

    const response = await server
      .get('/api/user/emails')
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    expect(response.body.emails).toHaveLength(1)
    expect(response.body.emails[0].subject).toBe('Test Email')
  })

  it('should archive email', async () => {
    const email = await createTestEmail(db, user.accounts[0].id)

    const response = await server
      .post(`/api/user/emails/${email.id}/archive`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.status).toBe(200)
    
    // Verify in database
    const updatedEmail = await db.email.findUnique({
      where: { id: email.id }
    })
    expect(updatedEmail?.archivedAt).toBeTruthy()
  })
})
```

### 4. End-to-End Tests
```typescript
// apps/web/__tests__/e2e/user-flows/email-management.test.ts
import { test, expect } from '@playwright/test'

test.describe('Email Management Workflow', () => {
  test('user can manage emails through the interface', async ({ page }) => {
    // Login
    await page.goto('/auth/signin')
    await page.fill('[data-test="email-input"]', 'test@example.com')
    await page.fill('[data-test="password-input"]', 'password123')
    await page.click('[data-test="sign-in-button"]')

    // Wait for dashboard
    await expect(page).toHaveURL('/app')
    await expect(page.locator('[data-test="email-list"]')).toBeVisible()

    // Check initial email count
    const initialCount = await page.locator('[data-test="email-item"]').count()

    // Select an email
    await page.locator('[data-test="email-item"]').first().click()
    await expect(page.locator('[data-test="email-content"]')).toBeVisible()

    // Archive email
    await page.click('[data-test="archive-button"]')
    
    // Verify email is archived
    await expect(page.locator('[data-test="toast-success"]')).toBeVisible()
    
    // Check email count decreased
    const newCount = await page.locator('[data-test="email-item"]').count()
    expect(newCount).toBeLessThan(initialCount)
  })

  test('bulk email operations work correctly', async ({ page }) => {
    await page.goto('/app')
    
    // Select multiple emails
    await page.click('[data-test="select-all-checkbox"]')
    await page.click('[data-test="archive-selected-button"]')
    
    // Confirm bulk action
    await page.click('[data-test="confirm-bulk-action"]')
    
    await expect(page.locator('[data-test="toast-success"]')).toBeVisible()
    await expect(page.locator('[data-test="bulk-operation-complete"]')).toBeVisible()
  })
})
```

## Test Utilities and Helpers

### Test Setup
```typescript
// apps/web/__tests__/helpers/setup.ts
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test'
  
  // Reset database
  execSync('npx prisma migrate reset --force', { 
    env: { 
      ...process.env, 
      DATABASE_URL: process.env.TEST_DATABASE_URL 
    }
  })
  
  // Generate Prisma client
  execSync('npx prisma generate')
})

beforeEach(async () => {
  // Clean up data between tests
  await db.$transaction([
    db.email.deleteMany({}),
    db.emailAccount.deleteMany({}),
    db.user.deleteMany({}),
  ])
})

afterAll(async () => {
  await db.$disconnect()
})
```

### Data Factories
```typescript
// apps/web/__tests__/helpers/factories.ts
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

export function createMockUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
    createdAt: faker.date.past(1),
    updatedAt: faker.date.recent(30),
    ...overrides
  }
}

export function createMockEmail(overrides = {}) {
  return {
    id: faker.string.uuid(),
    threadId: faker.string.uuid(),
    subject: faker.lorem.sentence(),
    snippet: faker.lorem.paragraph(),
    from: faker.internet.email(),
    to: faker.internet.email(),
    date: faker.date.recent(30),
    labels: ['INBOX'],
    isRead: faker.datatype.boolean(),
    isStarred: faker.datatype.boolean(),
    size: faker.number.int({ min: 1000, max: 50000 }),
    attachments: [],
    ...overrides
  }
}

export async function createTestUser(db: PrismaClient, overrides = {}) {
  const userData = createMockUser(overrides)
  return await db.user.create({ data: userData })
}

export async function createTestEmail(db: PrismaClient, emailAccountId: string, overrides = {}) {
  const emailData = createMockEmail({ emailAccountId, ...overrides })
  return await db.email.create({ data: emailData })
}
```

### Mock Implementations
```typescript
// apps/web/__tests__/helpers/mocks.ts
import { vi } from 'vitest'

export const mockGmailClient = {
  users: {
    messages: {
      list: vi.fn(),
      get: vi.fn(),
      modify: vi.fn(),
      delete: vi.fn(),
    },
    threads: {
      list: vi.fn(),
      get: vi.fn(),
      modify: vi.fn(),
    },
    labels: {
      list: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}

export const mockLLMClient = {
  generateText: vi.fn(),
  generateObject: vi.fn(),
  embed: vi.fn(),
}

export const mockRedisClient = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  exists: vi.fn(),
  expire: vi.fn(),
  lpush: vi.fn(),
  lrange: vi.fn(),
}

export const mockResendClient = {
  emails: {
    send: vi.fn(),
  },
}

export function setupMocks() {
  vi.mock('@/utils/gmail/client', () => ({
    getGmailClient: () => mockGmailClient,
  }))
  
  vi.mock('@upstash/redis', () => ({
    Redis: () => mockRedisClient,
  }))
  
  vi.mock('@/utils/llms/model', () => ({
    getModel: () => mockLLMClient,
  }))
}
```

### Custom Assertions
```typescript
// apps/web/__tests__/helpers/assertions.ts
import { expect } from 'vitest'

expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const pass = emailRegex.test(received)
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      }
    }
  },
  
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const pass = uuidRegex.test(received)
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      }
    }
  },
  
  toHaveBeenCalledWithObject(received: any, expected: any) {
    const pass = received.mock.calls.some((call: any[]) => 
      call.some(arg => 
        typeof arg === 'object' && 
        arg !== null && 
        this.equals(arg, expected)
      )
    )
    
    if (pass) {
      return {
        message: () => `expected mock to not have been called with object matching ${JSON.stringify(expected)}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected mock to have been called with object matching ${JSON.stringify(expected)}`,
        pass: false,
      }
    }
  },
})
```

## Test Performance Optimization

### Parallel Execution
```typescript
// apps/web/vitest.config.mts
export default defineConfig({
  test: {
    // ... other config
    threads: true,
    maxThreads: 4,
    minThreads: 1,
    isolate: false, // Allow tests to share context for performance
  }
})
```

### Database Optimization
```typescript
// apps/web/__tests__/helpers/database.ts
export class TestDatabase {
  private static instance: TestDatabase
  private db: PrismaClient
  
  constructor() {
    this.db = new PrismaClient({
      datasourcl('test_database_url')
    })
  }
  
  static getInstance() {
    if (!TestDatabase.instance) {
      TestDatabase.instance = new TestDatabase()
    }
    return TestDatabase.instance
  }
  
  async cleanup() {
    // Use transactions for faster cleanup
    await this.db.$transaction([
      this.db.email.deleteMany({}),
      this.db.user.deleteMany({}),
    ])
  }
  
  async seed() {
    // Seed with minimal test data
    await this.db.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      }
    })
  }
}
```

### Mock Optimization
```typescript
// apps/web/__tests__/helpers/performance.ts
export function setupLightMocks() {
  // Lighter mocks for faster tests
  vi.mock('@/external-api/costly-service', () => ({
    expensiveOperation: vi.fn(() => Promise.resolve({ data: 'mock' }))
  }))
  
  // Disable heavy logging
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
}
```

## Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: pnpm/action-setup@v2
        with:
          version: ${{ matrix.node-version }}
          latestVersion: true

      - name: Install dependencies
        run: pnpm install

      - name: Setup test database
        run: |
          pnpm prisma migrate reset --force
          pnpm prisma generate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run linting
        run: pnpm lint

      - name: Run unit tests
        run: pnpm test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run coverage
        run: pnpm test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  e2e:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 20
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Install Playwright
        run: npx playwright install
        
      - name: Run E2E tests
        run: pnpm test:e2e
```

### Test Scripts
```json
// apps/web/package.json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run __tests__/unit",
    "test:integration": "vitest run __tests__/integration",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:report": "vitest run --reporter=html",
    "test:types": "tsc --noEmit",
    "lint": "biome check",
    "lint:fix": "biome check --write"
  }
}
```

## Test Quality Assurance

### Test Linting
```typescript
// .biome.json - Test-specific rules
{
  "linter": {
    "rules": {
      "correctness": {
        "no-unused-vars": "error"
      },
      "style": {
        "prefer-const": "error"
      }
    },
    "overrides": [
      {
        "include": ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
        "rules": {
          "style": {
            "prefer-const": "off"
          }
        }
      }
    ]
  }
}
```

### Test Review Automation
```yaml
# .github/workflows/test-review.yml
name: Test Review
on: pull_request

jobs:
  test-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 20
      - run: pnpm install
      - run: pnpm test:changed --coverage
      
      - name: Comment test results
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs')
            const coverage = JSON.parse(fs.readFileSync('./coverage/coverage-summary.json', 'utf8'))
            
            const comment = `
            ## Test Coverage Report
            - Lines: ${coverage.total.lines.pct}%
            - Functions: ${coverage.total.functions.pct}%
            - Branches: ${coverage.total.branches.pct}%
            - Statements: ${coverage.total.statements.pct}%
            
            ${coverage.total.lines.pct >= 85 ? '✅ Coverage threshold met' : '❌ Coverage below threshold'}
            `
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            })
```

## Best Practices

### Test Writing Guidelines
```typescript
// Test naming conventions
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should behavior', () => {
      // Arrange
      const props = { /* test data */ }
      
      // Act
      const result = component(props)
      
      // Assert
      expect(result).toBe(expected)
    })
  })
})

// Mock cleanup
afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

// Async test patterns
it('should handle async operations', async () => {
  vi.useFakeTimers()
  
  const promise = asyncOperation()
  vi.runAllTimers()
  
  const result = await promise
  expect(result).toBeDefined()
})
```

### Performance Best Practices
1. **Use appropriate test types**: Unit for logic, integration for APIs, e2e for user flows
2. **Mock external dependencies**: Avoid network calls in unit tests
3. **Use test databases**: Isolated, fast, and predictable
4. **Parallel execution**: Run tests concurrently when possible
5. **Selective testing**: Test only changed files in development

### Reliability Best Practices
1. **Deterministic tests**: Avoid random data that can cause flakiness
2. **Proper cleanup**: Reset state between tests
3. **Wait for async operations**: Use proper waiting strategies
4. **Avoid timing dependencies**: Use mocking for time-based logic
5. **Test isolation**: Each test should be independent

## Integration Points

- **Development Workflow**: Integrated with pre-commit hooks and code review
- **CI/CD Pipeline**: Automated test execution on every commit
- **Code Quality**: Test coverage thresholds and quality gates
- **Documentation**: Test files serve as executable documentation
- **Refactoring**: Comprehensive tests enable safe refactoring

This agent ensures Inbox Zero maintains high code quality through comprehensive, reliable, and efficient testing practices that catch issues early and enable confident development.
