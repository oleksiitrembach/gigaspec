#!/usr/bin/env node

/**
 * Gigaspec MCP Server
 * 
 * Exposes gigaspec functionality as MCP (Model Context Protocol) tools
 * for AI assistants to discover and invoke directly.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { GigaspecFramework } = require('../lib/framework');
const fs = require('fs-extra');
const path = require('path');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

// Tool name schemas for validation
const ToolName = z.enum([
  'gigaspec-init',
  'gigaspec-analyze',
  'gigaspec-generate',
  'gigaspec-status',
  'gigaspec-wizard'
]);

// Tool input schemas
const InitInputSchema = z.object({
  name: z.string().optional().describe('Project name'),
  description: z.string().optional().describe('Project description'),
  team: z.string().optional().describe('Team size (e.g., "2-5")'),
  weeks: z.string().optional().describe('Timeline in weeks'),
  stack: z.string().optional().describe('Tech stack (e.g., "Node.js/Express")'),
  frontend: z.string().optional().describe('Frontend framework'),
  database: z.string().optional().describe('Database'),
  cache: z.string().optional().describe('Cache'),
  deploy: z.string().optional().describe('Deployment platform'),
  services: z.string().optional().describe('External services (comma-separated)'),
  output: z.string().optional().describe('Output directory'),
  yes: z.boolean().optional().describe('Use defaults (non-interactive)'),
  v5: z.boolean().optional().describe('Use Gigaspec v5.0 Ultimate Workflow')
});

const AnalyzeInputSchema = z.object({
  description: z.string().describe('What you want to build'),
  weeks: z.string().optional().describe('Timeline in weeks')
});

const GenerateInputSchema = z.object({
  config: z.string().optional().describe('Path to config JSON file'),
  name: z.string().optional().describe('Project name'),
  stack: z.string().optional().describe('Tech stack'),
  frontend: z.string().optional().describe('Frontend framework'),
  database: z.string().optional().describe('Database'),
  cache: z.string().optional().describe('Cache'),
  deploy: z.string().optional().describe('Deployment platform'),
  services: z.string().optional().describe('External services (comma-separated)'),
  weeks: z.string().optional().describe('Timeline in weeks'),
  output: z.string().optional().describe('Output directory')
});

const StatusInputSchema = z.object({
  path: z.string().optional().describe('Path to project directory (default: current)')
});

const WizardInputSchema = z.object({
  output: z.string().optional().describe('Output directory')
});

// Tool definitions
const TOOLS = [
  {
    name: 'gigaspec-init',
    description: 'Initialize a new project with AI collaboration framework. Creates specification files (AGENT.md, ARCHITECTURE.md, PLAN.md, STATE.md, etc.) based on project requirements.',
    inputSchema: zodToJsonSchema(InitInputSchema)
  },
  {
    name: 'gigaspec-analyze',
    description: 'Create an analysis prompt for AI assistant. Generates a structured prompt that guides AI to analyze project requirements deeply and recommend technical stacks.',
    inputSchema: zodToJsonSchema(AnalyzeInputSchema)
  },
  {
    name: 'gigaspec-generate',
    description: 'Generate specification files from a configuration. Creates all documentation files (AGENT.md, ARCHITECTURE.md, PLAN.md, etc.) based on provided or loaded config.',
    inputSchema: zodToJsonSchema(GenerateInputSchema)
  },
  {
    name: 'gigaspec-status',
    description: 'Check project status from STATE.md. Returns current phase, progress percentage, completed tasks, in-progress items, and next priorities.',
    inputSchema: zodToJsonSchema(StatusInputSchema)
  },
  {
    name: 'gigaspec-wizard',
    description: 'Run interactive wizard for project setup. Guides through questions to gather requirements and can recommend AI analysis for stack selection.',
    inputSchema: zodToJsonSchema(WizardInputSchema)
  }
];

// Server setup
const server = new Server(
  {
    name: 'gigaspec',
    version: '4.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'gigaspec-init': {
        // v5 workflow: Start AI interview
        if (args.v5) {
          const { AIWorkflowEngine } = require('../lib/ai-workflow');
          const engine = new AIWorkflowEngine({ outputDir: args.output || '.', v5: true });
          
          const result = await engine.startV5Workflow();
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }
            ]
          };
        }
        
        const framework = new GigaspecFramework({ 
          outputDir: args.output || '.',
          jsonMode: true 
        });
        
        // Build config from args
        let config;
        if (args.yes) {
          config = {
            name: args.name || 'MyProject',
            description: args.description || `${args.name || 'MyProject'} - A new software project`,
            stack: args.stack || 'Node.js/Express',
            frontend: args.frontend || 'React/Next.js',
            database: args.database || 'PostgreSQL',
            cache: args.cache || 'Redis',
            services: args.services ? args.services.split(',') : [],
            deployment: args.deploy || 'Railway',
            weeks: parseInt(args.weeks) || 12,
            team: args.team || '2-5'
          };
        } else if (args.stack) {
          config = {
            name: args.name || 'MyProject',
            description: args.description || `${args.name || 'MyProject'} - A new software project`,
            stack: args.stack,
            frontend: args.frontend || 'React/Next.js',
            database: args.database || 'PostgreSQL',
            cache: args.cache || 'Redis',
            services: args.services ? args.services.split(',') : [],
            deployment: args.deploy || 'Railway',
            weeks: parseInt(args.weeks) || 12,
            team: args.team || '2-5'
          };
        } else {
          // Need stack or --yes
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  status: 'input_required',
                  message: 'Project initialization requires either a stack (--stack) or --yes flag for defaults',
                  suggestion: 'Use --stack "Node.js/Express" to specify stack, or --yes for defaults'
                }, null, 2)
              }
            ]
          };
        }
        
        const result = await framework.generate(config);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                message: 'Specification framework ready',
                files: result.files,
                config: config,
                nextSteps: [
                  'Read AGENT.md for AI coding standards',
                  'Check STATE.md for project status',
                  'Follow PLAN.md for development roadmap'
                ]
              }, null, 2)
            }
          ]
        };
      }
      
      case 'gigaspec-analyze': {
        const framework = new GigaspecFramework({ jsonMode: true });
        
        const prompt = framework.createAnalysisPrompt(args.description, {
          weeks: args.weeks || '12'
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                message: 'Analysis prompt created',
                prompt: prompt,
                instructions: [
                  'Provide this prompt to an AI assistant for analysis',
                  'The AI will ask clarifying questions and recommend a stack',
                  'After getting recommendations, use gigaspec-generate to create docs'
                ]
              }, null, 2)
            }
          ]
        };
      }
      
      case 'gigaspec-generate': {
        const framework = new GigaspecFramework({ 
          outputDir: args.output || '.',
          jsonMode: true 
        });
        
        let config;
        if (args.config) {
          try {
            config = await fs.readJson(args.config);
          } catch (err) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    status: 'error',
                    message: `Failed to load config: ${err.message}`
                  }, null, 2)
                }
              ],
              isError: true
            };
          }
        } else {
          config = {
            name: args.name || 'MyProject',
            description: args.description || `${args.name || 'MyProject'} - A new software project`,
            stack: args.stack || 'Node.js/Express',
            frontend: args.frontend || 'React/Next.js',
            database: args.database || 'PostgreSQL',
            cache: args.cache || 'Redis',
            services: args.services ? args.services.split(',') : [],
            deployment: args.deploy || 'Railway',
            weeks: parseInt(args.weeks) || 12
          };
        }
        
        const result = await framework.generate(config);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                message: 'Specification files generated',
                files: result.files,
                outputDir: result.outputDir,
                config: config
              }, null, 2)
            }
          ]
        };
      }
      
      case 'gigaspec-status': {
        const projectPath = args.path || '.';
        const statePath = path.join(projectPath, 'STATE.md');
        
        if (!await fs.pathExists(statePath)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  status: 'error',
                  message: 'No STATE.md found. Run "gigaspec-init" first.',
                  statePath
                }, null, 2)
              }
            ],
            isError: true
          };
        }
        
        const content = await fs.readFile(statePath, 'utf-8');
        const name = content.match(/Project.*?:\s*(.+?)(?:\s{2,}|$)/m)?.[1]?.trim() || 'Unknown';
        const phase = content.match(/Current Phase.*?:\s*(.+?)(?:\s{2,}|$)/m)?.[1]?.trim() || 'Unknown';
        const progress = content.match(/Overall Progress.*?:\s*(\d+)%/)?.[1] || '0';
        
        // Parse sections
        const completed = content.match(/## Completed[✅]*\n([\s\S]*?)(?=##|$)/);
        const inProgress = content.match(/## In Progress[🔄]*\n([\s\S]*?)(?=##|$)/);
        const next = content.match(/## Next Priority[📋]*\n([\s\S]*?)(?=##|$)/);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'success',
                project: { name, phase, progress: parseInt(progress) },
                completed: completed ? completed[1].split('\n').filter(l => l.trim().startsWith('- [')).map(l => l.replace(/^- \[[x ]\]\s*/, '').trim()).filter(Boolean) : [],
                inProgress: inProgress ? inProgress[1].split('\n').filter(l => l.trim().startsWith('- [')).map(l => l.replace(/^- \[[x ]\]\s*/, '').trim()).filter(Boolean) : [],
                next: next ? next[1].split('\n').filter(l => l.trim().match(/^\d+\./)).map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean) : []
              }, null, 2)
            }
          ]
        };
      }
      
      case 'gigaspec-wizard': {
        // Wizard requires interactive mode, which isn't supported via MCP
        // Return instructions instead
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'interactive_required',
                message: 'The wizard requires interactive prompts which are not available via MCP',
                alternatives: [
                  'Use gigaspec-init with --stack flag to specify stack directly',
                  'Use gigaspec-analyze to get AI analysis prompt',
                  'Run "gigaspec wizard" in a terminal for interactive mode'
                ]
              }, null, 2)
            }
          ]
        };
      }
      
      default:
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'error',
                message: `Unknown tool: ${name}`
              }, null, 2)
            }
          ],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            message: error.message,
            stack: error.stack
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with JSON-RPC on stdout
  console.error('Gigaspec MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
