/**
 * Gigaspec v5.0 - Cursor Adapter
 * Generates Cursor-specific configuration files
 */

const fs = require('fs-extra');
const path = require('path');

class CursorAdapter {
  constructor(config) {
    this.config = config;
    this.outputDir = config.outputDir || '.';
  }

  /**
   * Generate all Cursor-specific files
   */
  async generate() {
    const files = [];
    
    // Generate .cursorrules
    const cursorRules = this.generateCursorRules();
    await fs.writeFile(path.join(this.outputDir, '.cursorrules'), cursorRules);
    files.push('.cursorrules');
    
    // Create .cursor directory
    const cursorDir = path.join(this.outputDir, '.cursor');
    await fs.ensureDir(cursorDir);
    await fs.ensureDir(path.join(cursorDir, 'agents'));
    
    // Generate agent
    const agent = this.generateAgent();
    await fs.writeFile(path.join(cursorDir, 'agents', 'gigaspec-agent.md'), agent);
    files.push('.cursor/agents/gigaspec-agent.md');
    
    return { files, outputDir: cursorDir };
  }

  /**
   * Generate .cursorrules file
   */
  generateCursorRules() {
    const stack = this.config.stack || 'Node.js/Express';
    const coverage = this.config.coverageTarget || '95';
    
    return `# Cursor Rules - ${this.config.name}

## Always

1. Read STATE.md first before any work
2. Read AGENT.md before writing code
3. Follow CLAUDE.md immutable rules strictly
4. Run tests after any code changes
5. Update STATE.md when task complete (user-confirmed)
6. Verify linting passes
7. Verify type checking passes
8. Write tests with implementation

## Never

1. Skip test execution
2. Use \`any\` types
3. Delete files without backup
4. Modify .env files
5. Write functions > 10 lines
6. Skip error handling
7. Use console.log in production code
8. Modify STATE.md without user confirmation

## Code Style

### Functions
- Max 10 lines per function
- Max 3 parameters per function (use objects)
- Max 2 levels of nested conditionals

### Types
- No \`any\` types allowed
- Explicit return types on public functions
- Use \`unknown\` with type guards when needed

### Error Handling
- Always handle errors explicitly
- Use Result types: { success: true, data: T } | { success: false, error: E }
- Never throw for expected errors

## Stack: ${stack}

### Commands
- Test: npm test
- Lint: npm run lint
- Type Check: npx tsc --noEmit
- Coverage: npm run test:coverage

### Quality Gates
- Coverage ≥ ${coverage}%
- All tests passing
- No lint errors
- No type errors

## Workflow

### For New Features
1. Read STATE.md
2. Check AGENT.md for patterns
3. Plan implementation
4. Get user approval if >50 lines
5. Implement in small chunks
6. Test each chunk
7. Update STATE.md

### For Bug Fixes
1. Read STATE.md
2. Analyze root cause
3. Write reproduction test
4. Fix the bug
5. Verify test passes
6. Run full test suite
7. Update STATE.md

## Agent Mode

When in Agent Mode:
- Follow all rules above
- Use gigaspec agent for compliance
- Run verification after each file
- Report compliance status
`;
  }

  /**
   * Generate Cursor agent definition
   */
  generateAgent() {
    return `# Gigaspec Agent for Cursor

## Role

You are a gigaspec-compliant coding agent for ${this.config.name}.

## Pre-Flight (REQUIRED)

Before any coding:
1. Check STATE.md for current task
2. Read AGENT.md for project standards
3. Verify understanding of requirements

## Coding Standards

### Function Constraints
- Max 10 lines per function
- Max 3 parameters per function
- Max 2 nesting levels

### Type Safety
- No 'any' types
- Explicit return types
- Handle all errors

### Testing
- Write tests with code
- Maintain coverage
- Test edge cases

## Post-Flight (REQUIRED)

After coding:
1. Run tests
2. Run linting
3. Run type checking
4. Report compliance status
5. Update STATE.md (user-confirmed)

## Compliance Report Template

\`\`\`
## Compliance Report

| Check | Status |
|-------|--------|
| Tests | ✅/❌ |
| Lint | ✅/❌ |
| Types | ✅/❌ |
| Coverage | ✅/❌ |

**Overall**: ✅ COMPLIANT / ❌ NON-COMPLIANT
\`\`\`
`;
  }
}

module.exports = { CursorAdapter };
