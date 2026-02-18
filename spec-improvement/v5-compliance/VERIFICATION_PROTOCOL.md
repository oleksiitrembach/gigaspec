# Verification Protocol

> **Purpose**: Automated compliance enforcement for AI-generated code

---

## 🔍 Pre-Generation Checks

Before writing ANY code, verify:

```yaml
pre_generation:
  - check: "Read STATE.md"
    required: true
    fallback: "Ask user for current state"
  
  - check: "Read AGENT.md"
    required: true
    fallback: "Ask user for project standards"
  
  - check: "Understand task scope"
    required: true
    criteria:
      - "Files to modify identified"
      - "Test approach defined"
      - "Rollback plan ready"
```

---

## ✅ Post-Generation Validation

After EVERY code change, run:

### 1. Static Analysis
```bash
# Run all static checks
{{LINT_COMMAND}}
{{TYPE_CHECK_COMMAND}}
```

**Success Criteria**: Zero errors

### 2. Unit Tests
```bash
# Run affected tests
{{TEST_COMMAND}} [specific files]
```

**Success Criteria**: All pass, coverage maintained

### 3. Integration Tests (if applicable)
```bash
# Run integration suite
{{INTEGRATION_TEST_COMMAND}}
```

**Success Criteria**: All pass

### 4. Code Quality Metrics
```bash
# Check quality gates
{{QUALITY_COMMAND}}
```

**Success Criteria**:
- Functions ≤ 10 lines: 100%
- Cyclomatic complexity ≤ 5: 100%
- No `any` types: 100%
- Test coverage ≥ {{COVERAGE_TARGET}}%

---

## 🚨 Violation Handling

### Critical Violations (Block Commit)
- Breaking existing tests
- Lint errors
- Type errors
- Security vulnerabilities
- Deleted files without backup

### Warning Violations (Fix Before Commit)
- Functions > 10 lines
- Missing tests
- Documentation gaps
- Coverage drops

### Auto-Fixable Violations
- Formatting issues
- Import ordering
- Whitespace errors

---

## 🔄 Compliance Checkpoint Protocol

```
Checkpoint A: Before Changes
├── Read all relevant docs
├── Understand current state
├── Plan changes
└── Get approval (if >50 lines)

Checkpoint B: After Implementation
├── Run static analysis
├── Run tests
├── Verify coverage
└── Document changes

Checkpoint C: Before Completion
├── Final verification run
├── Update STATE.md (confirmed)
├── Update docs (if needed)
└── Compliance checklist complete
```

---

## 📊 Compliance Report Template

```markdown
## Compliance Report - [Task Name]

### Changes Made
- [File 1]: [Description]
- [File 2]: [Description]

### Verification Results
| Check | Status | Details |
|-------|--------|---------|
| Lint | ✅/❌ | [Output] |
| Type Check | ✅/❌ | [Output] |
| Unit Tests | ✅/❌ | [X/Y passed] |
| Coverage | ✅/❌ | [Z%] |

### Violations Found
- [ ] None
- [ ] Auto-fixed: [list]
- [ ] Manual fix required: [list]

### Compliance Status
- [ ] ✅ FULLY COMPLIANT
- [ ] ⚠️ COMPLIANT WITH WARNINGS
- [ ] ❌ NON-COMPLIANT (blocking issues)
```

---

## 🤖 Automated Enforcement

### MCP Integration
If available, use MCP tools for:
- Running tests
- Checking coverage
- Linting
- Type checking

### Fallback to Bash
If MCP unavailable:
```bash
# Run verification via bash
npm run verify  # Or equivalent
```

### Self-Correction Loop
If violations found:
1. Stop and report
2. Propose fix
3. Apply fix
4. Re-run verification
5. Report results

---

**Remember**: Compliance is NOT optional. Every code change MUST pass verification.
