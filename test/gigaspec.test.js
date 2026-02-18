/**
 * Gigaspec Test Suite
 */

const { GigaspecFramework, initCommand, analyzeCommand, generateCommand } = require('../lib/framework');
const { AIWorkflowEngine } = require('../lib/ai-workflow');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('GigaspecFramework', () => {
  let framework;
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gigaspec-test-'));
    framework = new GigaspecFramework({ outputDir: tempDir });
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('createAnalysisPrompt', () => {
    it('should create a prompt with description', () => {
      const prompt = framework.createAnalysisPrompt('A chat app');
      expect(prompt).toContain('A chat app');
      expect(prompt).toContain('Staff+ Engineer');
      expect(prompt).toContain('--- ANALYSIS ---');
    });

    it('should include weeks in refinement prompt', () => {
      const prompt = framework.createRefinementPrompt('A chat app', ['Q1?', 'Q2?'], ['A1', 'A2'], 8);
      expect(prompt).toContain('8 weeks');
    });
  });

  describe('parseAnalysis', () => {
    it('should parse AI response correctly', () => {
      const aiResponse = `
--- Core Purpose ---
Test purpose

--- User Types ---
Developers

--- Key Features ---
Feature 1
Feature 2

--- Technical Challenges ---
Scaling

--- Scale Expectations ---
1000 users

--- Recommended Stack ---
Node.js/Express

--- Why ---
Fast development

--- Database ---
PostgreSQL

--- Cache Strategy ---
Redis

--- External Services ---
- Stripe
- SendGrid

--- Deployment Platform ---
Railway

--- Questions for User ---
What is the timeline?
What is the budget?

--- Confidence ---
High
`;
      const result = framework.parseAnalysis(aiResponse);
      expect(result.analysis.corePurpose).toBe('Test purpose');
      expect(result.analysis.userTypes).toBe('Developers');
      expect(result.recommendations.stack).toBe('Node.js/Express');
      expect(result.recommendations.database).toBe('PostgreSQL');
      expect(result.questions).toContain('What is the timeline?');
    });
  });

  describe('generate', () => {
    it('should generate all specification files', async () => {
      const config = {
        name: 'TestProject',
        description: 'A test project',
        stack: 'Node.js/Express',
        frontend: 'React/Next.js',
        database: 'PostgreSQL',
        cache: 'Redis',
        services: ['Stripe'],
        deployment: 'Railway',
        weeks: 12,
        team: '2-5'
      };

      const result = await framework.generate(config);

      expect(result.files).toContain('AGENT.md');
      expect(result.files).toContain('ARCHITECTURE.md');
      expect(result.files).toContain('PLAN.md');
      expect(result.files).toContain('STATE.md');
      expect(result.files).toContain('WORKFLOW.md');
      expect(result.files).toContain('SETUP.md');
      expect(result.files).toContain('DEPLOYMENT.md');
      expect(result.files).toContain('ENVIRONMENT.md');

      // Check files were actually created
      for (const file of result.files) {
        const filePath = path.join(tempDir, file);
        expect(await fs.pathExists(filePath)).toBe(true);
      }
    });

    it('should generate infrastructure files', async () => {
      const config = {
        name: 'TestProject',
        stack: 'Node.js/Express',
        frontend: 'React',
        database: 'PostgreSQL',
        cache: 'Redis',
        services: [],
        deployment: 'Railway',
        weeks: 12
      };

      await framework.generate(config);

      expect(await fs.pathExists(path.join(tempDir, 'scripts', 'validate-state.sh'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, '.hooks', 'pre-commit'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, '.github', 'workflows', 'ai-compliance.yml'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, 'prompts', 'plan.md'))).toBe(true);
      expect(await fs.pathExists(path.join(tempDir, '.cursorrules'))).toBe(true);
    });
  });
});

describe('analyzeCommand', () => {
  const mockBrand = {
    title: () => {},
    header: () => {},
    footer: () => {},
    step: () => {},
    divider: () => {},
    success: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    bold: (t) => t,
    cyan: (t) => t,
    reset: '',
    infoColor: (t) => t,
    warnColor: (t) => t,
    successColor: (t) => t
  };

  it('should output JSON when --json flag is set', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    await analyzeCommand('A chat app', { weeks: '12', json: true }, mockBrand);
    
    expect(consoleSpy).toHaveBeenCalled();
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.status).toBe('success');
    expect(output.prompt).toContain('chat app');
    
    consoleSpy.mockRestore();
  });
});

describe('generateCommand', () => {
  let tempDir;
  const mockBrand = {
    title: () => {},
    header: () => {},
    footer: () => {},
    step: () => {},
    divider: () => {},
    success: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    bold: (t) => t,
    cyan: (t) => t,
    reset: '',
    infoColor: (t) => t,
    warnColor: (t) => t,
    successColor: (t) => t
  };

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gigaspec-gen-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  it('should generate from config file with defaults', async () => {
    const configPath = path.join(tempDir, 'config.json');
    await fs.writeJson(configPath, {
      name: 'ConfigTest',
      stack: 'Python/FastAPI'
    });

    const outputDir = path.join(tempDir, 'output');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    await generateCommand({ 
      config: configPath, 
      output: outputDir,
      json: true 
    }, mockBrand);
    
    expect(consoleSpy).toHaveBeenCalled();
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.status).toBe('success');
    expect(output.config.name).toBe('ConfigTest');
    expect(output.config.services).toEqual([]);
    
    consoleSpy.mockRestore();
  });

  it('should handle missing config file gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    
    await generateCommand({ 
      config: '/nonexistent/config.json',
      json: true 
    }, mockBrand);
    
    expect(consoleSpy).toHaveBeenCalled();
    const output = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(output.status).toBe('error');
    
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });
});

describe('AIWorkflowEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new AIWorkflowEngine();
  });

  describe('startNewProject', () => {
    it('should return interview workflow for new projects', async () => {
      const result = await engine.startNewProject();
      
      expect(result.status).toBe('started');
      expect(result.workflow).toBe('new_project');
      expect(result.phase).toBe('interview');
      expect(result.first_question).toBeDefined();
      expect(result.first_question.id).toBe('purpose');
    });
  });

  describe('processInterviewAnswer', () => {
    it('should return next question after each answer', async () => {
      const result = await engine.processInterviewAnswer('purpose', 'A chat app', {});
      
      expect(result.status).toBe('interview_continue');
      expect(result.progress).toBe('1/8');
      expect(result.question).toBeDefined();
      expect(result.answers_so_far.purpose).toBe('A chat app');
    });

    it('should return recommendations after all questions', async () => {
      const answers = {
        purpose: 'Chat app',
        users: 'Small teams',
        key_features: 'Messaging',
        realtime: 'true',
        auth: 'Email',
        payments: 'false',
        scale: '< 100 users',
        team_expertise: 'JavaScript'
      };
      
      const result = await engine.processInterviewAnswer('team_expertise', 'JavaScript', answers);
      
      expect(result.status).toBe('interview_complete');
      expect(result.analysis).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.primary).toBeDefined();
      expect(result.recommendations.primary.stack).toBeDefined();
      expect(result.recommendations.alternatives).toBeInstanceOf(Array);
    });
  });

  describe('startExistingProject', () => {
    let tempDir;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gigaspec-existing-test-'));
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it('should return error for non-existent path', async () => {
      const result = await engine.startExistingProject('/nonexistent/path');
      
      expect(result.status).toBe('error');
    });

    it('should analyze existing codebase', async () => {
      // Create a mock package.json
      await fs.writeJson(path.join(tempDir, 'package.json'), {
        name: 'test-project',
        dependencies: {
          'react': '^18.0.0',
          'express': '^4.0.0'
        },
        devDependencies: {
          'jest': '^29.0.0'
        }
      });

      const result = await engine.startExistingProject(tempDir);
      
      expect(result.status).toBe('analysis_complete');
      expect(result.detected).toBeDefined();
      expect(result.detected.languages).toContain('JavaScript/TypeScript');
      expect(result.gaps).toBeInstanceOf(Array);
      expect(result.interview_questions).toBeInstanceOf(Array);
    });
  });
});
