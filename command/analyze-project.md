---
description: Analyze project structure, dependencies, and codebase patterns with git repository insights
agent: plan
subtask: true
---

# 📊 /analyze-project Command

## Purpose
Comprehensive analysis of the project structure, dependencies, and existing codebase patterns to understand the current state and identify improvement opportunities.

## Parameters
- **target**: What to analyze (structure, dependencies, patterns, quality)
- **depth**: Analysis depth (basic, detailed, comprehensive)
- **output**: Output format (summary, detailed, report)

## Execution Flow

### Phase 1: Structure Analysis
1. Map project directory structure and organization
2. Identify main components and their relationships
3. Analyze package.json dependencies and versions
4. Document build system and configuration

### Phase 2: Code Quality Assessment
1. Review TypeScript configuration and strict mode usage
2. Analyze code patterns and architectural decisions
3. Evaluate test coverage and quality metrics
4. Check for security vulnerabilities and best practices

### Phase 3: Dependency Analysis
1. Audit npm dependencies for security and updates
2. Identify duplicate or conflicting dependencies
3. Analyze bundle size and performance impact
4. Recommend dependency optimization strategies

### Phase 4: Pattern Documentation
1. Document established coding patterns and conventions
2. Identify areas for standardization
3. Review API design patterns and consistency
4. Assess component architecture and reusability

## Output Format
- Executive summary with key findings
- Detailed analysis with specific recommendations
- Priority matrix for improvements
- Implementation roadmap with timelines

## Examples

```bash
/analyze-project --target=structure --depth=comprehensive --output=report
/analyze-project --target=dependencies --depth=detailed
/analyze-project --target=quality --output=detailed
```

## Success Criteria
- Complete understanding of project architecture
- Clear identification of strengths and areas for improvement
- Actionable recommendations with priority levels
- Measurable quality metrics and benchmarks