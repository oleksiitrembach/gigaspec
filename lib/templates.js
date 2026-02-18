// Embedded templates for gigaspec
// These are functions that take config and return markdown content

function agent(config) {
  const stack = config.stack || 'Node.js/Express';
  const stackLower = stack.toLowerCase();
  
  let verificationCommands = '';
  let forbiddenPatterns = '';
  let stackPatterns = '';
  
  if (stackLower.includes('elixir')) {
    verificationCommands = `
\`\`\`bash
# Run all checks
mix check

# Type checking
mix dialyzer

# Linting
mix credo --strict

# Formatting
mix format --check-formatted

# Testing
mix test

# Coverage
mix coveralls
\`\`\``;
    forbiddenPatterns = `
| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
| \`String.to_atom/1\` on user input | Atom table exhaustion | Use strings or \`String.to_existing_atom/1\` |
| \`IO.puts\` in production | No structured logging | Use Logger |
| Deep nesting (>2 levels) | Hard to read | Extract functions |
| No @spec on public functions | Poor type safety | Always add @spec |
`;
    stackPatterns = `
\`\`\`elixir
# ✅ DO: Use Result types
def process(data) do
  with {:ok, validated} <- validate(data),
       {:ok, result} <- save(validated) do
    {:ok, result}
  else
    {:error, reason} -> {:error, reason}
  end
end

# ✅ DO: Pattern match in function heads
def handle({:ok, data}), do: process_success(data)
def handle({:error, reason}), do: process_error(reason)

# ❌ DON'T: Use exceptions for control flow
try do
  risky_operation()
rescue
  _ -> nil
end
\`\`\``;
  } else if (stackLower.includes('node') || stackLower.includes('next')) {
    verificationCommands = `
\`\`\`bash
# Run all checks
npm run lint && npm run type-check && npm run test

# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Testing
npm test

# Coverage
npm run test:coverage
\`\`\``;
    forbiddenPatterns = `
| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
| \`any\` type | Loses type safety | Use proper types or \`unknown\` |
| \`console.log\` in production | No structured logging | Use winston/pino |
| \`==\` instead of \`===\` | Type coercion bugs | Always use \`===\` |
| Callback hell | Hard to read | Use async/await |
`;
    stackPatterns = `
\`\`\`typescript
// ✅ DO: Use explicit return types
async function createUser(data: CreateUserInput): Promise<Result<User, Error>> {
  const validated = await validate(data);
  if (!validated.success) {
    return { success: false, error: validated.error };
  }
  return { success: true, data: await db.user.create(validated.data) };
}

// ✅ DO: Use Result types
 type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

// ❌ DON'T: Throw for expected errors
function getUser(id: string) {
  if (!id) throw new Error('Invalid ID'); // Don't do this
}
\`\`\``;
  } else if (stackLower.includes('python')) {
    verificationCommands = `
\`\`\`bash
# Run all checks
pytest && mypy && ruff check .

# Type checking
mypy .

# Linting
ruff check .
black --check .

# Testing
pytest

# Coverage
pytest --cov=.
\`\`\``;
    forbiddenPatterns = `
| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
| Bare \`except:\` | Catches all exceptions | Use \`except SpecificError:\` |
| \`print()\` in production | No structured logging | Use logging module |
| Mutable default args | Unexpected behavior | Use \`None\` and initialize inside |
| No type hints | Poor maintainability | Add type hints everywhere |
`;
    stackPatterns = `
\`\`\`python
# ✅ DO: Use type hints
from typing import Optional, Result

def create_user(data: UserInput) -> Result[User, ValidationError]:
    validated = validate(data)
    if not validated.is_valid:
        return Err(validated.errors)
    return Ok(db.users.create(validated.data))

# ✅ DO: Use explicit error handling
with contextlib.suppress(FileNotFoundError):
    os.remove(filename)

# ❌ DON'T: Use bare except
except:  # Don't do this
    pass
\`\`\``;
  } else {
    verificationCommands = `
\`\`\`bash
# Run all checks
[your verification commands here]

# Testing
[your test commands]
\`\`\``;
    forbiddenPatterns = `
| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
| Debug statements in production | No structured logging | Use proper logging |
| Deep nesting (>2 levels) | Hard to read | Extract functions |
`;
    stackPatterns = `
\`\`\`
# Add stack-specific patterns here
\`\`\``;
  }
  
  return `# AGENT.md - AI Coding Standards & Constraints

> **Project**: ${config.name}  
> **Stack**: ${stack}  
> **Last Updated**: ${new Date().toISOString().split('T')[0]}  

This document is the BIBLE for AI agents working on this project.

---

## 🏆 Golden Rules (Non-Negotiable)

1. **Max 10 lines per function** - Extract helpers if needed
2. **Max 3 arguments per function** - Use structs/objects for complex inputs
3. **No nested conditionals deeper than 2 levels** - Flatten with early returns
4. **All public functions must have types/docs**
5. **Explicit error handling** - No silent failures
6. **Emit events for state changes** - Audit trail is mandatory
7. **Write tests with implementation** - Not after
8. **No code without verification** - All checks must pass

---

## 🛠️ Stack-Specific Patterns

### ${stack}

${stackPatterns}

---

## 🚫 Forbidden Patterns

${forbiddenPatterns}

---

## 🧪 Testing Requirements

- **Unit tests**: >90% line coverage
- **Integration tests**: All API endpoints
- **E2E tests**: Critical user flows

---

## ⚡ Performance Constraints

| Metric | Target | Maximum |
|--------|--------|---------|
| p50 response | <50ms | 100ms |
| p95 response | <200ms | 500ms |
| p99 response | <500ms | 1000ms |
| Database query | <10ms | 50ms |

---

## 🔍 Verification Commands

${verificationCommands}

---

## 📋 Code Review Checklist

- [ ] All functions <10 lines
- [ ] All public functions documented
- [ ] Error handling explicit
- [ ] No forbidden patterns
- [ ] Tests pass (>90% coverage)
- [ ] Static analysis passes
- [ ] STATE.md updated (if needed)
`;
}

function architecture(config) {
  return `# ARCHITECTURE.md - System Design

> **Project**: ${config.name}  
> **Stack**: ${config.stack}  
> **Last Updated**: ${new Date().toISOString().split('T')[0]}  

---

## 📋 Overview

${config.name} is built with ${config.stack}, using ${config.database} for data storage${config.cache !== 'None needed' ? ` and ${config.cache} for caching` : ''}.

---

## 🏗️ Component Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Mobile App  │  │   API Clients│      │
│  │  (${config.frontend})  │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │ HTTPS/JSON
┌───────────────────────────▼─────────────────────────────────┐
│                         API LAYER                            │
│                    (${config.stack})                          │
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
│  │ ${config.database.padEnd(10)} │  │ ${config.cache !== 'None needed' ? config.cache : 'No Cache    '} │  │  External  │            │
│  │  (Primary) │  │  ${config.cache !== 'None needed' ? '(Cache)   ' : '          '} │  │  Services  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 💾 Database Schema

Key entities:
- **Users** - Authentication and profiles
- **Sessions** - User sessions and tokens
${config.services.some(s => s.includes('Stripe')) ? '- **Subscriptions** - Billing and plans' : ''}
${config.services.some(s => s.includes('S3') || s.includes('file')) ? '- **Files** - Uploaded file metadata' : ''}

---

## 🔌 External Services

${config.services.map(s => `- **${s}**`).join('\n') || '- None required for MVP'}

---

## 🔒 Security

- JWT-based authentication
- HTTPS only in production
- Input validation at API boundaries
- Parameterized queries (SQL injection prevention)
`;
}

function plan(config) {
  const weeks = parseInt(config.weeks) || 12;
  
  let phases = '';
  if (weeks <= 4) {
    phases = `
| Phase | Weeks | Focus | Milestone |
|-------|-------|-------|-----------|
| 1 | 1-2 | Foundation | Dev environment, core architecture |
| 2 | 3-${weeks} | MVP | Core features working |`;
  } else if (weeks <= 8) {
    phases = `
| Phase | Weeks | Focus | Milestone |
|-------|-------|-------|-----------|
| 1 | 1-2 | Foundation | Dev setup, auth, database |
| 2 | 3-5 | Core Features | Main functionality |
| 3 | 6-${weeks} | Polish | Testing, optimization, deployment |`;
  } else {
    phases = `
| Phase | Weeks | Focus | Milestone |
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

- [ ] Code follows AGENT.md
- [ ] Tests >90% coverage
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] STATE.md updated
`;
}

function state(config) {
  return `# STATE.md - Current Project State

> **Project**: ${config.name}  
> **Last Updated**: ${new Date().toISOString().split('T')[0]}  
> **Current Phase**: Phase 1 - Setup  
> **Overall Progress**: 0%  

---

## ✅ Completed

- [x] Repository initialized
- [x] Gigaspec documentation generated
- [x] Technical stack decided: ${config.stack}

---

## 🔄 In Progress

- [ ] Development environment setup
- [ ] Core architecture implementation

---

## 🚫 Blockers

- None

---

## 📋 Next Priority

1. Set up local development environment
2. Initialize ${config.database} database
3. Create base project structure

---

## 📝 Recent Decisions

| Date | Decision |
|------|----------|
| ${new Date().toISOString().split('T')[0]} | Stack: ${config.stack} |
| ${new Date().toISOString().split('T')[0]} | Database: ${config.database} |
| ${new Date().toISOString().split('T')[0]} | Deployment: ${config.deployment} |
`;
}

function workflow(config) {
  const stack = config.stack || 'Node.js';
  
  let verifyCommands = '';
  if (stack.toLowerCase().includes('elixir')) {
    verifyCommands = `
\`\`\`bash
# Static analysis
mix credo --strict
mix dialyzer

# Testing
mix test

# Coverage
mix coveralls
\`\`\``;
  } else if (stack.toLowerCase().includes('node')) {
    verifyCommands = `
\`\`\`bash
# Static analysis
npm run lint
npx tsc --noEmit

# Testing
npm test
\`\`\``;
  } else if (stack.toLowerCase().includes('python')) {
    verifyCommands = `
\`\`\`bash
# Static analysis
mypy .
ruff check .

# Testing
pytest
\`\`\``;
  }
  
  return `# WORKFLOW.md - AI Development Protocol

> **Project**: ${config.name}  
> **Stack**: ${stack}  

---

## 💬 Commands Reference

| Command | AI Action |
|---------|-----------|
| "Familiarize yourself" | Read all docs, confirm understanding |
| "CONTINUE" | Pick up from STATE.md "Next Priority" |
| "STATUS" | Report current state |
| "RESET" | Re-read STATE.md, restart context |
| "PLAN [feature]" | Create implementation plan |
| "IMPLEMENT [feature]" | Execute implementation |
| "VERIFY" | Run all verification checks |
| "UPDATE STATE" | Refresh STATE.md |

---

## 🛠️ Stack-Specific Verification

${verifyCommands}

---

## 🔄 State Transition Rules

- Update STATE.md after each completed task
- Mark blockers immediately when discovered
- Archive completed items monthly
`;
}

function setup(config) {
  const stack = config.stack || 'Node.js';
  const stackLower = stack.toLowerCase();
  
  let installInstructions = '';
  let verifyInstructions = '';
  
  if (stackLower.includes('elixir')) {
    installInstructions = `
### macOS
\`\`\`bash
# Install asdf version manager
brew install asdf
echo '. /opt/homebrew/opt/asdf/libexec/asdf.sh' >> ~/.zshrc

# Add plugins
asdf plugin add erlang
asdf plugin add elixir

# Install versions
cd ${config.name} && asdf install
\`\`\`

### Linux
\`\`\`bash
# Install dependencies
sudo apt-get install erlang elixir
\`\`\``;
    verifyInstructions = `
\`\`\`bash
# Verify installation
elixir --version
# Expected: Elixir 1.16.x

# Install dependencies
mix deps.get

# Setup database
mix ecto.setup

# Start server
mix phx.server
\`\`\`

Visit http://localhost:4000`;
  } else if (stackLower.includes('node') || stackLower.includes('next')) {
    installInstructions = `
### macOS/Linux
\`\`\`bash
# Install Node.js 18+
nvm install 18
nvm use 18
\`\`\``;
    verifyInstructions = `
\`\`\`bash
# Verify installation
node --version
# Expected: v18.x.x

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development
npm run dev
\`\`\`

Visit http://localhost:3000`;
  } else if (stackLower.includes('python')) {
    installInstructions = `
### macOS/Linux
\`\`\`bash
# Install Python 3.11+
brew install python@3.11  # macOS
sudo apt install python3.11  # Ubuntu

# Create virtual environment
python3 -m venv venv
source venv/bin/activate
\`\`\``;
    verifyInstructions = `
\`\`\`bash
# Verify installation
python --version
# Expected: Python 3.11.x

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Start server
uvicorn main:app --reload
\`\`\`

Visit http://localhost:8000`;
  } else {
    installInstructions = `
### Install ${stack}
[Add installation instructions for ${stack}]`;
    verifyInstructions = `
\`\`\`bash
# Verify installation
[your verification commands]
\`\`\``;
  }
  
  return `# SETUP.md - Local Development Guide

> **Project**: ${config.name}  
> **Stack**: ${stack}  

---

## 📋 Prerequisites

- ${stack.split('/')[0]} 
- ${config.database}
${config.cache !== 'None needed' ? `- ${config.cache}` : ''}
- Git

---

## 🚀 Installation

${installInstructions}

---

## ✅ Verification

${verifyInstructions}

---

## 🐛 Troubleshooting

### Port already in use
\`\`\`bash
# Find and kill process
lsof -i :4000  # or :3000, :8000
kill -9 <PID>
\`\`\`

### Database connection failed
\`\`\`bash
# Check database is running
${config.database.toLowerCase().includes('postgres') ? 'pg_isready' : '[check command]'}
\`\`\`
`;
}

function deployment(config) {
  const platform = config.deployment || 'Railway';
  const platformLower = platform.toLowerCase();
  
  let deployInstructions = '';
  let configFile = '';
  
  if (platformLower.includes('fly')) {
    deployInstructions = `
\`\`\`bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Create app
fly apps create ${config.name.toLowerCase().replace(/\s+/g, '-')}

# Create database
fly postgres create --name ${config.name.toLowerCase().replace(/\s+/g, '-')}-db

# Deploy
fly deploy
\`\`\``;
    configFile = `
\`\`\`toml
# fly.toml
app = "${config.name.toLowerCase().replace(/\s+/g, '-')}"
primary_region = "iad"

[build]

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
\`\`\``;
  } else if (platformLower.includes('railway')) {
    deployInstructions = `
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
\`\`\``;
    configFile = `
\`\`\`json
// railway.json
{
  "\$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
\`\`\``;
  } else if (platformLower.includes('vercel')) {
    deployInstructions = `
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
\`\`\``;
    configFile = `
\`\`\`json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ]
}
\`\`\``;
  } else {
    deployInstructions = `
\`\`\`bash
# Deploy to ${platform}
[Add deployment commands for ${platform}]
\`\`\``;
    configFile = `
\`\`\`
# Add ${platform} configuration
\`\`\``;
  }
  
  return `# DEPLOYMENT.md - Production Deployment

> **Project**: ${config.name}  
> **Platform**: ${platform}  

---

## 🚀 Deployment

${deployInstructions}

---

## ⚙️ Configuration

${configFile}

---

## 🔐 Environment Variables

\`\`\`bash
# Set secrets
${platformLower.includes('fly') ? 'fly secrets set' : platformLower.includes('railway') ? 'railway variables set' : '# Set environment variables'} SECRET_KEY_BASE="$(openssl rand -hex 48)"
${platformLower.includes('fly') ? 'fly secrets set' : platformLower.includes('railway') ? 'railway variables set' : '# Set environment variables'} DATABASE_URL="[your-db-url]"
\`\`\`

---

## ↩️ Rollback

\`\`\`bash
# Rollback to previous version
${platformLower.includes('fly') ? 'fly deploy --image-ref [previous-image]' : platformLower.includes('railway') ? 'railway rollback' : '# Rollback command'}
\`\`\`

---

## 💰 Cost Estimates

| Resource | Monthly Cost |
|----------|--------------|
| Compute | ~$20-50 |
| Database | ~$15-30 |
| **Total** | **~$35-80** |
`;
}

function environment(config) {
  return `# ENVIRONMENT.md - Secrets & Configuration

> **Project**: ${config.name}  

---

## 🔑 Required Variables

| Variable | Purpose | How to Obtain |
|----------|---------|---------------|
| \`SECRET_KEY_BASE\` | Session encryption | \`openssl rand -hex 48\` |
| \`DATABASE_URL\` | Database connection | From ${config.deployment} dashboard |
${config.cache !== 'None needed' ? '| `REDIS_URL` | Cache connection | From ' + config.deployment + ' dashboard |' : ''}
${config.services.map(s => `| \`${s.split(' ')[0].toUpperCase()}_API_KEY\` | ${s} API | From ${s.split(' ')[0]} dashboard |`).join('\n')}

---

## 🖥️ Local Development

\`\`\`bash
# Copy example environment
cp .env.example .env

# Edit with your values
${process.platform === 'darwin' ? 'open -e' : 'nano'} .env
\`\`\`

---

## 🚀 Production

${config.deployment} handles secrets securely. Never commit \`.env\` to git.

---

## ⚠️ Security

- NEVER commit secrets to git
- Rotate API keys every 90 days
- Use different keys for each environment
`;
}

function gettingStarted(config) {
  return `# Getting Started with ${config.name}

Welcome! This guide walks you through using Gigaspec to build your project with AI collaboration.

---

## 📖 What You Have Now

After running \`gigaspec init\`, you have:

\`\`\`
${config.name}/
├── AGENT.md          ← The "rulebook" for AI assistants
├── STATE.md          ← Your project's current status & todo list
├── SETUP.md          ← How to set up your development environment
├── PLAN.md           ← Development roadmap (phases, milestones)
├── ARCHITECTURE.md   ← System design & tech decisions
├── WORKFLOW.md       ← How to work with AI assistants
├── DEPLOYMENT.md     ← How to deploy to production
├── ENVIRONMENT.md    ← Environment variables & secrets
└── GETTING_STARTED.md ← This file!
\`\`\`

---

## 🚀 Your First Steps (Do This Now)

### Step 1: Check Your Status

\`\`\`bash
gigaspec status
\`\`\`

This shows what is next. **Always start here!**

### Step 2: Read STATE.md

Open \`STATE.md\` and look at **## 📋 Next Priority**.  
This tells you exactly what to work on first.

### Step 3: Do the First Task

Example: If it says "Set up local development environment":

1. Open \`SETUP.md\`
2. Follow the instructions for ${config.stack}
3. Run the verification commands

### Step 4: Update Your Progress ⭐ IMPORTANT

After completing a task, **edit STATE.md**:

- Move completed items to \`## ✅ Completed\`
- Update \`## 📋 Next Priority\`
- This keeps everyone (you + AI) in sync!

### Step 5: Continue the Loop

1. Check \`gigaspec status\`
2. Do the next task
3. Update \`STATE.md\`
4. Repeat!

---

## 🤖 Working with AI Assistants

### Before AI Starts Coding

Always tell the AI:

> "Please read AGENT.md and STATE.md before we start"

This gives the AI:
- Coding standards (from AGENT.md)
- Current context (from STATE.md)
- What's next (from Next Priority)

### Quick AI Commands

| You Say | AI Does |
|---------|---------|
| "What should I work on?" | Reads STATE.md → Tells you next task |
| "Let's implement [feature]" | Reads PLAN.md → Creates plan → Implements |
| "Review this code" | Checks AGENT.md → Reviews against standards |
| "I'm done" | Updates STATE.md → Suggests next step |

---

## 📚 Document Quick Reference

| Document | When to Read |
|----------|--------------|
| **STATE.md** | ✅ At start of every session |
| **AGENT.md** | ✅ Before writing any code |
| **SETUP.md** | Setting up dev environment |
| **PLAN.md** | Planning new features |
| **WORKFLOW.md** | Understanding AI collaboration |

---

## ✅ Daily Checklist

- [ ] Run \`gigaspec status\`
- [ ] Read STATE.md
- [ ] Complete one task
- [ ] Update STATE.md
- [ ] Tell AI to follow AGENT.md

---

## 🆘 Common Questions

### "What should I work on right now?"

\`\`\`bash
gigaspec status
\`\`\`

Look at **Next Priority** section in STATE.md.

### "How do I set up my dev environment?"

Read \`SETUP.md\` — it has step-by-step instructions for ${config.stack}.

### "The AI isn't following my stack's patterns"

Tell the AI: **"Please read AGENT.md and follow the stack-specific patterns"**

### "How do I track progress?"

Keep \`STATE.md\` updated! Both you and AI should read it before each session.

---

## 🎯 Success Check

You're using Gigaspec correctly when:

- ✅ You run \`gigaspec status\` at the start of each session
- ✅ STATE.md accurately shows what's done and what's next
- ✅ AI assistants reference AGENT.md when coding
- ✅ New AI assistants can onboard by reading the docs

---

## 📖 Next Step

**Right now:** Run \`gigaspec status\` and do the first item in "Next Priority"!

---

**Remember:** The docs only work if you keep them updated! 🚀
`;
}

module.exports = {
  agent,
  architecture,
  plan,
  state,
  workflow,
  setup,
  deployment,
  environment,
  gettingStarted
};
