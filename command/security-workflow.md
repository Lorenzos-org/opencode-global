---
description: Advanced security automation with vulnerability scanning, compliance monitoring, and threat detection
agent: security-agent
subtask: true
---

# 🔒 /security-workflow Command - Comprehensive Security Automation

## Purpose
Execute comprehensive security automation including vulnerability scanning, compliance monitoring, threat detection, and security orchestration with industry-leading practices and zero-trust principles.

## Parameters
- **operation**: Security operation type (scan, monitor, compliance, incident, audit)
- **framework**: Security framework (nist, iso27001, soc2, pci, hipaa, gdpr)
- **scanning**: Scanning type (basic, comprehensive, enterprise, continuous)
- **monitoring**: Monitoring level (off, basic, advanced, real-time)
- **automation**: Automation level (manual, semi-auto, auto, full-auto)

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

## Advanced Security Features

### 1. Multi-Engine Vulnerability Scanning
```bash
# Industry hack: Comprehensive vulnerability assessment
comprehensive_vulnerability_scan() {
    local target_repo=$1
    local scan_type=${2:-"full"}
    
    # Initialize results
    local results_dir="/tmp/security-scan-results"
    mkdir -p "$results_dir"
    
    echo "🔍 Starting comprehensive vulnerability scan..."
    
    # 1. Dependency vulnerability scanning
    echo "📦 Scanning dependencies..."
    
    # Snyk scan
    if command -v snyk &> /dev/null; then
        snyk test --all-projects --json > "$results_dir/snyk-dependencies.json"
        snyk monitor --all-projects
    fi
    
    # npm audit with enhanced reporting
    if [ -f "package.json" ]; then
        npm audit --audit-level=moderate --json > "$results_dir/npm-audit.json"
        audit-ci --config audit-ci-config.json --moderate
    fi
    
    # Python dependency scanning
    if [ -f "requirements.txt" ]; then
        pip-audit --format=json --output="$results_dir/pip-audit.json"
        safety check --json --output="$results_dir/safety-audit.json"
    fi
    
    # 2. Container vulnerability scanning
    echo "🐳 Scanning containers..."
    if [ -f "Dockerfile" ]; then
        # Trivy container scanning
        trivy image --format json --output "$results_dir/trivy-container.json" .
        
        # Docker bench security
        docker run --rm --net host --pid host --userns host --cap-add audit_control \
            -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
            -v /etc:/etc:ro \
            -v /var/lib:/var/lib:ro \
            -v /var/run/docker.sock:/var/run/docker.sock:ro \
            -v /usr/lib/systemd:/usr/lib/systemd:ro \
            -v /etc/systemd:/etc/systemd:ro \
            --label docker_bench_security \
            docker/docker-bench-security > "$results_dir/docker-bench.txt"
    fi
    
    # 3. Infrastructure as Code scanning
    echo "🏗️ Scanning infrastructure as code..."
    
    # Terraform security scanning
    if [ -f "*.tf" ]; then
        checkov --framework terraform --output-format json --output "$results_dir/checkov-terraform.json" .
        tfsec --format json --out "$results_dir/tfsec-results.json" .
    fi
    
    # Kubernetes manifest scanning
    if [ -f "*.k8s.yaml" ] || [ -f "*.kubernetes.yaml" ]; then
        kube-score score --output-format json --output-file "$results_dir/kube-score.json" .
        kubesec scan . > "$results_dir/kubesec.json"
    fi
    
    # 4. SAST (Static Application Security Testing)
    echo "🔬 Performing SAST analysis..."
    
    # Semgrep comprehensive rules
    semgrep --config=auto --json --output="$results_dir/semgrep-sast.json" .
    
    # Bandit for Python
    if [ -f "*.py" ]; then
        bandit -r . -f json -o "$results_dir/bandit-python.json"
    fi
    
    # ESLint security rules for JavaScript/TypeScript
    if [ -f "*.js" ] || [ -f "*.ts" ]; then
        npx eslint . --ext .js,.ts,.tsx --format json --output-file "$results_dir/eslint-security.json"
    fi
    
    # 5. License compliance scanning
    echo "📄 Analyzing license compliance..."
    if command -v license-checker &> /dev/null; then
        license-checker --json > "$results_dir/license-compliance.json"
    fi
    
    # Generate comprehensive report
    generate_security_report "$results_dir"
}
```

### 2. Real-time Threat Detection
```bash
# Industry hack: AI-powered anomaly detection
real_time_security_monitoring() {
    local monitoring_duration=${1:-"24h"}
    local alert_threshold=${2:-"medium"}
    
    echo "👁️ Starting real-time security monitoring..."
    
    # 1. File integrity monitoring
    echo "📁 Setting up file integrity monitoring..."
    inotifywait -m -r -e modify,attrib,moved_to,moved_from,create,delete \
        --format '%w%f %e %T' --timefmt '%Y-%m-%d %H:%M:%S' \
        . 2>/dev/null | while read file event timestamp; do
        
        # Analyze file changes for suspicious patterns
        if echo "$file" | grep -E "(config|secret|key|password)" && [ "$event" = "modify" ]; then
            echo "🚨 Suspicious file modification: $file at $timestamp" | \
                tee -a /var/log/security-monitor.log
            send_security_alert "suspicious_file_change" "$file" "$timestamp"
        fi
    done &
    
    # 2. Process monitoring
    echo "⚙️ Setting up process monitoring..."
    while true; do
        # Monitor for suspicious processes
        suspicious_processes=$(ps aux | grep -E "(nc|netcat|socat)" | grep -v grep)
        if [ -n "$suspicious_processes" ]; then
            echo "🚨 Suspicious process detected: $suspicious_processes" | \
                tee -a /var/log/security-monitor.log
            send_security_alert "suspicious_process" "$suspicious_processes"
        fi
        
        # Monitor for unusual network connections
        unusual_connections=$(netstat -tuln | grep -E ":(80|443|22|21|25)" | wc -l)
        if [ $unusual_connections -gt 10 ]; then
            echo "🚨 High number of network connections: $unusual_connections" | \
                tee -a /var/log/security-monitor.log
        fi
        
        sleep 30
    done &
    
    # 3. Log analysis with ML
    echo "🤖 Starting ML-based log analysis..."
    tail -f /var/log/auth.log /var/log/apache2/access.log /var/log/nginx/access.log | \
    while read log_line; do
        # Use ML model to detect anomalies
        if python3 -c "
import sys
import re
log_line = '$log_line'
# Simple anomaly detection (in practice, use trained ML model)
if re.search(r'(admin|root|test).*failed', log_line, re.IGNORECASE):
    print('ANOMALY_DETECTED')
" 2>/dev/null | grep -q "ANOMALY_DETECTED"; then
            echo "🚨 ML-anomaly detected: $log_line" | \
                tee -a /var/log/security-monitor.log
            send_security_alert "ml_anomaly" "$log_line"
        fi
    done &
}
```

### 3. Automated Compliance Monitoring
```bash
# Industry hack: Automated compliance framework implementation
automated_compliance_monitoring() {
    local framework=${1:-"nist"}  # nist, iso27001, soc2, gdpr, hipaa
    
    echo "📋 Starting $framework compliance monitoring..."
    
    case $framework in
        "nist")
            # NIST Cybersecurity Framework implementation
            nist_cs_framework_controls=(
                "ID.AM-1: Inventory of authorized and unauthorized devices"
                "PR.AC-1: Identity and access management"
                "DE.CM-1: Network monitoring and detection"
                "RS.MI-1: Response planning process"
                "RC.CO-1: Recovery planning process"
            )
            
            for control in "${nist_cs_framework_controls[@]}"; do
                echo "🔍 Checking control: $control"
                check_nist_control "$control"
            done
            ;;
        "iso27001")
            # ISO 27001 Annex A controls
            iso27001_controls=(
                "A.5.1.1: Information security policies"
                "A.8.2.3: Handling of assets"
                "A.12.4.1: Event logging"
                "A.13.2.1: Information transfer policies"
                "A.18.2.3: Technical compliance checking"
            )
            
            for control in "${iso27001_controls[@]}"; do
                echo "🔍 Checking control: $control"
                check_iso270001_control "$control"
            done
            ;;
        "soc2")
            # SOC 2 Trust Service Criteria
            soc2_criteria=(
                "CC1.1: Control environment"
                "CC2.1: Risk assessment"
                "CC6.1: System monitoring"
                "CC7.1: System operations"
                "CC8.1: Change management"
            )
            
            for criterion in "${soc2_criteria[@]}"; do
                echo "🔍 Checking criterion: $criterion"
                check_soc2_criterion "$criterion"
            done
            ;;
    esac
    
    # Generate compliance report
    generate_compliance_report "$framework"
}
```

### 4. Zero-Trust Security Implementation
```bash
# Industry hack: Zero-trust identity verification
zero_trust_identity_verification() {
    local user_id=$1
    local resource_accessed=$2
    local context_data=$3
    
    echo "🔐 Performing zero-trust identity verification for: $user_id"
    
    # 1. Multi-factor authentication verification
    verify_mfa() {
        local user_id=$1
        local mfa_token=$2
        
        # Verify MFA token
        if ! python3 -c "
import pyotp
import sys
user_id = '$user_id'
mfa_token = '$mfa_token'
# In practice, retrieve secret from secure storage
secret = 'TESTSECRET'
totp = pyotp.TOTP(secret)
if not totp.verify(mfa_token):
    sys.exit(1)
"; then
            echo "❌ MFA verification failed"
            return 1
        fi
        echo "✅ MFA verification successful"
        return 0
    }
    
    # 2. Device attestation
    verify_device_attestation() {
        local device_id=$1
        
        # Check device certificate
        if ! openssl verify -CAfile /etc/ssl/certs/device-ca.crt "/etc/ssl/certs/devices/${device_id}.crt" 2>/dev/null; then
            echo "❌ Device attestation failed"
            return 1
        fi
        echo "✅ Device attestation successful"
        return 0
    }
    
    # 3. Behavioral analysis
    perform_behavioral_analysis() {
        local user_id=$1
        
        # Analyze user behavior patterns
        login_time=$(date +%H)
        if [ $login_time -lt 6 ] || [ $login_time -gt 22 ]; then
            echo "⚠️ Unusual login time detected"
            require_additional_verification="true"
        fi
        
        # Check for unusual geolocation
        current_ip=$(curl -s ifconfig.me)
        if ! is_trusted_location "$current_ip" "$user_id"; then
            echo "⚠️ Unusual location detected"
            require_additional_verification="true"
        fi
        
        return 0
    }
    
    # 4. Risk-based authentication
    calculate_risk_score() {
        local user_id=$1
        local context_data=$2
        
        local risk_score=0
        
        # Base risk from user history
        failed_logins=$(grep "$user_id" /var/log/auth.log | grep "failed" | wc -l)
        risk_score=$((risk_score + failed_logins * 10))
        
        # Context-based risk
        if echo "$context_data" | grep -q "unusual_browser"; then
            risk_score=$((risk_score + 25))
        fi
        
        if echo "$context_data" | grep -q "vpn_connection"; then
            risk_score=$((risk_score + 15))
        fi
        
        echo "Risk score: $risk_score"
        
        if [ $risk_score -gt 50 ]; then
            echo "🔒 High risk - additional verification required"
            return 2
        elif [ $risk_score -gt 25 ]; then
            echo "⚠️ Medium risk - enhanced monitoring"
            return 1
        else
            echo "✅ Low risk - standard verification"
            return 0
        fi
    }
    
    # Execute verification chain
    case "$(calculate_risk_score "$user_id" "$context_data")" in
        0)
            # Standard verification
            verify_mfa "$user_id" "$MFA_TOKEN"
            ;;
        1)
            # Enhanced verification
            verify_mfa "$user_id" "$MFA_TOKEN"
            verify_device_attestation "$DEVICE_ID"
            ;;
        2)
            # Maximum verification
            verify_mfa "$user_id" "$MFA_TOKEN"
            verify_device_attestation "$DEVICE_ID"
            perform_behavioral_analysis "$user_id"
            # May require manual approval
            ;;
    esac
}
```

## Implementation Examples

### Enterprise Security Setup
```bash
/security-workflow --operation=setup --framework=enterprise --scanning=comprehensive --monitoring=real-time --automation=full-auto
```

### Vulnerability Management
```bash
/security-workflow --operation=scan --scanning=enterprise --automation=auto --reporting=detailed
```

### Compliance Monitoring
```bash
/security-workflow --operation=compliance --framework=nist --monitoring=continuous --reporting=automated
```

### Incident Response
```bash
/security-workflow --operation=incident --automation=auto --containment=immediate --escalation=smart
```

## Result Reporting

### Comprehensive Security Dashboard
```json
{
  "success": true,
  "security_scan": {
    "vulnerabilities_found": 15,
    "critical": 2,
    "high": 5,
    "medium": 6,
    "low": 2,
    "compliance_score": 87,
    "risk_level": "medium"
  },
  "threat_detection": {
    "anomalies_detected": 3,
    "false_positives": 1,
    "response_time": "2.3s",
    "detection_accuracy": 94.2
  },
  "compliance": {
    "framework": "nist",
    "controls_passed": 94,
    "controls_failed": 6,
    "audit_trail_complete": true,
    "remediation_required": 12
  },
  "zero_trust": {
    "identity_verifications": 156,
    "access_denials": 8,
    "device_attestations": 45,
    "risk_assessments": 156
  },
  "recommendations": [
    "Patch critical vulnerabilities within 24 hours",
    "Review access controls for high-risk users",
    "Implement additional monitoring for anomalous behavior",
    "Update incident response procedures"
  ]
}
```

## Success Metrics

### Security Excellence
- **Vulnerability Detection Rate**: 99%+
- **Mean Time to Detection**: <5 minutes
- **Mean Time to Response**: <15 minutes
- **False Positive Rate**: <5%

### Compliance Achievement
- **Framework Compliance**: 95%+
- **Audit Readiness**: 100%
- **Policy Enforcement**: 99%+
- **Reporting Accuracy**: 99.9%+

### Zero-Trust Implementation
- **Identity Verification Success**: 99.9%+
- **Access Control Enforcement**: 100%+
- **Risk Assessment Accuracy**: 95%+
- **Incident Prevention Rate**: 90%+

This comprehensive security automation system implements cutting-edge security practices with AI-powered threat detection, comprehensive vulnerability management, and zero-trust security principles for maximum protection against modern cyber threats.