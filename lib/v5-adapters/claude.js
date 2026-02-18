/**
 * Gigaspec v5.0 - Claude Code Adapter
 * Generates Claude-specific configuration files
 */

const fs = require('fs-extra');
const path = require('path');

class ClaudeAdapter {
  constructor(config) {
    this.config = config;
    this.outputDir = config.outputDir || '.';
  }

  /**
   * Generate all Claude-specific files
   */
  async generate() {
    const files = [];
    
    // Create .claude directory
    const claudeDir = path.join(this.outputDir, '.claude');
    await fs.ensureDir(claudeDir);
    
    // Generate CLAUDE.md
    const claudeMd = this.generateClaudeMd();
    await fs.writeFile(path.join(claudeDir, 'CLAUDE.md'), claudeMd);
    files.push('.claude/CLAUDE.md');
    
    // Generate skills
    const skillsDir = path.join(claudeDir, 'skills');
    await fs.ensureDir(skillsDir);
    
    const complianceSkill = this.generateComplianceSkill();
    await fs.ensureDir(path.join(skillsDir, 'gigaspec-compliance'));
    await fs.writeFile(
      path.join(skillsDir, 'gigaspec-compliance', 'SKILL.md'),
      complianceSkill
    );
    files.push('.claude/skills/gigaspec-compliance/SKILL.md');
    
    const reviewSkill = this.generateReviewSkill();
    await fs.ensureDir(path.join(skillsDir, 'code-review'));
    await fs.writeFile(
      path.join(skillsDir, 'code-review', 'SKILL.md'),
      reviewSkill
    );
    files.push('.claude/skills/code-review/SKILL.md');
    
    // Generate agents
    const agentsDir = path.join(claudeDir, 'agents');
    await fs.ensureDir(agentsDir);
    
    const securityAgent = this.generateSecurityAgent();
    await fs.writeFile(path.join(agentsDir, 'security-reviewer.md'), securityAgent);
    files.push('.claude/agents/security-reviewer.md');
    
    return { files, outputDir: claudeDir };
  }

  /**
   * Generate .claude/CLAUDE.md
   */
  generateClaudeMd() {
    return `---
# CLAUDE.md - Claude Code Configuration

@import ../../CLAUDE.md

## Claude-Specific Settings

### Tool Usage
- Use MCP tools when available for verification
- Prefer \`Read\` tool for file access
- Use \`Bash\` tool for running commands

### Workflow Preferences
- Use Plan Mode for changes >50 lines
- Create subagents for investigations
- Use skills via \`/skill-name\` command

### Context Management
- Import additional rules via @RULES/[topic].md
- Load skills on demand
- Use \`/compact\` when context >50%

## Available Skills

- \`/gigaspec-compliance\` - Verify code compliance
- \`/code-review\` - Review code for standards

## Available Agents

- \`security-reviewer\` - Security-focused code review
`;
  }

  /**
   * Generate compliance checking skill
   */
  generateComplianceSkill() {
    return `---
name: gigaspec-compliance
description: Verify code against gigaspec standards
tools: [Read, Grep, Bash]
---

# Gigaspec Compliance Checker

Validate code changes against gigaspec standards.

## Checks Performed

1. **Function Length** - Max 10 lines per function
2. **Parameter Count** - Max 3 parameters per function
3. **Nesting Depth** - Max 2 levels of nesting
4. **Type Safety** - No \`any\` types
5. **Test Coverage** - Coverage maintained

## Usage

Run \`/gigaspec-compliance\` after making code changes.

The skill will:
1. Check modified files
2. Run quality gates
3. Report violations
4. Suggest fixes

## Report Format

\`\`\`
## Compliance Report

| Check | Status | Details |
|-------|--------|---------|
| Function Length | ✅ | All functions ≤ 10 lines |
| Parameters | ✅ | All functions ≤ 3 params |
| Nesting | ✅ | Max 2 levels |
| Types | ✅ | No 'any' found |

**Overall**: ✅ COMPLIANT
\`\`\`
`;
  }

  /**
   * Generate code review skill
   */
  generateReviewSkill() {
    return `---
name: code-review
description: Review code for gigaspec compliance
tools: [Read, Grep]
---

# Code Review Skill

Perform comprehensive code review against project standards.

## Review Checklist

- [ ] Read AGENT.md for project standards
- [ ] Check function lengths
- [ ] Verify type safety
- [ ] Review error handling
- [ ] Check test coverage
- [ ] Verify documentation

## Output

Provide detailed review with:
- Line-specific comments
- Severity ratings
- Suggested fixes
- Compliance status
`;
  }

  /**
   * Generate security reviewer agent
   */
  generateSecurityAgent() {
    return `---
name: security-reviewer
description: Security-focused code reviewer
model: sonnet
tools: [Read, Grep, Bash]
---

# Security Reviewer Agent

You are a senior security engineer reviewing code for vulnerabilities.

## Review Focus

1. **Input Validation**
   - Check all user input is validated
   - Verify parameterized queries
   - Look for injection vulnerabilities

2. **Authentication/Authorization**
   - Verify auth on protected endpoints
   - Check authorization logic
   - Look for bypass opportunities

3. **Secrets**
   - No hardcoded credentials
   - No secrets in logs
   - Proper env var usage

4. **Data Protection**
   - Encryption at rest
   - TLS in transit
   - Proper sanitization

## Output Format

| Severity | Issue | Location | Fix |
|----------|-------|----------|-----|
| Critical | [Description] | [File:Line] | [Suggestion] |
| High | [Description] | [File:Line] | [Suggestion] |
| Medium | [Description] | [File:Line] | [Suggestion] |
`;
  }
}

module.exports = { ClaudeAdapter };
