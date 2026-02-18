/**
 * Gigaspec v5.0 Framework
 * The ultimate specification kit with forced compliance
 */

const fs = require('fs-extra');
const path = require('path');
const { v5Templates } = require('./v5-templates');
const { ruleModules, availableModules } = require('./v5-rules');
const { ComplianceVerifier } = require('./v5-compliance/verifier');
const { generateAdapters, getAvailableAdapters } = require('./v5-adapters');

class GigaspecV5Framework {
  constructor(options = {}) {
    this.outputDir = options.outputDir || '.';
    this.verbose = options.verbose || false;
    this.jsonMode = options.jsonMode || false;
    this.config = {
      coverageTarget: options.coverageTarget || 95,
      maxFunctionLines: options.maxFunctionLines || 10,
      maxParameters: options.maxParameters || 3,
      maxNesting: options.maxNesting || 2,
      ...options.config,
    };
  }

  /**
   * Generate v5.0 specification kit
   */
  async generate(userConfig) {
    const config = { ...this.config, ...userConfig };
    const outputDir = path.resolve(this.outputDir);
    await fs.ensureDir(outputDir);

    const files = [];
    const results = {
      version: '5.0.0',
      generatedAt: new Date().toISOString(),
      files: [],
      adapters: {},
    };

    // Generate core documents
    const coreFiles = await this.generateCoreDocuments(outputDir, config);
    files.push(...coreFiles);
    results.files.push(...coreFiles);

    // Generate rule modules
    const ruleFiles = await this.generateRuleModules(outputDir, config);
    files.push(...ruleFiles);
    results.files.push(...ruleFiles);

    // Generate tool adapters
    if (config.adapters !== false) {
      const adapterResults = await this.generateAdapters(outputDir, config);
      results.adapters = adapterResults;
      
      // Collect adapter files
      Object.values(adapterResults).forEach(adapter => {
        if (adapter.files) {
          files.push(...adapter.files);
          results.files.push(...adapter.files);
        }
      });
    }

    // Generate infrastructure
    await this.generateInfrastructure(outputDir, config);

    return {
      files,
      outputDir,
      results,
      config,
    };
  }

  /**
   * Generate core v5.0 documents
   */
  async generateCoreDocuments(outputDir, config) {
    const files = [];

    // CLAUDE.md - Immutable system rules
    const claudeContent = v5Templates.claude(config);
    await fs.writeFile(path.join(outputDir, 'CLAUDE.md'), claudeContent);
    files.push('CLAUDE.md');

    // AGENT.md - Project standards
    const agentContent = v5Templates.agent(config);
    await fs.writeFile(path.join(outputDir, 'AGENT.md'), agentContent);
    files.push('AGENT.md');

    // STATE.md - Living status
    const stateContent = v5Templates.state(config);
    await fs.writeFile(path.join(outputDir, 'STATE.md'), stateContent);
    files.push('STATE.md');

    // ARCHITECTURE.md - System design
    const archContent = this.generateArchitecture(config);
    await fs.writeFile(path.join(outputDir, 'ARCHITECTURE.md'), archContent);
    files.push('ARCHITECTURE.md');

    // PLAN.md - Development roadmap
    const planContent = this.generatePlan(config);
    await fs.writeFile(path.join(outputDir, 'PLAN.md'), planContent);
    files.push('PLAN.md');

    return files;
  }

  /**
   * Generate modular rule modules
   */
  async generateRuleModules(outputDir, config) {
    const files = [];
    const rulesDir = path.join(outputDir, 'RULES');
    await fs.ensureDir(rulesDir);

    // Generate each rule module
    for (const [name, generator] of Object.entries(ruleModules)) {
      const content = generator(config);
      const fileName = `${name}.md`;
      await fs.writeFile(path.join(rulesDir, fileName), content);
      files.push(`RULES/${fileName}`);
    }

    // Generate README for rules
    const readmeContent = this.generateRulesReadme();
    await fs.writeFile(path.join(rulesDir, 'README.md'), readmeContent);
    files.push('RULES/README.md');

    return files;
  }

  /**
   * Generate tool adapters
   */
  async generateAdapters(outputDir, config) {
    const adaptersConfig = {
      ...config,
      outputDir,
    };

    return await generateAdapters(adaptersConfig);
  }

  /**
   * Generate architecture document
   */
  generateArchitecture(config) {
    const stack = config.stack || 'Node.js/Express';
    
    return `# ARCHITECTURE.md - System Design

> **Project**: ${config.name}  
> **Stack**: ${stack}  
> **Last Updated**: ${new Date().toISOString().split('T')[0]}

---

## 📋 Overview

${config.name} is built with ${stack}, using ${config.database} for data storage${config.cache !== 'None needed' ? ` and ${config.cache} for caching` : ''}.

---

## 🏗️ Component Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Mobile App  │  │   API Clients│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │ HTTPS/JSON
┌───────────────────────────▼─────────────────────────────────┐
│                         API LAYER                            │
│                    (${stack})                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Auth     │  │   API      │  │  WebSocket │            │
│  │  Module    │  │  Routes    │  │  Handler   │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
└────────┼───────────────┼───────────────┼────────────────────┘
         │               │               │
         └───────────────┴───────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                        DATA LAYER                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ ${(config.database || 'PostgreSQL').padEnd(10)} │  │ ${config.cache !== 'None needed' ? config.cache : 'No Cache    '} │  │  External  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 💾 Database Schema

Key entities:
- **Users** - Authentication and profiles
- **Sessions** - User sessions and tokens
${config.services?.some(s => s.includes('Stripe')) ? '- **Subscriptions** - Billing and plans\n' : ''}${config.services?.some(s => s.includes('S3') || s.includes('file')) ? '- **Files** - Uploaded file metadata\n' : ''}

---

## 🔌 External Services

${config.services?.map(s => `- **${s}**`).join('\n') || '- None required for MVP'}

---

## 🔒 Security

- JWT-based authentication
- HTTPS only in production
- Input validation at API boundaries
- Parameterized queries (SQL injection prevention)

See @RULES/security.md for detailed security requirements.

---

## 🧪 Testing Strategy

See @RULES/testing.md for detailed testing requirements.

Highlights:
- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Coverage target: ${config.coverageTarget || 95}%
`;
  }

  /**
   * Generate development plan
   */
  generatePlan(config) {
    const weeks = parseInt(config.weeks) || 12;
    
    let phases = '';
    if (weeks <= 4) {
      phases = `| Phase | Weeks | Focus | Milestone |
|-------|-------|-------|-----------|
| 1 | 1-2 | Foundation | Dev environment, core architecture |
| 2 | 3-${weeks} | MVP | Core features working |`;
    } else if (weeks <= 8) {
      phases = `| Phase | Weeks | Focus | Milestone |
|-------|-------|-------|-----------|
| 1 | 1-2 | Foundation | Dev setup, auth, database |
| 2 | 3-5 | Core Features | Main functionality |
| 3 | 6-${weeks} | Polish | Testing, optimization, deployment |`;
    } else {
      phases = `| Phase | Weeks | Focus | Milestone |
|-------|-------|-------|-----------|
| 1 | 1-3 | Foundation | Dev setup, CI/CD, core architecture |
| 2 | 4-7 | Core Features | Main functionality |
| 3 | 8-10 | Integration | External services, polish |
| 4 | 11-${weeks} | Hardening | Testing, performance, launch |`;
    }

    return `# PLAN.md - Development Roadmap

> **Project**: ${config.name}  
> **Duration**: ${weeks} weeks  
> **Stack**: ${config.stack}

---

## 🎯 Project Phases

${phases}

---

## ⚠️ Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep | High | Medium | Strict MVP definition |
| Technical debt | Medium | High | Code reviews, AGENT.md compliance |
| Integration issues | Medium | Medium | Early integration testing |

---

## ✅ Definition of Done

- [ ] Code follows AGENT.md standards
- [ ] Tests written (>${config.coverageTarget || 95}% coverage)
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] STATE.md updated
- [ ] Verification passed
`;
  }

  /**
   * Generate rules README
   */
  generateRulesReadme() {
    const modules = availableModules.map(m => `- **${m}.md** - ${m.charAt(0).toUpperCase() + m.slice(1)} requirements`).join('\n');
    
    return `# Rule Modules

This directory contains modular rule specifications.

## Available Modules

${modules}

## Usage

Reference these modules in your code using the @ syntax:

\`\`\`markdown
For security requirements, see @RULES/security.md
For testing standards, see @RULES/testing.md
\`\`\`

## Adding New Modules

1. Create a new file: \`RULES/[topic].md\`
2. Follow the module template
3. Export from \`lib/v5-rules/[topic].js\`
4. Add to \`lib/v5-rules/index.js\`
`;
  }

  /**
   * Generate infrastructure files
   */
  async generateInfrastructure(outputDir, config) {
    // Create directories
    await fs.ensureDir(path.join(outputDir, 'scripts'));
    await fs.ensureDir(path.join(outputDir, '.hooks'));
    await fs.ensureDir(path.join(outputDir, '.github', 'workflows'));
    await fs.ensureDir(path.join(outputDir, 'prompts'));
    await fs.ensureDir(path.join(outputDir, 'SKILLS'));

    // Validate script
    await fs.writeFile(
      path.join(outputDir, 'scripts', 'verify-compliance.sh'),
      `#!/bin/bash
set -e
echo "🔍 Running compliance verification..."

# Run linting
echo "Running linter..."
npm run lint

# Run type checking
echo "Running type check..."
npx tsc --noEmit

# Run tests
echo "Running tests..."
npm test

echo "✅ Compliance verification passed!"
`,
      { mode: 0o755 }
    );

    // Pre-commit hook
    await fs.writeFile(
      path.join(outputDir, '.hooks', 'pre-commit'),
      `#!/bin/bash
echo "🔍 Running pre-commit checks..."
./scripts/verify-compliance.sh
echo "✅ Pre-commit checks passed!"
`,
      { mode: 0o755 }
    );

    // GitHub Actions workflow
    await fs.writeFile(
      path.join(outputDir, '.github', 'workflows', 'compliance.yml'),
      `name: Compliance
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run compliance verification
      run: ./scripts/verify-compliance.sh
`
    );

    // Prompts
    const prompts = {
      'plan.md': '# Planning Protocol\n1. Read STATE.md\n2. Identify critical path\n3. Create implementation plan\n4. Get user approval\n5. Execute in small chunks',
      'implement.md': '# Implementation Protocol\n1. Write tests first\n2. Implement feature\n3. Run verification\n4. Update STATE.md',
      'verify.md': '# Verification Protocol\n1. Run linting\n2. Run type checking\n3. Run tests\n4. Check coverage\n5. Report results',
      'fix.md': '# Fix Protocol\n1. Analyze error\n2. Identify root cause\n3. Write reproduction test\n4. Fix the bug\n5. Verify fix',
    };

    for (const [name, content] of Object.entries(prompts)) {
      await fs.writeFile(path.join(outputDir, 'prompts', name), content);
    }

    // .env.example
    await fs.writeFile(
      path.join(outputDir, '.env.example'),
      `# ${config.name} Environment
DATABASE_URL=postgresql://user:pass@localhost:5432/${config.name.toLowerCase().replace(/\s+/g, '_')}
SECRET_KEY_BASE=change_in_production
PORT=4000
`
    );

    // .gitignore
    await fs.writeFile(
      path.join(outputDir, '.gitignore'),
      `.ai-temp/
.env
.env.local
.DS_Store
node_modules/
_build/
dist/
.backup/
`
    );
  }

  /**
   * Run compliance verification
   */
  async verify(context = {}) {
    const verifier = new ComplianceVerifier({
      coverageTarget: this.config.coverageTarget,
      maxFunctionLines: this.config.maxFunctionLines,
      maxParameters: this.config.maxParameters,
      maxNesting: this.config.maxNesting,
    });

    return await verifier.verify(context);
  }

  /**
   * Get framework info
   */
  static getInfo() {
    return {
      version: '5.0.0',
      name: 'Gigaspec Ultimate',
      description: 'AI specification framework with forced compliance',
      features: [
        'Immutable system rules (CLAUDE.md)',
        'Project standards (AGENT.md)',
        'Living status tracking (STATE.md)',
        'Modular rule system (RULES/)',
        'Automated verification',
        'Multi-tool adapters (Claude, Cursor, Kimi)',
        'Model-agnostic design',
      ],
      adapters: getAvailableAdapters(),
      ruleModules: availableModules,
    };
  }
}

module.exports = { GigaspecV5Framework };
