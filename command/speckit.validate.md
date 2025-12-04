description: Validate SDD artifact compliance and constitutional standards alignment
mode: command
agent: @spec
tools: read, write, bash
permissions:
  read: allow
  write: ask
  bash: ask

# Spec-Kit Validate Command

## Purpose
Validates SDD artifact compliance, checks constitutional standards alignment, validates Spec-Kit template structure, and provides comprehensive compliance reporting.

## Workflow

### Step 1: Artifact Collection
- Discover and catalog all SDD artifacts
- Identify specification documents (.spec.md, .plan.md)
- Locate constitutional compliance documents
- Gather quality metrics and validation criteria

### Step 2: Template Structure Validation
- Validate Spec-Kit template compliance
- Check required sections and formatting
- Verify document structure integrity
- Assess cross-document consistency
- Validate artifact naming conventions

### Step 3: SDD Compliance Check
- Validate against SDD standards and templates
- Check completeness of design documentation
- Verify technical specifications accuracy
- Assess interface documentation quality
- Validate data model specifications

### Step 4: Constitutional Standards Alignment
- Cross-reference artifacts with constitutional principles
- Validate governance compliance requirements
- Check security standards implementation
- Verify quality assurance integration
- Assess maintainability standards

### Step 5: Quality Gates Verification
- Validate quality metrics compliance
- Check completeness of documentation
- Verify test coverage requirements
- Assess performance criteria alignment
- Validate deployment readiness

### Step 6: Compliance Reporting
- Generate comprehensive validation report
- Document compliance status by category
- Identify gaps and improvement areas
- Provide remediation recommendations
- Create compliance dashboard summary

## Input Requirements
- Complete set of SDD artifacts
- Spec-Kit template specifications
- Constitutional standards documentation
- Quality metrics and criteria
- Compliance checklists

## Output Artifacts
- SDD compliance validation report
- Constitutional alignment assessment
- Template structure verification results
- Quality gates compliance summary
- Detailed remediation recommendations
- Compliance dashboard and metrics

## Validation Criteria
- **Template Compliance**: All Spec-Kit templates properly implemented
- **SDD Standards**: Design documents meet industry standards
- **Constitutional Alignment**: All artifacts align with OpenCode constitution
- **Quality Assurance**: Quality metrics and standards met
- **Security Compliance**: Security requirements properly addressed
- **Documentation Completeness**: All required documentation present and accurate

## Integration Points
- Links to constitutional compliance framework
- Integration with quality assurance processes
- Connection to security review procedures
- Alignment with deployment pipeline
- Coordination with maintenance planning