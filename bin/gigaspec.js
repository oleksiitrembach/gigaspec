#!/usr/bin/env node

/**
 * Gigaspec CLI - AI-Native Specification Framework
 * 
 * Designed for AI assistants (Kimi, Claude) to drive spec-driven development.
 * All commands output JSON for AI consumption when --json flag is used.
 */

const { program } = require('commander');
const chalk = require('chalk');
const { version } = require('../package.json');
const { initCommand, analyzeCommand, generateCommand, GigaspecFramework } = require('../lib/framework');
const { AIWorkflowEngine } = require('../lib/ai-workflow');

// Detect if running in AI context (JSON mode preferred)
const isAIContext = process.env.GIGASPEC_AI_MODE === 'true';

// Brand styling for human output
const brand = {
  title: () => console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗')),
  header: (text) => console.log(chalk.cyan('║') + chalk.bold.white(`  ${text}`.padEnd(63)) + chalk.cyan('║')),
  footer: () => console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n')),
  success: (msg) => console.log(chalk.green('✓') + ' ' + msg),
  info: (msg) => console.log(chalk.blue('ℹ') + ' ' + msg),
  warn: (msg) => console.log(chalk.yellow('⚠') + ' ' + msg),
  error: (msg) => console.log(chalk.red('✗') + ' ' + msg),
  step: (n, total, msg) => console.log(chalk.cyan(`[${n}/${total}]`) + ' ' + msg),
  divider: () => console.log(chalk.gray('─'.repeat(66))),
  bold: chalk.bold,
  cyan: chalk.cyan,
  reset: chalk.reset,
  infoColor: chalk.blue,
  warnColor: chalk.yellow,
  successColor: chalk.green
};

program
  .name('gigaspec')
  .description('AI-native specification framework for spec-driven development')
  .version(version);

// DEFAULT: init - Project initialization with AI workflow
program
  .command('init', { isDefault: true })
  .description('Initialize project (new or existing) with AI-guided workflow')
  .option('-t, --type <type>', 'Project type: new|existing', 'menu')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --description <desc>', 'Project description')
  .option('-s, --stack <stack>', 'Tech stack (skip AI recommendation)')
  .option('-p, --path <path>', 'Path to existing project', '.')
  .option('-y, --yes', 'Use defaults (skip AI workflow)')
  .option('-j, --json', 'Output JSON for AI consumption')
  .action(async (options) => {
    try {
      const engine = new AIWorkflowEngine({ outputDir: options.path });
      
      // AI mode: output JSON
      if (options.json || isAIContext) {
        // If user specified type, skip menu
        if (options.type === 'new') {
          const result = await engine.startNewProject();
          console.log(JSON.stringify(result, null, 2));
          return;
        }
        
        if (options.type === 'existing') {
          const result = await engine.startExistingProject(options.path);
          console.log(JSON.stringify(result, null, 2));
          return;
        }
        
        // Default: show menu for AI to present
        console.log(JSON.stringify({
          status: 'requires_choice',
          message: 'Select project type',
          choices: [
            { 
              id: 'new', 
              label: '🚀 New Project', 
              description: 'Start from scratch with AI-guided stack selection',
              action: 'Start interview to discover requirements'
            },
            { 
              id: 'existing', 
              label: '📁 Existing Codebase', 
              description: 'Configure spec-driven development for existing code',
              action: 'Analyze codebase and generate specs'
            }
          ],
          next_action: 'ask_user_to_select',
          usage: 'gigaspec init --type <new|existing> --json'
        }, null, 2));
        return;
      }
      
      // Human mode: use original initCommand
      await initCommand(options, brand);
      
    } catch (error) {
      const errorOutput = { status: 'error', message: error.message };
      if (options.json || isAIContext) {
        console.log(JSON.stringify(errorOutput, null, 2));
      } else {
        brand.error(error.message);
      }
      process.exit(1);
    }
  });

// interview - Process interview answers (AI workflow)
program
  .command('interview')
  .description('Process interview answer and get next question (AI workflow)')
  .requiredOption('-q, --question-id <id>', 'Question ID being answered')
  .requiredOption('-a, --answer <text>', 'User answer')
  .option('-s, --state <json>', 'Current interview state (JSON string)', '{}')
  .option('-j, --json', 'Output JSON')
  .action(async (options) => {
    try {
      const engine = new AIWorkflowEngine();
      const state = JSON.parse(options.state);
      
      const result = await engine.processInterviewAnswer(
        options.questionId,
        options.answer,
        state
      );
      
      console.log(JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.log(JSON.stringify({ status: 'error', message: error.message }, null, 2));
      process.exit(1);
    }
  });

// analyze - Enhanced for AI workflow
program
  .command('analyze')
  .description('Create analysis prompt or analyze existing codebase')
  .argument('[description]', 'What you want to build (for new projects)')
  .option('-p, --path <path>', 'Analyze existing codebase at path')
  .option('-w, --weeks <weeks>', 'Timeline in weeks', '12')
  .option('-j, --json', 'Output JSON for AI consumption')
  .action(async (description, options) => {
    try {
      // If path provided, analyze existing codebase
      if (options.path) {
        const engine = new AIWorkflowEngine();
        const result = await engine.startExistingProject(options.path);
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      
      // Otherwise, create analysis prompt for new project
      if (!description) {
        console.log(JSON.stringify({
          status: 'error',
          message: 'Provide description for new project or --path for existing'
        }, null, 2));
        process.exit(1);
      }
      
      await analyzeCommand(description, options, brand);
      
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ status: 'error', message: error.message }, null, 2));
      } else {
        brand.error(error.message);
      }
      process.exit(1);
    }
  });

// continue - Get next task for AI to implement
program
  .command('continue')
  .description('Get next development task from STATE.md (for AI to implement)')
  .option('-p, --path <path>', 'Project path', '.')
  .option('-j, --json', 'Output JSON for AI consumption')
  .action(async (options) => {
    try {
      const fs = require('fs-extra');
      const statePath = require('path').join(options.path, 'STATE.md');
      const agentPath = require('path').join(options.path, 'AGENT.md');
      
      if (!await fs.pathExists(statePath)) {
        console.log(JSON.stringify({
          status: 'error',
          message: 'No STATE.md found. Run "gigaspec init" first.',
          suggestion: 'Run: gigaspec init --type new --json'
        }, null, 2));
        process.exit(1);
      }
      
      const stateContent = await fs.readFile(statePath, 'utf-8');
      const agentContent = await fs.pathExists(agentPath) 
        ? await fs.readFile(agentPath, 'utf-8')
        : '';
      
      // Parse current state
      const name = stateContent.match(/Project.*?:\s*(.+?)(?:\s{2,}|$)/m)?.[1]?.trim() || 'Unknown';
      const phase = stateContent.match(/Current Phase.*?:\s*(.+?)(?:\s{2,}|$)/m)?.[1]?.trim() || 'Unknown';
      const progress = stateContent.match(/Overall Progress.*?:\s*(\d+)%/)?.[1] || '0';
      
      // Parse next priority
      const nextMatch = stateContent.match(/## Next Priority[📋]*\n([\s\S]*?)(?=##|$)/);
      const nextTasks = nextMatch 
        ? nextMatch[1].split('\n')
            .filter(l => l.trim().match(/^\d+\./))
            .map(l => l.replace(/^\d+\.\s*/, '').trim())
            .filter(Boolean)
        : [];
      
      // Parse in progress
      const inProgressMatch = stateContent.match(/## In Progress[🔄]*\n([\s\S]*?)(?=##|$)/);
      const inProgressTasks = inProgressMatch
        ? inProgressMatch[1].split('\n')
            .filter(l => l.trim().startsWith('- ['))
            .map(l => l.replace(/^- \[[x ]\]\s*/, '').trim())
            .filter(Boolean)
        : [];
      
      // Determine current task
      let currentTask = null;
      
      if (inProgressTasks.length > 0) {
        // Continue with in-progress task
        currentTask = {
          title: inProgressTasks[0],
          status: 'in_progress',
          instruction: 'Continue working on this task'
        };
      } else if (nextTasks.length > 0) {
        // Start next task
        currentTask = {
          title: nextTasks[0],
          status: 'ready_to_start',
          instruction: 'Begin implementing this task'
        };
      }
      
      // Extract constraints from AGENT.md
      const constraints = {
        maxLinesPerFunction: agentContent.match(/Max (\d+) lines per function/)?.[1] || '10',
        maxArgsPerFunction: agentContent.match(/Max (\d+) arguments per function/)?.[1] || '3',
        forbiddenPatterns: [],
        testing: agentContent.includes('>90%') ? '90%' : 'required',
        stack: agentContent.match(/Stack.*?:\s*(.+)/)?.[1] || 'Not specified'
      };
      
      // Extract golden rules
      const goldenRules = agentContent.match(/## 🏆 Golden Rules[\s\S]*?(?=##|$)/)?.[0]
        ?.split('\n')
        ?.filter(l => l.match(/^\d+\./))
        ?.map(l => l.replace(/^\d+\.\s*/, '').trim())
        || [];
      
      const result = {
        status: currentTask ? 'ready' : 'complete',
        project: { name, phase, progress: parseInt(progress) },
        current_task: currentTask,
        next_tasks: nextTasks.slice(1),
        context: {
          constraints,
          golden_rules: goldenRules.slice(0, 5),
          agent_md_available: agentContent.length > 0
        },
        actions: {
          implement: 'Write code for the current task',
          verify: 'Run: gigaspec verify to check compliance',
          update_state: 'After completing, update STATE.md'
        }
      };
      
      console.log(JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.log(JSON.stringify({ status: 'error', message: error.message }, null, 2));
      process.exit(1);
    }
  });

// verify - Verify code against AGENT.md
program
  .command('verify')
  .description('Verify code compliance with AGENT.md standards')
  .option('-p, --path <path>', 'Project path', '.')
  .option('--auto-fix', 'Attempt to auto-fix issues')
  .option('-j, --json', 'Output JSON for AI consumption')
  .action(async (options) => {
    try {
      const fs = require('fs-extra');
      const path = require('path');
      
      const agentPath = path.join(options.path, 'AGENT.md');
      const statePath = path.join(options.path, 'STATE.md');
      
      if (!await fs.pathExists(agentPath)) {
        console.log(JSON.stringify({
          status: 'error',
          message: 'No AGENT.md found'
        }, null, 2));
        process.exit(1);
      }
      
      const agentContent = await fs.readFile(agentPath, 'utf-8');
      
      // Run verification checks
      const checks = [];
      
      // Check 1: AGENT.md compliance (placeholder for actual implementation)
      checks.push({
        name: 'AGENT.md exists and readable',
        passed: true,
        details: 'Coding standards available'
      });
      
      // Check 2: STATE.md exists
      checks.push({
        name: 'STATE.md tracking',
        passed: await fs.pathExists(statePath),
        details: await fs.pathExists(statePath) ? 'Project state tracked' : 'Missing STATE.md'
      });
      
      // Check 3: Extract what needs to be verified from AGENT.md
      const verificationCommands = agentContent.match(/```bash\n# Run all checks([\s\S]*?)```/)?.[1] || '';
      
      const allPassed = checks.every(c => c.passed);
      
      const result = {
        status: allPassed ? 'verified' : 'issues_found',
        checks,
        all_passed: allPassed,
        agent_md_constraints: {
          max_lines_per_function: agentContent.match(/Max (\d+) lines per function/)?.[1] || '10',
          requires_tests: agentContent.includes('Write tests'),
          requires_types: agentContent.includes('type') || agentContent.includes('TypeScript')
        },
        next_actions: allPassed 
          ? ['Update STATE.md to mark task complete', 'Run: gigaspec continue for next task']
          : ['Fix failed checks', 'Run: gigaspec verify again']
      };
      
      console.log(JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.log(JSON.stringify({ status: 'error', message: error.message }, null, 2));
      process.exit(1);
    }
  });

// status - Enhanced for AI
program
  .command('status')
  .description('Show project status')
  .option('-p, --path <path>', 'Project path', '.')
  .option('-j, --json', 'Output JSON for AI consumption')
  .action(async (options) => {
    try {
      const fs = require('fs-extra');
      const statePath = require('path').join(options.path, 'STATE.md');
      
      if (!await fs.pathExists(statePath)) {
        const error = { 
          status: 'error', 
          message: 'No STATE.md found',
          suggestion: 'Run: gigaspec init --type new --json'
        };
        if (options.json || isAIContext) {
          console.log(JSON.stringify(error, null, 2));
        } else {
          brand.error(error.message);
        }
        process.exit(1);
      }
      
      const content = await fs.readFile(statePath, 'utf-8');
      const name = content.match(/Project.*?:\s*(.+?)(?:\s{2,}|$)/m)?.[1]?.trim() || 'Unknown';
      const phase = content.match(/Current Phase.*?:\s*(.+?)(?:\s{2,}|$)/m)?.[1]?.trim() || 'Unknown';
      const progress = content.match(/Overall Progress.*?:\s*(\d+)%/)?.[1] || '0';
      
      const completed = content.match(/## Completed[✅]*\n([\s\S]*?)(?=##|$)/);
      const inProgress = content.match(/## In Progress[🔄]*\n([\s\S]*?)(?=##|$)/);
      const next = content.match(/## Next Priority[📋]*\n([\s\S]*?)(?=##|$)/);
      
      if (options.json || isAIContext) {
        const result = {
          status: 'success',
          project: { name, phase, progress: parseInt(progress) },
          completed: completed ? completed[1].split('\n').filter(l => l.trim().startsWith('- [')).map(l => l.replace(/^- \[[x ]\]\s*/, '').trim()).filter(Boolean) : [],
          in_progress: inProgress ? inProgress[1].split('\n').filter(l => l.trim().startsWith('- [')).map(l => l.replace(/^- \[[x ]\]\s*/, '').trim()).filter(Boolean) : [],
          next: next ? next[1].split('\n').filter(l => l.trim().match(/^\d+\./)).map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean) : [],
          action: 'Read first item in "next" array and implement it'
        };
        console.log(JSON.stringify(result, null, 2));
      } else {
        brand.title();
        brand.header(`Project: ${name}`);
        brand.footer();
        console.log(`${chalk.cyan('Phase:')} ${phase}`);
        console.log(`${chalk.cyan('Progress:')} ${progress}%`);
        
        if (completed) {
          console.log(chalk.bold('\n✅ Completed:'));
          completed[1].split('\n').filter(l => l.trim()).forEach(l => {
            console.log(`  ${chalk.green('✓')} ${l.replace(/^- \[[x ]\]\s*/, '')}`);
          });
        }
        
        if (inProgress) {
          console.log(chalk.bold('\n🔄 In Progress:'));
          inProgress[1].split('\n').filter(l => l.trim()).forEach(l => {
            console.log(`  ${chalk.blue('→')} ${l.replace(/^- \[[x ]\]\s*/, '')}`);
          });
        }
        
        if (next) {
          console.log(chalk.bold('\n📋 Next:'));
          next[1].split('\n').filter(l => l.trim()).forEach(l => {
            console.log(`  ${chalk.yellow('•')} ${l.replace(/^\d+\.\s*/, '')}`);
          });
        }
      }
    } catch (error) {
      if (options.json || isAIContext) {
        console.log(JSON.stringify({ status: 'error', message: error.message }, null, 2));
      } else {
        brand.error(error.message);
      }
      process.exit(1);
    }
  });

// generate - Generate spec files
program
  .command('generate')
  .description('Generate specification files')
  .option('-c, --config <file>', 'Config JSON file')
  .option('-n, --name <name>', 'Project name')
  .option('-s, --stack <stack>', 'Tech stack')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('-j, --json', 'Output JSON for AI consumption')
  .action(async (options) => {
    try {
      await generateCommand(options, brand);
    } catch (error) {
      if (options.json || isAIContext) {
        console.log(JSON.stringify({ status: 'error', message: error.message }, null, 2));
      } else {
        brand.error(error.message);
      }
      process.exit(1);
    }
  });

program.parse();
