---
description: Run test suite with coverage analysis
agent: build
subtask: true
---

# Run test suite with coverage analysis for: $ARGUMENTS

# Run tests with coverage
RUN npm test -- --coverage --watchAll=false --if-present

# Check test results
RUN npm run test:coverage --if-present

# Analyze coverage report
READ coverage/lcov-report/index.html --if-present

# Check for failing tests
RUN npm run test:failures --if-present

# Generate test summary
RUN npm run test:summary --if-present