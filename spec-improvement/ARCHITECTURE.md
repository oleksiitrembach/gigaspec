# ARCHITECTURE.md - Gigaspec System Design

> **Project**: Gigaspec Framework  
> **Version**: 4.0.0  
> **Last Updated**: 2026-02-18  

---

## 📋 Overview

Gigaspec is a Node.js-based AI collaboration framework with two primary interfaces:
- **CLI** (`bin/gigaspec.js`) - Human-facing command-line tool
- **MCP Server** (`bin/mcp-server.js`) - AI IDE integration

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Terminal   │  │  AI IDE      │  │  Scripts/CI          │  │
│  │   (CLI)      │  │  (MCP)       │  │  (JSON mode)         │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼──────────────┘
          │                 │                     │
          └─────────────────┴─────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    GIGASPEC FRAMEWORK                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              lib/framework.js                            │   │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │   │
│  │  │  Analysis  │  │ Interactive│  │   Generation    │   │   │
│  │  │  Engine    │  │   Wizard   │  │    Engine       │   │   │
│  │  └────────────┘  └────────────┘  └─────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              lib/templates.js                            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │AGENT.md  │ │PLAN.md   │ │STATE.md  │ │ ...      │   │   │
│  │  │template  │ │template  │ │template  │ │templates │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │  Output:      │
                    │  Spec Files   │
                    │  + Scripts    │
                    └───────────────┘
```

---

## 🏗️ Component Breakdown

### 1. CLI Layer (`bin/gigaspec.js`)

**Responsibilities:**
- Parse command-line arguments
- Handle interactive prompts (via `inquirer`)
- Format output (text vs JSON)
- Delegate to framework

**Commands:**
| Command | Function | Output Modes |
|---------|----------|--------------|
| `init` | `initCommand()` | Interactive, JSON, Non-interactive |
| `analyze` | `analyzeCommand()` | Text, JSON |
| `generate` | `generateCommand()` | Text, JSON |
| `status` | Reads STATE.md | Text, JSON |
| `wizard` | `interactiveSetup()` | Interactive only |

### 2. MCP Server (`bin/mcp-server.js`)

**Responsibilities:**
- Expose tools via Model Context Protocol
- Handle JSON-RPC requests
- Maintain stateless operation

**Tools:**
| Tool | Input Schema | Returns |
|------|--------------|---------|
| `gigaspec-init` | `InitInputSchema` | Generated files list |
| `gigaspec-analyze` | `AnalyzeInputSchema` | Analysis prompt |
| `gigaspec-generate` | `GenerateInputSchema` | Generated files list |
| `gigaspec-status` | `StatusInputSchema` | Project status |
| `gigaspec-wizard` | `WizardInputSchema` | Instructions (interactive only) |

### 3. Framework Core (`lib/framework.js`)

**GigaspecFramework Class:**

```javascript
class GigaspecFramework {
  constructor(options)
  
  // Analysis
  createAnalysisPrompt(description, context)
  createRefinementPrompt(description, questions, answers, weeks)
  parseAnalysis(aiResponse)
  parseRefinement(aiResponse)
  
  // Interaction
  interactiveSetup()
  
  // Generation
  generate(config)
  createStructuredOutput(analysis, recommendations, config)
  
  // Private helpers
  _extractSections(text)
  _extractValue(text)
  _extractList(text)
  _extractPhases(text)
  _generateInfrastructure(outputDir, config)
}
```

### 4. Templates (`lib/templates.js`)

**Template Functions:**
- `agent(config)` → AGENT.md
- `architecture(config)` → ARCHITECTURE.md
- `plan(config)` → PLAN.md
- `state(config)` → STATE.md
- `workflow(config)` → WORKFLOW.md
- `setup(config)` → SETUP.md
- `deployment(config)` → DEPLOYMENT.md
- `environment(config)` → ENVIRONMENT.md
- `gettingStarted(config)` → GETTING_STARTED.md

---

## 💾 Data Flow

### Init Flow
```
CLI/MCP → framework.js → templates.js → Files
              ↓              ↓
         Validation    Stack-specific
                       content
```

### Analysis Flow
```
User Input → createAnalysisPrompt() → AI Assistant
                                               ↓
User Answers ← Ask Questions ← Parse Response ←┘
       ↓
createRefinementPrompt() → Final Recommendations
```

---

## 🔌 Integration Points

### NPM Package
- Entry: `lib/framework.js` (main)
- CLI: `bin/gigaspec.js`
- MCP: `bin/mcp-server.js`

### MCP Configuration
```json
{
  "mcpServers": {
    "gigaspec": {
      "command": "gigaspec-mcp"
    }
  }
}
```

---

## 🔒 Security Considerations

- No network calls from MCP server
- File system access limited to `outputDir`
- No secret handling in framework
- Templates don't contain executable code

---

## 🚀 Performance Targets

| Metric | Target |
|--------|--------|
| Init command | < 500ms |
| File generation | < 100ms |
| MCP tool call | < 100ms |
| Memory usage | < 50MB |
