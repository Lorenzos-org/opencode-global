---
description: Implement new features following Spec-Driven Development methodology with git workflow integration
agent: build
subtask: true
---

# ✨ /implement-feature Command

## Purpose
Implement new features based on specifications, following established patterns and constitutional standards with comprehensive testing and documentation.

## Parameters
- **feature**: Feature name or identifier
- **spec**: Specification document or requirements
- **priority**: Implementation priority (high, medium, low)
- **estimate**: Time estimate in hours or days

## Execution Flow

### Phase 1: Specification Analysis
1. Parse and validate feature specifications
2. Identify dependencies and prerequisites
3. Break down feature into implementation tasks
4. Estimate effort and identify potential risks

### Phase 2: Implementation Planning
1. Design technical approach and architecture
2. Identify existing components to reuse
3. Plan test strategy and coverage requirements
4. Create implementation timeline and milestones

### Phase 3: Code Implementation
1. Implement core feature functionality
2. Follow established coding patterns and standards
3. Ensure TypeScript strict mode compliance
4. Integrate with existing architecture

### Phase 4: Testing & Validation
1. Create comprehensive test suite for feature
2. Validate functionality against specifications
3. Perform integration testing with existing features
4. Verify performance and security requirements

### Phase 5: Documentation & Deployment
1. Update API documentation and examples
2. Create user-facing documentation
3. Prepare deployment configuration
4. Validate deployment readiness

## Quality Gates
- All code passes TypeScript strict mode validation
- Test coverage meets constitutional requirements (90%+)
- Performance benchmarks are met or exceeded
- Security review completed and approved
- Documentation is complete and accurate

## Examples

```bash
/implement-feature --feature="user-authentication" --spec="auth-spec.md" --priority=high
/implement-feature --feature="real-time-notifications" --estimate="3 days"
/implement-feature --feature="api-rate-limiting" --priority=medium --spec="rate-limit-spec.md"
```

## Success Criteria
- Feature implemented according to specifications
- All quality gates passed successfully
- Comprehensive test coverage achieved
- Documentation is complete and accurate
- Deployment process is smooth and reliable