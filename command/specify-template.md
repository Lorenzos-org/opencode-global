---
description: "Define functional requirements and user stories for the RAG system"
---

# Specify Command

## Usage
```
/speckit.specify [prompt]
```

## Description
Creates detailed functional specifications and user stories for the RAG system. This command focuses on the "what" and "why" of the system without getting into technical implementation details.

## Process
1. Analyzes user prompt to understand requirements
2. Reviews existing constitution for principle alignment
3. Creates structured user stories with acceptance criteria
4. Defines functional and non-functional requirements
5. Identifies system boundaries and constraints
6. Establishes success metrics and validation criteria

## Examples
```
/speckit.specify Build a RAG system that can process my 270+ documents and answer questions based on their content
/speckit.specify Create a document search system that supports PDF, DOCX, and text files with semantic understanding
/speckit.specify Design a local RAG system that maintains privacy while providing intelligent document retrieval
```

## Output
- Updated specification in `specs/[feature-name]/spec.md`
- User stories with acceptance criteria
- Functional and non-functional requirements
- System boundaries and constraints
- Success metrics and validation criteria

## Integration
Specifications created by this command are used by:
- `/speckit.plan` for technical implementation planning
- `/speckit.tasks` for task breakdown generation
- `/speckit.analyze` for cross-artifact validation
- `/speckit.checklist` for quality requirement validation