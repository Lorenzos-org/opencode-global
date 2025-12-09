---
description: Comprehensive analysis of project structure, dependencies, cross-artifact consistency, and codebase patterns
agent: plan
subtask: true
---

# 📊 /analyze Command - Comprehensive Project Analysis

## Purpose
Comprehensive analysis of the project structure, dependencies, existing codebase patterns, and cross-artifact consistency to understand the current state and identify improvement opportunities.

## Parameters
- **target**: What to analyze (structure, dependencies, patterns, quality, consistency, coverage)
- **depth**: Analysis depth (basic, detailed, comprehensive)
- **output**: Output format (summary, detailed, report)

## Analysis Types

### 1. Project Structure Analysis
Analyze project structure, dependencies, and codebase patterns with git repository insights:

#### Directory Structure Analysis
- **Current Structure**: Analyze current project organization
- **Best Practices**: Compare against industry standards
- **Improvement Opportunities**: Identify structural improvements
- **Component Organization**: Evaluate module/component organization

#### Dependency Analysis
- **Package Dependencies**: Analyze npm/pip/other package dependencies
- **Version Management**: Check for outdated or vulnerable packages
- **Dependency Graph**: Map dependency relationships
- **Bundle Size Impact**: Analyze impact on bundle size

#### Codebase Patterns Analysis
- **Architecture Patterns**: Identify current architectural patterns
- **Code Quality**: Assess code quality metrics
- **Consistency**: Check for consistent coding patterns
- **Technical Debt**: Identify areas of technical debt

#### Git Repository Insights
- **Commit History**: Analyze commit patterns and history
- **Branch Strategy**: Evaluate branching strategy
- **Contributor Activity**: Analyze contributor patterns
- **Release Patterns**: Review release history and patterns

### 2. Cross-Artifact Consistency Analysis
Analyze specifications and plans for consistency using Spec-Driven Development methodology:

#### Analysis Focus:
- Cross-artifact consistency validation
- Coverage analysis across specifications
- Identify gaps and conflicts
- Validate requirement traceability
- Check plan-spec alignment
- Ensure task completeness

#### Execution Flow

##### Phase 1: Specification Analysis
1. **Requirement Consistency**
   - Validate requirements across all artifacts
   - Check for conflicting requirements
   - Ensure requirement traceability
   - Validate requirement completeness

2. **Architecture Consistency**
   - Check architecture alignment across documents
   - Validate design decisions
   - Ensure consistency in technical choices
   - Verify integration points

3. **Task Alignment**
   - Validate task breakdown alignment with requirements
   - Check task dependencies
   - Ensure task completeness
   - Validate task prioritization

##### Phase 2: Coverage Analysis
1. **Requirement Coverage**
   - Ensure all requirements have corresponding tasks
   - Check for missing functionality
   - Validate requirement decomposition
   - Ensure traceability from requirements to tasks

2. **Architecture Coverage**
   - Validate all architectural components are specified
   - Check for missing integration points
   - Ensure complete technical specification
   - Validate design completeness

3. **Quality Attribute Coverage**
   - Check non-functional requirements coverage
   - Validate performance requirements
   - Ensure security requirements are complete
   - Check usability requirements

##### Phase 3: Gap and Conflict Analysis
1. **Gap Identification**
   - Identify missing requirements
   - Find incomplete specifications
   - Detect missing architectural components
   - Identify missing tasks or dependencies

2. **Conflict Detection**
   - Find conflicting requirements
   - Identify contradictory specifications
   - Detect conflicting architectural decisions
   - Find conflicting task dependencies

3. **Resolution Recommendations**
   - Provide recommendations for gap resolution
   - Suggest conflict resolution strategies
   - Prioritize issues by impact
   - Provide implementation guidance

### 3. Quality Analysis
Perform comprehensive quality analysis:

#### Code Quality Metrics
- **Complexity Analysis**: Analyze code complexity metrics
- **Maintainability**: Assess maintainability index
- **Test Coverage**: Analyze test coverage metrics
- **Code Smells**: Identify code quality issues

#### Performance Analysis
- **Performance Patterns**: Identify performance bottlenecks
- **Resource Usage**: Analyze resource consumption
- **Optimization Opportunities**: Identify optimization opportunities
- **Performance Metrics**: Measure key performance indicators

#### Security Analysis
- **Security Patterns**: Identify security vulnerabilities
- **Best Practices**: Check security best practices
- **Vulnerability Assessment**: Assess potential vulnerabilities
- **Security Compliance**: Check security compliance

## Examples

```bash
# Analyze project structure
/analyze --target=structure --depth=detailed --output=report

# Analyze dependencies
/analyze --target=dependencies --depth=comprehensive

# Analyze cross-artifact consistency
/analyze --target=consistency --depth=detailed

# Analyze code quality
/analyze --target=quality --depth=comprehensive --output=detailed

# Quick analysis
/analyze --target=structure --depth=basic
```

## Analysis Output

### Summary Report
- **Executive Summary**: High-level analysis results
- **Key Findings**: Major issues and recommendations
- **Priority Items**: High-priority items requiring attention
- **Next Steps**: Recommended actions

### Detailed Analysis
- **Structure Analysis**: Detailed structure analysis results
- **Dependency Analysis**: Comprehensive dependency analysis
- **Pattern Analysis**: Detailed pattern analysis
- **Quality Analysis**: In-depth quality analysis

### Recommendations
- **Improvement Recommendations**: Specific improvement recommendations
- **Best Practices**: Recommended best practices
- **Implementation Guidance**: Implementation guidance for improvements
- **Timeline**: Suggested timeline for improvements

## Integration Points

- **Development Workflow**: Integrate analysis into development process
- **CI/CD Pipeline**: Include analysis in CI/CD pipeline
- **Code Reviews**: Use analysis results in code reviews
- **Planning**: Use analysis for planning improvements
- **Monitoring**: Continuous monitoring of key metrics

## Success Metrics

- **Structure Quality**: Improved project structure quality
- **Dependency Health**: Healthier dependency management
- **Code Quality**: Improved code quality metrics
- **Performance**: Better performance metrics
- **Security**: Improved security posture
- **Consistency**: Better cross-artifact consistency

This comprehensive analysis command provides deep insights into the project's current state and identifies opportunities for improvement across all aspects of the codebase.