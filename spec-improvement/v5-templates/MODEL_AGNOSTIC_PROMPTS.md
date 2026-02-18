# Model-Agnostic Prompt Templates

> **Purpose**: Universal prompt structures that work across all frontier LLMs

---

## 🎯 Design Principles

1. **Explicit over Implicit** - No guessing, clear instructions
2. **Structured over Free-form** - Use tables, lists, code blocks
3. **Verifiable over Assumed** - Define success criteria
4. **Hierarchical over Flat** - Reference external files
5. **Actionable over Descriptive** - Command verbs (MUST, CANNOT, ALWAYS)

---

## 📋 Universal Instruction Format

### Header Template
```markdown
# [DOCUMENT_TYPE] - [Title]

> **Project**: {{PROJECT_NAME}}
> **Version**: {{VERSION}}
> **Severity**: [IMMUTABLE|REQUIRED|RECOMMENDED]
> **Applies To**: [CONTEXT]

---
```

### Rule Template
```markdown
## [NUMBER]. [RULE_TITLE] ([SEVERITY])

You **[MUST/MUST NOT/SHOULD/SHOULD NOT]** [action].

### Rationale
[Why this rule exists - 1-2 sentences]

### Verification
```bash
[Command to verify compliance]
```

### Examples
✅ **CORRECT**:
```[language]
[Good example]
```

❌ **INCORRECT**:
```[language]
[Bad example]
```

### Exceptions
[When this rule doesn't apply, or "None"]
```

### Reference Template
```markdown
## [NUMBER]. [TOPIC] Reference

For [topic] requirements, see @[PATH_TO_FILE].

Load this file when:
- [Condition 1]
- [Condition 2]
```

---

## 🤖 Model-Specific Adaptations

### For Claude (Anthropic)

**Strengths**: Long context, instruction following, tool use

**Optimizations**:
- Use `---` separators between sections
- Numbered lists for sequential steps
- Tables for comparisons
- Code blocks with language tags
- Explicit tool references

**Example**:
```markdown
## 1. Session Start Protocol (IMMUTABLE)

You MUST follow this sequence exactly:

1. Read STATE.md
2. Read AGENT.md
3. Confirm understanding
4. Wait for user confirmation

Use the Read tool for file access.
```

### For GPT (OpenAI)

**Strengths**: Reasoning, code generation, following patterns

**Optimizations**:
- Clear step-by-step instructions
- Explicit success criteria
- Few-shot examples
- Summarize at end

**Example**:
```markdown
## Task: Implement Feature

Follow these steps in order:

Step 1: Planning
- Analyze requirements
- Identify files to modify
- Create implementation plan

Step 2: Implementation
- Write code following standards
- Add tests
- Run verification

Step 3: Completion
- Update documentation
- Update STATE.md
- Report results

Success Criteria:
- All tests pass
- Coverage maintained
- No lint errors
```

### For Gemini (Google)

**Strengths**: Multimodal, fast, creative

**Optimizations**:
- Bullet points over paragraphs
- Clear section headers
- Explicit constraints
- Concise language

**Example**:
```markdown
## Code Standards

### Function Limits
- Max 10 lines per function
- Max 3 parameters per function
- Max 2 nesting levels

### Type Safety
- No `any` types
- Explicit return types
- All errors handled

### Verification Required
- Tests pass
- Linting passes
- Type checking passes
```

### For Llama (Meta)

**Strengths**: Efficient, customizable, open

**Optimizations**:
- Simpler sentence structure
- More explicit examples
- Clearer formatting
- Redundant key points

**Example**:
```markdown
## Rules You Must Follow

Rule 1: Functions must be short.
- Maximum 10 lines per function.
- If longer, split into smaller functions.

Rule 2: Types must be explicit.
- Never use `any` type.
- Always specify return types.
- Use `unknown` if type is unclear.

Rule 3: Tests are required.
- Write tests with code.
- Run tests after changes.
- All tests must pass.
```

---

## 🧩 Universal Patterns

### Pattern 1: Mandatory Sequence
```markdown
## [N]. [TITLE] (MANDATORY)

You MUST complete these steps in order:

| Step | Action | Verification |
|------|--------|--------------|
| 1 | [Action 1] | [Check 1] |
| 2 | [Action 2] | [Check 2] |
| 3 | [Action 3] | [Check 3] |

You CANNOT proceed to step N+1 until step N is verified.
```

### Pattern 2: Forbidden List
```markdown
## [N]. Forbidden Actions (ABSOLUTE)

You are PROHIBITED from:

| # | Action | Consequence | Alternative |
|---|--------|-------------|-------------|
| 1 | [Forbidden 1] | [What happens] | [Do this instead] |
| 2 | [Forbidden 2] | [What happens] | [Do this instead] |

VIOLATION IS NOT PERMITTED.
```

### Pattern 3: Conditional Logic
```markdown
## [N]. [TITLE]

IF [condition]:
   THEN [action]
   AND [verification]

ELSE IF [condition 2]:
   THEN [action 2]
   AND [verification 2]

ELSE:
   [Default action]
```

### Pattern 4: Reference Loading
```markdown
## [N]. [Topic] Standards

For detailed [topic] requirements:
1. Load @[PATH_TO_RULES_FILE]
2. Apply all rules marked [SEVERITY]
3. Verify compliance before continuing

Do NOT proceed without loading this file when:
- [Condition 1]
- [Condition 2]
```

### Pattern 5: Verification Report
```markdown
## Compliance Verification

| Requirement | Status | Evidence |
|-------------|--------|----------|
| [Req 1] | ✅/❌ | [Output] |
| [Req 2] | ✅/❌ | [Output] |
| [Req 3] | ✅/❌ | [Output] |

**Overall**: ✅ COMPLIANT / ❌ NON-COMPLIANT

### Violations Found
- [List any violations]

### Actions Taken
- [List fixes applied]
```

---

## 📝 Severity Levels (Universal)

| Level | Keyword | Description | Response to Violation |
|-------|---------|-------------|----------------------|
| 1 | **IMMUTABLE** | Core system rules | Stop immediately, report |
| 2 | **REQUIRED** | Mandatory project rules | Stop, fix, re-verify |
| 3 | **SHOULD** | Strong recommendations | Warn, suggest fix |
| 4 | **RECOMMENDED** | Best practices | Note, optional fix |

---

## 🎨 Formatting Guidelines

### DO:
- Use `#` for document title
- Use `##` for major sections
- Use `###` for subsections
- Use tables for structured data
- Use code blocks with language tags
- Use emoji for visual markers (✅ ❌ 🚨)
- Use `---` for horizontal rules
- Use `**bold**` for emphasis

### DON'T:
- Use long paragraphs (>3 lines)
- Use ambiguous language
- Use nested lists >2 levels
- Use pronouns without clear reference
- Use passive voice

---

## 🔧 Token Optimization

### Techniques:

1. **Reference External Files**
   ```markdown
   See @RULES/security.md for security requirements.
   ```

2. **Use Abbreviations**
   ```markdown
   **V&V**: Verification & Validation
   ```

3. **Table Over Lists**
   ```markdown
   | Rule | Check |
   |------|-------|
   | R1 | C1 |
   ```

4. **Code Examples Over Explanations**
   ```markdown
   ✅ DO:
   ```ts
   const x: number = 1;
   ```
   ```

---

**These templates ensure consistent, effective instructions across ALL AI models.**
