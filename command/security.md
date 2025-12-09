---
description: Comprehensive security analysis and automation with vulnerability scanning, compliance monitoring, and threat detection
agent: security-auditor
subtask: true
---

# 🔒 /security Command - Comprehensive Security Automation

## Purpose
Execute comprehensive security automation including vulnerability scanning, compliance monitoring, threat detection, and security orchestration with industry-leading practices and zero-trust principles.

## Parameters
- **operation**: Security operation type (scan, monitor, compliance, incident, audit)
- **focus**: Security focus areas (vulnerabilities, compliance, monitoring, all)
- **depth**: Review depth (basic, detailed, comprehensive)

## Execution Flow

### Phase 1: Comprehensive Vulnerability Assessment
1. **Multi-Engine Vulnerability Scanning**
   - Dependency vulnerability analysis (Snyk, npm audit, pip-audit)
   - Container security scanning (Trivy, Docker Bench)
   - Infrastructure as Code security (Checkov, tfsec, kube-score)
   - SAST analysis (Semgrep, Bandit, ESLint security)

2. **Supply Chain Security Analysis**
   - SBOM (Software Bill of Materials) generation
   - Dependency license compliance checking
   - Component risk assessment and scoring
   - Third-party vulnerability monitoring

3. **Container and Runtime Security**
   - Docker image vulnerability scanning
   - Runtime security monitoring and anomaly detection
   - Kubernetes security configuration validation
   - Network security policy enforcement

### Phase 2: Advanced Threat Detection & Monitoring
1. **Real-time Security Monitoring**
   - File integrity monitoring with anomaly detection
   - Process monitoring for suspicious activities
   - Network connection analysis and monitoring
   - Log analysis with ML-powered anomaly detection

2. **Threat Intelligence Integration**
   - Integration with threat intelligence feeds
   - IOC (Indicators of Compromise) monitoring
   - Vulnerability exploit prediction
   - Attack pattern recognition and alerting

3. **Incident Detection and Response**
   - Automated incident detection and classification
   - Real-time alerting and notification systems
   - Automated containment and response actions
   - Forensic data collection and analysis

### Phase 3: Compliance and Governance
1. **Regulatory Compliance Automation**
   - SOC 2, PCI DSS, HIPAA, GDPR compliance checking
   - NIST Cybersecurity Framework implementation
   - ISO 27001 Annex A controls validation
   - Automated compliance reporting and documentation

2. **Security Policy Enforcement**
   - Automated policy validation and enforcement
   - Configuration drift detection and remediation
   - Access control policy validation
   - Data protection policy enforcement

3. **Audit Trail and Reporting**
   - Immutable audit trail generation
   - Security event logging and correlation
   - Compliance reporting and dashboards
   - Executive security metrics and KPIs

### Phase 4: Zero-Trust Security Implementation
1. **Identity and Access Management**
   - Multi-factor authentication verification
   - Device attestation and validation
   - Risk-based authentication and authorization
   - Continuous identity verification

2. **Micro-segmentation and Isolation**
   - Network segmentation strategy implementation
   - Application isolation and container security
   - Data isolation and access control
   - Zero-trust architecture validation

## Security Analysis Focus

Perform comprehensive security analysis of the codebase:

Check for:
- Input validation vulnerabilities
- Authentication and authorization flaws
- Data exposure risks
- Dependency vulnerabilities
- Configuration security issues
- SQL injection and XSS vulnerabilities
- Insecure direct object references
- Security misconfigurations
- Sensitive data exposure
- Broken access controls

## Security Checks

### Dependency Security
```bash
# npm audit for basic vulnerability scanning
npm audit

# OSV Scanner for comprehensive vulnerability detection
osv-scanner --format json --output audit-results.json .

# Snyk for advanced vulnerability management
snyk test --all-projects
```

### Code Security Analysis
```bash
# Biome security rules configuration
{
  "linter": {
    "rules": {
      "security": {
        "all": true
      }
    }
  }
}
```

### Configuration Security
- Environment variables and API keys
- Security headers and CORS configuration
- Authentication and authorization settings
- Data protection and encryption

## Examples

```bash
/security --operation=scan --focus=vulnerabilities --depth=comprehensive
/security --operation=monitor --framework=nist --monitoring=real-time
/security --operation=compliance --framework=iso27001 --automation=auto
```

## Security Standards
- **Vulnerability Detection Rate**: 99%+
- **Mean Time to Detection**: <5 minutes
- **Mean Time to Response**: <15 minutes
- **False Positive Rate**: <5%

## Compliance Achievement
- **Framework Compliance**: 95%+
- **Audit Readiness**: 100%
- **Policy Enforcement**: 99%+
- **Reporting Accuracy**: 99.9%+

## Zero-Trust Implementation
- **Identity Verification Success**: 99.9%+
- **Access Control Enforcement**: 100%+
- **Risk Assessment Accuracy**: 95%+
- **Incident Prevention Rate**: 90%+

This comprehensive security automation system implements cutting-edge security practices with AI-powered threat detection, comprehensive vulnerability management, and zero-trust security principles for maximum protection against modern cyber threats.