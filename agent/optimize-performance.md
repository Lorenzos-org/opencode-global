---
description: Optimizes application performance including bundle size, loading speed, and runtime efficiency
mode: subagent
---

# Performance Optimization Command

## Purpose
This command optimizes the Inbox Zero application's performance across all layers including bundle size, loading speed, runtime efficiency, database queries, and AI processing performance.

## Usage
```bash
# Run comprehensive performance audit
npx opencode optimize-performance

# Optimize specific areas
npx opencode optimize-performance --target=bundle
npx opencode optimize-performance --target=database
npx opencode optimize-performance --target=ai
npx opencode optimize-performance --target=caching

# Generate performance report
npx opencode optimize-performance --report

# Implement optimizations
npx opencode optimize-performance --apply

# Monitor performance metrics
npx opencode optimize-performance --monitor
```

## Performance Audit Framework

### Bundle Size Optimization
```typescript
// .opencode/command/optimize-performance.ts
export async function auditBundleSize() {
  const results = {
    totalSize: 0,
    chunks: [],
    issues: [],
    recommendations: []
  };

  // Analyze bundle composition
  const bundleAnalysis = await analyzeBundleComposition();
  
  // Check for large dependencies
  const largeDeps = await identifyLargeDependencies();
  
  // Analyze code splitting opportunities
  const splittingOpportunities = await analyzeCodeSplitting();
  
  // Check for duplicate dependencies
  const duplicates = await detectDuplicateDependencies();

  return {
    ...results,
    bundleAnalysis,
    largeDeps,
    splittingOpportunities,
    duplicates
  };
}

async function analyzeBundleComposition() {
  // Analyze webpack/next.js bundle output
  const bundleStats = await parseBundleStats();
  
  const analysis = {
    totalSize: bundleStats.totalSize,
    largestChunks: bundleStats.chunks
      .sort((a, b) => b.size - a.size)
      .slice(0, 10),
    slowestLoading: bundleStats.chunks
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, 10),
    duplicateModules: findDuplicateModules(bundleStats.modules)
  };

  return analysis;
}

async function identifyLargeDependencies() {
  const packageJson = await readPackageJson();
  const nodeModules = await scanNodeModules();
  
  const largeDeps = nodeModules
    .filter(dep => dep.size > 1024 * 1024) // > 1MB
    .sort((a, b) => b.size - a.size);

  return largeDeps.map(dep => ({
    name: dep.name,
    size: dep.size,
    alternatives: findAlternatives(dep.name),
    impact: calculateImpact(dep)
  }));
}
```

### Database Performance Optimization
```typescript
export async function auditDatabasePerformance() {
  const results = {
    slowQueries: [],
    missingIndexes: [],
    connectionIssues: [],
    optimizationRecommendations: []
  };

  // Analyze query performance
  const slowQueries = await analyzeSlowQueries();
  results.slowQueries = slowQueries;

  // Check for missing indexes
  const missingIndexes = await analyzeMissingIndexes();
  results.missingIndexes = missingIndexes;

  // Analyze connection patterns
  const connectionAnalysis = await analyzeConnectionPatterns();
  results.connectionIssues = connectionAnalysis.issues;

  // Generate optimization recommendations
  results.optimizationRecommendations = generateDBRecommendations({
    slowQueries,
    missingIndexes,
    connectionAnalysis
  });

  return results;
}

async function analyzeSlowQueries() {
  // Connect to database and analyze query performance
  const slowQueries = await prisma.$queryRaw`
    SELECT 
      query,
      mean_time,
      calls,
      total_time,
      rows
    FROM pg_stat_statements 
    WHERE mean_time > 100
    ORDER BY mean_time DESC
    LIMIT 20
  `;

  return slowQueries.map(query => ({
    query: query.query,
    meanTime: query.mean_time,
    calls: query.calls,
    totalTime: query.total_time,
    rows: query.rows,
    efficiency: query.rows / query.total_time,
    recommendation: generateQueryRecommendation(query)
  }));
}

async function analyzeMissingIndexes() {
  const tableStats = await prisma.$queryRaw`
    SELECT 
      tablename,
      seq_scan,
      idx_scan,
      seq_tup_read,
      idx_tup_fetch
    FROM pg_stat_user_tables
    WHERE seq_scan > idx_scan
    ORDER BY seq_scan DESC
  `;

  return tableStats.map(table => ({
    table: table.tablename,
    sequentialScans: table.seq_scan,
    indexScans: table.idx_scan,
    ratio: table.seq_scan / (table.seq_scan + table.idx_scan),
    recommendation: `CREATE INDEX ON ${table.tablename} (column_name)`
  }));
}
```

### AI Processing Optimization
```typescript
export async function auditAIProcessing() {
  const results = {
    modelUsage: [],
    responseTimes: [],
    costAnalysis: [],
    optimizationOpportunities: []
  };

  // Analyze AI model usage patterns
  const modelUsage = await analyzeModelUsage();
  results.modelUsage = modelUsage;

  // Check response times and timeouts
  const responseAnalysis = await analyzeResponseTimes();
  results.responseTimes = responseAnalysis;

  // Analyze cost efficiency
  const costAnalysis = await analyzeAICosts();
  results.costAnalysis = costAnalysis;

  // Identify optimization opportunities
  results.optimizationOpportunities = identifyAIOptimizations({
    modelUsage,
    responseAnalysis,
    costAnalysis
  });

  return results;
}

async function analyzeModelUsage() {
  // Analyze which models are being used and their performance
  const usageData = await getAIUsageMetrics();
  
  return usageData.map(model => ({
    model: model.name,
    calls: model.callCount,
    avgResponseTime: model.avgResponseTime,
    successRate: model.successRate,
    costPerCall: model.costPerCall,
    efficiencyScore: calculateEfficiencyScore(model)
  }));
}

async function analyzeResponseTimes() {
  const responseTimes = await prisma.aIUsageLog.findMany({
    where: {
      timestamp: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    orderBy: {
      responseTime: 'desc'
    },
    take: 50
  });

  const analysis = {
    avgResponseTime: responseTimes.reduce((sum, log) => sum + log.responseTime, 0) / responseTimes.length,
    p95ResponseTime: percentile(responseTimes.map(log => log.responseTime), 95),
    timeouts: responseTimes.filter(log => log.responseTime > 30000).length,
    slowestCalls: responseTimes.slice(0, 10)
  };

  return analysis;
}
```

### Caching Strategy Optimization
```typescript
export async function auditCachingStrategy() {
  const results = {
    cacheHitRates: {},
    staleData: [],
    memoryUsage: {},
    optimizationRecommendations: []
  };

  // Analyze Redis cache performance
  const redisAnalysis = await analyzeRedisPerformance();
  results.cacheHitRates.redis = redisAnalysis.hitRate;

  // Check for stale cache entries
  const staleEntries = await detectStaleCacheEntries();
  results.staleData = staleEntries;

  // Analyze memory usage patterns
  const memoryAnalysis = await analyzeMemoryUsage();
  results.memoryUsage = memoryAnalysis;

  // Generate caching recommendations
  results.optimizationRecommendations = generateCachingRecommendations({
    redisAnalysis,
    staleEntries,
    memoryAnalysis
  });

  return results;
}

async function analyzeRedisPerformance() {
  // Connect to Redis and analyze performance metrics
  const info = await redis.info('stats');
  const keyStats = await redis.info('keyspace');
  
  const hitRate = calculateCacheHitRate(info);
  const memoryUsage = parseMemoryUsage(info);
  const keyDistribution = parseKeyspaceStats(keyStats);

  return {
    hitRate,
    memoryUsage,
    keyDistribution,
    operationsPerSecond: parseOperationsPerSecond(info)
  };
}

async function detectStaleCacheEntries() {
  const keys = await redis.keys('*');
  const staleKeys = [];
  
  for (const key of keys) {
    const ttl = await redis.ttl(key);
    const size = await redis.memoryUsage(key);
    
    if (ttl > 0 && ttl < 3600) { // Keys expiring within 1 hour
      const lastAccess = await redis.object('idletime', key);
      if (lastAccess && lastAccess > ttl * 1000) { // Not accessed recently
        staleKeys.push({
          key,
          ttl,
          lastAccess,
          size,
          recommendation: 'Consider shorter TTL or lazy loading'
        });
      }
    }
  }

  return staleKeys;
}
```

## Performance Optimization Implementation

### Bundle Size Reduction
```typescript
export async function optimizeBundleSize(options: BundleOptimizationOptions) {
  const optimizations = [];

  // Implement tree shaking
  if (options.treeShaking) {
    optimizations.push(await implementTreeShaking());
  }

  // Implement code splitting
  if (options.codeSplitting) {
    optimizations.push(await implementCodeSplitting());
  }

  // Optimize images and assets
  if (options.assets) {
    optimizations.push(await optimizeAssets());
  }

  // Remove duplicate dependencies
  if (options.duplicates) {
    optimizations.push(await removeDuplicates());
  }

  return optimizations;
}

async function implementTreeShaking() {
  // Analyze imports and remove unused code
  const unusedExports = await detectUnusedExports();
  
  return {
    type: 'tree-shaking',
    removedExports: unusedExports.length,
    sizeReduction: calculateSizeReduction(unusedExports),
    filesModified: unusedExports.map(exp => exp.file)
  };
}

async function implementCodeSplitting() {
  // Implement dynamic imports for routes and components
  const dynamicImports = await identifyDynamicImportOpportunities();
  
  return {
    type: 'code-splitting',
    dynamicImports: dynamicImports.length,
    chunksCreated: dynamicImports.length + 1,
    estimatedBundleReduction: calculateBundleReduction(dynamicImports)
  };
}
```

### Database Query Optimization
```typescript
export async function optimizeDatabaseQueries() {
  const optimizations = [];

  // Add missing indexes
  const missingIndexes = await findMissingIndexes();
  for (const index of missingIndexes) {
    await createIndex(index);
    optimizations.push({
      type: 'index-creation',
      table: index.table,
      columns: index.columns,
      expectedImprovement: index.expectedImprovement
    });
  }

  // Optimize slow queries
  const slowQueries = await findSlowQueries();
  for (const query of slowQueries) {
    const optimization = await optimizeQuery(query);
    optimizations.push(optimization);
  }

  // Implement query caching
  await implementQueryCaching();

  return optimizations;
}

async function createIndex(index: MissingIndex) {
  const columns = index.columns.join(', ');
  const sql = `CREATE INDEX CONCURRENTLY idx_${index.table}_${index.columns.join('_')} ON ${index.table} (${columns})`;
  
  try {
    await prisma.$executeRawUnsafe(sql);
    return { success: true, indexName: `idx_${index.table}_${index.columns.join('_')}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### AI Processing Optimization
```typescript
export async function optimizeAIProcessing() {
  const optimizations = [];

  // Implement response caching
  optimizations.push(await implementAICaching());

  // Optimize model selection
  optimizations.push(await optimizeModelSelection());

  // Implement request batching
  optimizations.push(await implementRequestBatching());

  // Add intelligent retry logic
  optimizations.push(await implementIntelligentRetries());

  return optimizations;
}

async function implementAICaching() {
  // Cache AI responses to reduce redundant calls
  const cacheConfig = {
    ttl: 3600, // 1 hour
    maxSize: 1000, // Max 1000 cached responses
    keyGenerator: (prompt: string) => `ai_cache:${hash(prompt)}`
  };

  return {
    type: 'ai-caching',
    config: cacheConfig,
    expectedReduction: '40-60%',
    implementation: 'Redis-based LRU cache'
  };
}

async function optimizeModelSelection() {
  // Implement model selection based on task complexity and cost
  const modelSelector = {
    logic: `
      if (taskComplexity === 'simple') {
        return 'gpt-3.5-turbo';
      } else if (taskComplexity === 'complex') {
        return 'claude-3-sonnet';
      } else {
        return 'gpt-4-turbo';
      }
    `,
    costOptimization: '25-35%',
    responseTimeImprovement: '15-25%'
  };

  return {
    type: 'model-selection',
    strategy: modelSelector,
    expectedSavings: '$500-800/month'
  };
}
```

## Performance Monitoring

### Real-time Performance Monitoring
```typescript
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private monitoringInterval: NodeJS.Timeout | null = null;

  startMonitoring(intervalMs: number = 60000) {
    this.monitoringInterval = setInterval(async () => {
      await this.collectMetrics();
      await this.analyzePerformance();
      await this.generateAlerts();
    }, intervalMs);

    console.log('📊 Performance monitoring started');
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('📊 Performance monitoring stopped');
    }
  }

  private async collectMetrics() {
    this.metrics.bundleSize = await this.getBundleSizeMetrics();
    this.metrics.databasePerformance = await this.getDatabaseMetrics();
    this.metrics.aiPerformance = await this.getAIMetrics();
    this.metrics.userExperience = await this.getUserExperienceMetrics();
  }

  private async analyzePerformance() {
    const analysis = {
      bundleTrend: analyzeTrend(this.metrics.bundleSize),
      databaseHealth: analyzeDatabaseHealth(this.metrics.databasePerformance),
      aiEfficiency: analyzeAIefficiency(this.metrics.aiPerformance),
      userExperienceScore: calculateUXScore(this.metrics.userExperience)
    };

    this.metrics.analysis = analysis;
  }

  private async generateAlerts() {
    const alerts = [];

    if (this.metrics.analysis?.databaseHealth?.score < 70) {
      alerts.push({
        type: 'database-performance',
        severity: 'warning',
        message: 'Database performance degraded'
      });
    }

    if (this.metrics.analysis?.aiEfficiency?.cost > 1000) {
      alerts.push({
        type: 'ai-cost',
        severity: 'critical',
        message: 'AI processing costs exceeding budget'
      });
    }

    if (alerts.length > 0) {
      await this.sendPerformanceAlerts(alerts);
    }
  }
}
```

### Performance Metrics Dashboard
```typescript
export async function generatePerformanceReport() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      overallScore: 0,
      areasOfConcern: [],
      improvementRecommendations: []
    },
    detailedMetrics: {
      bundleSize: await getBundleSizeReport(),
      database: await getDatabaseReport(),
      ai: await getAIReport(),
      userExperience: await getUserExperienceReport()
    },
    trends: await generateTrendAnalysis(),
    recommendations: await generateOptimizationRecommendations()
  };

  report.summary.overallScore = calculateOverallScore(report.detailedMetrics);
  report.summary.areasOfConcern = identifyAreasOfConcern(report.detailedMetrics);
  report.summary.improvementRecommendations = report.recommendations.slice(0, 5);

  return report;
}

function calculateOverallScore(metrics: any): number {
  const weights = {
    bundleSize: 0.2,
    database: 0.3,
    ai: 0.3,
    userExperience: 0.2
  };

  const scores = {
    bundleSize: calculateBundleScore(metrics.bundleSize),
    database: calculateDatabaseScore(metrics.database),
    ai: calculateAIScore(metrics.ai),
    userExperience: calculateUXScore(metrics.userExperience)
  };

  return Math.round(
    scores.bundleSize * weights.bundleSize +
    scores.database * weights.database +
    scores.ai * weights.ai +
    scores.userExperience * weights.userExperience
  );
}
```

## Integration with CI/CD

### Performance Gates in CI/CD
```yaml
# .github/workflows/performance-audit.yml
name: Performance Audit
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  performance-audit:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: pnpm/action-setup@v2
        with:
          version: 20
          latestVersion: true
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build application
        run: pnpm build
      
      - name: Run performance audit
        run: npx opencode optimize-performance --audit --report
      
      - name: Check performance thresholds
        run: |
          node -e "
            const report = require('./performance-report.json');
            const threshold = 85; // Minimum acceptable score
            if (report.summary.overallScore < threshold) {
              console.error(\`Performance score \${report.summary.overallScore} below threshold \${threshold}\`);
              process.exit(1);
            }
            console.log(\`Performance score \${report.summary.overallScore} meets threshold\`);
          "
      
      - name: Upload performance report
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: performance-report.json
      
      - name: Comment PR with performance results
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('./performance-report.json', 'utf8'));
            
            const comment = \`
            ## Performance Audit Results
            - **Overall Score:** \${report.summary.overallScore}/100
            - **Bundle Size:** \${report.detailedMetrics.bundleSize.score}/100
            - **Database Performance:** \${report.detailedMetrics.database.score}/100
            - **AI Efficiency:** \${report.detailedMetrics.ai.score}/100
            - **User Experience:** \${report.detailedMetrics.userExperience.score}/100
            
            \${report.summary.overallScore >= 85 ? '✅ Performance thresholds met' : '❌ Performance below thresholds'}
            \`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### Performance Regression Detection
```typescript
export async function detectPerformanceRegression() {
  const currentMetrics = await getCurrentPerformanceMetrics();
  const baselineMetrics = await getBaselineMetrics();
  
  const regressions = [];
  
  // Check bundle size regression
  if (currentMetrics.bundleSize > baselineMetrics.bundleSize * 1.1) {
    regressions.push({
      type: 'bundle-size',
      current: currentMetrics.bundleSize,
      baseline: baselineMetrics.bundleSize,
      regression: ((currentMetrics.bundleSize / baselineMetrics.bundleSize) - 1) * 100
    });
  }
  
  // Check database performance regression
  if (currentMetrics.database.avgQueryTime > baselineMetrics.database.avgQueryTime * 1.2) {
    regressions.push({
      type: 'database-performance',
      current: currentMetrics.database.avgQueryTime,
      baseline: baselineMetrics.database.avgQueryTime,
      regression: ((currentMetrics.database.avgQueryTime / baselineMetrics.database.avgQueryTime) - 1) * 100
    });
  }
  
  // Check AI response time regression
  if (currentMetrics.ai.avgResponseTime > baselineMetrics.ai.avgResponseTime * 1.15) {
    regressions.push({
      type: 'ai-response-time',
      current: currentMetrics.ai.avgResponseTime,
      baseline: baselineMetrics.ai.avgResponseTime,
      regression: ((currentMetrics.ai.avgResponseTime / baselineMetrics.ai.avgResponseTime) - 1) * 100
    });
  }
  
  return regressions;
}
```

## Best Practices

### Performance Optimization Guidelines
```typescript
export const performanceBestPractices = {
  bundleOptimization: [
    'Implement code splitting for routes and components',
    'Use dynamic imports for non-critical functionality',
    'Enable tree shaking by avoiding side effects in imports',
    'Compress and optimize images and assets',
    'Use modern image formats (WebP, AVIF)',
    'Implement lazy loading for below-the-fold content',
    'Minify and compress JavaScript and CSS',
    'Use CDN for static assets'
  ],
  
  databaseOptimization: [
    'Add appropriate indexes for frequently queried columns',
    'Use connection pooling to manage database connections',
    'Implement query result caching',
    'Avoid N+1 queries with proper eager loading',
    'Use database-specific optimizations (e.g., PostgreSQL partial indexes)',
    'Monitor and optimize slow queries regularly',
    'Implement read replicas for read-heavy workloads',
    'Use database query analyzers'
  ],
  
  aiOptimization: [
    'Cache AI responses to avoid redundant calls',
    'Use appropriate model selection based on task complexity',
    'Implement request batching for multiple AI operations',
    'Set appropriate timeouts and retry logic',
    'Monitor AI usage costs and optimize accordingly',
    'Use smaller models for simpler tasks',
    'Implement intelligent fallback strategies',
    'Cache embeddings and other expensive computations'
  ],
  
  userExperience: [
    'Implement skeleton screens for loading states',
    'Use optimistic updates for better perceived performance',
    'Implement virtual scrolling for large lists',
    'Use efficient state management patterns',
    'Minimize re-renders with proper memoization',
    'Implement progressive loading strategies',
    'Use web workers for heavy computations',
    'Optimize critical rendering path'
  ]
};
```

### Performance Budget Guidelines
```typescript
export const performanceBudgets = {
  bundleSize: {
    maxInitialBundle: '2MB',
    maxChunkSize: '500KB',
    maxTotalBundle: '5MB'
  },
  
  loadingTimes: {
    timeToFirstByte: '200ms',
    firstContentfulPaint: '1.5s',
    largestContentfulPaint: '2.5s',
    cumulativeLayoutShift: '0.1',
    firstInputDelay: '100ms'
  },
  
  database: {
    avgQueryTime: '100ms',
    maxQueryTime: '1s',
    connectionPoolSize: '20',
    cacheHitRate: '90%'
  },
  
  aiProcessing: {
    avgResponseTime: '3s',
    maxResponseTime: '10s',
    monthlyBudget: '$1000',
    cacheHitRate: '60%'
  }
};
```

This command ensures Inbox Zero maintains optimal performance across all layers of the application, providing comprehensive monitoring, optimization, and continuous improvement capabilities.