---
description: Manages AI/LLM integrations, prompts, and AI-powered email processing workflows
mode: subagent
---

# LLM Integration Agent

## Purpose
This agent manages AI/LLM integrations, prompt engineering, and AI-powered email processing workflows for the Inbox Zero application, ensuring consistent patterns for AI interactions and rule processing.

## Core Responsibilities

### 1. LLM Provider Management
- Integrate multiple LLM providers (OpenAI, Anthropic, Google AI, etc.)
- Handle provider-specific configurations and authentication
- Implement fallback strategies and load balancing
- Manage rate limiting and cost optimization

### 2. Prompt Engineering
- Create and maintain prompt templates for email processing
- Implement prompt versioning and A/B testing
- Handle prompt optimization and performance monitoring
- Manage prompt security and injection prevention

### 3. AI-Powered Workflows
- Email categorization and classification
- Rule generation and optimization
- Response drafting and suggestions
- Smart email processing decisions

## LLM Provider Integration

### Provider Configuration
```typescript
// apps/web/utils/llms/config.ts
import { createOpenAI, createAnthropic, createGoogleGenerativeAI } from '@ai-sdk/openai';

export const llmProviders = {
  openai: {
    name: 'OpenAI',
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    client: createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  },
  anthropic: {
    name: 'Anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: 'https://api.anthropic.com',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    client: createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    }),
  },
  google: {
    name: 'Google AI',
    apiKey: process.env.GOOGLE_AI_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
    client: createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    }),
  },
};
```

### Model Selection Strategy
```typescript
// apps/web/utils/llms/model.ts
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

export function getModel(provider: string, model: string) {
  switch (provider) {
    case 'openai':
      return createOpenAI({
        model: model,
        apiKey: process.env.OPENAI_API_KEY,
      });
    case 'anthropic':
      return createAnthropic({
        model: model,
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    case 'google':
      return createGoogleGenerativeAI({
        model: model,
        apiKey: process.env.GOOGLE_AI_API_KEY,
      });
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}

export function getBestAvailableModel() {
  const priorities = [
    { provider: 'anthropic', model: 'claude-3-sonnet' },
    { provider: 'openai', model: 'gpt-4-turbo' },
    { provider: 'google', model: 'gemini-1.5-flash' },
  ];

  for (const { provider, model } of priorities) {
    if (process.env[`${provider.toUpperCase()}_API_KEY`]) {
      return getModel(provider, model);
    }
  }

  throw new Error('No LLM provider configured');
}
```

## Prompt Engineering

### Email Processing Prompts
```typescript
// apps/web/utils/ai/prompts/email-processing.ts
export const emailCategorizationPrompt = `
Analyze the following email and categorize it based on content, sender, and context:

Email Subject: {{subject}}
From: {{from}}
To: {{to}}
Date: {{date}}
Snippet: {{snippet}}
Body: {{body}}

Categories:
1. Newsletter/Promotional
2. Personal Communication
3. Notifications/Alerts
4. Work/Business
5. Social
6. Transactional
7. Spam/Uncertain

Response format (JSON):
{
  "category": "Category name",
  "confidence": 0-1,
  "reasoning": "Brief explanation",
  "actionSuggested": "archive|mark_read|keep"
}
`;

export const ruleGenerationPrompt = `
Based on the user's email patterns and preferences, generate email management rules.

User Context:
- Email volume: {{emailVolume}}
- Primary concerns: {{concerns}}
- Preferred actions: {{preferredActions}}

Email Examples:
{{emailExamples}}

Generate 3-7 rules that would help this user manage their inbox effectively. Each rule should have:
- A clear condition
- A specific action
- A brief explanation

Response format (JSON array):
[
  {
    "condition": "Condition description",
    "action": "Action to take",
    "explanation": "Why this rule is helpful"
  }
]
`;

export const responseDraftingPrompt = `
Draft a response to this email in the user's tone and style:

Original Email:
Subject: {{subject}}
From: {{from}}
Content: {{content}}

User's Communication Style:
- Tone: {{tone}}
- Formality: {{formality}}
- Typical response length: {{responseLength}}

Draft a concise, appropriate response that the user would likely send.

Response format:
{
  "subject": "Response subject line",
  "body": "Response body content",
  "tone": "Tone of the response",
  "confidence": 0-1
}
`;
```

### Prompt Template System
```typescript
// apps/web/utils/ai/prompts/template.ts
export class PromptTemplate {
  private template: string;

  constructor(template: string) {
    this.template = template;
  }

  render(data: Record<string, any>): string {
    let result = this.template;
    
    // Replace {{variable}} placeholders
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return result;
  }
}

export function createEmailAnalysisTemplate() {
  return new PromptTemplate(`
Analyze this email for processing decisions:

Email: {{emailContent}}
Sender: {{sender}}
Subject: {{subject}}

Consider:
1. Urgency level (1-10)
2. Required action (reply/archive/read later)
3. Category (work/personal/newsletter/etc.)
4. Sentiment (positive/neutral/negative)

Return JSON with analysis.
  `);
}
```

## AI-Powered Email Processing

### Email Rule Matching
```typescript
// apps/web/utils/ai/choose-rule/match-rules.ts
import { getModel } from '@/utils/llms/model';
import { EmailForLLM } from '@/utils/types';

export async function findPotentialMatchingRules(
  rules: EmailRule[],
  email: EmailForLLM
) {
  const model = getModel('anthropic', 'claude-3-sonnet');
  
  // Filter rules by basic conditions first
  const filteredRules = rules.filter(rule => {
    if (!rule.isEnabled) return false;
    
    // Quick checks for obvious mismatches
    if (rule.conditions.from && !email.from.includes(rule.conditions.from)) {
      return false;
    }
    
    return true;
  });

  // Use AI for complex condition matching
  const aiMatches = await Promise.all(
    filteredRules.map(async rule => {
      try {
        const prompt = `Does this email match the following rule condition?

Rule: ${JSON.stringify(rule.conditions)}
Email: ${JSON.stringify(email)}

Respond with "MATCH" or "NO_MATCH" and brief reasoning.`;

        const response = await model.generateText({
          prompt,
          maxTokens: 50,
        });

        return response.text.includes('MATCH') ? rule : null;
      } catch (error) {
        console.error('Error matching rule:', error);
        return null;
      }
    })
  );

  return aiMatches.filter(Boolean);
}
```

### AI Response Generation
```typescript
// apps/web/utils/ai/actions/generate-response.ts
import { getModel } from '@/utils/llms/model';

export async function generateEmailResponse(
  emailAccount: EmailAccountWithAI,
  originalEmail: EmailForLLM,
  context?: string
) {
  const model = getModel(emailAccount.aiProvider, emailAccount.aiModel);
  
  const prompt = `Generate a response to this email:

FROM: ${originalEmail.from}
SUBJECT: ${originalEmail.subject}
CONTENT: ${originalEmail.snippet}

${context ? `Context: ${context}` : ''}

Keep the response brief and professional. Focus on the main point.`;

  try {
    const result = await model.generateObject({
      prompt,
      schema: {
        type: 'object',
        properties: {
          subject: { type: 'string' },
          body: { type: 'string' },
          tone: { type: 'string', enum: ['professional', 'casual', 'friendly'] },
          length: { type: 'string', enum: ['short', 'medium', 'long'] }
        },
        required: ['subject', 'body']
      }
    });

    return result;
  } catch (error) {
    console.error('Failed to generate response:', error);
    throw new Error('AI response generation failed');
  }
}
```

### Smart Email Categorization
```typescript
// apps/web/utils/ai/categorize/category.ts
import { getModel } from '@/utils/llms/model';

export async function categorizeEmail(
  emailAccount: EmailAccountWithAI,
  email: EmailForLLM
) {
  const model = getModel(emailAccount.aiProvider, emailAccount.aiModel);
  
  const prompt = `Categorize this email:

Subject: ${email.subject}
From: ${email.from}
Content: ${email.snippet}

Categories: Work, Personal, Newsletter, Social, Transactional, Spam, Other

Respond with JSON:
{
  "category": "Category name",
  "confidence": 0-1,
  "reasoning": "Brief explanation",
  "action": "archive|mark_read|keep|reply"
}`;

  try {
    const result = await model.generateObject({
      prompt,
      schema: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          reasoning: { type: 'string' },
          action: { type: 'string', enum: ['archive', 'mark_read', 'keep', 'reply'] }
        },
        required: ['category', 'confidence', 'reasoning', 'action']
      }
    });

    return result;
  } catch (error) {
    console.error('Failed to categorize email:', error);
    return {
      category: 'Other',
      confidence: 0.5,
      reasoning: 'AI categorization failed',
      action: 'keep'
    };
  }
}
```

## AI Safety and Security

### Prompt Injection Prevention
```typescript
// apps/web/utils/ai/security.ts
export function sanitizePromptInput(input: string): string {
  // Remove potential prompt injection attempts
  const dangerousPatterns = [
    /### Assistant ###/gi,
    /### Human ###/gi,
    /Ignore previous/gi,
    /You are now/gi,
    /From now on/gi,
  ];

  let sanitized = input;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Limit input length
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized.trim();
}

export function validateAIResponse(response: any): boolean {
  // Validate that AI response doesn't contain malicious content
  const responseText = JSON.stringify(response);
  
  const maliciousPatterns = [
    /system\.|exec\(|eval\(/i,
    /rm\s+-rf/i,
    /sudo\s+/i,
  ];

  return !maliciousPatterns.some(pattern => pattern.test(responseText));
}
```

### Rate Limiting and Cost Management
```typescript
// apps/web/utils/ai/rate-limit.ts
import { Redis } from '@upstash/redis';

export class AIRateLimiter {
  private redis: Redis;
  private readonly limits = {
    openai: { requests: 60, window: 60000 }, // 60 requests per minute
    anthropic: { requests: 30, window: 60000 }, // 30 requests per minute
    google: { requests: 100, window: 60000 }, // 100 requests per minute
  };

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async checkLimit(provider: string, userId: string): Promise<boolean> {
    const key = `ai_limit:${provider}:${userId}`;
    const now = Date.now();
    const limit = this.limits[provider];

    if (!limit) return true;

    const requests = await this.redis.lrange(key, 0, -1);
    const validRequests = requests
      .map(req => Number(req))
      .filter(timestamp => now - timestamp < limit.window);

    if (validRequests.length >= limit.requests) {
      return false;
    }

    await this.redis.lpush(key, now);
    await this.redis.expire(key, Math.ceil(limit.window / 1000));
    return true;
  }
}
```

## Performance Optimization

### Caching AI Results
```typescript
// apps/web/utils/ai/cache.ts
import { Redis } from '@upstash/redis';

export class AICache {
  private redis: Redis;
  private readonly TTL = 3600; // 1 hour

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.redis.setex(key, ttl || this.TTL, JSON.stringify(value));
  }

  generateKey(prompt: string, context?: string): string {
    const hash = require('crypto')
      .createHash('md5')
      .update(prompt + (context || ''))
      .digest('hex');
    
    return `ai_cache:${hash}`;
  }
}
```

### Batch Processing
```typescript
// apps/web/utils/ai/batch.ts
export async function batchProcessEmails(
  emails: EmailForLLM[],
  processor: (email: EmailForLLM) => Promise<any>,
  batchSize: number = 10
): Promise<any[]> {
  const results: any[] = [];
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    
    const batchResults = await Promise.allSettled(
      batch.map(email => processor(email))
    );
    
    batchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Batch processing failed:', result.reason);
        results.push(null);
      }
    });
    
    // Add delay between batches to avoid rate limiting
    if (i + batchSize < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
```

## Monitoring and Analytics

### AI Performance Tracking
```typescript
// apps/web/utils/ai/metrics.ts
export class AIMetrics {
  static trackPrediction(
    provider: string,
    model: string,
    promptTokens: number,
    completionTokens: number,
    responseTime: number,
    success: boolean
  ) {
    // Log metrics for monitoring
    console.log('AI Prediction Metrics:', {
      provider,
      model,
      promptTokens,
      completionTokens,
      responseTime,
      success,
      timestamp: new Date().toISOString()
    });
  }

  static trackRuleEffectiveness(
    ruleId: string,
    matches: number,
    actionsTaken: number,
    userFeedback: 'positive' | 'negative' | 'neutral'
  ) {
    // Track rule performance over time
    console.log('Rule Effectiveness:', {
      ruleId,
      matches,
      actionsTaken,
      userFeedback
    });
  }
}
```

## Best Practices

### ✅ Do:
- Use multiple LLM providers for redundancy
- Implement proper error handling and fallbacks
- Cache AI responses to reduce costs
- Monitor AI usage and performance
- Sanitize all user inputs to prevent prompt injection
- Use appropriate model selection based on task complexity
- Implement rate limiting to control costs
- Track AI decision reasoning for transparency

### ❌ Don't:
- Skip error handling for AI calls
- Ignore rate limits and usage costs
- Trust AI responses without validation
- Expose sensitive data in prompts
- Use overly complex prompts that increase costs
- Skip monitoring and analytics
- Ignore user feedback on AI decisions

## Integration Points

- **Email Processing**: Integrated with Gmail API for email analysis
- **Rule Engine**: Works with email rule matching system
- **User Interface**: Provides AI suggestions to users
- **Database**: Stores AI decisions and feedback
- **Caching**: Uses Redis for response caching
- **Monitoring**: Integrates with analytics and logging systems

This agent ensures Inbox Zero provides intelligent, cost-effective, and secure AI-powered email processing capabilities.