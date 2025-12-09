---
description: Execute comprehensive test suite with coverage analysis including unit, integration, and AI tests
agent: build
subtask: true
---

# Run Tests Command

## Purpose
This command executes the comprehensive test suite for Inbox Zero, including unit tests, integration tests, and AI-powered tests to ensure code quality and functionality.

## Usage
```bash
# Run all tests
npx opencode run-tests

# Run specific test types
npx opencode run-tests --type=unit
npx opencode run-tests --type=integration
npx opencode run-tests --type=ai

# Run tests with coverage
npx opencode run-tests --coverage

# Run specific test files
npx opencode run-tests --files="**/*cleaner*"

# Watch mode for development
npx opencode run-tests --watch
```

## Test Execution
1. **Unit Tests**: Run all unit tests with detailed output
2. **Integration Tests**: Execute integration tests for API endpoints and services
3. **End-to-End Tests**: Run E2E tests for critical user workflows
4. **Coverage Analysis**: Generate and analyze test coverage reports
5. **Performance Tests**: Run performance benchmarks and load tests

## Test Structure

### Test Configuration
```typescript
// apps/web/vitest.config.mts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**'],
    testTimeout: 30000,
  },
  plugins: [tsconfigPaths()],
})
```

### Test Types

#### 1. Unit Tests
- **Location**: `apps/web/src/**/*.test.{ts,tsx}`
- **Purpose**: Test individual functions and components
- **Tools**: Vitest, React Testing Library
- **Coverage**: Business logic, utility functions, component rendering

```typescript
// apps/web/src/utils/gmail/message.test.ts
import { getMessages } from '@/utils/gmail/message'
import { describe, it, expect, vi } from 'vitest'

describe('getMessages', () => {
  it('should fetch messages from Gmail API', async () => {
    const mockGmail = {
      users: {
        messages: {
          list: vi.fn().mockResolvedValue({
            data: { messages: [{ id: '1', threadId: '1' }] }
          })
        }
      }
    }
    
    const result = await getMessages(mockGmail, { query: 'inbox' })
    
    expect(result).toEqual([{ id: '1', threadId: '1' }])
    expect(mockGmail.users.messages.list).toHaveBeenCalledWith({
      userId: 'me',
      q: 'inbox',
      maxResults: undefined
    })
  })
})
```

#### 2. Integration Tests
- **Location**: `apps/web/tests/integration/**/*.test.{ts,tsx}`
- **Purpose**: Test API endpoints and database operations
- **Tools**: Vitest, Supertest, Prisma
- **Coverage**: API routes, database transactions, authentication

```typescript
// apps/web/tests/integration/api.test.ts
import { createTestServer } from '../helpers/server'
import { createTestUser } from '../helpers/auth'

describe('API Integration Tests', () => {
  it('should create email rule via API', async () => {
    const { server, db } = await createTestServer()
    const user = await createTestUser(db)
    
    const response = await server
      .post('/api/user/rules')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        name: 'Test Rule',
        conditions: { from: 'test@example.com' },
        actions: { action: 'archive' }
      })
    
    expect(response.status).toBe(201)
    expect(response.body.name).toBe('Test Rule')
    
    // Verify in database
    const rule = await db.emailRule.findFirst({
      where: { name: 'Test Rule' }
    })
    expect(rule).toBeTruthy()
  })
})
```

#### 3. AI Tests
- **Location**: `apps/web/tests/ai/**/*.test.{ts,tsx}`
- **Purpose**: Test AI-powered features and rule processing
- **Tools**: Vitest, Mock LLM providers
- **Coverage**: AI rule matching, email analysis, response generation

```typescript
// apps/web/tests/ai/rule-matching.test.ts
import { findPotentialMatchingRules } from '@/utils/ai/choose-rule/match-rules'
import { createMockEmail } from '../helpers/email'

describe('AI Rule Matching', () => {
  it('should match rules based on email content', async () => {
    const mockRules = [
      {
        id: '1',
        conditions: { from: 'newsletter' },
        actions: { action: 'archive' }
      }
    ]
    
    const mockEmail = createMockEmail({
      from: 'newsletter@company.com',
      subject: 'Weekly Newsletter'
    })
    
    const matches = await findPotentialMatchingRules(mockRules, mockEmail)
    
    expect(matches).toHaveLength(1)
    expect(matches[0].rule.id).toBe('1')
  })
})
```

## Test Helpers

### Test Database
```typescript
// apps/web/tests/helpers/database.ts
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

export async function createTestDatabase() {
  const db = new PrismaClient({
    datasourl('test_database_url')
  })
  
  // Reset database
  execSync('npx prisma migrate reset --force', { 
    env: { ...process.env, DATABASE_URL: db.config.datasourl }
  })
  
  return db
}
```

### Test Server
```typescript
// apps/web/tests/helpers/server.ts
import { createApp } from '@/app'
import request from 'supertest'

export function createTestServer() {
  const app = createApp()
  const server = request(app)
  
  return { server, app }
}
```

### Mock Data Factories
```typescript
// apps/web/tests/helpers/factories.ts
import { faker } from '@faker-js/faker'

export function createMockUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    createdAt: faker.date.past(),
    ...overrides
  }
}

export function createMockEmail(overrides = {}) {
  return {
    id: faker.string.uuid(),
    threadId: faker.string.uuid(),
    subject: faker.lorem.sentence(),
    from: faker.internet.email(),
    to: faker.internet.email(),
    snippet: faker.lorem.paragraph(),
    date: faker.date.recent(),
    labels: ['INBOX'],
    ...overrides
  }
}
```

## Test Coverage

### Coverage Configuration
```typescript
// apps/web/vitest.config.mts
export default defineConfig({
  test: {
    // ... other config
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        'tests/',
        'vitest.config.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Coverage Reports
- **HTML Report**: `coverage/html/index.html`
- **JSON Report**: `coverage/coverage-final.json`
- **Text Report**: Console output

## Continuous Integration

### GitHub Actions Integration
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

    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm run test
      - run: pnpm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Test Scripts
```json
// apps/web/package.json
{
  "scripts": {
    "test": "cross-env RUN_AI_TESTS=false vitest",
    "test-ai": "cross-env RUN_AI_TESTS=true vitest --run",
    "test-e2e": "cross-env RUN_E2E_TESTS=true vitest --run",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Best Practices

### Writing Tests
1. **Arrange-Act-Assert**: Structure tests clearly with setup, execution, and verification
2. **Descriptive Names**: Use clear, descriptive test names that explain the scenario
3. **Isolation**: Ensure tests don't depend on each other
4. **Mocking**: Mock external dependencies to focus on unit behavior
5. **Edge Cases**: Test boundary conditions and error scenarios

### Test Organization
1. **File Structure**: Mirror the source code structure in tests
2. **Shared Utilities**: Create test helpers for common setup patterns
3. **Fixtures**: Use test fixtures for complex data structures
4. **Tags**: Use test tags for categorization and selective execution

### Performance
1. **Parallel Execution**: Run tests in parallel when possible
2. **Database Optimization**: Use transactions and rollbacks for database tests
3. **Mocking Strategy**: Mock expensive operations and external APIs
4. **Test Data**: Use minimal test data to reduce execution time

## Debugging Tests

### Common Issues
1. **Async Operations**: Ensure proper handling of promises and async/await
2. **Database State**: Clean up database state between tests
3. **Time Dependencies**: Mock date/time functions for consistent results
4. **External APIs**: Mock external API calls to avoid flakiness

### Debug Commands
```bash
# Run single test with debug output
npx opencode run-tests --files="specific.test.ts" --verbose

# Run tests in watch mode
npx opencode run-tests --watch

# Run tests with debugger
npx opencode run-tests --debug

# Generate coverage report
npx opencode run-tests --coverage
```

## Integration Points

- **Development Workflow**: Integrated into development process with pre-commit hooks
- **CI/CD Pipeline**: Automated test execution on every commit and pull request
- **Code Quality**: Test coverage thresholds prevent regression
- **Documentation**: Test files serve as executable documentation
- **Refactoring**: Comprehensive tests enable safe refactoring

This command ensures Inbox Zero maintains high code quality through comprehensive testing practices.