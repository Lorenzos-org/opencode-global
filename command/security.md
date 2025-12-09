---
description: Security vulnerability scan
agent: security-auditor
subtask: true
---

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

Current dependencies: !`npm list --depth=0`

Security scan process:
1. Analyze code for common vulnerability patterns
2. Review dependency security advisories
3. Check configuration files for security issues
4. Validate authentication and authorization logic
5. Review data handling and storage practices

Provide:
- Vulnerability severity levels
- Specific code locations and examples
- Exploitation scenarios
- Detailed remediation steps
- Security best practice recommendations

Use todowrite to track security issues found and remediation progress.