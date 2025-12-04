---
description: "Execute all tasks to build the feature according to the plan"
---

# Implement Command

## Usage
```
/speckit.implement
```

## Description
Executes the complete task breakdown to implement the RAG system according to the specification and technical plan. This command systematically processes all tasks in the correct order while maintaining quality standards.

## Process
1. Validates prerequisites (constitution, spec, plan, tasks)
2. Parses task breakdown and dependencies
3. Executes tasks in correct order with parallel optimization
4. Implements test-driven development when specified
5. Provides progress updates and error handling
6. Validates implementation against requirements

## Features
- **Systematic Execution**: Follows task dependencies and order
- **Parallel Processing**: Executes independent tasks concurrently
- **Quality Gates**: Validates code quality and test coverage
- **Progress Tracking**: Provides real-time progress feedback
- **Error Recovery**: Handles errors gracefully with recovery options
- **Test Integration**: Runs tests as part of implementation

## Validation
Before execution, the command validates:
- Constitution exists and is accessible
- Specification is complete and valid
- Technical plan is comprehensive
- Task breakdown is detailed and correct
- Development environment is properly configured

## Output
- Complete implementation of all components
- Test suite with comprehensive coverage
- Documentation and configuration files
- Progress reports and validation results
- Error logs and recovery recommendations

## Integration
This command is the culmination of the SDD process:
- Uses constitution for guidance on standards
- Implements according to specification requirements
- Follows technical plan architecture
- Executes task breakdown systematically
- Validates against quality checklists