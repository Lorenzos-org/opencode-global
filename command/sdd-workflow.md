---
description: Demonstrate complete SDD workflow with agent chaining and git integration for feature implementation
agent: plan
subtask: true
---

# 🔄 /sdd-workflow Command - Complete Feature Lifecycle

## Purpose
Demonstrate the complete Spec-Driven Development workflow using agent chaining to implement a feature from concept to deployment.

## Parameters
- **feature**: Feature name and description
- **complexity**: Implementation complexity (simple, medium, complex)
- **timeline**: Expected timeline (1-day, 1-week, 1-sprint)
- **priority**: Business priority (low, medium, high, critical)

## Chaining Workflow

### Phase 1: Specification (@plan agent)
```bash
/plan "Create comprehensive specification for {feature}"
```
**Output**: Detailed requirements, architecture design, success criteria

### Phase 2: Project Analysis (@plan agent)
```bash
/analyze-project --target=structure --depth=detailed
```
**Output**: Current state analysis, dependency mapping, pattern documentation

### Phase 3: Implementation Planning (@plan agent)
```bash
/plan "Break down {feature} implementation into tasks with estimates"
```
**Output**: Task breakdown, resource allocation, timeline planning

### Phase 4: Code Implementation (@build agent)
```bash
/implement-feature --feature="{feature}" --spec="generated-spec.md" --priority="{priority}"
```
**Output**: Implemented feature with tests and documentation

### Phase 5: Testing (@test agent)
```bash
/create-tests --target="new-feature" --type=all --coverage=comprehensive
```
**Output**: Complete test suite with 90%+ coverage

### Phase 6: Code Review (@review agent)
```bash
/review-code --target="new-feature" --focus=all --depth=comprehensive
```
**Output**: Quality assessment, security review, performance analysis

### Phase 7: Git Workflow (@git agent)
```bash
/git-workflow --action=branch --target="feature/{feature}" --strategy=feature-branch
/git-workflow --action=release --target="v{version}" --strategy=gitflow
```
**Output**: Proper version control, release management

## Example Complete Workflow

```bash
/sdd-workflow --feature="user-authentication-system" --complexity=complex --timeline="1-sprint" --priority=high
```

### Expected Chain Execution:

1. **Specification Phase**
   - @plan analyzes requirements for user authentication
   - Creates detailed spec with OAuth, JWT, session management
   - Defines API endpoints and security requirements

2. **Analysis Phase**
   - @plan analyzes current auth patterns in codebase
   - Reviews existing API structure and database schema
   - Identifies integration points and dependencies

3. **Planning Phase**
   - @plan breaks down into tasks: API routes, database models, middleware
   - Estimates 40 hours total with 2 developer allocation
   - Creates quality gates and success criteria

4. **Implementation Phase**
   - @build implements authentication API endpoints
   - Creates user models and validation middleware
   - Follows TypeScript strict mode and established patterns

5. **Testing Phase**
   - @test creates comprehensive test suite
   - Unit tests for all functions, integration tests for API
   - Performance tests for authentication flow
   - Achieves 95% test coverage

6. **Review Phase**
   - @review performs security analysis
   - Checks for vulnerabilities in auth implementation
   - Validates performance and code quality
   - Provides optimization recommendations

7. **Release Phase**
   - @git creates feature branch and manages PR workflow
   - Creates version tag and release notes
   - Coordinates deployment to staging and production

## Quality Gates & Validation

### Constitutional Compliance
- TypeScript strict mode validation ✅
- 90%+ test coverage requirement ✅
- Security vulnerability scan ✅
- Performance benchmark validation ✅
- Documentation completeness ✅

### SDD Phase Gates
- Specification approval before implementation ✅
- Planning validation before execution ✅
- Testing completion before review ✅
- Review approval before release ✅
- Deployment validation before production ✅

## Success Metrics

### Feature Quality
- All requirements implemented correctly
- Zero critical or high-priority bugs
- Performance meets or exceeds targets
- Security vulnerabilities: 0
- User acceptance testing: Pass

### Process Quality
- Timeline adherence: ±10%
- Budget compliance: Within 5%
- Team satisfaction: 4.5/5
- Code quality score: A+
- Customer satisfaction: 4.8/5

### Technical Quality
- Test coverage: 95%
- Code complexity: Low/Medium
- Performance score: 95/100
- Security score: 100/100
- Maintainability index: High

## Chaining Benefits

### Automated Workflow
- Seamless handoff between agents
- Consistent quality standards across phases
- Reduced manual coordination overhead
- Improved traceability and accountability

### Quality Assurance
- Each phase validates previous work
- Constitutional standards enforced throughout
- Continuous feedback and improvement
- Risk mitigation through phased approach

### Efficiency Gains
- Parallel execution where possible
- Reusable patterns and templates
- Automated validation and reporting
- Reduced rework and返工