/**
 * Gigaspec AI-Native Workflow Engine
 * 
 * This module handles the AI-driven workflow where:
 * - AI assistant runs commands
 * - Gigaspec outputs structured data for AI to present to human
 * - Human responds via AI
 * - AI feeds responses back to Gigaspec
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Interview questions for new projects
const INTERVIEW_QUESTIONS = [
  {
    id: 'purpose',
    text: 'What is the main purpose of this application?',
    type: 'open_ended',
    example: 'Help remote teams track tasks and deadlines',
    category: 'discovery'
  },
  {
    id: 'users',
    text: 'Who are the primary users and how many do you expect?',
    type: 'open_ended',
    example: 'Small teams of 5-20 people',
    category: 'discovery'
  },
  {
    id: 'key_features',
    text: 'What are the 3-5 most important features?',
    type: 'open_ended',
    example: 'Task creation, assignments, deadlines, comments, notifications',
    category: 'discovery'
  },
  {
    id: 'realtime',
    text: 'Do you need real-time features (live updates, chat, collaboration)?',
    type: 'boolean',
    category: 'technical'
  },
  {
    id: 'auth',
    text: 'Do you need user authentication?',
    type: 'multiple_choice',
    options: ['No auth needed', 'Email/password', 'Social login (Google/GitHub)', 'SSO/Enterprise'],
    category: 'technical'
  },
  {
    id: 'payments',
    text: 'Will this have paid features or subscriptions?',
    type: 'boolean',
    category: 'business'
  },
  {
    id: 'scale',
    text: 'What scale do you expect at launch and in 1 year?',
    type: 'multiple_choice',
    options: ['< 100 users', '100 - 1,000 users', '1,000 - 10,000 users', '10,000+ users'],
    category: 'technical'
  },
  {
    id: 'team_expertise',
    text: 'What technologies is your team most comfortable with?',
    type: 'multiple_select',
    options: ['JavaScript/TypeScript', 'Python', 'Go', 'Rust', 'Ruby', 'Java', 'Elixir', 'No preference'],
    category: 'team'
  }
];

// Stack recommendations based on requirements
const STACK_RECOMMENDATIONS = {
  'high_realtime': {
    primary: { stack: 'Elixir/Phoenix', reason: 'Best-in-class real-time capabilities' },
    alternative: { stack: 'Node.js/Socket.io', reason: 'Good real-time, larger ecosystem' }
  },
  'rapid_development': {
    primary: { stack: 'Python/Django', reason: 'Fastest development, built-in admin' },
    alternative: { stack: 'Ruby on Rails', reason: 'Convention over configuration' }
  },
  'modern_fullstack': {
    primary: { stack: 'Node.js/Next.js', reason: 'Modern React, excellent DX, TypeScript' },
    alternative: { stack: 'Python/FastAPI + React', reason: 'Fast API + flexible frontend' }
  },
  'high_performance': {
    primary: { stack: 'Go/Gin', reason: 'Fast, efficient, great for APIs' },
    alternative: { stack: 'Rust/Axum', reason: 'Maximum performance, type safety' }
  }
};

class AIWorkflowEngine {
  constructor(options = {}) {
    this.outputDir = options.outputDir || '.';
    this.interviewState = null;
  }

  /**
   * Start the new project workflow
   * Returns JSON for AI to present menu
   */
  async startNewProject() {
    return {
      status: 'started',
      workflow: 'new_project',
      phase: 'interview',
      message: 'Starting new project discovery',
      next_action: 'begin_interview',
      first_question: INTERVIEW_QUESTIONS[0]
    };
  }

  /**
   * Start the existing project workflow
   * Analyzes codebase and returns findings
   */
  async startExistingProject(projectPath) {
    const absolutePath = path.resolve(projectPath);
    
    if (!await fs.pathExists(absolutePath)) {
      return {
        status: 'error',
        message: `Path does not exist: ${projectPath}`
      };
    }

    const analysis = await this.analyzeCodebase(absolutePath);
    
    return {
      status: 'analysis_complete',
      workflow: 'existing_project',
      detected: analysis,
      gaps: this.identifyGaps(analysis),
      interview_questions: this.generateQuestionsFromAnalysis(analysis),
      next_action: 'conduct_interview_for_gaps'
    };
  }

  /**
   * Process interview answer and return next question or results
   */
  async processInterviewAnswer(questionId, answer, allAnswers = {}) {
    // Store answer
    allAnswers[questionId] = answer;
    
    // Find next question
    const currentIndex = INTERVIEW_QUESTIONS.findIndex(q => q.id === questionId);
    const nextQuestion = INTERVIEW_QUESTIONS[currentIndex + 1];
    
    if (nextQuestion) {
      return {
        status: 'interview_continue',
        progress: `${currentIndex + 1}/${INTERVIEW_QUESTIONS.length}`,
        question: nextQuestion,
        answers_so_far: allAnswers
      };
    }
    
    // Interview complete - analyze and recommend
    return this.analyzeRequirements(allAnswers);
  }

  /**
   * Analyze requirements and recommend stack
   */
  analyzeRequirements(answers) {
    const analysis = {
      purpose: answers.purpose || 'Application',
      users: answers.users || 'General users',
      key_features: (answers.key_features || '').split(',').map(f => f.trim()).filter(Boolean),
      needs_realtime: answers.realtime === true || answers.realtime === 'true',
      auth_type: answers.auth || 'None',
      needs_payments: answers.payments === true || answers.payments === 'true',
      expected_scale: answers.scale || '< 100 users',
      team_expertise: Array.isArray(answers.team_expertise) 
        ? answers.team_expertise 
        : (answers.team_expertise || 'No preference').split(',').map(e => e.trim())
    };

    // Determine recommendation profile
    let profile = 'modern_fullstack'; // default
    
    if (analysis.needs_realtime && analysis.expected_scale.includes('10,000')) {
      profile = 'high_realtime';
    } else if (analysis.team_expertise.includes('Python') && !analysis.needs_realtime) {
      profile = 'rapid_development';
    } else if (analysis.expected_scale.includes('10,000+')) {
      profile = 'high_performance';
    }

    const recommendation = STACK_RECOMMENDATIONS[profile];
    
    // Add alternatives based on team expertise
    const alternatives = [recommendation.alternative];
    
    if (analysis.team_expertise.includes('JavaScript/TypeScript')) {
      alternatives.push({ stack: 'Node.js/Next.js', reason: 'Your team knows JavaScript' });
    }
    if (analysis.team_expertise.includes('Python')) {
      alternatives.push({ stack: 'Python/FastAPI', reason: 'Your team knows Python' });
    }

    return {
      status: 'interview_complete',
      analysis: analysis,
      recommendations: {
        primary: {
          stack: recommendation.primary.stack,
          reasoning: recommendation.primary.reason,
          detailed_reasoning: this.generateDetailedReasoning(analysis, recommendation.primary.stack),
          pros: this.getProsForStack(recommendation.primary.stack),
          cons: this.getConsForStack(recommendation.primary.stack)
        },
        alternatives: alternatives.slice(0, 2).map(alt => ({
          stack: alt.stack,
          reasoning: alt.reason
        }))
      },
      next_action: 'present_options_and_get_selection'
    };
  }

  /**
   * Analyze existing codebase
   */
  async analyzeCodebase(projectPath) {
    const analysis = {
      languages: [],
      frontend: {},
      backend: {},
      database: null,
      testing: {},
      deployment: {},
      architecture: 'unknown'
    };

    // Check for package.json (Node.js)
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        analysis.languages.push('JavaScript/TypeScript');
        
        // Detect frontend
        if (packageJson.dependencies?.next) {
          analysis.frontend.framework = 'Next.js';
          analysis.frontend.version = packageJson.dependencies.next;
        } else if (packageJson.dependencies?.react) {
          analysis.frontend.framework = 'React';
          analysis.frontend.build_tool = packageJson.devDependencies?.vite ? 'Vite' : 'CRA/Other';
        } else if (packageJson.dependencies?.vue) {
          analysis.frontend.framework = 'Vue';
        }
        
        // Detect backend in same package
        if (packageJson.dependencies?.express) {
          analysis.backend.framework = 'Express.js';
        } else if (packageJson.dependencies?.['@nestjs/core']) {
          analysis.backend.framework = 'NestJS';
        }
        
        // Detect testing
        if (packageJson.devDependencies?.jest || packageJson.dependencies?.jest) {
          analysis.testing.framework = 'Jest';
        } else if (packageJson.devDependencies?.vitest) {
          analysis.testing.framework = 'Vitest';
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Check for Python
    const requirementsPath = path.join(projectPath, 'requirements.txt');
    const pyprojectPath = path.join(projectPath, 'pyproject.toml');
    if (await fs.pathExists(requirementsPath) || await fs.pathExists(pyprojectPath)) {
      analysis.languages.push('Python');
      
      // Try to detect framework
      if (await fs.pathExists(requirementsPath)) {
        const reqs = await fs.readFile(requirementsPath, 'utf-8');
        if (reqs.includes('fastapi')) analysis.backend.framework = 'FastAPI';
        else if (reqs.includes('django')) analysis.backend.framework = 'Django';
        else if (reqs.includes('flask')) analysis.backend.framework = 'Flask';
      }
    }

    // Check for database
    const prismaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    if (await fs.pathExists(prismaPath)) {
      analysis.database = { orm: 'Prisma' };
      const schema = await fs.readFile(prismaPath, 'utf-8');
      if (schema.includes('postgresql')) analysis.database.type = 'PostgreSQL';
      else if (schema.includes('mysql')) analysis.database.type = 'MySQL';
      else if (schema.includes('sqlite')) analysis.database.type = 'SQLite';
    }

    // Check for Dockerfile
    const dockerfilePath = path.join(projectPath, 'Dockerfile');
    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    if (await fs.pathExists(dockerfilePath) || await fs.pathExists(dockerComposePath)) {
      analysis.deployment.docker = true;
      analysis.deployment.method = await fs.pathExists(dockerComposePath) ? 'Docker Compose' : 'Docker';
    }

    // Detect architecture patterns
    const srcPath = path.join(projectPath, 'src');
    const appPath = path.join(projectPath, 'app');
    const pagesPath = path.join(projectPath, 'pages');
    
    if (await fs.pathExists(pagesPath)) {
      analysis.architecture = 'Next.js Pages Router';
    } else if (await fs.pathExists(appPath)) {
      analysis.architecture = 'Next.js App Router';
    } else if (await fs.pathExists(srcPath)) {
      analysis.architecture = 'Src-based';
    }

    return analysis;
  }

  /**
   * Identify gaps in existing project
   */
  identifyGaps(analysis) {
    const gaps = [];
    
    if (!analysis.testing.framework) {
      gaps.push('No testing framework detected');
    }
    
    if (!analysis.deployment.docker && !analysis.deployment.ci) {
      gaps.push('No deployment configuration detected');
    }
    
    if (!analysis.database) {
      gaps.push('No database configuration detected');
    }
    
    return gaps;
  }

  /**
   * Generate interview questions based on analysis
   */
  generateQuestionsFromAnalysis(analysis) {
    const questions = [];
    
    // Always ask about purpose
    questions.push({
      id: 'purpose',
      text: 'What is the main purpose of this application?',
      reason: 'Cannot determine from code alone'
    });
    
    // Ask about scale if not clear
    if (!analysis.deployment.method) {
      questions.push({
        id: 'scale',
        text: 'What scale do you expect? (users, traffic)',
        reason: 'Helps determine deployment strategy'
      });
    }
    
    return questions;
  }

  /**
   * Helper: Generate detailed reasoning
   */
  generateDetailedReasoning(analysis, stack) {
    const reasons = [];
    
    if (analysis.needs_realtime) {
      reasons.push(`${stack} has good real-time capabilities for your collaboration features`);
    }
    
    if (analysis.expected_scale.includes('10,000')) {
      reasons.push(`Can handle ${analysis.expected_scale} as you grow`);
    }
    
    if (analysis.team_expertise.some(e => stack.toLowerCase().includes(e.toLowerCase()))) {
      reasons.push(`Matches your team's existing expertise`);
    }
    
    if (analysis.needs_payments) {
      reasons.push(`Strong ecosystem for payment integration (Stripe, etc.)`);
    }
    
    return reasons.join('. ');
  }

  /**
   * Helper: Get pros for stack
   */
  getProsForStack(stack) {
    const pros = {
      'Node.js/Next.js': ['Excellent DX', 'Full-stack TypeScript', 'Huge ecosystem', 'Easy deployment'],
      'Elixir/Phoenix': ['Best real-time', 'High concurrency', 'Fault-tolerant', 'LiveView'],
      'Python/Django': ['Rapid development', 'Built-in admin', 'Mature ecosystem', 'Great for MVPs'],
      'Python/FastAPI': ['Fast performance', 'Automatic API docs', 'Type hints', 'Async support'],
      'Go/Gin': ['High performance', 'Low memory', 'Fast compile', 'Great for APIs']
    };
    return pros[stack] || ['Mature ecosystem', 'Good documentation'];
  }

  /**
   * Helper: Get cons for stack
   */
  getConsForStack(stack) {
    const cons = {
      'Node.js/Next.js': ['JavaScript fatigue', 'Callback complexity'],
      'Elixir/Phoenix': ['Smaller talent pool', 'Learning curve'],
      'Python/Django': ['Can be slow', 'Monolithic'],
      'Python/FastAPI': ['Newer ecosystem', 'Less built-in'],
      'Go/Gin': ['Verbose code', 'No generics (pre-1.18)']
    };
    return cons[stack] || ['Learning curve'];
  }
}

module.exports = { AIWorkflowEngine, INTERVIEW_QUESTIONS };
