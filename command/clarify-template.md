---
description: "Clarify underspecified areas in requirements and specifications"
---

# Clarify Command

## Usage
```
/speckit.clarify
```

## Description
Performs structured clarification of underspecified areas in the current specification. This command systematically identifies gaps, ambiguities, and missing details through targeted questioning.

## Process
1. Analyzes current specification for completeness
2. Identifies underspecified areas and ambiguities
3. Generates structured clarification questions
4. Records answers in Clarifications section
5. Updates specification with clarified details
6. Validates specification completeness

## Question Categories
- **Functional Requirements**: Missing or unclear functionality
- **User Interactions**: Unclear user workflows and interfaces
- **Performance Criteria**: Undefined performance expectations
- **Error Handling**: Missing error scenarios and recovery
- **Integration Points**: Unclear component interactions
- **Constraints**: Missing technical or business constraints

## Output
- Clarification questions and answers
- Updated specification with resolved ambiguities
- Completeness assessment and gap analysis
- Recommendations for further refinement

## Integration
Clarification results are used by:
- `/speckit.plan` for more accurate technical planning
- `/speckit.tasks` for comprehensive task breakdown
- `/speckit.analyze` for consistency validation
- `/speckit.checklist` for complete requirement validation