---
description: Run quick test suite with coverage analysis and basic diagnostics
agent: test
subtask: true
---

Execute quick test suite with focused analysis:

## Test Execution
1. **Run Tests**: Execute test suite with coverage
   ```bash
   npm test -- --coverage --watchAll=false
   ```

2. **Basic Analysis**: Review test results and coverage metrics
3. **Issue Identification**: Spot failing tests and coverage gaps
4. **Quick Recommendations**: Suggest immediate fixes

## Test Categories
- **Unit Tests**: Core functionality validation
- **Integration Tests**: Component interaction testing  
- **Coverage Analysis**: Basic line and branch coverage
- **Error Detection**: Identify failing tests and root causes

## Output Format
### Quick Test Summary
- Tests run: X passed, Y failed, Z skipped
- Coverage: X% (target: project minimum)
- Critical failures: List blocking issues
- Quick fixes: Immediate actionable recommendations

### Coverage Analysis
- **Line Coverage**: Percentage of executable lines tested
- **Branch Coverage**: Conditional logic testing
- **Gap Areas**: Code sections needing tests
- **Priority Fixes**: Most critical coverage improvements

## Quality Gates
- All critical tests must pass
- Coverage meets minimum project standards
- No major security vulnerabilities in test scenarios
- Performance tests within acceptable ranges

## Next Steps
If tests fail or coverage is low:
1. Fix critical failing tests first
2. Add tests for uncovered critical paths
3. Improve test quality and reliability
4. Update test documentation

Use todowrite to track test fixes and coverage improvements needed.