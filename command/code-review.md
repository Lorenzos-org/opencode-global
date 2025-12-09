---
description: Comprehensive code review with quality, security, and performance analysis
agent: code-reviewer
subtask: true
---

# 🔍 /code-review Command

## Purpose
Comprehensive code review focusing on quality, security, performance, and adherence to established standards and patterns. Combines the best of both code-review and review-code approaches.

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
/code-review --target="src/auth/" --focus=security --depth=detailed
/code-review --target="PR-123" --focus=all --depth=comprehensive
/code-review --target="src/components/Button.tsx" --focus=quality
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

## Quick Review Mode
For immediate feedback on changes in current working directory:

```bash
# Review staged changes
!`git diff --staged`

# Review unstaged changes  
!`git diff`

Focus on:
- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations
- Documentation completeness
- Test coverage and quality
- Architectural consistency

Provide:
- Specific issues with line numbers
- Severity assessment
- Actionable recommendations
- Alternative solutions when appropriate
- Positive feedback for good practices

Use todowrite to track review items and follow-up tasks.