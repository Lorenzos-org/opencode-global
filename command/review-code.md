---
description: Perform comprehensive code review and quality assessment with git history analysis
agent: review
subtask: true
---

# 🔍 /review-code Command

## Purpose
Comprehensive code review focusing on quality, security, performance, and adherence to established standards and patterns.

## Parameters
- **target**: Code to review (file, directory, PR, commit)
- **focus**: Review focus areas (quality, security, performance, all)
- **depth**: Review depth (basic, detailed, comprehensive)

## Execution Flow

### Phase 1: Code Quality Review
1. Analyze code structure and organization
2. Check TypeScript usage and type safety
3. Review error handling and validation
4. Evaluate code readability and maintainability

### Phase 2: Security Analysis
1. Perform vulnerability assessment
2. Review authentication and authorization
3. Check input validation and sanitization
4. Analyze data protection measures

### Phase 3: Performance Evaluation
1. Assess algorithm efficiency
2. Review resource usage patterns
3. Analyze database query performance
4. Check for memory leaks and optimization opportunities

### Phase 4: Standards Compliance
1. Verify constitutional standards compliance
2. Check coding pattern adherence
3. Review test coverage and quality
4. Validate documentation completeness

## Review Categories

### Critical Issues (Must Fix)
- Security vulnerabilities
- Type safety violations
- Performance bottlenecks
- Critical bugs

### Major Issues (Should Fix)
- Code quality problems
- Missing error handling
- Poor test coverage
- Documentation gaps

### Minor Issues (Nice to Fix)
- Code style inconsistencies
- Minor performance improvements
- Additional test cases
- Documentation enhancements

## Examples

```bash
/review-code --target="src/auth/" --focus=security --depth=detailed
/review-code --target="PR-123" --focus=all --depth=comprehensive
/review-code --target="src/components/Button.tsx" --focus=quality
```

## Review Output
- Summary of findings with severity levels
- Detailed analysis with specific recommendations
- Code examples and suggested improvements
- Priority matrix for addressing issues
- Quality metrics and trend analysis

## Success Criteria
- All critical and major issues identified
- Clear, actionable recommendations provided
- Security vulnerabilities detected and addressed
- Performance issues identified and prioritized
- Standards compliance verified and documented