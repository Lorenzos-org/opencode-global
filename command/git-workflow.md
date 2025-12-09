---
description: Manage Git operations, releases, and version control workflows for OpenCode projects
agent: git-agent
subtask: true
---

# 🔄 /git-workflow Command

## Purpose
Manage Git operations, release workflows, and version control processes to ensure proper code versioning and collaboration.

## Parameters
- **action**: Git action (branch, commit, release, merge, tag)
- **target**: Target for action (branch name, version, commit message)
- **strategy**: Git strategy (feature-branch, gitflow, trunk-based)

## Execution Flow

### Phase 1: Repository Analysis
1. Analyze current repository state and branch structure
2. Check for uncommitted changes and conflicts
3. Review recent commits and merge history
4. Validate repository health and integrity

### Phase 2: Branch Management
1. Create feature branches with proper naming
2. Set up release and hotfix branches as needed
3. Manage branch protection and quality gates
4. Coordinate branch synchronization and updates

### Phase 3: Commit Management
1. Validate commit messages follow conventions
2. Ensure atomic commits with clear purposes
3. Check for proper commit categorization
4. Validate commit quality and documentation

### Phase 4: Release Management
1. Create version tags following semantic versioning
2. Generate changelogs and release notes
3. Prepare release artifacts and documentation
4. Coordinate deployment and rollback procedures

### Phase 5: Merge & Integration
1. Manage pull request workflows and reviews
2. Resolve merge conflicts and integration issues
3. Validate merge quality and testing
4. Ensure proper integration with main branches

## Git Standards

### Branch Naming
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Releases: `release/vX.Y.Z`
- Hotfixes: `hotfix/description`

### Commit Messages
- Use conventional commit format
- Include type, scope, and description
- Provide clear, actionable messages
- Reference related issues or tickets

### Release Process
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Include comprehensive changelogs
- Validate release artifacts and documentation
- Ensure rollback procedures are in place

## Examples

```bash
/git-workflow --action=branch --target="feature/user-auth" --strategy=feature-branch
/git-workflow --action=release --target="v1.2.0" --strategy=gitflow
/git-workflow --action=commit --target="fix: resolve authentication timeout issue"
/git-workflow --action=merge --target="PR-123" --strategy=trunk-based
```

## Quality Gates
- All commits follow conventional commit standards
- Branch protection rules are enforced
- Pull requests have required reviews
- Automated tests pass before merge
- Release artifacts are validated and signed

## Success Criteria
- Git workflow follows established standards
- Release process is automated and reliable
- Branch management is organized and efficient
- Merge conflicts are resolved promptly
- Repository history is clean and maintainable