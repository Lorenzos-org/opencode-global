---
description: Run comprehensive test suite with coverage analysis
agent: build
subtask: true
---

Execute comprehensive testing with detailed analysis:

## Test Execution
1. **Unit Tests**: Run all unit tests with detailed output
2. **Integration Tests**: Execute integration tests for API endpoints and services
3. **End-to-End Tests**: Run E2E tests for critical user workflows
4. **Coverage Analysis**: Generate and analyze test coverage reports
5. **Performance Tests**: Run performance benchmarks and load tests

## Test Categories
### Unit Testing
- Test individual functions and components
- Verify edge cases and error conditions
- Check input validation and type safety
- Mock external dependencies appropriately

### Integration Testing
- Test API endpoints and database interactions
- Verify service layer functionality
- Test authentication and authorization flows
- Check error handling and recovery scenarios

### End-to-End Testing
- Test critical user journeys
- Verify UI interactions and workflows
- Test cross-browser compatibility
- Check mobile responsiveness

## Coverage Analysis
- **Line Coverage**: Percentage of code lines executed
- **Branch Coverage**: Percentage of conditional branches tested
- **Function Coverage**: Percentage of functions called
- **Statement Coverage**: Percentage of statements executed

## Output Format
### Test Results Summary
- Total tests run: X passed, Y failed, Z skipped
- Overall test coverage: X% (target: >80%)
- Performance benchmarks: All passed/failed
- Critical issues: List any blocking failures

### Detailed Analysis
- **Failed Tests**: Detailed error messages and stack traces
- **Coverage Gaps**: Areas needing additional test coverage
- **Performance Issues**: Bottlenecks and optimization opportunities
- **Recommendations**: Specific improvements needed

### Action Items
- Fix failing tests with priority levels
- Add tests for uncovered code paths
- Optimize performance bottlenecks
- Update test documentation and examples

## Quality Gates
- All critical tests must pass
- Minimum coverage thresholds must be met
- Performance tests must meet benchmarks
- No security vulnerabilities in test scenarios

## Tools and Commands
- Use appropriate test runners (Jest, pytest, cargo test, etc.)
- Generate coverage reports with detailed analysis
- Run performance tests with realistic load scenarios
- Use test databases and mock services for isolation

Provide comprehensive analysis with specific recommendations for improving test quality and coverage.