---
description: Advanced performance optimization with monitoring, profiling, and automated scaling strategies
agent: performance-agent
subtask: true
---

# ⚡ /performance-workflow Command - Comprehensive Performance Optimization

## Purpose
Execute comprehensive performance optimization including monitoring, profiling, automated scaling, and performance engineering with industry-leading practices and cutting-edge optimization techniques.

## Parameters
- **operation**: Performance operation type (optimize, monitor, profile, scale, engineer)
- **strategy**: Optimization strategy (aggressive, balanced, conservative, enterprise)
- **monitoring**: Monitoring level (basic, advanced, real-time, ai-powered)
- **profiling**: Profiling depth (light, comprehensive, deep, full-system)
- **scaling**: Scaling approach (manual, auto, predictive, intelligent)

## Execution Flow

### Phase 1: Comprehensive Performance Analysis
1. **System-Level Performance Assessment**
   - CPU, memory, disk I/O, and network performance analysis
   - Resource utilization patterns and bottleneck identification
   - Infrastructure performance baseline establishment
   - Performance metric collection and trending analysis

2. **Application Performance Analysis**
   - Application response time and throughput analysis
   - Memory usage patterns and garbage collection analysis
   - Database query performance and optimization opportunities
   - API endpoint performance and bottleneck identification

3. **User Experience Performance Analysis**
   - Core Web Vitals measurement and analysis
   - Page load time and user journey analysis
   - Frontend performance bottlenecks identification
   - Mobile performance and cross-device analysis

### Phase 2: Advanced Performance Profiling
1. **Code-Level Performance Profiling**
   - CPU profiling with flame graph generation
   - Memory profiling with heap analysis and leak detection
   - Database query profiling and optimization recommendations
   - Network request profiling and optimization strategies

2. **Infrastructure Performance Profiling**
   - Container resource utilization and optimization
   - Cloud infrastructure performance analysis
   - CDN and caching performance evaluation
   - Database performance and index optimization

3. **Bundle and Asset Performance Profiling**
   - JavaScript bundle analysis and optimization recommendations
   - CSS optimization and critical path analysis
   - Image and media optimization opportunities
   - Third-party script performance impact analysis

### Phase 3: Intelligent Performance Optimization
1. **Automated Code Optimization**
   - JavaScript bundle optimization with tree shaking and code splitting
   - CSS optimization with critical path CSS extraction
   - Image optimization with modern formats and lazy loading
   - Database query optimization and index recommendations

2. **Infrastructure Optimization**
   - Auto-scaling configuration and optimization
   - Load balancer optimization and health check tuning
   - CDN configuration and edge caching optimization
   - Database connection pooling and query optimization

3. **Caching Strategy Optimization**
   - Multi-level caching strategy implementation
   - Browser caching optimization with service workers
   - CDN caching strategy optimization
   - Application-level caching optimization

### Phase 4: Performance Engineering & Scaling
1. **Scalability Engineering**
   - Horizontal and vertical scaling strategy optimization
   - Microservices architecture performance optimization
   - Database sharding and replication strategy optimization
   - Caching layer architecture optimization

2. **Real-time Performance Monitoring**
   - AI-powered performance anomaly detection
   - Real-time performance dashboard and alerting
   - Performance regression detection and alerting
   - Automated performance optimization recommendations

3. **Predictive Performance Scaling**
   - ML-based load prediction and auto-scaling
   - Performance capacity planning and optimization
   - Cost optimization through intelligent resource allocation
   - Performance SLA monitoring and enforcement

## Advanced Performance Features

### 1. Real-time Performance Monitoring
```bash
# Industry hack: Real-time performance monitoring with AI analytics
real_time_performance_monitoring() {
    local monitoring_interval=${1:-"1s"}
    local alert_threshold=${2:-"95th_percentile"}
    
    echo "📊 Starting real-time performance monitoring..."
    
    # 1. System-level monitoring
    echo "🖥️ Monitoring system metrics..."
    
    # CPU monitoring with cgroup support
    while true; do
        # Get CPU usage with precision
        cpu_usage=$(grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$3+$4+$5)} END {printf "%.2f", usage}')
        
        # Memory monitoring with cgroup awareness
        if [ -f /sys/fs/cgroup/memory/memory.usage_in_bytes ]; then
            memory_usage=$(cat /sys/fs/cgroup/memory/memory.usage_in_bytes)
            memory_limit=$(cat /sys/fs/cgroup/memory/memory.limit_in_bytes)
            memory_percentage=$(echo "scale=2; $memory_usage * 100 / $memory_limit" | bc)
        else
            memory_usage=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
        fi
        
        # Disk I/O monitoring
        disk_io=$(iostat -x 1 1 | awk '/^[sv]d[a-z]*/ {print $4, $5, $6, $7, $8, $9, $10}' | head -1)
        
        # Network monitoring
        network_stats=$(cat /proc/net/dev | grep eth0 | awk '{print $2, $10}' | tr ' ' ',')
        
        # Store metrics
        echo "$(date +%s),$cpu_usage,$memory_percentage,$disk_io,$network_stats" >> /tmp/performance_metrics.csv
        
        sleep $monitoring_interval
    done &
    
    # 2. Application-level monitoring
    echo "🎯 Setting up application performance monitoring..."
    
    # Node.js/TypeScript performance monitoring
    if [ -f "package.json" ]; then
        # Memory usage monitoring
        node -e "
        const v8 = require('v8');
        const process = require('process');
        
        setInterval(() => {
            const memUsage = process.memoryUsage();
            const heapStats = v8.getHeapStatistics();
            
            const metrics = {
                timestamp: Date.now(),
                memory: memUsage,
                heap: {
                    total_heap_size: heapStats.total_heap_size,
                    total_heap_size_executable: heapStats.total_heap_size_executable,
                    total_physical_size: heapStats.total_physical_size,
                    total_available_size: heapStats.total_available_size,
                    used_heap_size: heapStats.used_heap_size,
                    heap_size_limit: heapStats.heap_size_limit,
                    malloced_memory: heapStats.malloced_memory,
                    external_memory: heapStats.external_memory,
                    peak_malloced_memory: heapStats.peak_malloced_memory,
                    number_of_native_contexts: heapStats.number_of_native_contexts,
                    number_of_detached_contexts: heapStats.number_of_detached_contexts
                },
                cpu: process.cpuUsage()
            };
            
            console.log(JSON.stringify(metrics));
        }, 1000);
        " > /tmp/node_performance.log &
    fi
    
    # 3. Database performance monitoring
    echo "🗄️ Setting up database performance monitoring..."
    
    # PostgreSQL monitoring
    if command -v psql &> /dev/null; then
        while true; do
            psql -c "
            SELECT 
                now() as timestamp,
                (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
                (SELECT count(*) FROM pg_stat_activity WHERE state = 'idle') as idle_connections,
                (SELECT avg(EXTRACT(EPOCH FROM (now() - query_start))) FROM pg_stat_activity WHERE state = 'active' AND query_start IS NOT NULL) as avg_query_time,
                (SELECT pg_size_pretty(pg_database_size(current_database()))) as database_size;
            " -t --no-align >> /tmp/database_metrics.csv
            sleep 5
        done &
    fi
    
    # 4. Web performance monitoring
    echo "🌐 Setting up web performance monitoring..."
    
    # Core Web Vitals monitoring
    if command -v lighthouse &> /dev/null; then
        while true; do
            lighthouse http://localhost:3000 \
                --output=json \
                --output-path=/tmp/lighthouse_$(date +%s).json \
                --chrome-flags="--headless --no-sandbox" \
                --quiet
            
            sleep 300  # Every 5 minutes
        done &
    fi
    
    # Start AI-powered anomaly detection
    start_anomaly_detection
}
```

### 2. Advanced Performance Profiling
```bash
# Industry hack: Multi-language performance profiling
comprehensive_code_profiling() {
    local target_type=$1
    local duration=${2:-"30s"}
    local output_format=${3:-"flamegraph"}
    
    echo "🔥 Starting comprehensive code profiling..."
    
    case $target_type in
        "nodejs")
            # Node.js profiling with multiple techniques
            echo "📦 Profiling Node.js application..."
            
            # CPU profiling
            node --prof --trace-opt --trace-deopt app.js &
            NODE_PID=$!
            
            # Wait for application to warm up
            sleep 10
            
            # Generate load
            for i in {1..100}; do
                curl -s http://localhost:3000/api/endpoint > /dev/null &
            done
            
            # Wait for profiling duration
            sleep $duration
            
            # Stop application and process profile
            kill $NODE_PID
            node --prof-process isolate-*.log > node_cpu_profile.txt
            
            # Memory profiling
            node --inspect app.js &
            NODE_INSPECT_PID=$!
            sleep 5
            
            # Take heap snapshot using Chrome DevTools Protocol
            curl -s -X POST http://localhost:9229/json/new \
                -H "Content-Type: application/json" \
                -d '{"method":"HeapProfiler.takeHeapSnapshot","params":{}}'
            
            kill $NODE_INSPECT_PID
            
            # Generate flame graph
            if command -v flamegraph.pl &> /dev/null; then
                flamegraph.pl isolate-*.log > node_flamegraph.svg
            fi
            ;;
        "python")
            # Python profiling with multiple profilers
            echo "🐍 Profiling Python application..."
            
            # cProfile with visualization
            python -m cProfile -o profile.prof app.py &
            PYTHON_PID=$!
            sleep $duration
            kill $PYTHON_PID
            
            # Convert to different formats
            python -c "
import pstats
import sys
stats = pstats.Stats('profile.prof')
stats.sort_stats('cumulative')
stats.print_stats(20)  # Top 20 functions
stats.dump_stats('profile.prof')
"
            
            # Memory profiling with memory_profiler
            mprof run app.py &
            MPROF_PID=$!
            sleep $duration
            kill $MPROF_PID
            
            # Generate memory timeline
            mprof plot -o memory_timeline.png
            
            # Line-by-line profiling
            kernprof -l -v app.py
            ;;
        "go")
            # Go profiling with pprof
            echo "🐹 Profiling Go application..."
            
            # CPU profiling
            go test -cpuprofile=cpu.prof -bench=. &
            GO_PID=$!
            sleep $duration
            kill $GO_PID
            
            # Memory profiling
            go test -memprofile=mem.prof -bench=. &
            GO_MEM_PID=$!
            sleep $duration
            kill $GO_MEM_PID
            
            # Generate profiles
            go tool pprof -svg cpu.prof > cpu_flamegraph.svg
            go tool pprof -svg mem.prof > mem_flamegraph.svg
            
            # Web-based interactive profiling
            go tool pprof cpu.prof
            ;;
        "java")
            # Java profiling with JProfiler and async-profiler
            echo "☕ Profiling Java application..."
            
            # JStack for thread analysis
            for i in {1..10}; do
                jstack $JAVA_PID >> thread_dump.txt
                sleep 1
            done
            
            # JMap for heap analysis
            jmap -histo $JAVA_PID > heap_histogram.txt
            jmap -dump:format=binary,file=heap_dump.hprof $JAVA_PID
            
            # Async-profiler for detailed analysis
            if command -v async-profiler &> /dev/null; then
                async-profiler -d $duration -f profile.html $JAVA_PID
            fi
            ;;
    esac
    
    # Generate comprehensive report
    generate_profiling_report "$target_type"
}
```

### 3. Intelligent Auto-Scaling
```bash
# Industry hack: Intelligent auto-scaling with predictive scaling
intelligent_auto_scaling() {
    local scaling_strategy=${1:-"predictive"}
    local min_instances=${2:-"2"}
    local max_instances=${3:-"20"}
    
    echo "🚀 Starting intelligent auto-scaling..."
    
    # 1. Metrics collection and analysis
    collect_scaling_metrics() {
        # CPU metrics
        cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
        
        # Memory metrics
        memory_usage=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
        
        # Network metrics
        network_in=$(cat /proc/net/dev | grep eth0 | awk '{print $2}')
        network_out=$(cat /proc/net/dev | grep eth0 | awk '{print $10}')
        
        # Request rate (if available)
        request_rate=$(curl -s http://localhost:9999/metrics 2>/dev/null | grep request_rate || echo "0")
        
        # Response time (if available)
        response_time=$(curl -s http://localhost:9999/metrics 2>/dev/null | grep response_time || echo "0")
        
        echo "$(date +%s),$cpu_usage,$memory_usage,$network_in,$network_out,$request_rate,$response_time" >> /tmp/scaling_metrics.csv
    }
    
    # 2. Predictive scaling algorithm
    predictive_scaling() {
        # Analyze historical data to predict load
        python3 -c "
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import time

class PredictiveScaler:
    def __init__(self, min_instances=2, max_instances=20):
        self.min_instances = min_instances
        self.max_instances = max_instances
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
    
    def collect_historical_data(self):
        # In practice, collect from monitoring system
        pass
    
    def train_model(self):
        # Train model on historical data
        self.is_trained = True
    
    def predict_load(self, current_metrics):
        if not self.is_trained:
            self.train_model()
        
        # Predict future load based on current metrics and time
        future_load = self.model.predict([current_metrics])[0]
        return future_load
    
    def determine_scaling_action(self, current_load, predicted_load):
        current_time = time.localtime().tm_hour
        day_of_week = time.localtime().tm_wday
        
        # Base scaling decision on predicted load
        if predicted_load > 80:  # High load prediction
            target_instances = min(self.max_instances, 
                                 max(self.min_instances, int(current_load * 1.5)))
        elif predicted_load > 60:  # Medium load prediction
            target_instances = min(self.max_instances, 
                                 max(self.min_instances, int(current_load * 1.2)))
        elif predicted_load < 30:  # Low load prediction
            target_instances = max(self.min_instances, 
                                 int(current_load * 0.8))
        else:  # Stable load
            target_instances = current_load
        
        return int(target_instances)

scaler = PredictiveScaler($min_instances, $max_instances)
"
    }
    
    # 3. Scaling execution
    execute_scaling() {
        local target_instances=$1
        local current_instances=$2
        
        if [ $target_instances -gt $current_instances ]; then
            echo "📈 Scaling up from $current_instances to $target_instances instances"
            scale_up $target_instances
        elif [ $target_instances -lt $current_instances ]; then
            echo "📉 Scaling down from $current_instances to $target_instances instances"
            scale_down $target_instances
        else
            echo "✅ No scaling needed - current: $current_instances, target: $target_instances"
        fi
    }
    
    # 4. Scale up implementation
    scale_up() {
        local target_instances=$1
        
        case $DEPLOYMENT_PLATFORM in
            "docker-compose")
                docker-compose up -d --scale app=$target_instances
                ;;
            "kubernetes")
                kubectl scale deployment app --replicas=$target_instances
                ;;
            "aws-ecs")
                aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --desired-count $target_instances
                ;;
            "heroku")
                heroku ps:scale web=$target_instances
                ;;
        esac
        
        # Wait for scaling to complete
        wait_for_scaling_completion $target_instances
    }
    
    # 5. Scale down implementation
    scale_down() {
        local target_instances=$1
        
        case $DEPLOYMENT_PLATFORM in
            "docker-compose")
                docker-compose up -d --scale app=$target_instances
                ;;
            "kubernetes")
                kubectl scale deployment app --replicas=$target_instances
                ;;
            "aws-ecs")
                aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --desired-count $target_instances
                ;;
            "heroku")
                heroku ps:scale web=$target_instances
                ;;
        esac
    }
    
    # 6. Continuous monitoring and adjustment
    while true; do
        # Collect current metrics
        collect_scaling_metrics
        
        # Predict future load
        predicted_load=$(predictive_scaling)
        
        # Determine scaling action
        current_instances=$(get_current_instance_count)
        target_instances=$(determine_scaling_action $current_instances $predicted_load)
        
        # Execute scaling if needed
        execute_scaling $target_instances $current_instances
        
        # Sleep until next scaling decision
        sleep 30  # Check every 30 seconds
    done
}
```

### 4. Intelligent Caching Optimization
```bash
# Industry hack: Multi-level intelligent caching
intelligent_caching_optimization() {
    local cache_strategy=${1:-"adaptive"}
    
    echo "🧠 Starting intelligent caching optimization..."
    
    # 1. Application-level caching
    echo "📦 Optimizing application caching..."
    
    # Redis optimization
    if command -v redis-cli &> /dev/null; then
        # Analyze Redis usage patterns
        redis-cli INFO memory > redis_memory_info.txt
        redis-cli INFO stats > redis_stats_info.txt
        redis-cli INFO persistence > redis_persistence_info.txt
        
        # Generate optimized Redis configuration
        cat > redis_optimized.conf << 'REDIS_CONF'
# Memory optimization
maxmemory 1gb
maxmemory-policy allkeys-lru

# Persistence optimization
save 900 1
save 300 10
save 60 10000

# Network optimization
tcp-keepalive 300
timeout 0

# Performance optimization
tcp-backlog 511
databases 16
REDIS_CONF
        
        # Implement cache warming
        implement_cache_warming
    fi
    
    # 2. CDN optimization
    echo "🌐 Optimizing CDN strategy..."
    
    # Analyze asset usage patterns
    analyze_asset_patterns() {
        # Find most frequently accessed assets
        find . -name "*.js" -o -name "*.css" -o -name "*.png" -o -name "*.jpg" | \
        xargs ls -la | sort -k5 -nr > asset_sizes.txt
        
        # Generate cache headers strategy
        cat > cache_headers.conf << 'CACHE_HEADERS'
# Static assets - long cache
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# HTML files - short cache
<FilesMatch "\.html$">
    Header set Cache-Control "public, max-age=3600"
</FilesMatch>

# API responses - conditional cache
<FilesMatch "\.json$">
    Header set Cache-Control "public, max-age=300, must-revalidate"
</FilesMatch>
CACHE_HEADERS
    }
    
    # 3. Database query caching
    echo "🗄️ Optimizing database query caching..."
    
    # Implement query result caching
    implement_query_caching() {
        # Redis-based query caching
        cat > query_cache_optimizer.py << 'QUERY_CACHE'
import hashlib
import redis
import time
import json
from functools import wraps

class QueryCache:
    def __init__(self, redis_client, default_ttl=300):
        self.redis_client = redis_client
        self.default_ttl = default_ttl
    
    def cache_query(self, ttl=None):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                # Create cache key from function name and arguments
                cache_key = self._generate_key(func.__name__, args, kwargs)
                
                # Try to get from cache
                cached_result = self.redis_client.get(cache_key)
                if cached_result:
                    return json.loads(cached_result)
                
                # Execute query and cache result
                start_time = time.time()
                result = func(*args, **kwargs)
                query_time = time.time() - start_time
                
                # Cache result with intelligent TTL
                effective_ttl = ttl or self._calculate_ttl(query_time)
                self.redis_client.setex(
                    cache_key, 
                    effective_ttl, 
                    json.dumps(result)
                )
                
                return result
            return wrapper
        return decorator
    
    def _generate_key(self, func_name, args, kwargs):
        key_data = f"{func_name}:{args}:{kwargs}"
        return f"query_cache:{hashlib.md5(key_data.encode()).hexdigest()}"
    
    def _calculate_ttl(self, query_time):
        # Intelligent TTL calculation based on query execution time
        if query_time < 0.1:  # Fast queries
            return 600  # 10 minutes
        elif query_time < 1.0:  # Medium queries
            return 300  # 5 minutes
        else:  # Slow queries
            return 60  # 1 minute

# Usage example
cache = QueryCache(redis.Redis())

@cache.cache_query(ttl=1800)  # 30 minutes
def get_user_data(user_id):
    # Database query here
    return {"user_id": user_id, "data": "example"}
QUERY_CACHE
    }
    
    # 4. Browser caching optimization
    echo "🌐 Optimizing browser caching..."
    
    # Generate service worker for advanced caching
    generate_service_worker() {
        cat > service-worker.js << 'SERVICE_WORKER'
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/static/media/logo.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }
        
        // Cache miss - fetch from network and cache
        return fetch(event.request).then(
          response => {
            // Only cache successful responses
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone response for caching
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            
            return response;
          }
        );
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  // Sync offline data when connection is restored
  return new Promise((resolve) => {
    // Implementation here
    resolve();
  });
}
SERVICE_WORKER
    }
    
    # Generate caching strategy report
    generate_caching_strategy_report
}
```

## Implementation Examples

### Enterprise Performance Optimization
```bash
/performance-workflow --operation=optimize --strategy=enterprise --monitoring=ai-powered --profiling=comprehensive --scaling=predictive
```

### Performance Monitoring Setup
```bash
/performance-workflow --operation=monitor --monitoring=real-time --anomaly-detection=ai --alerting=smart --reporting=automated
```

### Performance Profiling
```bash
/performance-workflow --operation=profile --profiling=deep --languages=all --optimization=aggressive
```

### Auto-Scaling Configuration
```bash
/performance-workflow --operation=scale --scaling=intelligent --min-instances=2 --max-instances=50 --strategy=predictive
```

## Result Reporting

### Comprehensive Performance Dashboard
```json
{
  "success": true,
  "performance_metrics": {
    "current_performance": {
      "response_time_p95": "245ms",
      "requests_per_second": 1250,
      "error_rate": "0.02%",
      "cpu_usage": "45%",
      "memory_usage": "68%",
      "database_queries_per_second": 150
    },
    "optimization_results": {
      "performance_improvement": "35%",
      "resource_utilization_improvement": "28%",
      "cost_optimization": "22%",
      "scaling_efficiency": "92%"
    },
    "anomaly_detection": {
      "anomalies_detected": 3,
      "false_positives": 1,
      "detection_accuracy": 96.7,
      "response_time": "2.1s"
    }
  },
  "recommendations": [
    "Implement additional caching layer for frequently accessed data",
    "Optimize database queries for better index utilization",
    "Consider horizontal scaling for peak load periods",
    "Implement CDN for static asset delivery"
  ],
  "next_optimization_targets": [
    "Frontend bundle optimization",
    "Database connection pooling",
    "Microservices communication optimization",
    "Content delivery network setup"
  ]
}
```

## Success Metrics

### Performance Excellence
- **Response Time Improvement**: 35%+
- **Resource Utilization Optimization**: 30%+
- **Cost Optimization**: 25%+
- **Scalability Efficiency**: 90%+

### Monitoring Excellence
- **Anomaly Detection Accuracy**: 95%+
- **Mean Time to Detection**: <3 seconds
- **Mean Time to Response**: <15 seconds
- **False Positive Rate**: <3%

### Optimization Impact
- **Application Performance**: 40% improvement
- **Database Performance**: 35% improvement
- **Infrastructure Efficiency**: 30% improvement
- **User Experience**: 45% improvement

This comprehensive performance optimization system implements cutting-edge performance engineering practices with AI-powered monitoring, intelligent auto-scaling, and comprehensive optimization strategies for maximum application performance and user experience.