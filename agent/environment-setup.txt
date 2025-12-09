---
description: Manages environment variables setup, configuration, and best practices
mode: subagent
---

# Environment Setup Command

## Purpose
This command manages environment variables setup, configuration, and best practices for the Inbox Zero application, ensuring secure and consistent configuration across development, staging, and production environments.

## Usage
```bash
# Set up environment variables
npx opencode environment-setup

# Validate environment configuration
npx opencode environment-setup --validate

# Generate environment file from template
npx opencode environment-setup --generate

# Check for missing environment variables
npx opencode environment-setup --check-missing
```

## Environment Structure

### Core Environment Variables
```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/inbox_zero"

# Authentication
AUTH_SECRET="your-auth-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email Providers
EMAIL_ENCRYPT_SECRET="your-email-encryption-secret"
EMAIL_ENCRYPT_SALT="your-email-encryption-salt"

# AI/ML Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Redis Configuration
UPSTASH_REDIS_URL="redis-url"
UPSTASH_REDIS_TOKEN="redis-token"

# Google Services
GOOGLE_PUBSUB_TOPIC_NAME="projects/your-project/topics/your-topic"
GOOGLE_PUBSUB_VERIFICATION_TOKEN="your-verification-token"

# Analytics and Monitoring
POSTHOG_API_KEY="your-posthog-api-key"
AXIOM_API_KEY="your-axiom-api-key"
SENTRY_DSN="your-sentry-dsn"

# Email Services
RESEND_API_KEY="your-resend-api-key"
TINYBIRD_API_KEY="your-tinybird-api-key"

# Payment Processing
LEMON_SQUEEZY_API_KEY="your-lemon-squeezy-api-key"
```

### Environment File Template
```bash
# .env.example - Template for environment variables
# Copy this file to .env.local and fill in your values

# ===== Database =====
DATABASE_URL=""

# ===== Authentication =====
AUTH_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# ===== Email Configuration =====
EMAIL_ENCRYPT_SECRET=""
EMAIL_ENCRYPT_SALT=""

# ===== AI Services =====
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_AI_API_KEY=""
GROQ_API_KEY=""
OLLAMA_BASE_URL="http://localhost:11434"

# ===== Redis =====
UPSTASH_REDIS_URL=""
UPSTASH_REDIS_TOKEN=""

# ===== Google Services =====
GOOGLE_PUBSUB_TOPIC_NAME=""
GOOGLE_PUBSUB_VERIFICATION_TOKEN=""

# ===== Analytics =====
POSTHOG_API_KEY=""
AXIOM_API_KEY=""
SENTRY_DSN=""

# ===== Email Services =====
RESEND_API_KEY=""
TINYBIRD_API_KEY=""

# ===== Payments =====
LEMON_SQUEEZY_API_KEY=""
LEMON_SQUEEZY_WEBHOOK_SECRET=""

# ===== Feature Flags =====
ENABLE_COLD_EMAIL_BLOCKER="true"
ENABLE_REPLY_TRACKER="true"
ENABLE_DIGEST_EMAILS="true"
ENABLE_SCHEDULED_CLEANUP="false"

# ===== Development =====
DEBUG_MODE="false"
LOG_LEVEL="info"
```

## Setup Process

### 1. Initial Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Install required dependencies
pnpm install

# Validate environment setup
npx opencode environment-setup --validate
```

### 2. Database Configuration
```bash
# Set up PostgreSQL database
createdb inbox_zero_dev

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 3. Authentication Setup
```bash
# Generate secure secrets
openssl rand -base64 32

# Configure Google OAuth
# 1. Go to Google Cloud Console
# 2. Create OAuth 2.0 credentials
# 3. Add authorized redirect URIs
# 4. Copy client ID and secret to .env.local
```

### 4. Redis Setup
```bash
# Option 1: Use Upstash (Recommended for production)
# Sign up at upstash.com and copy credentials

# Option 2: Local Redis (Development only)
brew install redis
brew services start redis
```

## Validation Process

### Environment Variable Validation
```typescript
// .opencode/command/environment-setup.ts
export async function validateEnvironment() {
  const requiredVars = [
    'DATABASE_URL',
    'AUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  // Validate format of specific variables
  const validations = [
    {
      var: 'DATABASE_URL',
      test: (val: string) => val.startsWith('postgresql://'),
      message: 'DATABASE_URL must be a valid PostgreSQL connection string'
    },
    {
      var: 'AUTH_SECRET',
      test: (val: string) => val.length >= 32,
      message: 'AUTH_SECRET must be at least 32 characters long'
    }
  ];
  
  for (const { var, test, message } of validations) {
    const value = process.env[var];
    if (value && !test(value)) {
      console.error(`Invalid ${var}: ${message}`);
      return false;
    }
  }
  
  return true;
}
```

### Configuration Testing
```bash
# Test database connection
npx prisma db push

# Test authentication setup
npx opencode environment-setup --test-auth

# Test email configuration
npx opencode environment-setup --test-email

# Test AI service connections
npx opencode environment-setup --test-ai
```

## Security Best Practices

### 1. Secret Management
```typescript
// Always use environment variables for secrets
const config = {
  database: {
    url: process.env.DATABASE_URL,
    // Never hardcode database credentials
  },
  auth: {
    secret: process.env.AUTH_SECRET!, // Use non-null assertion for required vars
    // Never commit secrets to version control
  }
};
```

### 2. Environment-Specific Configuration
```bash
# .env.development.local
DEBUG_MODE="true"
LOG_LEVEL="debug"
DATABASE_URL="postgresql://localhost:5432/inbox_zero_dev"

# .env.production.local
DEBUG_MODE="false"
LOG_LEVEL="warn"
DATABASE_URL="postgresql://prod-server:5432/inbox_zero_prod"
```

### 3. Sensitive Data Handling
```typescript
// apps/web/utils/env.ts
export const getSensitiveConfig = () => ({
  // These should only be used server-side
  databaseUrl: process.env.DATABASE_URL,
  authSecret: process.env.AUTH_SECRET,
  emailEncryptSecret: process.env.EMAIL_ENCRYPT_SECRET,
  
  // These can be exposed to client
  public: {
    authUrl: process.env.NEXTAUTH_URL,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  }
});
```

## Troubleshooting

### Common Issues

#### 1. Missing Environment Variables
```bash
# Error: DATABASE_URL is not defined
# Solution: Add DATABASE_URL to your .env.local file
DATABASE_URL="postgresql://user:password@localhost:5432/inbox_zero"
```

#### 2. Invalid Authentication Configuration
```bash
# Error: Google OAuth configuration invalid
# Solution: Verify Google Cloud Console setup
# - Check OAuth client ID and secret
# - Verify authorized redirect URIs
# - Ensure Google+ API is enabled
```

#### 3. Database Connection Issues
```bash
# Error: Connection refused
# Solution: Check database server status
# - Ensure PostgreSQL is running
# - Verify connection string format
# - Check firewall settings
```

### Debug Commands
```bash
# Show current environment variables
npx opencode environment-setup --show-env

# Test specific configurations
npx opencode environment-setup --test-database
npx opencode environment-setup --test-auth
npx opencode environment-setup --test-redis

# Generate diagnostic report
npx opencode environment-setup --diagnose
```

## Integration Points

### Development Workflow
- Integrated with pre-commit hooks for environment validation
- Works with Docker for containerized development
- Supports hot reloading for environment changes

### CI/CD Pipeline
- Validates environment setup in continuous integration
- Manages environment-specific configurations
- Handles secret management in deployment

### Monitoring
- Logs environment configuration issues
- Monitors for missing or invalid configurations
- Provides alerts for security issues

This command ensures Inbox Zero maintains secure, consistent, and properly configured environment variables across all deployment stages.