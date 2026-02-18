/**
 * Gigaspec v5.0 - STATE.md Template
 * Living project status document
 */

function stateTemplate(config) {
  return `# STATE.md - Project State

> **Project**: ${config.name}  
> **Current Phase**: Phase 1 - Setup  
> **Overall Progress**: 0%  
> **Last Updated**: ${new Date().toISOString().split('T')[0]}

---

## ✅ Completed

- [x] Repository initialized
- [x] Gigaspec v5.0 specification generated
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
4. Implement first feature

---

## 📝 Recent Decisions

| Date | Decision | Context |
|------|----------|---------|
| ${new Date().toISOString().split('T')[0]} | Stack: ${config.stack} | Chosen for team expertise |
| ${new Date().toISOString().split('T')[0]} | Database: ${config.database} | Fits data model requirements |
| ${new Date().toISOString().split('T')[0]} | Deployment: ${config.deployment} | Team familiarity |

---

## 📊 Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Test Coverage | 0% | ${config.coverageTarget || '95'}% |
| Open Issues | 0 | 0 |
| Tech Debt Items | 0 | 0 |

---

## 🔗 Quick Links

- [AGENT.md](./AGENT.md) - Coding standards
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [PLAN.md](./PLAN.md) - Development roadmap

---

**⚠️ AI INSTRUCTION**: Before modifying this file, you **MUST**:
1. Read the current contents completely
2. Propose changes to user
3. Get explicit user confirmation
4. Then apply changes
`;
}

module.exports = { stateTemplate };
