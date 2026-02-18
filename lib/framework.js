/**
 * Gigaspec AI Collaboration Framework
 * 
 * This framework provides structure for AI assistants to:
 * 1. Analyze project requirements
 * 2. Ask clarifying questions
 * 3. Make intelligent recommendations
 * 4. Generate complete specifications
 * 
 * The AI does the thinking. This framework provides the structure.
 */

const fs = require('fs-extra');
const path = require('path');
const templates = require('./templates');
const { GigaspecV5Framework } = require('./v5-framework');

// Inquirer is ESM-only in v9+, so we need dynamic import
let inquirer;
async function getInquirer() {
  if (!inquirer) {
    const mod = await import('inquirer');
    inquirer = mod.default;
  }
  return inquirer;
}

// ============================================================================
// ANALYSIS PROMPTS - For LLM to analyze requirements
// ============================================================================

const ANALYSIS_PROMPT = `You are a Staff+ Engineer and Technical Architect.
Your task is to analyze a project description and make intelligent technical decisions.

PROJECT DESCRIPTION:
{{DESCRIPTION}}

{{CONTEXT}}

Analyze this project deeply. Consider:

1. WHAT is being built? (Core functionality, user flows)
2. WHO are the users? (End users, admins, scale)
3. WHAT are the constraints? (Performance, security, compliance)
4. WHAT are the integrations? (External APIs, services)
5. WHAT is the timeline and team size?

Based on your analysis, answer these questions:

--- ANALYSIS ---

Core Purpose: [What is the fundamental problem being solved?]

User Types: [Who will use this? How many?]

Key Features: [What are the 3-5 most important features?]

Technical Challenges: [What will be hardest to build?]

Scale Expectations: [How many users? What traffic?]

--- TECHNICAL DECISIONS ---

Recommended Stack: [Language/Framework with specific version]
Why: [Explain your reasoning based on the analysis]

Alternative Stacks: [2 other options with pros/cons]

Database: [Which database and why]

Cache Strategy: [What to cache and how]

External Services: [What 3rd party services are needed?]

Deployment Platform: [Where to deploy and why]

--- QUESTIONS FOR USER ---

What questions do you have that would help you make better recommendations?
List 3-5 specific questions.

--- CONFIDENCE ---

How confident are you in these recommendations? (High/Medium/Low)
What information would increase your confidence?
`;

const QUESTION_ANSWER_PROMPT = `You previously analyzed this project:

{{DESCRIPTION}}

And asked these questions:
{{QUESTIONS}}

The user has answered:
{{ANSWERS}}

Based on these answers, refine your technical recommendations:

--- REFINED ANALYSIS ---
[Update your analysis with new information]

--- FINAL TECHNICAL STACK ---
Stack: [Final decision with version]
Frontend: [If applicable]
Database: [Final decision]
Cache: [Final decision]
Services: [List of external services]
Deployment: [Final platform]

--- RATIONALE ---
[Explain why you made these specific choices]

--- TIMELINE BREAKDOWN ---
[Break down {{WEEKS}} weeks into phases with milestones]

--- RISKS & MITIGATION ---
[What could go wrong and how to prevent it]
`;

// ============================================================================
// INTERACTIVE QUESTIONS
// ============================================================================

const PROJECT_QUESTIONS = [
  {
    type: 'input',
    name: 'name',
    message: '📛 Project name:',
    default: 'MyProject',
    validate: (input) => input.trim().length > 0 || 'Project name is required'
  },
  {
    type: 'input',
    name: 'description',
    message: '📝 Brief description:',
    default: (answers) => `${answers.name} - A new software project`
  },
  {
    type: 'list',
    name: 'team',
    message: '👥 Team size:',
    choices: ['Solo (1)', 'Small (2-5)', 'Medium (6-10)', 'Large (10+)'],
    default: 'Small (2-5)'
  },
  {
    type: 'list',
    name: 'weeks',
    message: '⏱️ Timeline:',
    choices: ['4 weeks', '8 weeks', '12 weeks', '16 weeks', '20+ weeks'],
    default: '12 weeks'
  },
  {
    type: 'input',
    name: 'targetUsers',
    message: '🎯 Target users (e.g., "students", "developers", "small businesses"):',
    default: 'general users'
  },
  {
    type: 'confirm',
    name: 'needsRealtime',
    message: '⚡ Does this need real-time features (chat, live updates)?',
    default: false
  },
  {
    type: 'confirm',
    name: 'needsAuth',
    message: '🔐 Does this need user authentication?',
    default: true
  },
  {
    type: 'confirm',
    name: 'needsPayments',
    message: '💳 Does this need payment processing?',
    default: false
  },
  {
    type: 'list',
    name: 'scale',
    message: '📈 Expected scale at launch:',
    choices: ['< 100 users', '100 - 1,000 users', '1,000 - 10,000 users', '10,000+ users'],
    default: '100 - 1,000 users'
  }
];

const STACK_QUESTIONS = [
  {
    type: 'list',
    name: 'stack',
    message: '🛠️ Backend stack:',
    choices: [
      'Node.js/Express',
      'Node.js/NestJS',
      'Python/FastAPI',
      'Python/Django',
      'Elixir/Phoenix',
      'Go/Gin',
      'Ruby on Rails',
      'Java/Spring Boot',
      'Other'
    ],
    default: 'Node.js/Express'
  },
  {
    type: 'list',
    name: 'frontend',
    message: '🎨 Frontend:',
    choices: [
      'React/Next.js',
      'React/Vite',
      'Vue/Nuxt',
      'Vue/Vite',
      'Svelte/SvelteKit',
      'Angular',
      'HTMX + Templates',
      'React Native',
      'Flutter',
      'None (API only)'
    ],
    default: 'React/Next.js'
  },
  {
    type: 'list',
    name: 'database',
    message: '💾 Database:',
    choices: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'SQLite',
      'Supabase',
      'Firebase',
      'DynamoDB'
    ],
    default: 'PostgreSQL'
  },
  {
    type: 'list',
    name: 'cache',
    message: '⚡ Cache:',
    choices: [
      'Redis',
      'Memcached',
      'None needed'
    ],
    default: 'Redis'
  },
  {
    type: 'list',
    name: 'deployment',
    message: '🚀 Deployment platform:',
    choices: [
      'Vercel',
      'Railway',
      'Fly.io',
      'AWS',
      'Google Cloud',
      'Azure',
      'DigitalOcean',
      'Heroku',
      'Self-hosted'
    ],
    default: 'Railway'
  }
];

// ============================================================================
// FRAMEWORK API
// ============================================================================

class GigaspecFramework {
  constructor(options = {}) {
    this.outputDir = options.outputDir || '.';
    this.verbose = options.verbose || false;
    this.jsonMode = options.jsonMode || false;
  }

  /**
   * Output data (text or JSON based on mode)
   */
  output(data) {
    if (this.jsonMode) {
      return data;
    }
    return data;
  }

  /**
   * Step 1: Create analysis prompt for LLM
   * The AI uses this to analyze requirements
   */
  createAnalysisPrompt(description, context = {}) {
    let prompt = ANALYSIS_PROMPT
      .replace('{{DESCRIPTION}}', description)
      .replace('{{WEEKS}}', context.weeks || '12');

    if (context.previousAnalysis) {
      prompt = prompt.replace(
        '{{CONTEXT}}',
        `\nPREVIOUS ANALYSIS:\n${context.previousAnalysis}\n`
      );
    } else {
      prompt = prompt.replace('{{CONTEXT}}', '');
    }

    return prompt;
  }

  /**
   * Step 2: Create question-answer prompt for LLM
   * After AI asks questions, user answers, AI refines recommendations
   */
  createRefinementPrompt(description, questions, answers, weeks = 12) {
    return QUESTION_ANSWER_PROMPT
      .replace('{{DESCRIPTION}}', description)
      .replace('{{QUESTIONS}}', questions.map((q, i) => `${i + 1}. ${q}`).join('\n'))
      .replace('{{ANSWERS}}', answers.map((a, i) => `${i + 1}. ${a}`).join('\n'))
      .replace('{{WEEKS}}', weeks);
  }

  /**
   * Step 3: Parse AI analysis output
   * Extract structured data from LLM response
   */
  parseAnalysis(aiResponse) {
    const sections = this._extractSections(aiResponse);
    
    return {
      analysis: {
        corePurpose: sections['Core Purpose'] || '',
        userTypes: sections['User Types'] || '',
        keyFeatures: sections['Key Features'] || '',
        technicalChallenges: sections['Technical Challenges'] || '',
        scaleExpectations: sections['Scale Expectations'] || ''
      },
      recommendations: {
        stack: this._extractValue(sections['Recommended Stack']),
        stackReasoning: sections['Why'] || '',
        alternatives: sections['Alternative Stacks'] || '',
        database: this._extractValue(sections['Database']),
        cache: this._extractValue(sections['Cache Strategy']),
        services: this._extractList(sections['External Services']),
        deployment: this._extractValue(sections['Deployment Platform'])
      },
      questions: this._extractList(sections['Questions for User']),
      confidence: this._extractValue(sections['Confidence'])
    };
  }

  /**
   * Step 4: Parse refined recommendations
   */
  parseRefinement(aiResponse) {
    const sections = this._extractSections(aiResponse);
    
    return {
      stack: this._extractValue(sections['Stack']),
      frontend: this._extractValue(sections['Frontend']),
      database: this._extractValue(sections['Database']),
      cache: this._extractValue(sections['Cache']),
      services: this._extractList(sections['Services']),
      deployment: this._extractValue(sections['Deployment']),
      rationale: sections['Rationale'] || '',
      timeline: this._extractPhases(sections['Timeline Breakdown']),
      risks: sections['Risks & Mitigation'] || ''
    };
  }

  /**
   * Step 5: Interactive project setup
   * Asks user questions to gather requirements
   */
  async interactiveSetup() {
    const inq = await getInquirer();
    
    // Step 1: Project basics
    const basics = await inq.prompt(PROJECT_QUESTIONS);
    
    // Parse weeks from selection
    const weeksMatch = basics.weeks.match(/(\d+)/);
    const weeks = weeksMatch ? parseInt(weeksMatch[1]) : 12;
    
    // Step 2: Stack selection (or AI recommendation)
    const useAI = await inq.prompt([{
      type: 'confirm',
      name: 'useAI',
      message: '🤖 Would you like AI to recommend the tech stack based on your requirements?',
      default: true
    }]);
    
    let stackConfig;
    
    if (useAI.useAI) {
      // Return partial config for AI analysis
      return {
        mode: 'ai_analysis',
        config: {
          name: basics.name,
          description: basics.description,
          team: basics.team,
          weeks: weeks,
          targetUsers: basics.targetUsers,
          needsRealtime: basics.needsRealtime,
          needsAuth: basics.needsAuth,
          needsPayments: basics.needsPayments,
          scale: basics.scale
        }
      };
    } else {
      // Manual stack selection
      stackConfig = await inq.prompt(STACK_QUESTIONS);
    }
    
    // Step 3: Additional services
    const services = [];
    if (basics.needsAuth) services.push('Authentication (Clerk/Auth0)');
    if (basics.needsPayments) services.push('Stripe (payments)');
    
    const additionalServices = await inq.prompt([{
      type: 'checkbox',
      name: 'extras',
      message: '📦 Additional services:',
      choices: [
        'Email (SendGrid/Resend)',
        'File Storage (S3/R2)',
        'Analytics (PostHog/Amplitude)',
        'Error Tracking (Sentry)',
        'Search (Algolia/Meilisearch)',
        'CMS (Sanity/Strapi)',
        'Real-time (Pusher/Ably)'
      ]
    }]);
    
    services.push(...additionalServices.extras);
    
    return {
      mode: 'complete',
      config: {
        name: basics.name,
        description: basics.description,
        team: basics.team,
        weeks: weeks,
        stack: stackConfig?.stack || 'Node.js/Express',
        frontend: stackConfig?.frontend || 'React/Next.js',
        database: stackConfig?.database || 'PostgreSQL',
        cache: stackConfig?.cache || 'Redis',
        deployment: stackConfig?.deployment || 'Railway',
        services: services,
        requirements: {
          targetUsers: basics.targetUsers,
          needsRealtime: basics.needsRealtime,
          needsAuth: basics.needsAuth,
          needsPayments: basics.needsPayments,
          scale: basics.scale
        }
      }
    };
  }

  /**
   * Step 6: Generate all specification files
   * Uses AI's recommendations to generate docs
   */
  async generate(config) {
    // Use v5.0 if specified
    if (config.version === '5.0' || config.v5) {
      const v5Framework = new GigaspecV5Framework({
        outputDir: this.outputDir,
        verbose: this.verbose,
        jsonMode: this.jsonMode,
        config: {
          coverageTarget: config.coverageTarget || 95,
        }
      });
      return await v5Framework.generate(config);
    }

    // Legacy v4.0 generation
    const outputDir = path.resolve(this.outputDir);
    await fs.ensureDir(outputDir);

    const files = [];
    const docs = [
      { name: 'AGENT.md', template: 'agent' },
      { name: 'ARCHITECTURE.md', template: 'architecture' },
      { name: 'PLAN.md', template: 'plan' },
      { name: 'STATE.md', template: 'state' },
      { name: 'WORKFLOW.md', template: 'workflow' },
      { name: 'SETUP.md', template: 'setup' },
      { name: 'DEPLOYMENT.md', template: 'deployment' },
      { name: 'ENVIRONMENT.md', template: 'environment' },
      { name: 'GETTING_STARTED.md', template: 'gettingStarted' }
    ];

    for (const doc of docs) {
      const content = templates[doc.template](config);
      const filePath = path.join(outputDir, doc.name);
      await fs.writeFile(filePath, content);
      files.push(doc.name);
    }

    // Generate infrastructure
    await this._generateInfrastructure(outputDir, config);

    return { files, outputDir };
  }

  /**
   * Create structured output for AI assistant
   */
  createStructuredOutput(analysis, recommendations, config) {
    return {
      version: '4.0.0',
      generatedAt: new Date().toISOString(),
      
      project: {
        name: config.name,
        description: config.description,
        team: config.team,
        weeks: config.weeks
      },
      
      analysis: analysis,
      
      recommendations: {
        stack: recommendations.stack,
        frontend: recommendations.frontend,
        database: recommendations.database,
        cache: recommendations.cache,
        services: recommendations.services,
        deployment: recommendations.deployment,
        rationale: recommendations.rationale
      },
      
      timeline: recommendations.timeline,
      
      risks: recommendations.risks,
      
      nextSteps: [
        'Review AI analysis and recommendations',
        'Approve or modify technical stack',
        'Generate specification files',
        'Begin development following PLAN.md'
      ]
    };
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  _extractSections(text) {
    const sections = {};
    const lines = text.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      // Match section headers like "--- Section Name ---" or "-- Section Name --"
      const sectionMatch = line.match(/^---\s*([^-][^\n-]*?)\s*---$/);
      
      if (sectionMatch) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = sectionMatch[1].trim();
        currentContent = [];
      } else if (currentSection && line.trim()) {
        currentContent.push(line);
      }
    }

    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  _extractValue(text) {
    if (!text) return '';
    // Extract value after colon or first line
    const match = text.match(/:\s*(.+)/);
    return match ? match[1].trim() : text.split('\n')[0].trim();
  }

  _extractList(text) {
    if (!text) return [];
    return text
      .split('\n')
      .map(line => line.replace(/^[-*\d.\s]+/, '').trim())
      .filter(line => line.length > 0);
  }

  _extractPhases(text) {
    if (!text) return [];
    const phases = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      const phaseMatch = line.match(/Phase\s*\d+.*?:\s*(.+)/i);
      if (phaseMatch) {
        phases.push(phaseMatch[1].trim());
      }
    }
    
    return phases;
  }

  async _generateInfrastructure(outputDir, config) {
    // Create directories
    await fs.ensureDir(path.join(outputDir, 'scripts'));
    await fs.ensureDir(path.join(outputDir, '.hooks'));
    await fs.ensureDir(path.join(outputDir, '.github', 'workflows'));
    await fs.ensureDir(path.join(outputDir, 'prompts'));

    // Validate script
    await fs.writeFile(
      path.join(outputDir, 'scripts', 'validate-state.sh'),
      `#!/bin/bash\nset -e\nif [ ! -f "STATE.md" ]; then\n  echo "❌ STATE.md not found"\n  exit 1\nfi\necho "✅ STATE.md valid"\n`,
      { mode: 0o755 }
    );

    // Pre-commit hook
    await fs.writeFile(
      path.join(outputDir, '.hooks', 'pre-commit'),
      `#!/bin/bash\necho "🔍 Running checks..."\nif [ -f "scripts/validate-state.sh" ]; then\n  ./scripts/validate-state.sh\nfi\necho "✅ Checks passed"\n`,
      { mode: 0o755 }
    );

    // GitHub Actions
    await fs.writeFile(
      path.join(outputDir, '.github', 'workflows', 'ai-compliance.yml'),
      `name: Spec Validation\non: [push, pull_request]\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - run: ./scripts/validate-state.sh\n`
    );

    // Prompts
    const prompts = {
      'plan.md': '# Planning Protocol\nRead STATE.md → Identify critical path → Output: Assessment → Chunks → Checklist',
      'implement.md': '# Implementation Protocol\nPhase A: Interface → Phase B: Logic → Phase C: Fault tolerance',
      'verify.md': '# Verification Protocol\nStatic analysis → Tests → AGENT.md compliance',
      'fix.md': '# Fix Protocol\nInput: Violation + Code → Output: Before/After diff'
    };

    for (const [name, content] of Object.entries(prompts)) {
      await fs.writeFile(path.join(outputDir, 'prompts', name), content);
    }

    // .cursorrules
    await fs.writeFile(
      path.join(outputDir, '.cursorrules'),
      `# ${config.name} - Cursor Rules\n## ALWAYS\n1. Read STATE.md first\n2. Check AGENT.md constraints\n3. Max 10 lines per function\n## NEVER\n1. Skip verification\n2. Update STATE.md without CONFIRMED\n## COMMANDS\n- "Familiarize yourself" - Read all docs\n- "CONTINUE" - Next task from STATE.md\n- "STATUS" - Current state\n`
    );

    // CLAUDE.md
    await fs.writeFile(
      path.join(outputDir, 'CLAUDE.md'),
      `# ${config.name} - Claude Code Guide\n## Session Start\n1. Read STATE.md completely\n2. Check AGENT.md constraints\n3. Identify next task\n## Stack: ${config.stack}\n`
    );

    // .env.example
    await fs.writeFile(
      path.join(outputDir, '.env.example'),
      `# ${config.name} Environment\nDATABASE_URL=postgresql://user:pass@localhost:5432/${config.name.toLowerCase().replace(/\s+/g, '_')}\nSECRET_KEY_BASE=change_in_production\nPORT=4000\n`
    );

    // .gitignore
    await fs.writeFile(
      path.join(outputDir, '.gitignore'),
      `.ai-temp/\n.env\n.env.local\n.DS_Store\nnode_modules/\n_build/\ndist/\n`
    );
  }
}

// ============================================================================
// CLI COMMANDS
// ============================================================================

async function initCommand(options, brand) {
  const framework = new GigaspecFramework({ 
    outputDir: options.output,
    jsonMode: options.json 
  });

  // JSON mode: skip branding, output structured data
  if (!options.json) {
    brand.title();
    brand.header('Gigaspec - AI Collaboration Framework');
    brand.footer();
  }

  let config;
  let result;

  // Mode 1: Non-interactive with stack provided (highest priority)
  if (options.stack) {
    if (!options.json) {
      brand.step(1, 3, 'Using provided stack configuration');
    }
    
    config = {
      name: options.name || 'MyProject',
      description: options.description || `${options.name || 'MyProject'} - A new software project`,
      stack: options.stack,
      frontend: options.frontend || 'React/Next.js',
      database: options.database || 'PostgreSQL',
      cache: options.cache || 'Redis',
      services: options.services ? options.services.split(',') : [],
      deployment: options.deploy || 'Railway',
      weeks: parseInt(options.weeks) || 12,
      team: options.team || '2-5'
    };
  }
  // Mode 2: Non-interactive with defaults (--yes)
  else if (options.yes) {
    if (!options.json) {
      brand.step(1, 3, 'Using default configuration');
    }
    
    config = {
      name: options.name || 'MyProject',
      description: options.description || `${options.name || 'MyProject'} - A new software project`,
      stack: 'Node.js/Express',
      frontend: 'React/Next.js',
      database: 'PostgreSQL',
      cache: 'Redis',
      services: [],
      deployment: 'Railway',
      weeks: parseInt(options.weeks) || 12,
      team: options.team || '2-5'
    };
  }
  // Mode 3: JSON mode with description only (for AI consumption)
  else if (options.json && options.description) {
    const analysisPrompt = framework.createAnalysisPrompt(options.description, {
      weeks: options.weeks || '12'
    });
    
    result = {
      status: 'analysis_required',
      message: 'AI analysis needed',
      prompt: analysisPrompt,
      nextSteps: [
        'Analyze the project requirements',
        'Ask clarifying questions',
        'Recommend technical stack',
        'Run: gigaspec generate --config <config>'
      ]
    };
    
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
  // Mode 4: No stack provided - show help
  else if (!options.json && !options.name) {
    // User ran 'gigaspec init' with no options
    // Header already shown above, just show help
    console.log('\n' + brand.bold('🤔 No stack specified!'));
    console.log('\nHere are your options:\n');
    
    console.log(brand.cyan('Option 1: Interactive Wizard (Recommended)'));
    console.log('  gigaspec wizard');
    console.log('  → Answer questions, get AI stack recommendation\n');
    
    console.log(brand.cyan('Option 2: Analyze First'));
    console.log('  gigaspec analyze "Your project idea" --json');
    console.log('  → Give prompt to AI assistant for stack recommendation');
    console.log('  → Then: gigaspec init --name "MyApp" --stack "RecommendedStack"\n');
    
    console.log(brand.cyan('Option 3: Use Defaults'));
    console.log('  gigaspec init --name "MyApp" --yes');
    console.log('  → Uses Node.js/Express with defaults\n');
    
    console.log(brand.cyan('Option 4: Specify Stack'));
    console.log('  gigaspec init --name "MyApp" --stack "Node.js/Next.js"');
    console.log('  → Common stacks: Node.js/Next.js, Python/FastAPI, Elixir/Phoenix\n');
    
    console.log(brand.bold('💡 Tip:'));
    console.log('If you\'re unsure about your stack, use Option 1 or 2!\n');
    
    return { status: 'help_shown' };
  }
  // Mode 5: Interactive mode (has name but no stack/yes)
  else if (!options.json) {
    brand.step(1, 3, 'Interactive project setup');
    
    const setup = await framework.interactiveSetup();
    
    if (setup.mode === 'ai_analysis') {
      // Generate analysis prompt for AI
      const description = `${setup.config.name}: ${setup.config.description}
Target users: ${setup.config.targetUsers}
Needs realtime: ${setup.config.needsRealtime}
Needs auth: ${setup.config.needsAuth}
Needs payments: ${setup.config.needsPayments}
Expected scale: ${setup.config.scale}`;
      
      const analysisPrompt = framework.createAnalysisPrompt(description, {
        weeks: setup.config.weeks
      });
      
      // Save prompt
      const promptPath = path.join(options.output, '.ai-temp');
      await fs.ensureDir(promptPath);
      await fs.writeFile(
        path.join(promptPath, 'analysis-prompt.txt'),
        analysisPrompt
      );
      
      brand.step(2, 3, 'AI analysis required');
      console.log(`\n  ${brand.infoColor('Analysis prompt saved to:')} .ai-temp/analysis-prompt.txt`);
      console.log(`\n  ${brand.warnColor('Next:')} Provide this prompt to your AI assistant`);
      console.log(`  ${brand.infoColor('The AI will analyze and recommend a technical stack')}`);
      console.log(`\n  ${brand.infoColor('After AI analysis, run:')}`);
      console.log(`  ${brand.cyan('gigaspec generate --config .ai-temp/config.json')}`);
      
      // Save partial config for later
      await fs.writeFile(
        path.join(promptPath, 'project-config.json'),
        JSON.stringify(setup.config, null, 2)
      );
      
      return { 
        status: 'awaiting_ai_analysis',
        config: setup.config,
        promptPath: '.ai-temp/analysis-prompt.txt'
      };
    }
    
    config = setup.config;
  }
  // Mode 5: JSON mode without description (error)
  else {
    const error = {
      status: 'error',
      message: 'JSON mode requires either --stack, --yes, or --description for analysis'
    };
    console.log(JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  // Generate files
  if (!options.json) {
    brand.step(3, 3, 'Generating specification files');
  }
  
  const genResult = await framework.generate(config);
  
  if (options.json) {
    result = {
      status: 'success',
      message: 'Specification framework ready',
      files: genResult.files,
      config: config
    };
    console.log(JSON.stringify(result, null, 2));
  } else {
    brand.divider();
    brand.success('Specification framework ready!');
    brand.divider();

    console.log('\n' + brand.bold('📁 Generated Files:'));
    genResult.files.forEach(f => console.log(`  ${brand.successColor('✓')} ${f}`));

    console.log('\n' + brand.bold('⭐ START HERE:'));
    console.log(`  ${brand.cyan('GETTING_STARTED.md')} - Your step-by-step guide`);

    console.log('\n' + brand.bold('🤖 For AI Assistants:'));
    console.log(`  1. Read ${brand.cyan('AGENT.md')} for coding standards`);
    console.log(`  2. Check ${brand.cyan('STATE.md')} for current status`);
    console.log(`  3. Run ${brand.cyan('gigaspec status')} to check progress`);

    console.log('\n' + brand.bold('🚀 Quick Commands:'));
    console.log(`  ${brand.cyan('gigaspec status')}     - Check what to do next`);
    console.log(`  ${brand.cyan('cat STATE.md')}       - View current status`);
    console.log(`  ${brand.cyan('cat GETTING_STARTED.md')} - Read the full guide`);
    
    console.log('\n' + brand.bold('💡 Next Step:'));
    console.log(`  Run ${brand.cyan('gigaspec status')} to see your first task!`);
  }

  return { files: genResult.files, config };
}

async function analyzeCommand(description, options, brand) {
  const framework = new GigaspecFramework({ jsonMode: options.json });
  
  const prompt = framework.createAnalysisPrompt(description, {
    weeks: options.weeks || '12'
  });

  if (options.json) {
    console.log(JSON.stringify({ 
      status: 'success',
      prompt,
      metadata: {
        description,
        weeks: options.weeks || '12',
        generatedAt: new Date().toISOString()
      }
    }, null, 2));
  } else {
    console.log(prompt);
  }
}

async function generateCommand(options, brand) {
  const framework = new GigaspecFramework({ 
    outputDir: options.output,
    jsonMode: options.json 
  });

  // Load config from file or options
  let config;
  if (options.config) {
    try {
      config = await fs.readJson(options.config);
      // Ensure all required fields have defaults
      config.name = config.name || 'MyProject';
      config.description = config.description || `${config.name} - A new software project`;
      config.stack = config.stack || 'Node.js/Express';
      config.frontend = config.frontend || 'React/Next.js';
      config.database = config.database || 'PostgreSQL';
      config.cache = config.cache || 'Redis';
      config.services = config.services || [];
      config.deployment = config.deployment || 'Railway';
      config.weeks = config.weeks || 12;
    } catch (err) {
      const error = {
        status: 'error',
        message: `Failed to load config: ${err.message}`
      };
      if (options.json) {
        console.log(JSON.stringify(error, null, 2));
      } else {
        brand.error(error.message);
      }
      process.exit(1);
      return; // For tests that mock process.exit
    }
  } else {
    config = {
      name: options.name || 'MyProject',
      description: options.description || `${options.name || 'MyProject'} - A new software project`,
      stack: options.stack || 'Node.js/Express',
      frontend: options.frontend || 'React/Next.js',
      database: options.database || 'PostgreSQL',
      cache: options.cache || 'Redis',
      services: options.services ? options.services.split(',') : [],
      deployment: options.deploy || 'Railway',
      weeks: parseInt(options.weeks) || 12
    };
  }

  // Enable v5.0 if requested
  if (options.v5) {
    config.v5 = true;
    config.version = '5.0';
  }

  if (!options.json) {
    if (options.v5) {
      brand.step(1, 1, 'Generating Gigaspec v5.0 (Ultimate Spec Kit)');
    } else {
      brand.step(1, 1, 'Generating specification files');
    }
  }
  
  const result = await framework.generate(config);

  if (options.json) {
    console.log(JSON.stringify({
      status: 'success',
      files: result.files,
      config,
      generatedAt: new Date().toISOString()
    }, null, 2));
  } else {
    brand.divider();
    if (options.v5) {
      brand.success('Gigaspec v5.0 generated!');
      brand.divider();
      console.log(chalk.cyan('\n🚀 Gigaspec v5.0 Features:'));
      console.log('  ' + brand.successColor('✓') + ' Immutable system rules (CLAUDE.md)');
      console.log('  ' + brand.successColor('✓') + ' Automated compliance verification');
      console.log('  ' + brand.successColor('✓') + ' Multi-tool adapters (Claude, Cursor, Kimi)');
      console.log('  ' + brand.successColor('✓') + ' Model-agnostic design');
      console.log('  ' + brand.successColor('✓') + ' Modular rule system\n');
    } else {
      brand.success('Files generated!');
    }
    brand.divider();
    result.files.forEach(f => console.log(`  ${brand.successColor('✓')} ${f}`));
  }
}

module.exports = {
  GigaspecFramework,
  initCommand,
  analyzeCommand,
  generateCommand,
  ANALYSIS_PROMPT,
  QUESTION_ANSWER_PROMPT,
  PROJECT_QUESTIONS,
  STACK_QUESTIONS
};
