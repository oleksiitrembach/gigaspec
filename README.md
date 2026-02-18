<div align="center">

<img src="logo.svg" alt="Gigaspec Logo" width="120" height="120">

# 🚀 Gigaspec

### **AI-Native Specification Framework**

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/oleksiitrembach/gigaspec)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()

**The AI does the thinking. We provide the structure.**

[Installation](#installation) • [Quick Start](#quick-start) • [Documentation](#documentation) • [GitHub](https://github.com/oleksiitrembach/gigaspec)

</div>

---

## 🎯 What is Gigaspec?

Gigaspec is an **AI-native collaboration framework** that transforms how software projects are planned and built. Instead of static templates or keyword-based recommendations, Gigaspec enables **deep AI analysis** of your requirements with intelligent Q&A workflows.

### The Problem with Traditional Tools

```
User: "I want to build a real-time collaborative app"
Traditional Tool: "Use Elixir!" ← No questions, no reasoning
```

### The Gigaspec Way

```
User: "I want to build a real-time collaborative app"
AI: "Tell me more! What's your expected user count? Do you need 
     offline support? What's your team's expertise?"
     
     → Analyzes deeply
     → Explains reasoning  
     → Recommends tailored stack
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Native Workflow** | Designed for AI assistants to drive development |
| 💬 **Intelligent Q&A** | AI asks clarifying questions, not keyword matching |
| 📋 **Living Documentation** | STATE.md tracks progress, AGENT.md guides AI coding |
| 🎯 **Stack Recommendations** | Deep analysis with transparent reasoning |
| 🔧 **MCP Server** | Native integration with AI IDEs |
| 📦 **Zero Config** | Works out of the box with sensible defaults |

---

## 🚀 Quick Start

### Installation

```bash
# Global installation
npm install -g gigaspec

# Or use without installing
npx gigaspec init --name "MyApp"
```

### Create Your First Project

```bash
# Interactive AI-guided wizard
gigaspec init

# Or specify your stack directly
gigaspec init --name "MyApp" --stack "Node.js/Next.js"

# Non-interactive with defaults
gigaspec init --name "MyApp" --yes
```

### What Gets Created

```
my-project/
├── AGENT.md           ← AI coding standards & constraints
├── ARCHITECTURE.md    ← System design & decisions  
├── PLAN.md            ← Development roadmap
├── STATE.md           ← Project status (living document)
├── WORKFLOW.md        ← AI development protocols
├── SETUP.md           ← Local development guide
├── DEPLOYMENT.md      ← Production deployment
├── ENVIRONMENT.md     ← Secrets & configuration
├── CLAUDE.md          ← Claude Code integration guide
├── .cursorrules       ← Cursor IDE rules
├── .github/workflows/ ← CI/CD automation
├── .hooks/            ← Git hooks
├── scripts/           ← Utility scripts
└── prompts/           ← AI prompt templates
```

---

## 🤖 For AI Assistants

Gigaspec is built for AI-native workflows. All commands support `--json` for structured output:

```bash
# Start AI workflow
gigaspec init --json

# Get current task to implement  
gigaspec continue --json

# Verify code compliance
gigaspec verify --json
```

### MCP Integration

```bash
# Start MCP server for AI IDE integration
gigaspec-mcp
```

Available tools:
- `gigaspec-init` — Initialize project
- `gigaspec-analyze` — Create analysis prompt
- `gigaspec-generate` — Generate specification files
- `gigaspec-status` — Get project status

---

## 📚 Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `gigaspec init` | Initialize project with AI collaboration framework |
| `gigaspec analyze "<description>"` | Create analysis prompt for AI |
| `gigaspec generate` | Generate specification files |
| `gigaspec status` | Show current project status |
| `gigaspec continue` | Get next development task |
| `gigaspec verify` | Verify code against AGENT.md |

### Options

```bash
# JSON output for AI consumption
gigaspec init --name "MyApp" --json

# Specify stack
gigaspec init --name "MyApp" --stack "Elixir/Phoenix"

# With all options
gigaspec init \
  --name "MyApp" \
  --stack "Node.js/Express" \
  --database "PostgreSQL" \
  --deploy "Railway" \
  --yes
```

---

## 🎓 How It Works

### 1. Describe Your Project

```
"I want to build a math learning app for kids"
```

### 2. AI Analyzes Deeply

The AI receives a structured prompt and:
- ✅ Analyzes core requirements
- ✅ Identifies user types and scale
- ✅ Considers technical challenges
- ✅ Asks clarifying questions

### 3. Intelligent Q&A

```
AI: "I have some questions to better understand your needs:

1. What age range are you targeting?
2. Do you need offline capability?  
3. Will this be free or subscription?
4. Any compliance requirements (COPPA)?"
```

### 4. Tailored Recommendations

```
AI: "Based on your answers, I recommend:

Stack: Next.js 14 with PWA capabilities
Why: PWA gives offline capability, Next.js excels at interactive content

Database: PostgreSQL via Supabase  
Why: Built-in realtime for progress sync, COPPA compliance features

Services: Clerk (COPPA-compliant auth), Stripe (payments)"
```

### 5. Generate & Build

```bash
gigaspec generate --stack "Next.js 14" --name "MathLearn"
```

---

## 🆚 Comparison

|  | Traditional Tools | Gigaspec |
|--|-------------------|----------|
| **Analysis** | Keyword matching | Deep AI reasoning |
| **Questions** | None | Intelligent Q&A |
| **Explanations** | "Use X" | "Use X because of Y" |
| **Tailored** | One-size-fits-all | Project-specific |
| **AI Workflow** | Not designed for AI | Built for AI collaboration |

---

## 📁 Project Structure

When you run `gigaspec init`, you get a complete specification framework:

```
📦 my-project/
├── 📄 AGENT.md              AI coding standards (the "rulebook")
├── 📄 ARCHITECTURE.md       System design & tech decisions
├── 📄 PLAN.md               Development phases & milestones
├── 📄 STATE.md              Current status & next tasks
├── 📄 WORKFLOW.md           AI collaboration protocols
├── 📄 SETUP.md              Environment setup guide
├── 📄 DEPLOYMENT.md         Production deployment
├── 📄 ENVIRONMENT.md        Secrets & configuration
├── 📄 CLAUDE.md             Claude Code integration
├── ⚙️  .cursorrules          Cursor IDE rules
├── 🗂️  .github/workflows/    CI/CD automation
├── 🗂️  .hooks/               Git hooks
├── 🗂️  scripts/              Utility scripts
└── 🗂️  prompts/              AI prompt templates
```

---

## 🧪 Example Walkthrough

See [EXAMPLE.md](EXAMPLE.md) for a complete walkthrough of building a math learning app, including:

- Initial project description
- AI analysis and questions
- Stack recommendation with reasoning
- Full specification generation
- Development workflow

---

## 🔧 Requirements

- **Node.js** >= 16.0.0
- **npm** or **yarn**

---

## 📄 License

Apache License 2.0 — see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for AI-human collaboration**

[⭐ Star us on GitHub](https://github.com/oleksiitrembach/gigaspec) • [🐛 Report Issues](https://github.com/oleksiitrembach/gigaspec/issues)

</div>
