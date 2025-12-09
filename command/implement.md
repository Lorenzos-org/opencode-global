---
description: Execute implementation tasks systematically
agent: build
subtask: true
---

# Execute implementation tasks systematically

# Validate prerequisites
RUN ls .specify/specs/
RUN ls .specify/memory/

# Parse task breakdown for: $ARGUMENTS
READ .specify/specs/$ARGUMENTS/tasks.md

# Execute implementation respecting dependencies
RUN npm run build --if-present

# Validate implementation
RUN npm test --if-present

# Review implementation results
RUN git status