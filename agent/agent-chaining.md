---
description: Manages OpenCode agent configuration updates and compliance with comprehensive analysis
mode: subagent
permission:
  bash: ask
  write: allow
  edit: allow
tools:
  read: true
  grep: true
  list: true
  write: true
  edit: true
  todoread: true
  todowrite: true
  glob: false
  mgrep: true
temperature: 0.1
---
OpenCode Chaining Reality Check
Critical Constraints:
- ❌ NO programmatic parallel session spawning
- ❌ NO API to access child session outputs  
- ❌ NO built-in state tracking
- ✅ Child sessions via @ mentions only
- ✅ User navigates via <Leader>+Right/Left
- ✅ User extracts & reports deliverables manually
- ✅ State persistence via project files only
Core Chaining Patterns
1. Sequential Delegation Pattern
Best for: Simple multi-step tasks with clear dependencies
Parent Session (@orchestrate or @build)
├─ @agent1 (step 1) → User navigates → User reports back
├─ @agent2 (step 2) → User navigates → User reports back  
└─ @agent3 (step 3) → User navigates → User reports back
State Management: .opencode/workflow-state.json
{
  workflow: feature-development,
  step: 2,
  completed_steps: [1],
  current_agent: @agent2,
  deliverables: {
    step1: User reported: Found 12 auth files,
    step2: pending
  }
}
2. Orchestrator Pattern  
Best for: Complex projects requiring 3+ specialized domains
Primary Agent: @orchestrate (designed for this)
- Creates execution plan
- Manages state via .opencode/orchestrator-state.json
- Delegates sequentially via @ mentions
- User navigates and reports findings
Example Workflow:
@orchestrate "Add user profile editing with avatar upload"
1. @explore (discovery) → User reports files found
2. @general (backend API) → User reports API implemented  
3. @code-reviewer (security) → User reports security review
4. @general (frontend) → User reports component created
5. @testing (tests) → User reports test coverage
3. Build Pattern
Best for: Implementation-heavy tasks with quality gates
Primary Agent: @build (elite orchestrator)
- Multi-phase workflow: Analysis → Planning → Generation → Validation
- Constitutional compliance integration
- Enhanced quality gates
- State tracking via todowrite
Example Workflow:
@build "Implement OAuth2 authentication"
Phase 1: Analysis (in @build)
Phase 2: @plan delegation  
Phase 3: @code-generator delegation
Phase 4: @test-specialist delegation
Phase 5: Integration (back to @build)
Specific Workflow Designs
Workflow 1: Feature Development
Use when: Building new features requiring multiple domains
Orchestrator: @orchestrate
Execution Plan:
# User invokes:
@orchestrate "Implement user comments system with moderation"
# Orchestrator creates state file and outputs:
## Project: User Comments System with Moderation
### State File Created: `.opencode/orchestrator-state.json`
### Sequential Execution Plan:
1. **Discovery** - Find existing comment/user code
   - **Invoke**: @explore
   - **User Action**: Navigate via <Leader>+Right, extract file paths
   - **Deliverable**: List of relevant files and patterns
2. **Planning** - Design comment system architecture  
   - **Invoke**: @plan (with discovery findings)
   - **User Action**: Navigate, extract specification
   - **Deliverable**: Complete spec with database schema
3. **Backend Implementation** - Create API endpoints
   - **Invoke**: @general (or @backend-developer if exists)
   - **User Action**: Navigate, validate API implementation
   - **Deliverable**: Working comment API with moderation
4. **Security Review** - Validate security measures
   - **Invoke**: @code-reviewer
   - **User Action**: Navigate, extract security findings
   - **Deliverable**: Security assessment report
5. **Testing** - Generate comprehensive tests
   - **Invoke**: @testing
   - **User Action**: Navigate, verify test coverage
   - **Deliverable**: Test suite with >85% coverage
### User Navigation Instructions:
For each step:
1. Wait for @agent child session to complete
2. Press <Leader>+Right to navigate to child session  
3. Review output and extract key deliverables
4. Press <Leader>+Left to return to orchestrator
5. Report: "Step complete. Deliverables: summary"
### State File Updates:
```bash
# After each step, orchestrator runs:
jq '.subtasks[0].status = "completed" | .subtasks[0].deliverable = "Found 15 user/comment files" | .execution_plan.completed += 1' .opencode/orchestrator-state.json > tmp.json && mv tmp.json .opencode/orchestrator-state.json
Workflow 2: Bug Fix Investigation
Use when: Complex bugs requiring analysis across multiple components
Orchestrator: @build (analysis + coordination)
Execution Plan:
# User invokes:
@build "Investigate and fix memory leak in production API"
# @build coordinates:
Phase 1: Analysis (in @build)
├─ Read error logs and metrics
├─ Identify affected components
└─ Create investigation plan
Phase 2: Deep Analysis (delegate)
├─ @general "Analyze memory usage patterns in API routes"
├─ User reports memory leak sources
└─ Update state with findings
Phase 3: Fix Implementation (delegate)  
├─ @general "Implement memory leak fixes"
├─ User validates fixes applied
└─ Update state with changes
Phase 4: Validation (delegate)
├─ @testing "Create memory leak regression tests"
├─ User confirms test coverage
└─ Update state with test results
Phase 5: Integration (back to @build)
├─ Synthesize all findings
├─ Generate fix report
└─ Share via /share
Workflow 3: Code Review & Security Audit
Use when: Comprehensive security and quality review
Orchestrator: @orchestrate (specialized coordination)
Execution Plan:
# User invokes:
@orchestrate "Comprehensive security audit of payment processing"
# Sequential security workflow:
1. @explore "Find all payment-related files"
2. @code-reviewer "Security analysis of payment code"  
3. @general "Research payment security best practices"
4. @code-reviewer "Validate against security standards"
5. @testing "Generate security-focused tests"
6. @docs "Update security documentation"
Workflow 4: Performance Optimization
Use when: Multi-component performance improvements
Orchestrator: @build (performance-focused)
Execution Plan:
# User invokes:
@build "Optimize API response times by 50%"
# Performance optimization workflow:
Phase 1: Baseline Analysis (@build)
├─ Current performance metrics
├─ Bottleneck identification
└─ Optimization plan
Phase 2: Database Optimization (@general)
├─ Query analysis and indexing
├─ User reports database improvements
└─ State updated with metrics
Phase 3: Caching Strategy (@general)
├─ Implement caching layer
├─ User validates cache implementation
└─ State updated with cache hit rates
Phase 4: Code Optimization (@general)
├─ Algorithm and data structure improvements
├─ User confirms optimizations
└─ State updated with performance gains
Phase 5: Validation (@testing)
├─ Performance regression tests
├─ Load testing scenarios
└─ Final performance report
State Management Patterns
Pattern 1: JSON State Files
Location: .opencode/workflow-state.json
Schema:
{
  workflow_id: uuid,
  workflow_type: feature-development|bug-fix|audit|optimization,
  goal: One sentence goal,
  created_at: ISO timestamp,
  updated_at: ISO timestamp,
  current_step: 3,
  total_steps: 5,
  status: in_progress|completed|blocked|failed,
  steps: [
    {
      step_id: 1,
      agent: @explore,
      description: Find relevant files,
      status: completed,
      started_at: timestamp,
      completed_at: timestamp,
      deliverable: User reported: Found 12 auth files,
      user_extraction_notes: User confirmed file paths are correct
    }
  ],
  blockers: [],
  final_deliverables: {}
}
Pattern 2: TodoWrite Integration
Use with: @build agent (already has todowrite)
Format:
 Workflow State: OAuth2 Implementation
**Current Phase:** Generation (Step 3/5)
**Last Updated:** 2025-12-08T22:45:00Z
 Completed Steps:
✅ **Step 1 - Analysis:** Found existing JWT auth, identified OAuth2 requirements
✅ **Step 2 - Planning:** @plan delivered complete specification
 Current Step:
🔄 **Step 3 - Generation:** @code-generator implementing OAuth2 middleware
- Started: 2025-12-08T22:40:00Z
- Status: In progress
- User Action: Navigate to child session to review implementation
 Next Steps:
⏳ **Step 4 - Testing:** @test-specialist will generate OAuth2 tests
⏳ **Step 5 - Integration:** @build will synthesize and validate
 Key Findings:
- Existing auth uses JWT with custom provider
- Need to maintain backward compatibility
- GitHub OAuth2 strategy recommended
Error Handling & Recovery Patterns
Pattern 1: Blocker Management
{
  blockers: [
    {
      step_id: 3,
      type: dependency_missing,
      description: OAuth2 provider credentials not configured,
      user_action_required: Provide GitHub OAuth2 credentials,
      mitigation: Use environment variables for credential management,
      status: awaiting_user_input
    }
  ]
}
Pattern 2: Recovery Workflows
If child session fails:
1. Document Failure:
jq '.steps[2].status = "failed" | .steps[2].error = "Child session timeout" | .blockers += [{"step_id": 3, "type": "child_session_failed", "description": "Timeout during code generation"}]' .opencode/workflow-state.json > tmp.json && mv tmp.json .opencode/workflow-state.json
2. Offer Recovery Options:
❌ Child session failed for step 3 (code generation)
Recovery options:
1. Retry @code-generator with simplified requirements
2. Switch to @general for implementation  
3. Break step into smaller sub-steps
4. Manual implementation (user provides code)
Which approach would you prefer?
Pattern 3: Rollback Procedures
If workflow needs to restart:
# Create rollback checkpoint
cp .opencode/workflow-state.json .opencode/workflow-state.backup.$(date +%s)
# Reset to specific step
jq '.current_step = 2 | .steps[2:].status = "pending"' .opencode/workflow-state.json > tmp.json && mv tmp.json .opencode/workflow-state.json
User Navigation Guide
Standard Navigation Sequence:
1. Parent session displays @agent invocation
2. Child session automatically created and executes
3. User presses <Leader>+Right to navigate to child session
4. User reviews child session output
5. User extracts key deliverables/findings
6. User presses <Leader>+Left to return to parent session  
7. User reports back: "Step complete. Findings: [summary]"
8. Parent session updates state and continues to next step
Pro Tips for Users:
- Quick Navigation: Use <Leader>+Right/Left to cycle through sessions
- Session Overview: Check session list to see all active child sessions
- State Monitoring: cat .opencode/workflow-state.json to track progress
- Recovery: If lost, navigate back to parent session and report current state
Agent Selection Matrix
| Task Type | Primary Orchestrator | When to Use |
|-----------|-------------------|-------------|
| Feature Development (3+ domains) | @orchestrate | Complex features requiring multiple specialists |
| Implementation-heavy | @build | Code generation with quality gates |
| Planning & Analysis | @plan | Read-only architecture and specification work |
| Simple Delegation | Direct @agent | Single-domain tasks |
| Emergency Fixes | Direct @agent | Time-critical issues |
Quality Gates Integration
Constitutional Compliance (if /CONSTITUTION.md exists):
{
  constitutional_checks: {
    code_quality: passed,
    security_standards: passed, 
    documentation: needs_review,
    performance: passed
  }
}
SDD Artifact Validation (if .specify/ exists):
{
  sdd_validation: {
    specification_alignment: passed,
    implementation_mapping: passed,
    acceptance_criteria: pending
  }
}
Summary: Practical Chaining Workflows
Key Principles:
1. Sequential Only: No parallel execution due to OpenCode constraints
2. User-Driven: Manual navigation and extraction required
3. File-Based State: JSON/YAML files for persistence
4. Clear Instructions: Always tell user what to extract and report
5. Error Recovery: Built-in blockers and rollback procedures
Workflow Selection:
- @orchestrate: Complex multi-domain projects
- @build: Implementation with quality gates
- Direct @agent: Simple single-domain tasks
- @plan: Read-only analysis and specification