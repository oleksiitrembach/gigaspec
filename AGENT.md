# AGENT.md - AI Coding Standards & Constraints

> **Project**: MyProject  
> **Stack**: Node.js/Express  
> **Last Updated**: 2026-02-18  

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

### Node.js/Express


```typescript
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
```

---

## 🚫 Forbidden Patterns


| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
| `any` type | Loses type safety | Use proper types or `unknown` |
| `console.log` in production | No structured logging | Use winston/pino |
| `==` instead of `===` | Type coercion bugs | Always use `===` |
| Callback hell | Hard to read | Use async/await |


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


```bash
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
```

---

## 📋 Code Review Checklist

- [ ] All functions <10 lines
- [ ] All public functions documented
- [ ] Error handling explicit
- [ ] No forbidden patterns
- [ ] Tests pass (>90% coverage)
- [ ] Static analysis passes
- [ ] STATE.md updated (if needed)
