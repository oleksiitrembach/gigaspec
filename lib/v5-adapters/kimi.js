/**
 * Gigaspec v5.0 - Kimi CLI Adapter
 * Generates Kimi CLI-specific configuration files
 */

const fs = require('fs-extra');
const path = require('path');

class KimiAdapter {
  constructor(config) {
    this.config = config;
    this.outputDir = config.outputDir || '.';
  }

  /**
   * Generate all Kimi-specific files
   */
  async generate() {
    const files = [];
    
    // Create .kimi directory
    const kimiDir = path.join(this.outputDir, '.kimi');
    await fs.ensureDir(kimiDir);
    
    // Generate AGENT.md
    const agentMd = this.generateAgentMd();
    await fs.writeFile(path.join(kimiDir, 'AGENT.md'), agentMd);
    files.push('.kimi/AGENT.md');
    
    return { files, outputDir: kimiDir };
  }

  /**
   * Generate .kimi/AGENT.md
   */
  generateAgentMd() {
    const stack = this.config.stack || 'Node.js/Express';
    const coverage = this.config.coverageTarget || '95';
    
    return `# Kimi CLI Configuration - ${this.config.name}

> **Stack**: ${stack}  
> **Coverage Target**: ${coverage}%

---

## Session Start (REQUIRED)

At the start of EVERY session:

1. Read \`../STATE.md\`
2. Read \`../AGENT.md\`
3. Confirm: "I have read STATE.md and AGENT.md. Ready to proceed."

---

## Immutable Rules

### You MUST:
- Write tests with implementation
- Keep functions ≤ 10 lines
- Use explicit types (no 'any')
- Handle all errors
- Run verification after changes

### You MUST NOT:
- Skip tests
- Use 'any' types
- Delete files without backup
- Modify .env files
- Write functions > 10 lines
- Skip error handling

---

## Commands

### Development
- Start: \`npm run dev\`
- Build: \`npm run build\`

### Testing
- Test: \`npm test\`
- Coverage: \`npm run test:coverage\`

### Quality
- Lint: \`npm run lint\`
- Type Check: \`npx tsc --noEmit\`

### Verification (REQUIRED after changes)
\`\`\`bash
npm run lint && npx tsc --noEmit && npm test
\`\`\`

---

## Code Standards

### Functions
- Maximum 10 lines
- Maximum 3 parameters
- Maximum 2 nesting levels

### Types
- Explicit return types
- No 'any' allowed
- Use 'unknown' with guards

### Error Handling
- Explicit error handling
- Result type pattern
- No silent failures

---

## Workflow

### New Feature
1. Read STATE.md
2. Plan changes
3. Get approval if >50 lines
4. Implement with tests
5. Run verification
6. Update STATE.md (confirmed)

### Bug Fix
1. Analyze root cause
2. Write reproduction test
3. Fix bug
4. Verify test passes
5. Run full verification
6. Update STATE.md

---

## Context Files

- \`../CLAUDE.md\` - System rules (immutable)
- \`../AGENT.md\` - Project standards
- \`../STATE.md\` - Project status
- \`../RULES/security.md\` - Security rules
- \`../RULES/testing.md\` - Testing rules
`;
  }
}

module.exports = { KimiAdapter };
