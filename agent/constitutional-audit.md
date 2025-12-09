---
description: Performs comprehensive constitutional compliance audit and framework validation
mode: subagent
temperature: 0.1
---

# Constitutional Audit Command

## Purpose
This command performs comprehensive constitutional compliance auditing for the Inbox Zero project, ensuring all code changes align with project principles, security standards, and architectural guidelines.

## Usage
```bash
# Run full constitutional audit
npx opencode constitutional-audit

# Audit specific aspects
npx opencode constitutional-audit --check=security
npx opencode constitutional-audit --check=architecture
npx opencode constitutional-audit --check=privacy

# Generate compliance report
npx opencode constitutional-audit --report

# Validate against constitution
npx opencode constitutional-audit --validate

# Check specific files
npx opencode constitutional-audit --files="apps/web/**/*.ts"
```

## Constitutional Principles

### 1. Privacy by Design
```typescript
// Core privacy principles that must be enforced
const privacyPrinciples = {
  dataMinimization: true,
  purposeLimitation: true,
  userConsent: true,
  transparency: true,
  securityByDesign: true,
  userControl: true
};

// Privacy compliance checks
export async function auditPrivacyCompliance() {
  const checks = [
    checkDataMinimization(),
    checkConsentManagement(),
    checkDataEncryption(),
    checkUserRightsImplementation(),
    checkThirdPartyDataSharing()
  ];
  
  return await Promise.all(checks);
}
```

### 2. Security Standards
```typescript
// Security compliance framework
const securityStandards = {
  authentication: 'mfa_required',
  encryption: 'end_to_end',
  accessControl: 'principle_of_least_privilege',
  auditLogging: 'comprehensive',
  vulnerabilityManagement: 'continuous',
  incidentResponse: '24x7'
};

// Security validation checks
export async function auditSecurityCompliance() {
  const checks = [
    validateAuthenticationImplementation(),
    checkEncryptionStandards(),
    auditAccessControls(),
    verifyAuditLogging(),
    testVulnerabilityManagement(),
    validateIncidentResponse()
  ];
  
  return await Promise.all(checks);
}
```

### 3. Architectural Integrity
```typescript
// Architectural principles
const architecturalPrinciples = {
  separationOfConcerns: true,
  modularity: true,
  scalability: true,
  maintainability: true,
  performance: true,
  reliability: true
};

// Architecture compliance validation
export async function auditArchitectureCompliance() {
  const checks = [
    validateSeparationOfConcerns(),
    checkModularityStandards(),
    verifyScalabilityPatterns(),
    auditMaintainabilityMetrics(),
    validatePerformanceStandards(),
    checkReliabilityPatterns()
  ];
  
  return await Promise.all(checks);
}
```

## Audit Implementation

### Privacy Compliance Checks
```typescript
// apps/web/audit/privacy.ts
export async function checkDataMinimization() {
  const issues = [];
  
  // Check for excessive data collection
  const dataCollectionPatterns = [
    'collect all user data',
    'store unnecessary information',
    'log sensitive data'
  ];
  
  // Scan codebase for violations
  for (const pattern of dataCollectionPatterns) {
    const violations = await scanCodeForPattern(pattern);
    issues.push(...violations);
  }
  
  // Check database schema for unnecessary fields
  const schemaIssues = await auditDatabaseSchema();
  issues.push(...schemaIssues);
  
  return {
    principle: 'dataMinimization',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 10))
  };
}

export async function checkConsentManagement() {
  const issues = [];
  
  // Verify consent mechanisms
  const consentChecks = [
    checkCookieConsent(),
    checkDataProcessingConsent(),
    checkThirdPartySharingConsent(),
    checkOptOutMechanisms()
  ];
  
  for (const check of consentChecks) {
    const result = await check();
    if (!result.compliant) {
      issues.push(...result.violations);
    }
  }
  
  return {
    principle: 'userConsent',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 5))
  };
}

export async function checkDataEncryption() {
  const issues = [];
  
  // Check data at rest encryption
  const atRestChecks = await auditDataAtRestEncryption();
  issues.push(...atRestChecks);
  
  // Check data in transit encryption
  const inTransitChecks = await auditDataInTransitEncryption();
  issues.push(...inTransitChecks);
  
  // Check sensitive data handling
  const sensitiveDataChecks = await auditSensitiveDataHandling();
  issues.push(...sensitiveDataChecks);
  
  return {
    principle: 'securityByDesign',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 15))
  };
}
```

### Security Compliance Checks
```typescript
// apps/web/audit/security.ts
export async function validateAuthenticationImplementation() {
  const issues = [];
  
  // Check for MFA implementation
  const mfaCompliance = await auditMFAImplementation();
  if (!mfaCompliance.implemented) {
    issues.push({
      type: 'mfa_missing',
      severity: 'high',
      description: 'Multi-factor authentication not implemented'
    });
  }
  
  // Check password security
  const passwordChecks = await auditPasswordSecurity();
  issues.push(...passwordChecks);
  
  // Check session management
  const sessionChecks = await auditSessionManagement();
  issues.push(...sessionChecks);
  
  return {
    standard: 'authentication',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 20))
  };
}

export async function checkEncryptionStandards() {
  const issues = [];
  
  // Check TLS implementation
  const tlsChecks = await auditTLSImplementation();
  issues.push(...tlsChecks);
  
  // Check encryption algorithms
  const algorithmChecks = await auditEncryptionAlgorithms();
  issues.push(...algorithmChecks);
  
  // Check key management
  const keyManagementChecks = await auditKeyManagement();
  issues.push(...keyManagementChecks);
  
  return {
    standard: 'encryption',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 25))
  };
}

export async function auditAccessControls() {
  const issues = [];
  
  // Check principle of least privilege
  const privilegeChecks = await auditLeastPrivilege();
  issues.push(...privilegeChecks);
  
  // Check role-based access control
  const rbacChecks = await auditRBACImplementation();
  issues.push(...rbacChecks);
  
  // Check permission boundaries
  const boundaryChecks = await auditPermissionBoundaries();
  issues.push(...boundaryChecks);
  
  return {
    standard: 'accessControl',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 30))
  };
}
```

### Architectural Compliance Checks
```typescript
// apps/web/audit/architecture.ts
export async function validateSeparationOfConcerns() {
  const issues = [];
  
  // Check for proper layer separation
  const layerSeparation = await auditLayerSeparation();
  if (!layerSeparation.proper) {
    issues.push(...layerSeparation.violations);
  }
  
  // Check for single responsibility principle
  const srpViolations = await auditSingleResponsibility();
  issues.push(...srpViolations);
  
  // Check for proper abstraction levels
  const abstractionChecks = await auditAbstractionLevels();
  issues.push(...abstractionChecks);
  
  return {
    principle: 'separationOfConcerns',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 10))
  };
}

export async function checkModularityStandards() {
  const issues = [];
  
  // Check for proper module boundaries
  const moduleBoundaryChecks = await auditModuleBoundaries();
  issues.push(...moduleBoundaryChecks);
  
  // Check for circular dependencies
  const circularDependencyChecks = await auditCircularDependencies();
  issues.push(...circularDependencyChecks);
  
  // Check for proper interface design
  const interfaceChecks = await auditInterfaceDesign();
  issues.push(...interfaceChecks);
  
  return {
    principle: 'modularity',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 8))
  };
}

export async function verifyScalabilityPatterns() {
  const issues = [];
  
  // Check for proper caching strategies
  const cachingChecks = await auditCachingStrategies();
  issues.push(...cachingChecks);
  
  // Check for database optimization
  const databaseOptimizationChecks = await auditDatabaseOptimization();
  issues.push(...databaseOptimizationChecks);
  
  // Check for load balancing readiness
  const loadBalancingChecks = await auditLoadBalancingReadiness();
  issues.push(...loadBalancingChecks);
  
  return {
    principle: 'scalability',
    status: issues.length === 0 ? 'compliant' : 'non-compliant',
    issues,
    score: Math.max(0, 100 - (issues.length * 12))
  };
}
```

## Audit Execution Framework
```typescript
// .opencode/command/constitutional-audit.ts
export async function runConstitutionalAudit(options: AuditOptions) {
  const startTime = Date.now();
  
  console.log('🔍 Starting Constitutional Compliance Audit...');
  
  // Initialize audit context
  const auditContext = await initializeAuditContext(options);
  
  // Run privacy compliance checks
  console.log('📋 Auditing Privacy Compliance...');
  const privacyResults = await auditPrivacyCompliance(auditContext);
  
  // Run security compliance checks
  console.log('🔒 Auditing Security Compliance...');
  const securityResults = await auditSecurityCompliance(auditContext);
  
  // Run architectural compliance checks
  console.log('🏗️ Auditing Architectural Compliance...');
  const architectureResults = await auditArchitectureCompliance(auditContext);
  
  // Generate comprehensive report
  const auditReport = generateAuditReport({
    privacy: privacyResults,
    security: securityResults,
    architecture: architectureResults,
    context: auditContext,
    duration: Date.now() - startTime
  });
  
  // Save audit results
  await saveAuditResults(auditReport);
  
  // Display summary
  displayAuditSummary(auditReport);
  
  return auditReport;
}

export async function initializeAuditContext(options: AuditOptions) {
  return {
    targetFiles: options.files || await getAllSourceFiles(),
    excludePatterns: options.exclude || getExcludedPatterns(),
    includePatterns: options.include || getIncludedPatterns(),
    auditScope: options.scope || 'full',
    outputFormat: options.format || 'detailed',
    timestamp: new Date().toISOString()
  };
}

export function generateAuditReport(results: AuditResults) {
  const totalScore = calculateOverallScore(results);
  const complianceLevel = determineComplianceLevel(totalScore);
  
  return {
    summary: {
      overallScore: totalScore,
      complianceLevel,
      totalIssues: countTotalIssues(results),
      criticalIssues: countCriticalIssues(results),
      auditDuration: results.duration,
      auditTimestamp: results.context.timestamp
    },
    detailedResults: results,
    recommendations: generateRecommendations(results),
    complianceCertificate: generateComplianceCertificate(totalScore, complianceLevel)
  };
}

export function displayAuditSummary(report: AuditReport) {
  console.log('\n📊 Constitutional Compliance Audit Summary');
  console.log('='.repeat(50));
  console.log(`Overall Score: ${report.summary.overallScore}/100`);
  console.log(`Compliance Level: ${report.summary.complianceLevel}`);
  console.log(`Total Issues: ${report.summary.totalIssues}`);
  console.log(`Critical Issues: ${report.summary.criticalIssues}`);
  console.log(`Audit Duration: ${report.summary.auditDuration}ms`);
  console.log('='.repeat(50));
  
  if (report.summary.complianceLevel === 'non-compliant') {
    console.log('\n⚠️  Compliance Issues Found:');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.priority}: ${rec.description}`);
    });
  } else {
    console.log('\n✅ All Constitutional Standards Met!');
  }
}
```

## Compliance Scoring System
```typescript
// apps/web/audit/scoring.ts
export function calculateOverallScore(results: AuditResults): number {
  const weights = {
    privacy: 0.4,
    security: 0.4,
    architecture: 0.2
  };
  
  const privacyScore = calculateCategoryScore(results.privacy);
  const securityScore = calculateCategoryScore(results.security);
  const architectureScore = calculateCategoryScore(results.architecture);
  
  return Math.round(
    (privacyScore * weights.privacy) +
    (securityScore * weights.security) +
    (architectureScore * weights.architecture)
  );
}

export function calculateCategoryScore(categoryResults: any): number {
  const principleScores = Object.values(categoryResults).map(
    (result: any) => result.score || 0
  );
  
  return principleScores.reduce((sum, score) => sum + score, 0) / principleScores.length;
}

export function determineComplianceLevel(score: number): string {
  if (score >= 95) return 'exemplary';
  if (score >= 85) return 'compliant';
  if (score >= 70) return 'partially_compliant';
  return 'non-compliant';
}

export function generateRecommendations(results: AuditResults): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Extract critical issues and generate recommendations
  Object.values(results).forEach((category: any) => {
    Object.values(category).forEach((principle: any) => {
      if (principle.issues && principle.issues.length > 0) {
        principle.issues.forEach((issue: any) => {
          recommendations.push({
            priority: getPriorityFromSeverity(issue.severity),
            category: principle.principle || principle.standard,
            description: `Fix ${issue.type}: ${issue.description}`,
            effort: estimateEffort(issue),
            impact: estimateImpact(issue)
          });
        });
      }
    });
  });
  
  // Sort by priority and impact
  return recommendations.sort((a, b) => {
    const priorityWeight = { critical: 3, high: 2, medium: 1, low: 0.5 };
    const impactWeight = { high: 3, medium: 2, low: 1 };
    
    const aScore = priorityWeight[a.priority] * impactWeight[a.impact];
    const bScore = priorityWeight[b.priority] * impactWeight[b.impact];
    
    return bScore - aScore;
  });
}
```

## Continuous Compliance Monitoring
```typescript
// apps/web/audit/monitoring.ts
export class ComplianceMonitor {
  private auditInterval: NodeJS.Timeout | null = null;
  private webhookUrl: string;
  
  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }
  
  startMonitoring(intervalHours: number = 24) {
    this.auditInterval = setInterval(async () => {
      try {
        const report = await runConstitutionalAudit({
          scope: 'full',
          format: 'summary'
        });
        
        await this.sendComplianceAlert(report);
      } catch (error) {
        console.error('Compliance monitoring failed:', error);
      }
    }, intervalHours * 60 * 60 * 1000);
    
    console.log(`🔍 Compliance monitoring started (every ${intervalHours} hours)`);
  }
  
  stopMonitoring() {
    if (this.auditInterval) {
      clearInterval(this.auditInterval);
      this.auditInterval = null;
      console.log('🔍 Compliance monitoring stopped');
    }
  }
  
  private async sendComplianceAlert(report: AuditReport) {
    const payload = {
      timestamp: report.summary.auditTimestamp,
      score: report.summary.overallScore,
      complianceLevel: report.summary.complianceLevel,
      issues: report.summary.totalIssues,
      criticalIssues: report.summary.criticalIssues,
      recommendations: report.recommendations.slice(0, 3) // Top 3 recommendations
    };
    
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Failed to send compliance alert:', error);
    }
  }
}

export function setupComplianceMonitoring() {
  const monitor = new ComplianceMonitor(process.env.COMPLIANCE_WEBHOOK_URL || '');
  
  // Start monitoring in production
  if (process.env.NODE_ENV === 'production') {
    monitor.startMonitoring(24); // Daily audits
  }
  
  // Return monitor instance for manual control
  return monitor;
}
```

## Integration with CI/CD
```yaml
# .github/workflows/constitutional-audit.yml
name: Constitutional Compliance Audit
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  constitutional-audit:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: pnpm/action-setup@v2
        with:
          version: 20
          latestVersion: true
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run constitutional audit
        run: npx opencode constitutional-audit --report
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          COMPLIANCE_WEBHOOK_URL: ${{ secrets.COMPLIANCE_WEBHOOK_URL }}
      
      - name: Upload audit report
        uses: actions/upload-artifact@v3
        with:
          name: constitutional-audit-report
          path: constitutional-audit-report.json
      
      - name: Check compliance level
        run: |
          compliance_level=$(cat constitutional-audit-report.json | jq -r '.summary.complianceLevel')
          if [[ "$compliance_level" == "non-compliant" ]]; then
            echo "❌ Constitutional compliance failed"
            exit 1
          else
            echo "✅ Constitutional compliance passed"
          fi
```

## Best Practices for Constitutional Compliance

### Development Workflow Integration
1. **Pre-commit Hooks**: Run basic constitutional checks before commits
2. **Code Review**: Include constitutional compliance in review checklists
3. **Automated Testing**: Include compliance tests in the test suite
4. **Documentation**: Maintain up-to-date constitutional guidelines

### Continuous Improvement
1. **Regular Updates**: Update constitutional standards based on new requirements
2. **Feedback Loop**: Incorporate feedback from audit results
3. **Training**: Educate team members on constitutional principles
4. **Metrics**: Track compliance metrics over time

### Governance
1. **Compliance Officer**: Designate responsibility for constitutional compliance
2. **Regular Audits**: Schedule regular comprehensive audits
3. **Incident Response**: Establish procedures for compliance violations
4. **Reporting**: Generate regular compliance reports for stakeholders

This command ensures Inbox Zero maintains the highest standards of constitutional compliance across all aspects of development, security, and architecture.
```

Let me create a few more important agents and commands:

<tool_call>
<function=edit_file>
<parameter=display_description>
Create Digest Feature agent
</parameter>
<parameter=path>
inbox-zero/.opencode/agent/digest-feature.md
</parameter>
<parameter=mode>
create
</parameter>
</function>
</tool_call>