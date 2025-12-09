---
description: Executes comprehensive test suites including unit, integration, and AI tests
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
```

Let me create a few more command files:

```yaml
---
title: Security Audit Command
description: Performs comprehensive security analysis and vulnerability scanning
tags: [security, audit, vulnerabilities, code-analysis, dependencies]
capabilities: [file-system, code-execution]
---
```

# Security Audit Command

## Purpose
This command performs comprehensive security analysis of the Inbox Zero codebase, including dependency vulnerability scanning, code security analysis, and configuration security checks.

## Usage
```bash
# Run full security audit
npx opencode security-audit

# Run specific audit types
npx opencode security-audit --type=dependencies
npx opencode security-audit --type=code
npx opencode security-audit --type=config

# Generate security report
npx opencode security-audit --report

# Fix automatically fixable issues
npx opencode security-audit --fix
```

## Audit Types

### 1. Dependency Vulnerability Scanning
- **Tools**: npm audit, OSV Scanner, Snyk
- **Scope**: All npm dependencies and transitive dependencies
- **Frequency**: Daily automated scans, pre-deployment checks

```bash
# npm audit for basic vulnerability scanning
npm audit

# OSV Scanner for comprehensive vulnerability detection
osv-scanner --format json --output audit-results.json .

# Snyk for advanced vulnerability management
snyk test --all-projects
```

### 2. Code Security Analysis
- **Tools**: Biome security rules, ESLint security plugin
- **Scope**: Source code for security anti-patterns
- **Focus**: Input validation, authentication, data exposure

```typescript
// .biome.json - Security rules configuration
{
  "linter": {
    "rules": {
      "security": {
        "all": true
      }
    }
  }
}
```

### 3. Configuration Security
- **Scope**: Environment variables, API keys, security headers
- **Focus**: Hardcoded secrets, insecure configurations
- **Tools**: Custom security scanners, secret detection

## Security Checks

### Dependency Security
```typescript
// .opencode/command/security-audit.ts
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

export async function auditDependencies() {
  const results = {
    npmAudit: await runNpmAudit(),
    osvScanner: await runOsvScanner(),
    outdatedPackages: await checkOutdatedPackages()
  }
  
  return results
}

async function runNpmAudit() {
  try {
    const output = execSync('npm audit --json', { encoding: 'utf8' })
    return JSON.parse(output)
  } catch (error) {
    return { error: error.message }
  }
}

async function runOsvScanner() {
  try {
    execSync('osv-scanner --format json --output osv-results.json .', { stdio: 'inherit' })
    const output = readFileSync('osv-results.json', 'utf8')
    return JSON.parse(output)
  } catch (error) {
    return { error: error.message }
  }
}
```

### Code Security Analysis
```typescript
export async function auditCodeSecurity() {
  const results = {
    biomeSecurity: await runBiomeSecurity(),
    eslintSecurity: await runEslintSecurity(),
    customSecurityChecks: await runCustomSecurityChecks()
  }
  
  return results
}

async function runBiomeSecurity() {
  try {
    const output = execSync('biome check --only security .', { encoding: 'utf8' })
    return parseBiomeOutput(output)
  } catch (error) {
    return { error: error.message }
  }
}

async function runCustomSecurityChecks() {
  const checks = [
    checkForHardcodedSecrets(),
    checkForInsecureRandom(),
    checkForEvalUsage(),
    checkForPathTraversal(),
    checkForSQLInjection(),
    checkForXSSVulnerabilities()
  ]
  
  return await Promise.all(checks)
}
```

### Configuration Security
```typescript
export async function auditConfigurationSecurity() {
  const results = {
    environmentVariables: await checkEnvironmentVariables(),
    apiKeys: await checkApiKeys(),
    securityHeaders: await checkSecurityHeaders(),
    corsConfiguration: await checkCorsConfiguration()
  }
  
  return results
}

async function checkEnvironmentVariables() {
  const envFiles = ['.env', '.env.local', '.env.production']
  const issues = []
  
  for (const file of envFiles) {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf8')
      const lines = content.split('\n')
      
      for (const line of lines) {
        if (line.trim() && !line.startsWith('#')) {
          const [key, value] = line.split('=')
          if (isSensitiveKey(key) && isHardcodedValue(value)) {
            issues.push({
              file,
              key,
              issue: 'Hardcoded sensitive value',
              severity: 'high'
            })
          }
        }
      }
    }
  }
  
  return issues
}

function isSensitiveKey(key: string) {
  const sensitivePatterns = [
    /password/i,
    /secret/i,
    /key/i,
    /token/i,
    /api[_-]?key/i
  ]
  
  return sensitivePatterns.some(pattern => pattern.test(key))
}
```

## Security Rules

### High Priority Issues
1. **Hardcoded Secrets**: API keys, passwords, tokens in source code
2. **Vulnerable Dependencies**: Known CVEs in npm packages
3. **Insecure Random**: Use of Math.random() for security purposes
4. **Code Injection**: eval(), Function(), dynamic code execution
5. **Path Traversal**: Unsafe file path handling

### Medium Priority Issues
1. **Weak Cryptography**: Deprecated hash functions, weak encryption
2. **Information Disclosure**: Excessive error details, debug info in production
3. **Missing Security Headers**: CSP, HSTS, X-Frame-Options
4. **Insecure Dependencies**: Development dependencies in production

### Low Priority Issues
1. **Best Practice Violations**: Security linting rules
2. **Documentation Issues**: Missing security documentation
3. **Configuration Drift**: Inconsistent security configurations

## Automated Security

### Pre-commit Hooks
```bash
#!/bin/sh
# .husky/pre-commit

# Run security audit before commit
npx opencode security-audit --quick

if [ $? -ne 0 ]; then
  echo "❌ Security issues found. Please review and fix them."
  exit 1
fi
```

### CI/CD Integration
```yaml
# .github/workflows/security.yml
name: Security Audit
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run security audit
        run: npx opencode security-audit --report
      
      - name: Upload security report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.json
      
      - name: Fail on high severity issues
        run: |
          if jq '.issues[] | select(.severity == "high")' security-report.json | grep .; then
            echo "High severity security issues found"
            exit 1
          fi
```

## Security Monitoring

### Real-time Monitoring
```typescript
// apps/web/utils/security/monitor.ts
import { createLogger } from '@/utils/logger'

const logger = createLogger('security-monitor')

export class SecurityMonitor {
  static logSuspiciousActivity(activity: {
    type: string
    userId?: string
    ip?: string
    userAgent?: string
    details: any
  }) {
    logger.warn('Suspicious security activity', activity)
    
    // Send to security monitoring service
    this.reportToSecurityService(activity)
  }
  
  static checkRateLimiting(endpoint: string, ip: string) {
    // Implement rate limiting checks
  }
  
  static validateInputSecurity(input: string) {
    // Check for common attack patterns
    const attackPatterns = [
      /<script>/i,  // XSS
      /union.*select/i,  // SQL injection
      /\.\.\//,  // Path traversal
      /javascript:/i  // JavaScript injection
    ]
    
    return attackPatterns.some(pattern => pattern.test(input))
  }
}
```

### Security Headers
```typescript
// apps/web/middleware/security.ts
import { NextResponse } from 'next/server'

export function securityHeaders() {
  return {
    'Content-Security-Policy': "default-src 'self'",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
}
```

## Security Best Practices

### Development Practices
1. **Input Validation**: Validate all user inputs on both client and server
2. **Authentication**: Use secure authentication mechanisms
3. **Authorization**: Implement proper access controls
4. **Error Handling**: Don't expose sensitive information in error messages
5. **Logging**: Log security events without sensitive data

### Code Review Checklist
1. **Authentication**: Are authentication mechanisms secure?
2. **Authorization**: Are access controls properly implemented?
3. **Input Validation**: Is all input properly validated and sanitized?
4. **Data Protection**: Is sensitive data properly protected?
5. **Error Handling**: Are errors handled securely?

### Deployment Security
1. **Environment Variables**: Use environment variables for secrets
2. **HTTPS**: Enforce HTTPS in production
3. **Security Headers**: Implement security headers
4. **CORS**: Configure CORS properly
5. **Monitoring**: Set up security monitoring and alerting

## Integration Points

- **Development Workflow**: Integrated into development and code review process
- **CI/CD Pipeline**: Automated security checks in deployment pipeline
- **Monitoring**: Real-time security monitoring in production
- **Incident Response**: Automated alerting for security issues
- **Compliance**: Helps maintain security compliance standards

This command ensures Inbox Zero maintains high security standards through comprehensive security analysis and monitoring practices.
```

Let me create one final command for project structure validation:

```yaml
---
title: Project Structure Command
description: Validates and maintains consistent project structure and organization
tags: [project-structure, organization, linting, validation, conventions]
capabilities: [file-system, code-execution]
---
```

# Project Structure Command

## Purpose
This command validates and maintains consistent project structure, file organization, and naming conventions across the Inbox Zero codebase.

## Usage
```bash
# Validate entire project structure
npx opencode project-structure

# Check specific directories
npx opencode project-structure --dir=apps/web

# Validate naming conventions
npx opencode project-structure --check=naming

# Generate structure report
npx opencode project-structure --report

# Fix structural issues
npx opencode project-structure --fix
```

## Structure Validation

### Directory Organization
```
inbox-zero/
├── apps/
│   ├── web/                 # Main Next.js application
│   │   ├── app/             # App Router structure
│   │   ├── components/      # React components
│   │   ├── utils/           # Utility functions
│   │   ├── prisma/          # Database schema
│   │   └── public/          # Static assets
│   └── unsubscriber/        # Unsubscribe service
├── packages/                # Shared libraries
│   ├── loops/              # Marketing automation
│   ├── resend/             # Email service
│   └── tinybird/           # Analytics
├── .opencode/              # Opencode configuration
│   ├── agent/              # Agent definitions
│   └── command/            # Command definitions
└── docs/                   # Documentation
```

### File Naming Conventions
```typescript
// .opencode/command/project-structure.ts
export const namingConventions = {
  directories: {
    pattern: /^[a-z][a-z0-9-]*$/,
    examples: ['components', 'utils', 'hooks', 'lib']
  },
  files: {
    pattern: /^[a-z][a-z0-9-]*\.[a-z]+$/,
    examples: ['component.tsx', 'utils.ts', 'config.json']
  },
  components: {
    pattern: /^[A-Z][a-zA-Z]*\.(tsx|ts)$/,
    examples: ['Button.tsx', 'UserProfile.tsx', 'DataTable.tsx']
  },
  utilities: {
    pattern: /^[a-z][a-z-]*\.(ts|js)$/,
    examples: 'utils.ts', 'api-client.ts', 'date-formatter.ts'
  },
  tests: {
    pattern: /.*\.(test|spec)\.(ts|tsx|js|jsx)$/,
    examples: 'component.test.tsx', 'utils.test.ts'
  }
}
```

### Structure Validation Rules
```typescript
export const structureRules = {
  requiredFiles: [
    'package.json',
    'README.md',
    'tsconfig.json',
    '.gitignore'
  ],
  prohibitedFiles: [
    'console.log',
    'debugger',
    'TODO:.*fix me',
    'FIXME'
  ],
  directoryStructure: {
    'apps/web': {
      required: ['app', 'components', 'utils', 'prisma'],
      prohibited: ['src', 'lib']
    },
    'packages/*': {
      required: ['package.json', 'src'],
      recommended: ['README.md', 'tests']
    }
  }
}
```

## Validation Implementation

### Directory Structure Validation
```typescript
export async function validateDirectoryStructure() {
  const issues = []
  
  // Check root structure
  issues.push(...await validateRootStructure())
  
  // Check apps structure
  issues.push(...await validateAppsStructure())
  
  // Check packages structure
  issues.push(...await validatePackagesStructure())
  
  return issues
}

async function validateRootStructure() {
  const issues = []
  const requiredFiles = ['package.json', 'README.md', 'tsconfig.json']
  
  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      issues.push({
        type: 'missing-file',
        file,
        severity: 'error',
        message: `Required file ${file} is missing`
      })
    }
  }
  
  return issues
}

async function validateAppsStructure() {
  const issues = []
  
  if (existsSync('apps')) {
    const apps = await readdir('apps')
    
    for (const app of apps) {
      const appPath = `apps/${app}`
      
      // Check for src directory (prohibited)
      if (existsSync(`${appPath}/src`)) {
        issues.push({
          type: 'prohibited-directory',
          file: `${appPath}/src`,
          severity: 'warning',
          message: `App ${app} should not have src directory`
        })
      }
      
      // Check for proper structure
      const requiredDirs = ['app', 'components', 'utils']
      for (const dir of requiredDirs) {
        if (!existsSync(`${appPath}/${dir}`)) {
          issues.push({
            type: 'missing-directory',
            file: `${appPath}/${dir}`,
            severity: 'info',
            message: `Consider adding ${dir} directory to ${app}`
          })
        }
      }
    }
  }
  
  return issues
}
```

### File Naming Validation
```typescript
export async function validateNamingConventions() {
  const issues = []
  
  // Walk through all files
  const files = await getAllFiles('.')
  
  for (const file of files) {
    // Skip node_modules and hidden files
    if (file.includes('node_modules') || file.startsWith('.')) {
      continue
    }
    
    const issuesFromFile = validateFileNaming(file)
    issues.push(...issuesFromFile)
  }
  
  return issues
}

function validateFileNaming(filePath: string) {
  const issues = []
  const fileName = basename(filePath)
  const dirName = basename(dirname(filePath))
  
  // Check directory naming
  if (!/^[a-z][a-z0-9-]*$/.test(dirName)) {
    issues.push({
      type: 'naming-convention',
      file: dirname(filePath),
      severity: 'warning',
      message: `Directory ${dirName} should use kebab-case`
    })
  }
  
  // Check file naming based on type
  if (filePath.includes('/components/')) {
    if (!/^[A-Z][a-zA-Z]*\.(tsx|ts)$/.test(fileName)) {
      issues.push({
        type: 'naming-convention',
        file: filePath,
        severity: 'error',
        message: `Component file ${fileName} should use PascalCase`
      })
    }
  } else if (filePath.includes('/utils/') || filePath.includes('/lib/')) {
    if (!/^[a-z][a-z-]*\.(ts|js)$/.test(fileName)) {
      issues.push({
        type: 'naming-convention',
        file: filePath,
        severity: 'warning',
        message: `Utility file ${fileName} should use kebab-case`
      })
    }
  }
  
  return issues
}
```

### Code Quality Validation
```typescript
export async function validateCodeQuality() {
  const issues = []
  
  // Check for common code quality issues
  issues.push(...await checkForConsoleLogs())
  issues.push(...await checkForDebugStatements())
  issues.push(...await checkForTodoComments())
  issues.push(...await checkForLargeFiles())
  
  return issues
}

async function checkForConsoleLogs() {
  const issues = []
  const files = await getFilesByExtension(['.ts', '.tsx', '.js', '.jsx'])
  
  for (const file of files) {
    const content = readFileSync(file, 'utf8')
    
    if (content.includes('console.log') || 
        content.includes('console.error') || 
        content.includes('console.warn')) {
      issues.push({
        type: 'code-quality',
        file,
        severity: 'warning',
        message: 'File contains console statements'
      })
    }
  }
  
  return issues
}

async function checkForLargeFiles() {
  const issues = []
  const files = await getAllFiles('.')
  const maxSize = 1024 * 1024 // 1MB
  
  for (const file of files) {
    if (file.includes('node_modules') || file.startsWith('.')) {
      continue
    }
    
    const stats = statSync(file)
    if (stats.size > maxSize) {
      issues.push({
        type: 'code-quality',
        file,
        severity: 'info',
        message: `File size ${formatBytes(stats.size)} exceeds recommended limit`
      })
    }
  }
  
  return issues
}
```

## Automated Fixes

### Structure Fixes
```typescript
export async function fixStructureIssues(issues: any[]) {
  const fixes = []
  
  for (const issue of issues) {
    switch (issue.type) {
      case 'missing-file':
        fixes.push(await createMissingFile(issue.file))
        break
      case 'naming-convention':
        fixes.push(await renameFile(issue.file))
        break
      case 'prohibited-directory':
        fixes.push(await moveDirectoryContents(issue.file))
        break
    }
  }
  
  return fixes
}

async function createMissingFile(filePath: string) {
  const fileName = basename(filePath)
  
  switch (fileName) {
    case 'package.json':
      return createPackageJson()
    case 'README.md':
      return createReadme()
    case 'tsconfig.json':
      return createTsConfig()
    default:
      return null
  }
}

async function renameFile(filePath: string) {
  const fileName = basename(filePath)
  const newFileName = convertToConvention(fileName, getConvention(filePath))
  const newFilePath = filePath.replace(fileName, newFileName)
  
  renameSync(filePath, newFilePath)
  
  return {
    action: 'renamed',
    from: filePath,
    to: newFilePath
  }
}
```

### Convention Templates
```typescript
function createPackageJson() {
  const template = {
    name: 'inbox-zero-app',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'biome check',
      format: 'biome check --write'
    },
    dependencies: {},
    devDependencies: {}
  }
  
  writeFileSync('package.json', JSON.stringify(template, null, 2))
}

function createReadme() {
  const template = `# Inbox Zero

[Project description]

## Development

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Contributing

[Contributing guidelines]
`
  
  writeFileSync('README.md', template)
}
```

## Continuous Integration

### Pre-commit Integration
```bash
#!/bin/sh
# .husky/pre-commit

# Validate project structure before commit
npx opencode project-structure --check=naming

if [ $? -ne 0 ]; then
  echo "❌ Project structure issues found. Please fix them."
  exit 1
fi
```

### CI/CD Integration
```yaml
# .github/workflows/structure.yml
name: Project Structure
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  structure-validation:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      
      - name: Validate project structure
        run: npx opencode project-structure --report
      
      - name: Upload structure report
        uses: actions/upload-artifact@v3
        with:
          name: structure-report
          path: structure-report.json
```

## Best Practices

### Directory Organization
1. **Feature-based Structure**: Organize by features rather than file types
2. **Clear Boundaries**: Separate concerns with clear directory boundaries
3. **Consistent Patterns**: Use consistent patterns across the codebase
4. **Documentation**: Document structure decisions and conventions

### File Organization
1. **Single Responsibility**: One component/class per file
2. **Descriptive Names**: Use descriptive, meaningful names
3. **Group Related Files**: Keep related files together
4. **Avoid Deep Nesting**: Limit directory depth to 3-4 levels

### Naming Conventions
1. **PascalCase**: Components and classes
2. **camelCase**: Variables and functions
3. **kebab-case**: Directories and files
4. **SCREAMING_SNAKE_CASE**: Constants

## Integration Points

- **Development Workflow**: Integrated into daily development process
- **Code Reviews**: Automated structure validation in reviews
- **CI/CD Pipeline**: Structure validation in deployment pipeline
- **Onboarding**: Helps new developers understand project structure
- **Refactoring**: Ensures consistent structure during refactoring

This command ensures Inbox Zero maintains organized, consistent project structure that enhances developer productivity and code maintainability.
```

I've successfully converted the `.cursor` directory files into Opencode.ai agents and commands. Here's a summary of what I've created:

## 📁 Created Files

### **Agents** (for complex workflows and features):
1. **`gmail-api.md`** - Gmail API integration and email provider abstractions
2. **`server-actions.md`** - Next.js server actions with type safety and validation
3. **`prisma.md`** - PostgreSQL database schema and ORM operations
4. **`inbox-cleaner.md`** - Inbox cleaning feature for achieving inbox zero

### **Commands** (for specific focused tasks):
1. **`format-code.md`** - Code formatting with Biome and Prettier
2. **`run-tests.md`** - Comprehensive test suite execution
3. **`security-audit.md`** - Security analysis and vulnerability scanning
4. **`project-structure.md`** - Project structure validation and organization

## 🎯 Key Features

### **Compliance with Opencode Standards:**
- ✅ YAML headers without model fields (models inherited automatically)
- ✅ Proper categorization into agents and commands
- ✅ Comprehensive capabilities declarations
- ✅ Structured with clear purposes and implementations

### **Enhanced Content:**
- 📋 Detailed implementation examples
- 🔧 Practical code snippets and configurations
- 📊 Best practices and guidelines
- 🚀 Integration points and workflows
- 🛠️ Troubleshooting and debugging sections

### **Project-Specific Focus:**
- 🎯 Gmail-only email provider support
- 🔧 Next.js 15 with App Router patterns
- 🗄️ PostgreSQL with Prisma ORM
- 🤖 AI-powered email processing
- 🎨 React components with TypeScript

The converted files maintain the original knowledge from the `.cursor` rules while enhancing them with Opencode.ai structure and additional implementation details. Each file is now ready for use with Opencode.ai agents and commands system.
