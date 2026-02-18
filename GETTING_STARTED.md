# Getting Started with MyProject

Welcome! This guide walks you through using Gigaspec to build your project with AI collaboration.

---

## 📖 What You Have Now

After running `gigaspec init`, you have:

```
MyProject/
├── AGENT.md          ← The "rulebook" for AI assistants
├── STATE.md          ← Your project's current status & todo list
├── SETUP.md          ← How to set up your development environment
├── PLAN.md           ← Development roadmap (phases, milestones)
├── ARCHITECTURE.md   ← System design & tech decisions
├── WORKFLOW.md       ← How to work with AI assistants
├── DEPLOYMENT.md     ← How to deploy to production
├── ENVIRONMENT.md    ← Environment variables & secrets
└── GETTING_STARTED.md ← This file!
```

---

## 🚀 Your First Steps (Do This Now)

### Step 1: Check Your Status

```bash
gigaspec status
```

This shows what is next. **Always start here!**

### Step 2: Read STATE.md

Open `STATE.md` and look at **## 📋 Next Priority**.  
This tells you exactly what to work on first.

### Step 3: Do the First Task

Example: If it says "Set up local development environment":

1. Open `SETUP.md`
2. Follow the instructions for Node.js/Express
3. Run the verification commands

### Step 4: Update Your Progress ⭐ IMPORTANT

After completing a task, **edit STATE.md**:

- Move completed items to `## ✅ Completed`
- Update `## 📋 Next Priority`
- This keeps everyone (you + AI) in sync!

### Step 5: Continue the Loop

1. Check `gigaspec status`
2. Do the next task
3. Update `STATE.md`
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

- [ ] Run `gigaspec status`
- [ ] Read STATE.md
- [ ] Complete one task
- [ ] Update STATE.md
- [ ] Tell AI to follow AGENT.md

---

## 🆘 Common Questions

### "What should I work on right now?"

```bash
gigaspec status
```

Look at **Next Priority** section in STATE.md.

### "How do I set up my dev environment?"

Read `SETUP.md` — it has step-by-step instructions for Node.js/Express.

### "The AI isn't following my stack's patterns"

Tell the AI: **"Please read AGENT.md and follow the stack-specific patterns"**

### "How do I track progress?"

Keep `STATE.md` updated! Both you and AI should read it before each session.

---

## 🎯 Success Check

You're using Gigaspec correctly when:

- ✅ You run `gigaspec status` at the start of each session
- ✅ STATE.md accurately shows what's done and what's next
- ✅ AI assistants reference AGENT.md when coding
- ✅ New AI assistants can onboard by reading the docs

---

## 📖 Next Step

**Right now:** Run `gigaspec status` and do the first item in "Next Priority"!

---

**Remember:** The docs only work if you keep them updated! 🚀
