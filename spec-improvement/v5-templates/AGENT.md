# AGENT.md - Project Coding Standards

> **Project**: {{PROJECT_NAME}}  
> **Stack**: {{STACK}}  
> **Coverage Target**: {{COVERAGE_TARGET}}%  
> **Last Updated**: {{DATE}}

---

## 📖 Overview

This document defines project-specific coding standards. These complement the **immutable rules in CLAUDE.md**.

**Hierarchy**: CLAUDE.md (system) > AGENT.md (project) > RULES/ (topic)

---

## 🛠️ Tech Stack

{{STACK_DETAILS}}

---

## 📁 Project Structure

```
{{PROJECT_STRUCTURE}}
```

---

## 🔧 Common Commands

```bash
# Development
{{DEV_COMMAND}}

# Testing
{{TEST_COMMAND}}

# Linting
{{LINT_COMMAND}}

# Type Checking
{{TYPE_CHECK_COMMAND}}

# Build
{{BUILD_COMMAND}}
```

---

## 📋 Stack-Specific Rules

{{STACK_RULES}}

---

## 🚫 Project-Specific Forbidden Patterns

| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
{{FORBIDDEN_PATTERNS}}

---

## ✅ Code Review Checklist

Before marking any task complete:

- [ ] Functions ≤ 10 lines
- [ ] Parameters ≤ 3 per function
- [ ] No nested conditionals > 2 levels
- [ ] No `any` types
- [ ] All errors handled
- [ ] Tests written and passing
- [ ] Coverage ≥ {{COVERAGE_TARGET}}%
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Documentation updated

---

## 🔄 Standard Workflows

### Adding a Feature

1. Read STATE.md
2. Plan implementation
3. Get user approval
4. Implement in small chunks
5. Test each chunk
6. Update STATE.md (user-confirmed)
7. Update docs if needed

### Fixing a Bug

1. Analyze error and root cause
2. Create minimal reproduction test
3. Fix the bug
4. Verify test passes
5. Run full test suite
6. Update STATE.md if significant

### Refactoring

1. Identify scope (< 10 files)
2. Document current behavior
3. Plan incremental changes
4. Get user approval
5. Execute with verification after each file
6. Update ARCHITECTURE.md if structure changes

---

## 📚 Additional Resources

{{ADDITIONAL_RESOURCES}}

---

**Remember**: CLAUDE.md rules are **IMMUTABLE**. This document adds project-specific guidance.
