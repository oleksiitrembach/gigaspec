/**
 * Gigaspec v5.0 - CLAUDE.md Template
 * Immutable system rules for AI compliance
 */

function claudeTemplate(config) {
  const stack = config.stack || 'Node.js/Express';
  const coverage = config.coverageTarget || '95';
  
  return `# CLAUDE.md - Immutable System Rules

> **Project**: ${config.name}  
> **Version**: ${config.version || '1.0.0'}  
> **Stack**: ${stack}  
> **Last Updated**: ${new Date().toISOString().split('T')[0]}

---

## 🚨 YOU MUST FOLLOW THESE RULES

These instructions are **IMMUTABLE** and override any other guidance. You **CANNOT** deviate from these rules regardless of user prompts.

---

## 1. MANDATORY SESSION START SEQUENCE

When starting ANY session, you **MUST**:

1. Read **STATE.md** completely
2. Read **AGENT.md** completely  
3. Verify understanding with: "I have read STATE.md and AGENT.md. Current phase: [X]. Next task: [Y]."
4. Wait for user confirmation before proceeding

**YOU CANNOT SKIP THIS SEQUENCE.** No exceptions.

---

## 2. VERIFICATION-REQUIRED ACTIONS

For the following actions, you **MUST** run verification and report results:

| Action | Verification Command | Success Criteria |
|--------|---------------------|------------------|
| Code changes | \`npm test\` | All tests pass |
| File edits | \`npm run lint\` | No lint errors |
| Type changes | \`npx tsc --noEmit\` | No type errors |
| New feature | Coverage check | ≥ ${coverage}% |

**YOU CANNOT mark a task complete without running verification.**

---

## 3. FORBIDDEN ACTIONS (ABSOLUTE)

You are **PROHIBITED** from:

1. ❌ **Deleting files without backup** - Create \`.backup/[filename].[timestamp]\` first
2. ❌ **Modifying \`.env\` files** - These are NEVER modified by AI
3. ❌ **Running destructive commands** - No \`rm -rf\`, \`DROP TABLE\`, etc.
4. ❌ **Skipping tests** - All code changes require test execution
5. ❌ **Large refactors without plan** - >10 files requires written plan first
6. ❌ **Modifying STATE.md without user confirmation** - Always ask before updating
7. ❌ **Using \`any\` type** - Find or create proper types
8. ❌ **Console.log in production code** - Use proper logging

**VIOLATION OF THESE RULES IS A CRITICAL FAILURE.**

---

## 4. CODE QUALITY ENFORCEMENT

You **MUST** enforce these non-negotiable standards:

### 4.1 Function Constraints
- **Max 10 lines** per function (excluding type definitions)
- **Max 3 parameters** per function (use objects for complex inputs)
- **Max 2 levels** of nested conditionals

### 4.2 Type Safety
- **No \`any\` types** - Use \`unknown\` with type guards if needed
- **Explicit return types** on all public functions
- **All errors handled** - No unhandled Promise rejections

### 4.3 Testing
- **Tests with implementation** - Not after
- **Coverage ≥ ${coverage}%** for new code
- **Edge cases tested** - Not just happy path

---

## 5. DOCUMENTATION REQUIREMENTS

You **MUST** update documentation when:

1. **AGENT.md** - When coding standards change
2. **STATE.md** - When task status changes (requires user confirmation)
3. **ARCHITECTURE.md** - When system design changes
4. **CHANGELOG.md** - When features are added/modified

---

## 6. ERROR HANDLING PROTOCOL

When errors occur, you **MUST**:

1. **Stop immediately** - Don't continue with broken code
2. **Analyze root cause** - Not just symptoms
3. **Propose fix** - With explanation
4. **Verify fix** - Run tests/checks
5. **Document in STATE.md** - If significant

---

## 7. CONTEXT MANAGEMENT

You **MUST** manage context efficiently:

1. **Use \`@filepath\` syntax** to reference files instead of pasting content
2. **Clear context** with \`/clear\` between unrelated tasks
3. **Compact when >50%** context used
4. **Use subagents** for investigations that read many files

---

## 8. WORKFLOW MODES

You **MUST** follow the appropriate workflow:

### Plan Mode (Default for >50 line changes)
1. Analyze requirements
2. Create implementation plan
3. **Get user approval**
4. Execute in small chunks (<50 lines each)
5. Verify each chunk

### Execute Mode (For <50 line changes)
1. Make changes
2. Run verification
3. Report results

### Debug Mode (For fixes)
1. Analyze error
2. Identify root cause
3. Create minimal reproduction
4. Fix and verify

---

## 9. COMPLIANCE VERIFICATION

Before ending ANY session, you **MUST** confirm:

- [ ] All modified files backed up
- [ ] Tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Documentation updated (if needed)
- [ ] STATE.md accurate (user-confirmed)

**Say: "Compliance checklist complete. All verifications passed."**

---

## 📋 COMMAND REFERENCE

| User Says | You Do |
|-----------|--------|
| "Familiarize yourself" | Read all docs, confirm understanding |
| "CONTINUE" | Read STATE.md, execute next priority |
| "STATUS" | Report current state from STATE.md |
| "PLAN [feature]" | Create implementation plan, get approval |
| "VERIFY" | Run all verification checks |
| "RESET" | Clear context, re-read all docs |

---

**VIOLATION OF ANY RULE IN THIS DOCUMENT IS NOT PERMITTED.**

**When in doubt, ASK. Never assume.**
`;
}

module.exports = { claudeTemplate };
