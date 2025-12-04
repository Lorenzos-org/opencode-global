# Enhanced AGENTS.md - OpenCode + Spec-Kit Integration

## About Enhanced OpenCode with Spec-Kit Integration

This enhanced configuration merges **OpenCode's agent-based development system** with **GitHub Spec Kit's Spec-Driven Development (SDD) methodology**, creating a comprehensive development framework with constitutional compliance validation.

**OpenCode** provides specialized agents for different development tasks, while **Spec Kit** offers structured specification and planning workflows. The integration ensures all development follows constitutional standards while maintaining high quality and predictability.

---

## Constitutional Compliance Integration

### Constitutional Validation Framework
All agents and workflows must comply with the constitutional standards defined in `/CONSTITUTION.md`. The compliance framework includes:

- **Pre-validation**: All operations checked against constitutional standards before execution
- **Runtime Monitoring**: Continuous compliance validation during development
- **Post-operation Audit**: Comprehensive audit trails for all agent operations
- **Violation Handling**: Automated detection and reporting of constitutional violations

### Agent Constitutional Requirements
Each agent must:
- Validate operations against constitutional standards
- Maintain audit trails for all actions
- Report compliance status to central audit system
- Handle constitutional violations appropriately

---

## Enhanced Agent System

### Core Development Agents

#### General Agent (`agent/general.md`)
- **Purpose**: General development tasks and coordination
- **Constitutional Compliance**: Validates all general operations against constitutional standards
- **Spec-Kit Integration**: Uses `/speckit.*` commands for structured development
- **Quality Gates**: Ensures all general development meets quality standards

#### Developer Framework Agent (`agent/developer-framework.md`)
- **Purpose**: Framework setup and configuration management
- **Constitutional Compliance**: Validates framework configurations against constitutional standards
- **Spec-Kit Integration**: Sets up spec-kit templates with constitutional validation
- **Quality Gates**: Ensures framework configurations meet security and performance standards

#### Frontend Developer Agent (`agent/frontend-developer.md`)
- **Purpose**: Frontend development and UI implementation
- **Constitutional Compliance**: Validates frontend code against constitutional standards
- **Spec-Kit Integration**: Implements frontend features from spec-kit specifications
- **Quality Gates**: Ensures UI/UX meets accessibility and performance standards

#### Backend Developer Agent (`agent/backend-developer.md`)
- **Purpose**: Backend development and API implementation
- **Constitutional Compliance**: Validates backend code against constitutional standards
- **Spec-Kit Integration**: Implements backend features from spec-kit specifications
- **Quality Gates**: Ensures API security and performance standards

#### Fullstack Workflow Agent (`agent/fullstack-workflow.md`)
- **Purpose**: Fullstack development coordination
- **Constitutional Compliance**: Validates fullstack operations against constitutional standards
- **Spec-Kit Integration**: Coordinates frontend and backend implementation from spec-kit plans
- **Quality Gates**: Ensures end-to-end functionality meets standards

### Specialized Agents

#### Security Agent (`agent/security-agent.md`)
- **Purpose**: Security validation and vulnerability assessment
- **Constitutional Compliance**: Validates security measures against constitutional standards
- **Spec-Kit Integration**: Reviews spec-kit specifications for security requirements
- **Quality Gates**: Ensures all security requirements are met

#### Performance Agent (`agent/performance-agent.md`)
- **Purpose**: Performance optimization and monitoring
- **Constitutional Compliance**: Validates performance against constitutional standards
- **Spec-Kit Integration**: Implements performance requirements from spec-kit specifications
- **Quality Gates**: Ensures performance benchmarks are met

#### Test Agent (`agent/test-agent.md`)
- **Purpose**: Test development and quality assurance
- **Constitutional Compliance**: Validates tests against constitutional standards
- **Spec-Kit Integration**: Creates tests based on spec-kit specifications
- **Quality Gates**: Ensures test coverage and quality standards

#### Documentation Writer Agent (`agent/documentation-writer.md`)
- **Purpose**: Documentation creation and maintenance
- **Constitutional Compliance**: Validates documentation against constitutional standards
- **Spec-Kit Integration**: Creates documentation from spec-kit specifications
- **Quality Gates**: Ensures documentation completeness and accuracy

#### Code Reviewer Agent (`agent/code-reviewer.md`)
- **Purpose**: Code review and quality assessment
- **Constitutional Compliance**: Validates code reviews against constitutional standards
- **Spec-Kit Integration**: Reviews code against spec-kit specifications
- **Quality Gates**: Ensures code quality and compliance standards

### Workflow and Automation Agents

#### CI/CD Agent (`agent/cicd-agent.md`)
- **Purpose**: CI/CD pipeline setup and management
- **Constitutional Compliance**: Validates CI/CD configurations against constitutional standards
- **Spec-Kit Integration**: Implements CI/CD from spec-kit plans
- **Quality Gates**: Ensures pipeline security and reliability

#### DevEx Agent (`agent/devex-agent.md`)
- **Purpose**: Developer experience optimization
- **Constitutional Compliance**: Validates DevEx improvements against constitutional standards
- **Spec-Kit Integration**: Implements DevEx features from spec-kit specifications
- **Quality Gates**: Ensures developer productivity and satisfaction

#### Constitutional Audit Agent (`agent/constitutional-audit.md`)
- **Purpose**: Constitutional compliance auditing and reporting
- **Constitutional Compliance**: Primary guardian of constitutional standards
- **Spec-Kit Integration**: Audits spec-kit workflows for constitutional compliance
- **Quality Gates**: Ensures all operations maintain constitutional compliance

---

## Spec-Kit Integration Commands

### Core Spec-Driven Development Commands

#### `/speckit.constitution`
- **Purpose**: Create or update project governing principles
- **Constitutional Compliance**: Validates constitution against `/CONSTITUTION.md`
- **Agent Integration**: All agents reference constitutional principles for decision-making
- **Quality Gates**: Ensures constitutional completeness and consistency

#### `/speckit.specify`
- **Purpose**: Define requirements and user stories
- **Constitutional Compliance**: Validates specifications against constitutional standards
- **Agent Integration**: Agents use specifications for implementation guidance
- **Quality Gates**: Ensures specification completeness and clarity

#### `/speckit.plan`
- **Purpose**: Create technical implementation plans
- **Constitutional Compliance**: Validates plans against constitutional requirements
- **Agent Integration**: Agents execute implementation based on approved plans
- **Quality Gates**: Ensures technical feasibility and compliance

#### `/speckit.tasks`
- **Purpose**: Generate actionable task lists
- **Constitutional Compliance**: Validates tasks against constitutional standards
- **Agent Integration**: Agents execute tasks in constitutional-compliant manner
- **Quality Gates**: Ensures task completeness and proper ordering

#### `/speckit.implement`
- **Purpose**: Execute implementation tasks
- **Constitutional Compliance**: Monitors implementation for constitutional compliance
- **Agent Integration**: Coordinates multiple agents for implementation
- **Quality Gates**: Ensures implementation quality and compliance

### Optional Quality Commands

#### `/speckit.clarify`
- **Purpose**: Clarify underspecified areas
- **Constitutional Compliance**: Ensures clarifications follow constitutional standards
- **Agent Integration**: Agents use clarifications for better implementation
- **Quality Gates**: Ensures specification completeness

#### `/speckit.analyze`
- **Purpose**: Cross-artifact consistency analysis
- **Constitutional Compliance**: Validates analysis against constitutional standards
- **Agent Integration**: Agents use analysis for quality improvement
- **Quality Gates**: Ensures artifact consistency and coverage

#### `/speckit.checklist`
- **Purpose**: Generate quality checklists
- **Constitutional Compliance**: Validates checklists against constitutional standards
- **Agent Integration**: Agents use checklists for quality validation
- **Quality Gates**: Ensures comprehensive quality coverage

---

## Agent Configuration with Constitutional Compliance

### Agent Metadata Structure
Each agent configuration includes:
```yaml
agent:
  name: "Agent Name"
  description: "Agent purpose and capabilities"
  constitutional_compliance:
    validation_required: true
    audit_trail: true
    compliance_checks:
      - "pre_operation_validation"
      - "runtime_monitoring"
      - "post_operation_audit"
  spec_kit_integration:
    supported_commands: ["/speckit.specify", "/speckit.plan", "/speckit.implement"]
    workflow_integration: true
  quality_gates:
    - "code_quality"
    - "security_validation"
    - "performance_standards"
    - "documentation_completeness"
```

### Constitutional Validation Workflow
1. **Pre-Operation Validation**: Agent checks if operation complies with constitutional standards
2. **Runtime Monitoring**: Continuous monitoring during operation execution
3. **Post-Operation Audit**: Comprehensive audit and compliance reporting
4. **Violation Handling**: Automated detection, reporting, and remediation

### Agent Synchronization with Constitutional Compliance
- **Shared Constitutional Context**: All agents access current constitutional standards
- **Compliance Status Sharing**: Agents share compliance status across operations
- **Audit Trail Coordination**: Coordinated audit logging across all agents
- **Violation Response**: Coordinated response to constitutional violations

---

## Quality Gates Integration

### Pre-commit Quality Gates
- **Constitutional Validation**: All changes validated against constitutional standards
- **Code Quality**: Linting, formatting, and type checking
- **Security Scanning**: Vulnerability assessment and security validation
- **Spec-Kit Validation**: SDD artifact validation when present

### Pre-push Quality Gates
- **Full Test Suite**: Comprehensive test execution
- **Integration Testing**: Cross-component functionality validation
- **Performance Benchmarks**: Performance standards validation
- **Constitutional Compliance**: Complete compliance verification

### Post-commit Quality Gates
- **Audit Trail Updates**: Constitutional audit logging
- **Notification Systems**: Team notifications and alerts
- **Metric Collection**: Development metrics and compliance tracking
- **Backup Procedures**: Automated backups with validation

---

## Development Workflow Integration

### Phase 1: Constitutional Setup
1. **Constitution Validation**: Verify `/CONSTITUTION.md` exists and is valid
2. **Agent Configuration**: Configure all agents with constitutional compliance
3. **Quality Gates Setup**: Initialize constitutional quality gates
4. **Audit Trail Initialization**: Set up constitutional audit system

### Phase 2: Spec-Kit Integration
1. **Template Setup**: Install spec-kit templates with constitutional validation
2. **Command Integration**: Configure `/speckit.*` commands with constitutional checks
3. **Agent Training**: Train agents on spec-kit workflows and constitutional requirements
4. **Workflow Validation**: Validate integrated workflows meet constitutional standards

### Phase 3: Development Execution
1. **Specification Creation**: Use `/speckit.specify` with constitutional validation
2. **Planning Phase**: Use `/speckit.plan` with constitutional compliance checks
3. **Implementation**: Use `/speckit.implement` with continuous constitutional monitoring
4. **Quality Validation**: Comprehensive quality and constitutional validation

### Phase 4: Continuous Compliance
1. **Ongoing Monitoring**: Continuous constitutional compliance monitoring
2. **Audit Reporting**: Regular constitutional audit reports
3. **Improvement**: Continuous improvement of constitutional compliance
4. **Documentation**: Updated documentation with constitutional requirements

---

## Configuration Files

### Constitutional Configuration
- `/CONSTITUTION.md`: Master constitutional document
- `constitutional_checks.yml`: Constitutional compliance validation rules
- `.constitutional/audit_config.yml`: Audit trail configuration

### Spec-Kit Configuration
- `.specify/memory/constitution.md`: Project-specific constitution
- `.specify/templates/`: Spec-kit templates with constitutional validation
- `.specify/scripts/`: Scripts with constitutional compliance

### Agent Configuration
- `agent/`: Enhanced agent configurations with constitutional compliance
- `opencode.json`: OpenCode configuration with constitutional requirements
- `.git/hooks/`: Git hooks with constitutional validation

---

## Usage Examples

### Basic Constitutional-Compliant Development
```bash
# Initialize project with constitutional compliance
opencode init --constitutional-compliance

# Create constitution with validation
/speckit.constitution Create principles focused on code quality, testing standards, and constitutional compliance

# Specify requirements with constitutional validation
/speckit.specify Build a user authentication system with constitutional compliance requirements

# Plan implementation with constitutional checks
/speckit.plan Use secure authentication methods with constitutional validation

# Implement with continuous constitutional monitoring
/speckit.implement
```

### Agent-Based Constitutional Development
```bash
# Use security agent with constitutional compliance
agent/security-agent --constitutional-validation

# Use performance agent with constitutional monitoring
agent/performance-agent --audit-trail

# Use constitutional audit agent
agent/constitutional-audit --comprehensive-report
```

---

## Maintenance and Updates

### Constitutional Maintenance
- **Regular Reviews**: Periodic constitutional reviews and updates
- **Compliance Monitoring**: Continuous compliance monitoring and reporting
- **Audit Trail Management**: Regular audit trail maintenance and archiving
- **Improvement Process**: Continuous improvement of constitutional compliance

### Agent Maintenance
- **Regular Updates**: Keep agent configurations current with constitutional requirements
- **Performance Monitoring**: Monitor agent performance and compliance
- **Training Updates**: Regular training updates for constitutional compliance
- **Integration Testing**: Regular testing of agent integration with constitutional requirements

### Spec-Kit Maintenance
- **Template Updates**: Keep spec-kit templates current with constitutional validation
- **Command Updates**: Update `/speckit.*` commands with constitutional checks
- **Workflow Updates**: Maintain workflow integration with constitutional compliance
- **Documentation Updates**: Keep documentation current with constitutional requirements

---

This enhanced AGENTS.md provides comprehensive integration of OpenCode's agent-based development with Spec-Kit's Spec-Driven Development methodology, all while maintaining strict constitutional compliance throughout the development lifecycle.