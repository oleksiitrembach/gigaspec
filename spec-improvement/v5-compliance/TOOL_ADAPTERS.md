# Tool Adapter Specifications

> **Purpose**: Generate tool-specific files from unified spec

---

## 🎯 Adapter Philosophy

The **core specification** is tool-agnostic. Adapters translate it to tool-specific formats.

```
Unified Spec (gigaspec)
    ↓
┌─────────────┬─────────────┬─────────────┐
│   Claude    │   Cursor    │    Kimi     │
│   Adapter   │   Adapter   │   Adapter   │
└─────────────┴─────────────┴─────────────┘
```

---

## 🔧 Claude Code Adapter

### Generated Files

#### `.claude/CLAUDE.md`
Direct copy of project CLAUDE.md with additions:
```markdown
@../../CLAUDE.md  # Import project rules

## Tool-Specific Settings
- Use Plan Mode for >50 line changes
- Use subagents for investigations
- Enable MCP tools if available
```

#### `.claude/skills/gigaspec-compliance/SKILL.md`
```yaml
---
name: gigaspec-compliance
description: Enforce gigaspec coding standards
tools: [Read, Edit, Bash]
---

Validate code against gigaspec standards:
1. Check function length ≤ 10 lines
2. Check parameters ≤ 3
3. Check nesting ≤ 2 levels
4. Verify no `any` types
5. Confirm tests exist

Report violations and suggest fixes.
```

#### `.claude/agents/code-reviewer.md`
```yaml
---
name: code-reviewer
description: Review code for gigaspec compliance
tools: [Read, Grep, Bash]
model: sonnet
---

Review code for:
- CLAUDE.md rule compliance
- AGENT.md standards
- Test coverage
- Documentation

Provide specific line references for issues.
```

---

## 🔧 Cursor Adapter

### Generated Files

#### `.cursorrules`
```markdown
# Cursor Rules - {{PROJECT_NAME}}

## Always
1. Read STATE.md first
2. Read AGENT.md before coding
3. Follow CLAUDE.md immutable rules
4. Run tests after changes
5. Update STATE.md when done

## Never
1. Skip test execution
2. Use `any` types
3. Delete files without backup
4. Modify .env files
5. Write functions > 10 lines

## Code Style
{{STACK_SPECIFIC_RULES}}

## Verification
- Run tests: {{TEST_COMMAND}}
- Run lint: {{LINT_COMMAND}}
- Type check: {{TYPE_CHECK_COMMAND}}
```

#### `.cursor/agents/gigaspec-agent.md`
```markdown
# Gigaspec Agent for Cursor

You are a gigaspec-compliant coding agent.

## Pre-Flight
1. Check STATE.md for current task
2. Read AGENT.md for standards
3. Verify understanding

## Coding
1. Follow all rules in .cursorrules
2. Write tests with code
3. Keep functions small
4. Handle all errors

## Post-Flight
1. Run verification
2. Update STATE.md
3. Report compliance status
```

---

## 🔧 Kimi CLI Adapter

### Generated Files

#### `.kimi/AGENT.md`
```markdown
# Kimi CLI Configuration

## Session Start (REQUIRED)
1. Read STATE.md
2. Read AGENT.md
3. Confirm understanding

## Rules (IMMUTABLE)
{{CLAUDE_MD_RULES}}

## Stack
{{STACK_DETAILS}}

## Commands
- Test: {{TEST_COMMAND}}
- Lint: {{LINT_COMMAND}}
- Build: {{BUILD_COMMAND}}
```

---

## 🔧 Generic Adapter

For tools without native support:

### `.gigaspec/UNIFIED_SPEC.md`
Consolidated specification:
```yaml
project:
  name: {{PROJECT_NAME}}
  stack: {{STACK}}

compliance:
  rules:
    - id: R001
      severity: CRITICAL
      description: "Functions must be ≤ 10 lines"
      check: "line_count <= 10"
    
    - id: R002
      severity: CRITICAL
      description: "No any types"
      check: "no_any_types"
  
  verification:
    pre_flight:
      - read: [STATE.md, AGENT.md]
    
    post_generation:
      - run: {{TEST_COMMAND}}
      - run: {{LINT_COMMAND}}
      - run: {{TYPE_CHECK_COMMAND}}
    
    quality_gates:
      coverage: {{COVERAGE_TARGET}}
      max_function_lines: 10
      max_parameters: 3
      max_nesting: 2
```

---

## 🔄 Adapter Generation

### Command
```bash
gigaspec adapt --tool <tool-name>
```

### Supported Tools
- `claude` - Claude Code
- `cursor` - Cursor IDE
- `kimi` - Kimi CLI
- `copilot` - GitHub Copilot
- `windsurf` - Windsurf IDE
- `generic` - Universal format

### Output
```
.gigaspec/
├── adapters/
│   ├── claude/     # Claude-specific files
│   ├── cursor/     # Cursor-specific files
│   ├── kimi/       # Kimi-specific files
│   └── generic/    # Universal format
└── manifest.json   # Adapter registry
```

---

## 📝 Adapter Manifest

```json
{
  "version": "5.0.0",
  "project": "{{PROJECT_NAME}}",
  "adapters": {
    "claude": {
      "version": "1.0.0",
      "files": [".claude/CLAUDE.md", ".claude/skills/*"],
      "features": ["skills", "subagents", "hooks"]
    },
    "cursor": {
      "version": "1.0.0",
      "files": [".cursorrules", ".cursor/agents/*"],
      "features": ["rules", "agent_mode"]
    },
    "kimi": {
      "version": "1.0.0",
      "files": [".kimi/AGENT.md"],
      "features": ["context_files"]
    }
  }
}
```

---

**Every adapter enforces the same core rules, just in tool-native formats.**
