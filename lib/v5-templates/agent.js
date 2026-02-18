/**
 * Gigaspec v5.0 - AGENT.md Template
 * Project-specific coding standards
 */

function agentTemplate(config) {
  const stack = config.stack || 'Node.js/Express';
  const stackLower = stack.toLowerCase();
  const coverage = config.coverageTarget || '95';
  
  // Generate stack-specific content
  let stackDetails = '';
  let commonCommands = '';
  let stackRules = '';
  let forbiddenPatterns = '';
  let projectStructure = '';
  
  if (stackLower.includes('node') || stackLower.includes('next')) {
    stackDetails = `- **Runtime**: Node.js 18+\n- **Language**: TypeScript 5+\n- **Framework**: ${stack}\n- **Testing**: Jest\n- **Linting**: ESLint + Prettier`;
    
    commonCommands = `\`\`\`bash
# Development\nnpm run dev\n\n# Testing\nnpm test\nnpm run test:coverage\n\n# Linting\nnpm run lint\nnpm run lint:fix\n\n# Type Checking\nnpx tsc --noEmit\n\n# Build\nnpm run build\n\`\`\``;
    
    stackRules = `### TypeScript\n- Use strict mode\n- Explicit return types on public functions\n- Prefer interfaces over types for objects\n- Use discriminated unions for complex state\n\n### Error Handling\n- Use Result types: \`{ success: true, data: T } | { success: false, error: E }\`\n- Never throw for expected errors\n- Always handle Promise rejections`;
    
    forbiddenPatterns = `| Pattern | Why Forbidden | Alternative |\n|---------|---------------|-------------|\n| \`any\` type | Loses type safety | Use \`unknown\` with type guards |\n| \`console.log\` in prod | No structured logging | Use pino/winston |\n| \`==\` instead of \`===\` | Type coercion bugs | Always use \`===\` |\n| Callback hell | Hard to read | Use async/await |\n| \`var\` | Function scope issues | Use \`const\` or \`let\` |`;
    
    projectStructure = `\`\`\`\nsrc/\n├── lib/          # Core logic\n├── routes/       # API routes\n├── types/        # TypeScript types\n├── utils/        # Utilities\ntests/\n├── unit/         # Unit tests\n├── integration/  # Integration tests\n\`\`\``;
  } else if (stackLower.includes('elixir')) {
    stackDetails = `- **Language**: Elixir 1.16+\n- **Framework**: Phoenix\n- **Testing**: ExUnit\n- **Linting**: Credo\n- **Type Checking**: Dialyzer`;
    
    commonCommands = `\`\`\`bash
# Development\nmix phx.server\n\n# Testing\nmix test\nmix coveralls\n\n# Linting\nmix credo --strict\nmix format --check-formatted\n\n# Type Checking\nmix dialyzer\n\n# Build\nmix compile\n\`\`\``;
    
    stackRules = `### Elixir Patterns\n- Use \`with\` for sequential operations\n- Pattern match in function heads\n- Return \`{:ok, result}\` / \`{:error, reason}\` tuples\n- Use \`@spec\` for all public functions\n\n### Error Handling\n- Never use exceptions for control flow\n- Always handle all cases in case statements\n- Use \`with\` else clauses for error handling`;
    
    forbiddenPatterns = `| Pattern | Why Forbidden | Alternative |\n|---------|---------------|-------------|\n| \`String.to_atom/1\` on input | Atom exhaustion | Use \`String.to_existing_atom/1\` |\n| \`IO.puts\` in production | No structured logging | Use Logger |\n| Deep nesting (>2 levels) | Hard to read | Extract functions |\n| Exceptions for control flow | Unexpected behavior | Use Result tuples |`;
    
    projectStructure = `\`\`\`\nlib/\n├── my_app/\n│   ├── accounts/     # Context\n│   ├── accounts.ex   # Context API\n│   └── accounts/     # Context internals\n│       ├── user.ex   # Schema\n│       └── user_queries.ex\ntest/\n├── my_app/           # Unit tests\n├── support/          # Test support\n\`\`\``;
  } else if (stackLower.includes('python')) {
    stackDetails = `- **Language**: Python 3.11+\n- **Framework**: ${stack.includes('FastAPI') ? 'FastAPI' : 'Django/Flask'}\n- **Testing**: pytest\n- **Linting**: ruff + black\n- **Type Checking**: mypy`;
    
    commonCommands = `\`\`\`bash
# Development\nuvicorn main:app --reload\n\n# Testing\npytest\npytest --cov=.\n\n# Linting\nruff check .\nruff check . --fix\nblack --check .\n\n# Type Checking\nmypy .\n\n# Build\npip install -e .\n\`\`\``;
    
    stackRules = `### Python Patterns\n- Use type hints everywhere\n- Prefer dataclasses over dicts\n- Use context managers for resources\n- Prefer composition over inheritance\n\n### Error Handling\n- Use specific exceptions, never bare except\n- Use \`contextlib.suppress\` for expected exceptions\n- Return Result types for business logic errors`;
    
    forbiddenPatterns = `| Pattern | Why Forbidden | Alternative |\n|---------|---------------|-------------|\n| Bare \`except:\` | Catches all exceptions | Use \`except SpecificError:\` |\n| \`print()\` in production | No structured logging | Use logging module |\n| Mutable default args | Unexpected behavior | Use \`None\` and initialize inside |\n| No type hints | Poor maintainability | Add type hints everywhere |`;
    
    projectStructure = `\`\`\`\nsrc/\n├── myapp/\n│   ├── __init__.py\n│   ├── models/       # Data models\n│   ├── routes/       # API routes\n│   ├── services/     # Business logic\n│   └── utils/        # Utilities\ntests/\n├── unit/\n├── integration/\n\`\`\``;
  } else {
    stackDetails = `- **Stack**: ${stack}\n- **Testing**: [Add test framework]\n- **Linting**: [Add linter]`;
    
    commonCommands = `\`\`\`bash
# Add your common commands here\n\`\`\``;
    
    stackRules = `### General Patterns\n- Add stack-specific patterns here`;
    
    forbiddenPatterns = `| Pattern | Why Forbidden | Alternative |\n|---------|---------------|-------------|\n| [Add patterns] | [Why] | [Alternative] |`;
    
    projectStructure = `\`\`\`\n[Add project structure]\n\`\`\``;
  }
  
  return `# AGENT.md - Project Coding Standards

> **Project**: ${config.name}  
> **Stack**: ${stack}  
> **Coverage Target**: ${coverage}%  
> **Last Updated**: ${new Date().toISOString().split('T')[0]}

---

## 📖 Overview

This document defines project-specific coding standards. These complement the **immutable rules in CLAUDE.md**.

**Hierarchy**: CLAUDE.md (system) > AGENT.md (project) > RULES/ (topic)

---

## 🛠️ Tech Stack

${stackDetails}

---

## 📁 Project Structure

${projectStructure}

---

## 🔧 Common Commands

${commonCommands}

---

## 📋 Stack-Specific Rules

${stackRules}

---

## 🚫 Project-Specific Forbidden Patterns

${forbiddenPatterns}

---

## ✅ Code Review Checklist

Before marking any task complete:

- [ ] Functions ≤ 10 lines
- [ ] Parameters ≤ 3 per function
- [ ] No nested conditionals > 2 levels
- [ ] No \`any\` types
- [ ] All errors handled
- [ ] Tests written and passing
- [ ] Coverage ≥ ${coverage}%
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

- @RULES/security.md - Security requirements
- @RULES/testing.md - Testing standards  
- @SKILLS/fix-issue - Issue resolution workflow

---

**Remember**: CLAUDE.md rules are **IMMUTABLE**. This document adds project-specific guidance.
`;
}

module.exports = { agentTemplate };
