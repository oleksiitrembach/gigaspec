# WORKFLOW.md - AI Development Protocol

> **Project**: MyProject  
> **Stack**: Node.js/Express  

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


```bash
# Static analysis
npm run lint
npx tsc --noEmit

# Testing
npm test
```

---

## 🔄 State Transition Rules

- Update STATE.md after each completed task
- Mark blockers immediately when discovered
- Archive completed items monthly
