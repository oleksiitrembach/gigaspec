/**
 * Gigaspec v5.0 - Security Rules Module
 * Topic-specific security requirements
 */

function securityRules(config) {
  return `# Security Rules

> **Module**: Security  
> **Severity**: REQUIRED  
> **Applies To**: All code, all files

---

## 1. Authentication & Authorization

### 1.1 Authentication Required
You MUST implement authentication for:
- All API endpoints (except health checks)
- Admin interfaces
- Sensitive operations

### 1.2 Authorization Checks
- Verify user permissions before actions
- Use principle of least privilege
- Never trust client-side authorization

---

## 2. Input Validation

### 2.1 Never Trust Input
- Validate ALL user input
- Sanitize data before processing
- Use parameterized queries (prevent SQL injection)
- Escape output (prevent XSS)

### 2.2 Validation Rules
- Type validation
- Length limits
- Format validation (regex)
- Range validation for numbers

---

## 3. Secrets Management

### 3.1 Secret Storage
- NEVER hardcode secrets
- Use environment variables
- Use secret management services (Vault, AWS Secrets Manager)
- Rotate secrets regularly

### 3.2 Forbidden in Code
| Pattern | Severity | Alternative |
|---------|----------|-------------|
| API keys in source | CRITICAL | Environment variables |
| Passwords in code | CRITICAL | Secret manager |
| Private keys in repo | CRITICAL | Secure storage |
| .env files committed | HIGH | .env.example only |

---

## 4. Data Protection

### 4.1 Sensitive Data
- Encrypt sensitive data at rest
- Use TLS for data in transit
- Mask sensitive data in logs
- Follow GDPR/CCPA for personal data

### 4.2 Logging
- NEVER log: passwords, tokens, credit cards, PII
- DO log: access attempts, errors (sanitized), audit events

---

## 5. Common Vulnerabilities

### 5.1 OWASP Top 10 Prevention

| Vulnerability | Prevention |
|--------------|------------|
| Injection | Parameterized queries |
| Broken Auth | Strong passwords, MFA, session management |
| Sensitive Data Exposure | Encryption, secure protocols |
| XXE | Disable XML external entities |
| Broken Access Control | Server-side authorization checks |
| Security Misconfiguration | Secure defaults, minimal features |
| XSS | Output encoding, CSP headers |
| Insecure Deserialization | Input validation, type checking |
| Known Vulnerabilities | Dependency scanning, updates |
| Insufficient Logging | Comprehensive audit logging |

---

## 6. Security Headers

### 6.1 Required Headers
\`\`\`
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
\`\`\`

---

## 7. Verification

### 7.1 Security Checklist
- [ ] No secrets in code
- [ ] Input validation implemented
- [ ] Output encoding implemented
- [ ] Authentication on all endpoints
- [ ] Authorization checks present
- [ ] Security headers configured
- [ ] Dependencies scanned

### 7.2 Security Testing
- Run security linter: \`npm run security:lint\`
- Check for secrets: \`git-secrets\` or \`truffleHog\`
- Dependency audit: \`npm audit\`
`;
}

module.exports = { securityRules };
