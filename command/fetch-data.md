---
description: Manages data fetching patterns, API integrations, and caching strategies
agent: plan
subtask: true
---

# Fetch Data Command

## Purpose
This command manages data fetching patterns, API integrations, and caching strategies for the Inbox Zero application using SWR, Next.js API routes, and real-time data synchronization.

## Usage
```bash
# Generate API route with SWR hook
npx opencode fetch-data --type=api-route --name=email-messages

# Create SWR hook for existing API
npx opencode fetch-data --type=swr-hook --api=/api/user/messages

# Set up real-time data synchronization
npx opencode fetch-data --type=realtime --channel=emails

# Generate API documentation
npx opencode fetch-data --type=documentation --api=/api/user/rules
```

## Data Fetching Patterns

### 1. SWR Configuration
```typescript
// apps/web/utils/swr.ts
import useSWR, { SWRConfiguration } from 'swr';
import { createScopedLogger } from './logger';

const logger = createScopedLogger('swr');

const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const defaultSWRConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 30000, // 30 seconds
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  loadingTimeout: 10000,
  shouldRetryOnError: true,
};

export function useApi<T>(url: string, config?: SWRConfiguration) {
  const swrConfig = { ...defaultSWRConfig, ...config };
  
  return useSWR<T>(
    url,
    async (url: string) => {
      try {
        const data = await fetcher<T>(url);
        logger.debug('API request successful', { url });
        return data;
      } catch (error) {
        logger.error('API request failed', { url, error });
        throw error;
      }
    },
    swrConfig
  );
}
```

### 2. API Route Structure
```typescript
// apps/web/app/api/user/messages/route.ts
import { withError } from '@/utils/middleware';
import { getMessagesForUser } from '@/utils/gmail/message';
import { createScopedLogger } from '@/utils/logger';

export const maxDuration = 300;

const logger = createScopedLogger('api/user/messages');

export const GET = withError(async (request) => {
  const { searchParams } = new URL(request.url);
  const emailAccountId = searchParams.get('emailAccountId');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  const query = searchParams.get('query') || '';
  
  logger.info('Fetching messages', { emailAccountId, limit, offset, query });
  
  const messages = await getMessagesForUser({
    emailAccountId,
    limit,
    offset,
    query,
  });
  
  return Response.json({
    messages,
    pagination: {
      limit,
      offset,
      hasMore: messages.length === limit,
    },
  });
});
```

### 3. SWR Hook Generation
```typescript
// apps/web/hooks/useMessages.ts
import { useApi } from '@/utils/swr';
import { EmailMessage } from '@/types/email';

interface UseMessagesOptions {
  emailAccountId?: string;
  limit?: number;
  offset?: number;
  query?: string;
  enabled?: boolean;
}

export function useMessages(options: UseMessagesOptions = {}) {
  const { emailAccountId, limit = 50, offset = 0, query = '', enabled = true } = options;
  
  const url = emailAccountId 
    ? `/api/user/messages?emailAccountId=${emailAccountId}&limit=${limit}&offset=${offset}&query=${encodeURIComponent(query)}`
    : null;
  
  return useApi<EmailMessage[]>(enabled ? url : null, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });
}

export function useMessage(id: string, emailAccountId: string) {
  const url = id ? `/api/user/messages/${id}?emailAccountId=${emailAccountId}` : null;
  
  return useApi<EmailMessage>(url, {
    shouldRetryOnError: false,
  });
}
```

## Real-time Data Synchronization

### 1. WebSocket Integration
```typescript
// apps/web/utils/websocket.ts
import { createScopedLogger } from './logger';

const logger = createScopedLogger('websocket');

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval = 5000;
  private maxReconnectAttempts = 10;
  private reconnectAttempts = 0;
  private listeners: Map<string, Function[]> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      logger.info('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        logger.debug('WebSocket message received', { data });
        this.emit('message', data);
      } catch (error) {
        logger.error('Failed to parse WebSocket message', { error });
      }
    };

    this.ws.onclose = () => {
      logger.info('WebSocket disconnected');
      this.emit('disconnected');
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        logger.info('Attempting to reconnect', { attempt: this.reconnectAttempts });
        
        setTimeout(() => {
          this.connect();
        }, this.reconnectInterval * this.reconnectAttempts);
      }
    };

    this.ws.onerror = (error) => {
      logger.error('WebSocket error', { error });
      this.emit('error', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      logger.warn('WebSocket not connected, cannot send message');
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}
```

### 2. Real-time SWR Integration
```typescript
// apps/web/hooks/useRealtimeData.ts
import { useEffect, useRef } from 'react';
import useSWR, { mutate } from 'swr';
import { WebSocketManager } from '@/utils/websocket';

interface UseRealtimeDataOptions<T> {
  channel: string;
  apiEndpoint: string;
  transform?: (data: any) => T;
  enabled?: boolean;
}

export function useRealtimeData<T>(
  key: string,
  options: UseRealtimeDataOptions<T>
) {
  const { channel, apiEndpoint, transform, enabled = true } = options;
  const wsRef = useRef<WebSocketManager | null>(null);

  const swr = useSWR<T>(
    enabled ? key : null,
    async () => {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    },
    {
      refreshInterval: 60000, // 1 minute
      dedupingInterval: 10000, // 10 seconds
    }
  );

  useEffect(() => {
    if (!enabled) return;

    wsRef.current = new WebSocketManager(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
    
    wsRef.current.on('connected', () => {
      wsRef.current?.send({ type: 'subscribe', channel });
    });

    wsRef.current.on('message', (data: any) => {
      if (data.channel === channel) {
        const transformedData = transform ? transform(data.payload) : data.payload;
        
        // Update SWR cache with real-time data
        mutate(key, transformedData, false);
      }
    });

    wsRef.current.connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.off('message', () => {});
        wsRef.current.disconnect();
      }
    };
  }, [enabled, channel, apiEndpoint, key, transform]);

  return swr;
}
```

### 3. Event-driven Updates
```typescript
// apps/web/utils/events.ts
import { createScopedLogger } from './logger';

const logger = createScopedLogger('events');

export class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  off(event: string, listener: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any) {
    logger.debug('Event emitted', { event, data });
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  once(event: string, listener: Function) {
    const onceWrapper = (data: any) => {
      listener(data);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
}

// Global event emitter instance
export const eventEmitter = new EventEmitter();

// Event types
export const Events = {
  EMAIL_RECEIVED: 'email:received',
  EMAIL_ARCHIVED: 'email:archived',
  RULE_EXECUTED: 'rule:executed',
  CLEANUP_COMPLETED: 'cleanup:completed',
  NOTIFICATION_SENT: 'notification:sent',
} as const;
```

## Caching Strategies

### 1. Redis Caching
```typescript
// apps/web/utils/cache.ts
import { Redis } from '@upstash/redis';
import { createScopedLogger } from './logger';

const logger = createScopedLogger('cache');

export class CacheManager {
  private redis: Redis;
  private defaultTTL = 3600; // 1 hour

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get<string>(key);
      if (data) {
        logger.debug('Cache hit', { key });
        return JSON.parse(data);
      }
      logger.debug('Cache miss', { key });
      return null;
    } catch (error) {
      logger.error('Cache get error', { key, error });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.redis.setex(key, ttl || this.defaultTTL, JSON.stringify(value));
      logger.debug('Cache set', { key, ttl });
    } catch (error) {
      logger.error('Cache set error', { key, error });
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      logger.debug('Cache deleted', { key });
    } catch (error) {
      logger.error('Cache delete error', { key });
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        logger.debug('Cache pattern deleted', { pattern, keysCount: keys.length });
      }
    } catch (error) {
      logger.error('Cache pattern delete error', { pattern, error });
    }
  }

  generateKey(namespace: string, ...parts: string[]): string {
    return `${namespace}:${parts.join(':')}`;
  }
}
```

### 2. SWR Cache Invalidation
```typescript
// apps/web/utils/swr-cache.ts
import useSWR, { mutate, cache } from 'swr';

export class SWRCacheManager {
  static invalidate(pattern: string) {
    // Invalidate all cache entries matching pattern
    const keys = cache.keys();
    const matchingKeys = Array.from(keys).filter(key => 
      typeof key === 'string' && key.includes(pattern)
    );
    
    matchingKeys.forEach(key => {
      mutate(key, undefined, { revalidate: true });
    });
  }

  static invalidateUser(emailAccountId: string) {
    this.invalidate(`emailAccountId:${emailAccountId}`);
  }

  static invalidateMessages(emailAccountId: string) {
    this.invalidate(`messages:${emailAccountId}`);
  }

  static invalidateRules(emailAccountId: string) {
    this.invalidate(`rules:${emailAccountId}`);
  }

  static prefetch<T>(key: string, data: T) {
    mutate(key, data, { revalidate: false });
  }
}
```

## API Documentation

### 1. OpenAPI Integration
```typescript
// apps/web/app/api/user/rules/route.ts
import { withError } from '@/utils/middleware';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Create registry for OpenAPI documentation
const registry = new OpenAPIRegistry();

// Define schemas
const EmailRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  conditions: z.record(z.any()),
  actions: z.record(z.any()),
  isEnabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Register schemas
registry.register('EmailRule', EmailRuleSchema);

// Register endpoints
registry.registerPath({
  method: 'get',
  path: '/api/user/rules',
  description: 'Get email rules for user',
  responses: {
    200: {
      description: 'List of email rules',
      content: {
        'application/json': {
          schema: z.array(EmailRuleSchema),
        },
      },
    },
  },
});

export const GET = withError(async (request) => {
  // Implementation
});
```

### 2. API Testing
```typescript
// apps/web/tests/api/user/rules.test.ts
import { describe, it, expect } from 'vitest';
import { createTestServer } from '../../helpers/server';

describe('User Rules API', () => {
  it('should return list of rules', async () => {
    const { server } = createTestServer();
    
    const response = await server
      .get('/api/user/rules')
      .set('Authorization', 'Bearer test-token');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create new rule', async () => {
    const { server } = createTestServer();
    
    const newRule = {
      name: 'Test Rule',
      conditions: { from: 'test@example.com' },
      actions: { action: 'archive' },
    };
    
    const response = await server
      .post('/api/user/rules')
      .set('Authorization', 'Bearer test-token')
      .send(newRule);
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newRule.name);
  });
});
```

## Best Practices

### ✅ Do:
- Use SWR for client-side data fetching with proper caching
- Implement proper error handling and loading states
- Use real-time updates for frequently changing data
- Cache API responses appropriately
- Implement proper TypeScript types
- Add comprehensive API documentation
- Use proper HTTP status codes
- Implement rate limiting and validation

### ❌ Don't:
- Skip error handling in API routes
- Ignore caching strategies leading to performance issues
- Forget to implement proper TypeScript types
- Skip API documentation
- Use synchronous operations in API routes
- Ignore security considerations
- Forget to handle edge cases
- Skip testing for API endpoints

## Integration Points

- **SWR**: Client-side data fetching with caching
- **API Routes**: Server-side API endpoints with proper error handling
- **WebSocket**: Real-time data synchronization
- **Redis**: Server-side caching for performance
- **Events**: Event-driven architecture for data updates
- **Testing**: Comprehensive API testing with Vitest

This command ensures Inbox Zero maintains efficient, reliable
