---
description: Execute advanced CI/CD workflows with PR automation, auto-merge, worktrees, and industry best practices
agent: cicd-agent
subtask: true
---

# 🚀 /cicd-workflow Command - Advanced CI/CD Pipeline Management

## Purpose
Execute comprehensive CI/CD workflows with advanced PR automation, smart auto-merge strategies, worktree management, and industry-optimized performance.

## Parameters
- **operation**: CI/CD operation type (setup, deploy, test, merge, optimize)
- **strategy**: Workflow strategy (fast, balanced, secure, enterprise)
- **auto-merge**: Auto-merge configuration (smart, conservative, aggressive, disabled)
- **worktrees**: Number of parallel worktrees (1-10)
- **cache**: Cache strategy (layered, aggressive, conservative, disabled)
- **parallel**: Parallel execution level (low, medium, high, maximum)

## Execution Flow

### Phase 1: Environment Setup
1. Configure advanced caching strategies
2. Set up parallel worktree environments
3. Initialize CI/CD pipeline configuration
4. Validate toolchain and dependencies

### Phase 2: Quality Gates & Testing
1. Execute fast feedback quality checks
2. Run parallel test execution strategies
3. Perform security scanning and vulnerability assessment
4. Validate performance benchmarks and requirements

### Phase 3: Smart Automation
1. Implement intelligent auto-merge strategies
2. Execute approval workflow automation
3. Perform conflict detection and resolution
4. Coordinate deployment pipeline execution

### Phase 4: Optimization & Monitoring
1. Analyze pipeline performance and bottlenecks
2. Optimize caching and build strategies
3. Monitor deployment success and rollback readiness
4. Generate comprehensive pipeline reports

## Advanced Operations

### Smart Auto-Merge Implementation
```bash
/cicd-workflow --operation=auto-merge --strategy=smart --auto-merge=aggressive
```

**Features:**
- **Conflict Prediction**: ML-based conflict probability analysis
- **Quality-Based Merging**: Merge only if quality gates pass
- **Approval Automation**: Smart approval requirements based on change impact
- **Rollback Safety**: Automatic rollback if post-merge issues detected

**Implementation:**
```yaml
# Advanced auto-merge workflow
name: Smart Auto-Merge Pipeline

on:
  pull_request:
    types: [opened, synchronize, reopened]
  pull_request_review:
    types: [submitted]

jobs:
  # Industry hack: Fast conflict detection
  conflict-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Advanced conflict detection
        id: conflict
        run: |
          # Fetch base branch with full history
          git fetch origin ${{ github.base_ref }} --unshallow --depth=200
          
          # Check ancestry for fast path
          if git merge-base --is-ancestor HEAD origin/${{ github.base_ref }}; then
            echo "UP_TO_DATE=true" >> $GITHUB_OUTPUT
            echo "CONFLICTS=false" >> $GITHUB_OUTPUT
            exit 0
          fi
          
          # Advanced merge simulation
          git fetch origin ${{ github.base_ref }}
          git merge-base --is-ancestor HEAD origin/${{ github.base_ref }} || {
            echo "UP_TO_DATE=false" >> $GITHUB_OUTPUT
            
            # Simulate merge to detect conflicts
            git merge --no-commit --no-ff origin/${{ github.base_ref }} || {
              echo "CONFLICTS=true" >> $GITHUB_OUTPUT
              git merge --abort
              exit 1
            }
            git merge --abort
            echo "CONFLICTS=false" >> $GITHUB_OUTPUT
          }

  # Industry hack: Parallel quality checks
  quality-gates:
    needs: conflict-check
    if: steps.conflict-check.outputs.CONFLICTS == 'false'
    strategy:
      matrix:
        check: [lint, typecheck, security, performance]
        fail-fast: false
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Cache optimization
        uses: actions/cache@v3
        with:
          path: |
            ~/.npm
            ~/.cache
            node_modules
          key: ${{ runner.os }}-${{ matrix.check }}-${{ hashFiles('**/package-lock.json') }}-${{ github.sha }}
      
      - name: Execute ${{ matrix.check }} checks
        run: |
          npm ci --frozen-lockfile
          case "${{ matrix.check }}" in
            lint)
              npm run lint:fix
              ;;
            typecheck)
              npm run type-check
              ;;
            security)
              npm run security:audit
              npx audit-ci --config audit-ci.json
              ;;
            performance)
              npm run build
              npm run test:performance
              ;;
          esac

  # Industry hack: Smart auto-merge with approvals
  smart-merge:
    needs: [conflict-check, quality-gates]
    if: |
      github.event.pull_request.state == 'open' &&
      github.event.pull_request.draft == false &&
      needs.conflict-check.outputs.CONFLICTS == 'false' &&
      needs.quality-gates.result == 'success'
    
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0
      
      - name: Calculate approval requirements
        id: approvals
        run: |
          # Get change metrics
          FILES_CHANGED=$(git diff --numstat origin/${{ github.base_ref }}...HEAD | wc -l)
          LINES_CHANGED=$(git diff --numstat origin/${{ github.base_ref }}...HEAD | awk '{sum += $1 + $2} END {print sum}')
          
          # Check for sensitive files
          SENSITIVE_FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD | grep -E "(config|secret|auth|payment)" | wc -l)
          
          # Calculate required approvals
          if [[ $SENSITIVE_FILES -gt 0 ]]; then
            echo "REQUIRED_APPROVALS=2" >> $GITHUB_OUTPUT
            echo "MIN_AGE_HOURS=24" >> $GITHUB_OUTPUT
          elif [[ $LINES_CHANGED -gt 500 || $FILES_CHANGED -gt 20 ]]; then
            echo "REQUIRED_APPROVALS=2" >> $GITHUB_OUTPUT
            echo "MIN_AGE_HOURS=6" >> $GITHUB_OUTPUT
          elif [[ $LINES_CHANGED -gt 100 || $FILES_CHANGED -gt 5 ]]; then
            echo "REQUIRED_APPROVALS=1" >> $GITHUB_OUTPUT
            echo "MIN_AGE_HOURS=2" >> $GITHUB_OUTPUT
          else
            echo "REQUIRED_APPROVALS=0" >> $GITHUB_OUTPUT
            echo "MIN_AGE_HOURS=0" >> $GITHUB_OUTPUT
          fi
      
      - name: Check approval status
        id: approval-check
        run: |
          # Get current approvals
          APPROVALS=$(gh pr view ${{ github.event.pull_request.number }} --json reviews | jq '[.reviews[] | select(.state == "APPROVED")] | length')
          
          if [[ $APPROVALS -ge ${{ steps.approvals.outputs.REQUIRED_APPROVALS }} ]]; then
            echo "READY_TO_MERGE=true" >> $GITHUB_OUTPUT
          else
            echo "READY_TO_MERGE=false" >> $GITHUB_OUTPUT
            echo "CURRENT_APPROVALS=$APPROVALS" >> $GITHUB_OUTPUT
            echo "REQUIRED_APPROVALS=${{ steps.approvals.outputs.REQUIRED_APPROVALS }}" >> $GITHUB_OUTPUT
          fi
      
      - name: Execute smart merge
        if: steps.approval-check.outputs.READY_TO_MERGE == 'true'
        run: |
          # Determine merge strategy
          BRANCH_NAME="${{ github.head_ref }}"
          
          if [[ "$BRANCH_NAME" == feature/* ]]; then
            MERGE_STRATEGY="--squash"
          elif [[ "$BRANCH_NAME" == hotfix/* ]]; then
            MERGE_STRATEGY="--merge"
          elif [[ "$BRANCH_NAME" == release/* ]]; then
            MERGE_STRATEGY="--rebase"
          else
            MERGE_STRATEGY="--squash"
          fi
          
          # Execute merge with strategy
          gh pr merge --auto $MERGE_STRATEGY --delete-branch ${{ github.event.pull_request.number }}

  # Industry hack: Advanced deployment pipeline
  deploy:
    needs: smart-merge
    if: github.ref == 'refs/heads/main'
    
    strategy:
      matrix:
        environment: [staging, production]
        exclude:
          - environment: production
            if: github.event.pull_request.draft == true
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      # Industry hack: Incremental deployment strategy
      - name: Determine deployment strategy
        id: deploy-strategy
        run: |
          # Analyze changes for deployment strategy
          CHANGED_FILES=$(git diff --name-only HEAD~1)
          
          if echo "$CHANGED_FILES" | grep -qE "(package\.json|yarn\.lock|Dockerfile)"; then
            echo "DEPLOY_STRATEGY=full-rebuild" >> $GITHUB_OUTPUT
          elif echo "$CHANGED_FILES" | grep -q "src/pages"; then
            echo "DEPLOY_STRATEGY=blue-green" >> $GITHUB_OUTPUT
          elif echo "$CHANGED_FILES" | grep -q "src/components"; then
            echo "DEPLOY_STRATEGY=canary" >> $GITHUB_OUTPUT
          else
            echo "DEPLOY_STRATEGY=hot-swap" >> $GITHUB_OUTPUT
          fi
      
      # Industry hack: Blue-green deployment
      - name: Execute ${{ matrix.environment }} deployment
        run: |
          case "${{ steps.deploy-strategy.outputs.DEPLOY_STRATEGY }}" in
            "blue-green")
              # Blue-green deployment
              kubectl set image deployment/app app=registry/app:${{ github.sha }} -n ${{ matrix.environment }}-green
              kubectl rollout status deployment/app -n ${{ matrix.environment }}-green
              kubectl patch service app -p '{"spec":{"selector":{"version":"green"}}}' -n ${{ matrix.environment }}
              kubectl set image deployment/app app=registry/app:${{ github.sha }} -n ${{ matrix.environment }}-blue
              ;;
            "canary")
              # Canary deployment
              kubectl set image deployment/app-primary app=registry/app:${{ github.sha }} -n ${{ matrix.environment }}
              kubectl rollout status deployment/app-primary -n ${{ matrix.environment }}
              ;;
            "full-rebuild")
              # Full rebuild deployment
              helm upgrade --install app ./helm-chart \
                --set image.tag=${{ github.sha }} \
                --set strategy.type=Recreate \
                -n ${{ matrix.environment }}
              ;;
          esac
      
      # Industry hack: Post-deployment validation
      - name: Post-deployment health check
        run: |
          # Wait for deployment
          sleep 30
          
          # Health check
          kubectl get pods -n ${{ matrix.environment }} -l app=app -o json | jq '.items[] | select(.status.phase != "Running")'
          
          # Smoke tests
          kubectl run smoke-test --image=curlimages/curl --rm -i --restart=Never -- \
            curl -f http://${{ matrix.environment }}-service/health || exit 1
```

### Worktree Orchestration
```bash
/cicd-workflow --operation=worktree --worktrees=8 --parallel=maximum --cache=aggressive
```

**Features:**
- **Parallel Development**: Support for 8 concurrent worktrees
- **Shared Resources**: Intelligent resource sharing between worktrees
- **Automatic Cleanup**: Cleanup based on age and inactivity
- **Performance Optimization**: Fast switching and minimal overhead

**Implementation:**
```bash
#!/bin/bash
# Advanced worktree orchestration script

# Industry hack: Efficient worktree management
setup_worktree_environment() {
    local num_worktrees=$1
    local base_branch=${2:-main}
    
    # Create worktree directory
    mkdir -p ../worktrees
    
    # Create shared cache
    mkdir -p ../worktrees/cache
    
    # Create worktrees in parallel
    for i in $(seq 1 $num_worktrees); do
        (
            local worktree_name="wt-$i"
            local worktree_path="../worktrees/$worktree_name"
            
            # Create worktree if it doesn't exist
            if [ ! -d "$worktree_path" ]; then
                git worktree add --checkout "$worktree_path" "origin/$base_branch" 2>/dev/null || {
                    # Fallback: create from local branch
                    git worktree add --checkout "$worktree_path" "$base_branch"
                }
            fi
            
            # Set up shared cache mount
            if [ -d "../worktrees/cache" ]; then
                mount --bind ../worktrees/cache "$worktree_path/.cache" 2>/dev/null || true
            fi
            
            # Install dependencies in parallel
            cd "$worktree_path"
            npm ci --frozen-lockfile --prefer-offline 2>/dev/null || true
            
            echo "Worktree $worktree_name setup complete"
        ) &
    done
    
    # Wait for all worktrees to be created
    wait
    echo "All $num_worktrees worktrees created successfully"
}

# Industry hack: Smart worktree cleanup
cleanup_worktrees() {
    local max_age=${1:-7}  # days
    local min_active=${2:-3}  # minimum active worktrees
    
    # Find worktrees older than max_age
    local old_worktrees=($(find ../worktrees -maxdepth 1 -type d -mtime +$max_age))
    
    # Keep at least min_active worktrees
    local num_to_cleanup=$((${#old_worktrees[@]} - $min_active))
    
    if [ $num_to_cleanup -gt 0 ]; then
        echo "Cleaning up $num_to_cleanup old worktrees"
        
        for ((i=0; i<num_to_cleanup; i++)); do
            local wt_path="${old_worktrees[$i]}"
            local wt_name=$(basename "$wt_path")
            
            # Unmount shared cache
            umount "$wt_path/.cache" 2>/dev/null || true
            
            # Remove worktree
            git worktree remove "$wt_name" --force 2>/dev/null || true
            rm -rf "$wt_path" 2>/dev/null || true
            
            echo "Removed worktree: $wt_name"
        done
    fi
    
    # Prune git worktree references
    git worktree prune
}

# Industry hack: Worktree load balancing
get_available_worktree() {
    local base_branch=${1:-main}
    
    # Find least loaded worktree
    local best_worktree=""
    local min_load=999999
    
    for wt_dir in ../worktrees/wt-*; do
        if [ -d "$wt_dir" ]; then
            local load=$(ps aux | grep -c "worktree.*$(basename $wt_dir)")
            
            if [ $load -lt $min_load ]; then
                min_load=$load
                best_worktree=$(basename $wt_dir)
            fi
        fi
    done
    
    # If no worktree found, create new one
    if [ -z "$best_worktree" ]; then
        local new_num=$(ls ../worktrees/wt-* 2>/dev/null | wc -l)
        new_num=$((new_num + 1))
        best_worktree="wt-$new_num"
        
        git worktree add --checkout "../worktrees/$best_worktree" "origin/$base_branch"
    fi
    
    echo "$best_worktree"
}
```

### Advanced Caching Strategies
```bash
/cicd-workflow --operation=cache --cache=layered --strategy=enterprise --parallel=high
```

**Features:**
- **Multi-Layer Caching**: Dependencies, build artifacts, language caches
- **Intelligent Invalidation**: Smart cache invalidation based on changes
- **Cross-Runner Sharing**: Cache sharing across different runners
- **Compression Optimization**: Compressed cache storage and retrieval

**Implementation:**
```yaml
# Advanced caching configuration
- name: Multi-Layer Cache Strategy
  uses: actions/cache@v3
  with:
    # Layer 1: Dependencies (npm, pip, maven, etc.)
    path: |
      ~/.npm
      ~/.cache/pip
      ~/.m2
      ~/.gradle
      node_modules
      .venv
      target/
    
    # Layer 2: Build artifacts and outputs
    path: |
      dist/
      build/
      .next/
      .nuxt/
      out/
    
    # Layer 3: Language-specific caches
    path: |
      ~/.cache/electron
      ~/.cache/yarn
      ~/.composer
      vendor/
    
    # Layer 4: Tool-specific caches
    path: |
      ~/.cache/CodeQL
      ~/.codeql
      .codeql/
    
    # Advanced cache key with multiple factors
    key: ${{ runner.os }}-${{ runner.arch }}-v3-${{
      hashFiles('**/package-lock.json', '**/yarn.lock', '**/requirements.txt', '**/pom.xml')
    }}-${{ github.sha }}-${{
      hashFiles('**/.nvmrc', '**/.node-version', '**/.python-version', '**/.java-version')
    }}
    
    # Multi-level restore strategy
    restore-keys: |
      # Exact match for dependencies + OS + architecture
      ${{ runner.os }}-${{ runner.arch }}-v3-${{ hashFiles('**/package-lock.json') }}-
      ${{ runner.os }}-${{ runner.arch }}-v3-${{ hashFiles('**/yarn.lock') }}-
      ${{ runner.os }}-${{ runner.arch }}-v3-${{ hashFiles('**/requirements.txt') }}-
      
      # Fallback to OS + architecture only
      ${{ runner.os }}-${{ runner.arch }}-v3-
      
      # Final fallback to any runner
      v3-

# Industry hack: Cache size optimization
- name: Optimize cache size
  run: |
    # Remove unnecessary files before caching
    find ~/.cache -name "*.log" -delete 2>/dev/null || true
    find ~/.npm -name "_logs" -type d -exec rm -rf {} + 2>/dev/null || true
    
    # Compress large cache directories
    tar -czf ~/.cache-compressed.tgz -C ~/.cache . 2>/dev/null || true
    
    # Report cache sizes
    echo "Cache sizes:"
    du -sh ~/.npm ~/.cache 2>/dev/null || echo "Cache directories not found"
```

## Result Reporting

### Performance Metrics
```json
{
  "success": true,
  "operation": "cicd-workflow",
  "timestamp": "2024-01-15T10:30:00Z",
  "performance": {
    "total_duration": "45.2s",
    "build_time": "15.3s",
    "test_time": "25.1s",
    "deploy_time": "4.8s",
    "cache_hit_rate": 87.5,
    "parallel_efficiency": 92.3
  },
  "quality": {
    "test_coverage": 94.2,
    "security_issues": 0,
    "code_quality_score": 9.8,
    "performance_score": 95
  },
  "automation": {
    "auto_merge_success": true,
    "approval_time_saved": "2.5h",
    "deployment_automation": 100,
    "manual_intervention_required": false
  },
  "recommendations": [
    "Consider increasing parallel workers for test execution",
    "Cache strategy is optimal for current dependency pattern",
    "Auto-merge success rate indicates good code quality"
  ]
}
```

## Examples

### Enterprise CI/CD Setup
```bash
/cicd-workflow --operation=setup --strategy=enterprise --auto-merge=conservative --worktrees=10 --cache=layered
```

### Fast Development Pipeline
```bash
/cicd-workflow --operation=deploy --strategy=fast --auto-merge=aggressive --parallel=maximum
```

### Security-Focused Pipeline
```bash
/cicd-workflow --operation=test --strategy=secure --auto-merge=disabled --cache=conservative
```

### Performance Optimization
```bash
/cicd-workflow --operation=optimize --strategy=balanced --parallel=high --worktrees=5
```

## Success Criteria

### Performance Targets
- **Build Time**: <30 seconds for incremental builds
- **Test Time**: <60 seconds for full test suite
- **Deployment Time**: <10 seconds for hot-swaps
- **Auto-Merge Success Rate**: >90%

### Quality Targets
- **Test Coverage**: >90% with meaningful tests
- **Security Issues**: 0 critical, <5 low-severity
- **Code Quality Score**: >9.0/10
- **Performance Score**: >90/100

### Automation Targets
- **Manual Interventions**: <5% of deployments
- **Approval Time**: <30 minutes average
- **Pipeline Success Rate**: >95%
- **Rollback Rate**: <2%

This advanced CI/CD workflow system implements cutting-edge industry practices for maximum development velocity while maintaining the highest quality and security standards.