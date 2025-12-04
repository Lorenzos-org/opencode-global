---
description: "Generate actionable task breakdowns for systematic implementation"
---

# Tasks Command

## Usage
```
/speckit.tasks
```

## Description
Generates detailed, actionable task breakdowns from the current technical plan and specification. This command creates a systematic roadmap for implementation with dependency management and parallel execution optimization.

## Process
1. Analyzes current specification and technical plan
2. Breaks down user stories into implementable tasks
3. Establishes task dependencies and execution order
4. Identifies parallel execution opportunities
5. Creates validation checkpoints
6. Generates file-level implementation details

## Features
- **Dependency Management**: Tasks are ordered to respect component dependencies
- **Parallel Execution**: Marks tasks that can be executed simultaneously
- **Checkpoint Validation**: Creates validation points after each major phase
- **File Specifications**: Provides exact file paths for implementation
- **Test Integration**: Includes test-driven development tasks

## Output
- Detailed task breakdown in `specs/[feature-name]/tasks.md`
- Task organization by user story
- Dependency mapping and execution order
- Parallel execution markers
- Validation checkpoints
- File path specifications

## Integration
Task breakdowns are used by:
- `/speckit.implement` for systematic execution
- Project management for progress tracking
- Quality assurance for validation planning
- Development teams for work allocation