---
description: Execute comprehensive git workflow operations with agent coordination and result reporting
agent: git-agent
subtask: true
---

# 🔄 /git-command Command - Advanced Git Workflow Management

## Purpose
Execute advanced git workflow operations with agent coordination, structured result reporting, and integration with CI/CD pipelines.

## Parameters
- **operation**: Git operation type (branch, commit, release, merge, analyze, health)
- **action**: Specific action to perform (create, delete, merge, tag, etc.)
- **target**: Target for the operation (branch name, version, file path)
- **strategy**: Git strategy to use (feature-branch, gitflow, trunk-based)
- **options**: Additional options (force, squash, rebase, etc.)

## Execution Flow

### Phase 1: Repository Analysis
1. Analyze current repository state and branch structure
2. Check for uncommitted changes and potential conflicts
3. Review recent commit history and merge patterns
4. Validate repository health and integrity

### Phase 2: Operation Execution
1. Execute the specified git operation with proper validation
2. Handle conflicts and edge cases appropriately
3. Generate structured results and metrics
4. Update repository state and notify stakeholders

### Phase 3: Quality Assurance
1. Validate operation success and repository consistency
2. Check for quality gate compliance
3. Generate reports and documentation
4. Coordinate with CI/CD pipeline integration

## Operation Types

### Branch Management
```bash
/git-command --operation=branch --action=create --target="feature/user-auth" --strategy=feature-branch
/git-command --operation=branch --action=merge --target="feature/user-auth" --options="squash,ff-only"
```

**Returns:**
```json
{
  "success": true,
  "operation": "branch-management",
  "action": "create",
  "branch": "feature/user-auth",
  "protection_rules": true,
  "integration_points": ["main", "develop"],
  "time_elapsed": "2.3s"
}
```

### Release Management
```bash
/git-command --operation=release --action=prepare --target="v1.2.0" --strategy=gitflow --generate-changelog=true
/git-command --operation=release --action=tag --target="v1.2.0" --sign=true
```

**Returns:**
```json
{
  "success": true,
  "operation": "release-management",
  "version": "v1.2.0",
  "changelog_generated": true,
  "tag_created": "v1.2.0",
  "artifacts_prepared": ["source", "docs"],
  "release_notes": "detailed-release-notes.md"
}
```

### Repository Analysis
```bash
/git-command --operation=analyze --action=commits --target="last-30-days" --include="authors,quality,security"
/git-command --operation=analyze --action=branches --target="all" --include="protection,activity,stale"
```

**Returns:**
```json
{
  "success": true,
  "operation": "repository-analysis",
  "analysis_type": "commits",
  "time_period": "last-30-days",
  "metrics": {
    "total_commits": 156,
    "active_authors": 8,
    "conventional_commits": 92.3,
    "security_commits": 12,
    "average_commit_size": "45 lines"
  },
  "recommendations": ["Improve commit message consistency", "Review security commit patterns"]
}
```

### Health Check
```bash
/git-command --operation=health --action=check --include="repository,security,performance,quality"
```

**Returns:**
```json
{
  "success": true,
  "operation": "health-check",
  "overall_score": 87,
  "categories": {
    "repository_health": 92,
    "security_posture": 85,
    "performance_metrics": 88,
    "code_quality": 81
  },
  "issues_found": 3,
  "critical_issues": 0,
  "recommendations": ["Clean up large files", "Review branch protection rules"]
}
```

## Integration Features

### CI/CD Pipeline Integration
- Automatic trigger validation for branch operations
- Pre-merge quality checks and validation
- Release artifact generation and signing
- Deployment coordination and rollback preparation

### Quality Gate Integration
- Commit message format validation
- Branch protection rule enforcement
- Code coverage and quality metric validation
- Security scan integration and reporting

### Collaboration Features
- Pull request workflow automation
- Code review assignment and tracking
- Notification and communication coordination
- Documentation and changelog generation

## Result Handling

### Success Response Format
```json
{
  "status": "success",
  "operation": "operation-type",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "repository": "opencode/opencode",
    "branch": "feature/operation-result",
    "commit": "abc123def456",
    "files_changed": 15,
    "lines_added": 250,
    "lines_removed": 45
  },
  "metrics": {
    "execution_time": "3.2s",
    "repository_size": "45MB",
    "commit_count": 1250
  }
}
```

### Error Response Format
```json
{
  "status": "error",
  "operation": "operation-type",
  "timestamp": "2024-01-15T10:30:00Z",
  "error": {
    "code": "BRANCH_EXISTS",
    "message": "Branch 'feature/user-auth' already exists",
    "details": "Use --force option to override existing branch"
  },
  "suggestions": [
    "Use --force option to override",
    "Choose a different branch name",
    "Merge existing branch first"
  ]
}
```

## Examples

### Feature Branch Workflow
```bash
/git-command --operation=branch --action=create --target="feature/real-time-notifications" --strategy=feature-branch
/git-command --operation=commit --action=validate --target="current" --include="conventional,security,quality"
/git-command --operation=branch --action=merge --target="feature/real-time-notifications" --options="squash,ff-only"
```

### Release Workflow
```bash
/git-command --operation=release --action=prepare --target="v1.5.0" --strategy=gitflow --generate-changelog=true
/git-command --operation=release --action=tag --target="v1.5.0" --sign=true --annotate="Production release"
/git-command --operation=release --action=deploy --target="production" --strategy=blue-green
```

### Repository Maintenance
```bash
/git-command --operation=health --action=check --include="all" --report="detailed"
/git-command --operation=cleanup --action=branches --target="stale" --include="merged,abandoned"
/git-command --operation=maintenance --action=optimize --target="repository" --include="gc,compression"
```

## Success Criteria

### Operational Excellence
- Git operation success rate: 99%+
- Branch management efficiency: <5 seconds per operation
- Release preparation time: <30 seconds
- Conflict resolution automation: 85%+

### Quality Assurance
- Commit message compliance: 95%+
- Branch protection coverage: 100%
- Security vulnerability detection: 99%+
- Repository health score: B+ minimum

### Integration Performance
- API response time: <3 seconds
- Data accuracy: 99.9%+
- Error handling: Graceful degradation with clear guidance
- Documentation completeness: 100%