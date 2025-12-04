---
description: Create and execute comprehensive test suites for code validation with git-aware test strategies
agent: test-agent
subtask: true
---

# 🧪 /create-tests Command

## Purpose
Create comprehensive test suites including unit tests, integration tests, and end-to-end tests to ensure code quality and reliability.

## Parameters
- **target**: Code to test (file, module, feature, system)
- **type**: Test type (unit, integration, e2e, performance, all)
- **coverage**: Coverage target (minimum, standard, comprehensive)
- **framework**: Testing framework (jest, vitest, mocha, etc.)

## Execution Flow

### Phase 1: Test Planning
1. Analyze code structure and identify testable units
2. Define test scenarios and edge cases
3. Plan test data and mock strategies
4. Set coverage targets and quality metrics

### Phase 2: Unit Test Creation
1. Create isolated unit tests for functions and components
2. Implement proper mocking for dependencies
3. Test error conditions and edge cases
4. Ensure comprehensive code path coverage

### Phase 3: Integration Testing
1. Create tests for component interactions
2. Test API endpoints and database operations
3. Validate external service integrations
4. Test system workflows and data flow

### Phase 4: End-to-End Testing
1. Create user workflow tests
2. Test critical business processes
3. Validate UI interactions and state management
4. Test cross-component functionality

### Phase 5: Performance & Security Testing
1. Create performance benchmarks and load tests
2. Test memory usage and optimization
3. Validate security measures and vulnerability protection
4. Test scalability and stress conditions

## Test Standards

### Unit Tests
- Test individual functions and components in isolation
- Use proper mocking for external dependencies
- Cover all code paths and decision branches
- Validate input validation and error handling

### Integration Tests
- Test component interactions and API integrations
- Use real databases and services when possible
- Test data consistency and transaction handling
- Validate error propagation and recovery

### End-to-End Tests
- Test complete user workflows and business processes
- Use realistic test data and scenarios
- Test UI interactions and state changes
- Validate system behavior under various conditions

## Examples

```bash
/create-tests --target="src/auth/" --type=unit --coverage=comprehensive
/create-tests --target="api/users" --type=integration --framework=jest
/create-tests --target="checkout-flow" --type=e2e --coverage=standard
/create-tests --target="payment-system" --type=all --coverage=comprehensive
```

## Test Quality Metrics
- Code coverage: Minimum 90% for new code
- Test execution time: Under 30 seconds for full suite
- Test reliability: Zero flaky tests
- Test maintainability: Clear, well-documented test cases

## Success Criteria
- All critical functionality is thoroughly tested
- Test coverage meets or exceeds targets
- Tests are reliable, fast, and maintainable
- Performance and security requirements are validated
- Test documentation is clear and comprehensive