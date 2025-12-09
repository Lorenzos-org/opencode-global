---
description: "Create or update project governing principles and development guidelines"
agent: build
subtask: true
---

# Constitution Command

## Usage
```
/speckit.constitution [prompt]
```

## Description
Creates or updates the project's governing principles and development guidelines. This command establishes the foundation for all subsequent development decisions and ensures consistency throughout the project lifecycle.

## Process
1. Reads existing constitution from `.specify/memory/constitution.md`
2. Processes user prompt to understand principle requirements
3. Updates constitution with new or refined principles
4. Validates principles against project goals and constraints
5. Saves updated constitution for reference by other commands

## Examples
```
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
/speckit.constitution Add security principles focusing on local data processing and privacy protection
/speckit.constitution Update principles to include performance benchmarks for RAG systems
```

## Output
- Updated `.specify/memory/constitution.md` file
- Summary of changes made to principles
- Validation of principle consistency and completeness

## Integration
The constitution serves as the authoritative reference for:
- Technical decision making in `/speckit.plan`
- Code quality standards in `/speckit.implement`
- Quality checklist generation in `/speckit.checklist`
- Architecture validation in `/speckit.analyze`