---
description: Advanced performance optimization with monitoring, profiling, and automated scaling strategies - now consolidated with performance-optimizer.md
mode: subagent
tools:
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
  todowrite: true
  todoread: true
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
---

# ⚡ @performance-agent - Legacy Reference

**Note**: This agent has been consolidated into `performance-optimizer.md` which now handles all performance capabilities:
- Performance analysis and monitoring
- Optimization strategies and implementation  
- Performance engineering and architecture
- Automated scaling and resource management

Please use `@performance-specialist` (performance-optimizer.md) for all performance-related tasks.

## Consolidated Capabilities Available

### analysis
Comprehensive performance analysis and bottleneck identification

### optimization  
Performance optimization and improvement implementation

### monitoring
Performance monitoring and reporting

### engineering
Performance engineering and architecture optimization

---

**This file maintained for backward compatibility. All new performance work should use @performance-specialist.**

## Industry Best Practices & Cutting-Edge Techniques

### 1. Advanced Performance Monitoring

#### Real-time Performance Dashboard
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

#### AI-Powered Performance Anomaly Detection
```bash
# Industry hack: Machine learning for performance anomaly detection
start_anomaly_detection() {
    echo "🤖 Starting AI-powered anomaly detection..."
    
    # Python script for anomaly detection
    cat > /tmp/anomaly_detection.py << 'EOF'
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import time
import json

class PerformanceAnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_columns = [
            'cpu_usage', 'memory_usage', 'disk_read', 'disk_write',
            'network_recv', 'network_sent', 'active_connections'
        ]
    
    def collect_training_data(self):
        """Collect baseline performance data for training"""
        print("📊 Collecting baseline performance data...")
        
        data = []
        for i in range(1000):  # Collect 1000 samples
            sample = self.collect_metrics()
            data.append(sample)
            time.sleep(1)  # 1 second interval
        
        return pd.DataFrame(data)
    
    def collect_metrics(self):
        """Collect current system metrics"""
        import subprocess
        
        # CPU usage
        cpu_result = subprocess.run(['grep', 'cpu ', '/proc/stat'], 
                                   capture_output=True, text=True)
        cpu_line = cpu_result.stdout.split('\n')[0]
        cpu_fields = list(map(int, cpu_line.split()[1:]))
        cpu_idle = cpu_fields[3]
        cpu_total = sum(cpu_fields)
        
        # Memory usage
        mem_result = subprocess.run(['free'], capture_output=True, text=True)
        mem_lines = mem_result.stdout.strip().split('\n')
        mem_fields = mem_lines[1].split()[1:3]
        memory_usage = (int(mem_fields[0]) - int(mem_fields[1])) * 100 / int(mem_fields[0])
        
        # Disk I/O
        disk_result = subprocess.run(['iostat', '-x', '1', '1'], 
                                   capture_output=True, text=True)
        disk_lines = disk_result.stdout.strip().split('\n')
        disk_data = [line.split() for line in disk_lines if '/dev/' in line]
        
        # Network stats
        with open('/proc/net/dev', 'r') as f:
            net_lines = f.readlines()
        eth0_stats = [line for line in net_lines if 'eth0' in line][0].split()
        
        return {
            'timestamp': time.time(),
            'cpu_usage': float(cpu_idle),
            'memory_usage': float(memory_usage),
            'disk_read': float(disk_data[0][3]) if disk_data else 0,
            'disk_write': float(disk_data[0][4]) if disk_data else 0,
            'network_recv': float(eth0_stats[1]),
            'network_sent': float(eth0_stats[9]),
            'active_connections': 0  # Would need database connection
        }
    
    def train_model(self):
        """Train the anomaly detection model"""
        print("🏋️ Training anomaly detection model...")
        
        # Collect training data
        df = self.collect_training_data()
        
        # Prepare features
        features = df[self.feature_columns].fillna(0)
        features_scaled = self.scaler.fit_transform(features)
        
        # Train model
        self.model.fit(features_scaled)
        self.is_trained = True
        
        print("✅ Model training completed")
    
    def detect_anomalies(self):
        """Continuously monitor for anomalies"""
        if not self.is_trained:
            self.train_model()
        
        print("🔍 Starting continuous anomaly detection...")
        
        while True:
            # Collect current metrics
            current_metrics = self.collect_metrics()
            
            # Prepare features
            features = np.array([[current_metrics[col] for col in self.feature_columns]])
            features_scaled = self.scaler.transform(features)
            
            # Predict anomaly
            anomaly_score = self.model.decision_function(features_scaled)[0]
            is_anomaly = self.model.predict(features_scaled)[0] == -1
            
            # Report anomalies
            if is_anomaly:
                alert_data = {
                    'timestamp': current_metrics['timestamp'],
                    'anomaly_score': float(anomaly_score),
                    'metrics': current_metrics,
                    'severity': 'high' if anomaly_score < -0.5 else 'medium'
                }
                
                print(f"🚨 Anomaly detected: {json.dumps(alert_data)}")
                self.send_alert(alert_data)
            
            time.sleep(10)  # Check every 10 seconds
    
    def send_alert(self, alert_data):
        """Send alert for anomaly"""
        # In practice, send to monitoring system
        with open('/tmp/performance_alerts.log', 'a') as f:
            f.write(json.dumps(alert_data) + '\n')

if __name__ == "__main__":
    detector = PerformanceAnomalyDetector()
    detector.detect_anomalies()
EOF
    
    # Start anomaly detection in background
    python3 /tmp/anomaly_detection.py > /tmp/anomaly_detection.log 2>&1 &
    echo $! > /tmp/anomaly_detection.pid
}
```

### 2. Advanced Performance Profiling

#### Comprehensive Code Profiling
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

#### Database Performance Optimization
```bash
# Industry hack: Advanced database performance tuning
database_performance_optimization() {
    local db_type=$1
    local optimization_level=${2:-"comprehensive"}
    
    echo "🗄️ Starting database performance optimization for: $db_type"
    
    case $db_type in
        "postgresql")
            # PostgreSQL comprehensive optimization
            echo "🐘 Optimizing PostgreSQL performance..."
            
            # 1. Query analysis and optimization
            echo "🔍 Analyzing slow queries..."
            
            # Enable query logging
            psql -c "ALTER SYSTEM SET log_min_duration_statement = 1000;"
            psql -c "SELECT pg_reload_conf();"
            
            # Analyze query patterns
            psql -c "
            SELECT 
                query,
                calls,
                total_time,
                mean_time,
                rows,
                100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
            FROM pg_stat_statements 
            ORDER BY total_time DESC 
            LIMIT 20;
            " > slow_queries_analysis.txt
            
            # 2. Index optimization
            echo "📊 Analyzing index usage..."
            
            # Find unused indexes
            psql -c "
            SELECT 
                t.tablename,
                indexname,
                c.reltuples AS num_rows,
                pg_size_pretty(pg_relation_size(quote_ident(t.tablename)::regclass)) AS table_size,
                pg_size_pretty(pg_relation_size(quote_ident(indexrelname)::regclass)) AS index_size,
                CASE WHEN indisunique THEN 'Y' ELSE 'N' END AS unique,
                idx_scan AS number_of_scans,
                idx_tup_read AS tuples_read,
                idx_tup_fetch AS tuples_fetched
            FROM pg_tables t
            LEFT OUTER JOIN pg_class c ON c.relname = t.tablename
            LEFT OUTER JOIN (
                SELECT c.relname AS ctablename, ipg.relname AS indexname, x.indnatts AS number_of_columns,
                       idx_scan, idx_tup_read, idx_tup_fetch, indexrelname, indisunique
                FROM pg_index x
                JOIN pg_class c ON c.oid = x.indrelid
                JOIN pg_class ipg ON ipg.oid = x.indexrelid
                JOIN pg_stat_user_indexes psui ON x.indexrelid = psui.indexrelid
            ) AS foo ON t.tablename = foo.ctablename
            WHERE t.tablename NOT LIKE 'pg_%'
            ORDER BY 1, 2;
            " > index_analysis.txt
            
            # 3. Configuration optimization
            echo "⚙️ Optimizing PostgreSQL configuration..."
            
            # Generate optimized configuration
            cat > postgresql_optimized.conf << 'POSTGRESQL_CONF'
# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Checkpoint settings
checkpoint_completion_target = 0.9
wal_buffers = 16MB
checkpoint_timeout = 30min

# I/O settings
random_page_cost = 1.1
effective_io_concurrency = 200

# Connection settings
max_connections = 100

# Query planner settings
default_statistics_target = 100
POSTGRESQL_CONF
            
            # Apply configuration (backup first)
            cp /etc/postgresql/*/main/postgresql.conf /etc/postgresql/*/main/postgresql.conf.backup
            cat postgresql_optimized.conf >> /etc/postgresql/*/main/postgresql.conf
            
            # 4. Vacuum and analyze optimization
            echo "🧹 Optimizing vacuum strategy..."
            
            # Analyze table statistics
            psql -c "ANALYZE;"
            
            # Schedule vacuum for large tables
            psql -c "
            SELECT 
                tablename,
                n_tup_ins as inserts,
                n_tup_upd as updates,
                n_tup_del as deletes,
                n_dead_tup as dead_tuples,
                CASE 
                    WHEN n_dead_tup > n_tup_ins * 0.1 THEN 'VACUUM_REQUIRED'
                    ELSE 'OK'
                END as vacuum_status
            FROM pg_stat_user_tables
            WHERE n_dead_tup > 1000
            ORDER BY n_dead_tup DESC;
            " > vacuum_analysis.txt
            ;;
        "mysql")
            # MySQL optimization
            echo "🐬 Optimizing MySQL performance..."
            
            # Query analysis
            mysql -e "
            SELECT 
                query_time,
                lock_time,
                rows_sent,
                rows_examined,
                sql_text
            FROM mysql.slow_log 
            WHERE start_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
            ORDER BY query_time DESC 
            LIMIT 20;
            " > mysql_slow_queries.txt
            
            # Index analysis
            mysql -e "
            SELECT 
                TABLE_SCHEMA,
                TABLE_NAME,
                INDEX_NAME,
                CARDINALITY,
                SUB_PART,
                NULLABLE
            FROM information_schema.STATISTICS
            WHERE TABLE_SCHEMA NOT IN ('mysql', 'information_schema', 'performance_schema', 'sys')
            ORDER BY TABLE_SCHEMA, TABLE_NAME, SEQ_IN_INDEX;
            " > mysql_index_analysis.txt
            
            # Configuration optimization
            cat > mysql_optimized.cnf << 'MYSQL_CONF'
[mysqld]
# Memory settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M
key_buffer_size = 128M

# Connection settings
max_connections = 200
thread_cache_size = 50

# Query cache
query_cache_type = 1
query_cache_size = 256M

# InnoDB settings
innodb_flush_method = O_DIRECT
innodb_flush_log_at_trx_commit = 2
innodb_file_per_table = 1

# Timeout settings
wait_timeout = 600
interactive_timeout = 600
MYSQL_CONF
            ;;
    esac
    
    # Generate optimization report
    generate_database_optimization_report "$db_type"
}
```

### 3. Automated Performance Optimization

#### Intelligent Caching Strategies
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

### 4. Performance Engineering & Scaling

#### Auto-Scaling Implementation
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

## Integration Examples

### Complete Performance Optimization
```bash
# Execute comprehensive performance optimization
/performance-optimize --strategy="enterprise" --monitoring="real-time" --profiling="comprehensive" --scaling="predictive"
```

### Performance Monitoring Setup
```bash
# Set up advanced performance monitoring
/performance-monitoring --interval="1s" --anomaly-detection="ai" --alerting="smart" --reporting="automated"
```

### Database Performance Tuning
```bash
# Execute database performance optimization
/database-performance --type="postgresql" --optimization="comprehensive" --indexing="smart" --caching="intelligent"
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

This advanced performance optimization system implements cutting-edge performance engineering practices with AI-powered monitoring, intelligent auto-scaling, and comprehensive optimization strategies for maximum application performance and user experience.

## Project Bloat Reduction

This agent is committed to reducing project bloat and maintaining lean, high-performance systems. Specific responsibilities include:

- **Performance Efficiency**: Identify and eliminate performance bottlenecks that contribute to system bloat and resource waste
- **Resource Management**: Optimize resource utilization to reduce unnecessary infrastructure and operational overhead
- **Architecture Simplicity**: Advocate for performance-optimized architectures that are simple and maintainable
- **Monitoring Conciseness**: Implement focused monitoring that captures essential metrics without excessive data collection
- **Optimization Minimalism**: Apply performance optimizations strategically, avoiding over-engineering and premature optimization
- **Code Optimization**: Identify and eliminate inefficient code patterns that contribute to application bloat
- **Regular Cleanup**: Remove unused performance monitoring configurations, obsolete metrics, and redundant optimization code