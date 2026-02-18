# AGENT.md - Gigaspec Self-Improvement Standards

> **Project**: Gigaspec Self-Improvement  
> **Stack**: Node.js/Express/MCP  
> **Last Updated**: 2026-02-18  
> **Version**: 4.0.0 → 5.0.0

This document guides AI agents improving the gigaspec framework itself.

---

## 🎯 Self-Improvement Philosophy

**Gigaspec improves itself through structured iteration:**

1. **Analyze** current capabilities and gaps
2. **Propose** improvements with clear rationale
3. **Implement** with backward compatibility
4. **Validate** against existing tests
5. **Document** changes in CHANGELOG.md

---

## 🏆 Golden Rules for Framework Changes

1. **Backward Compatibility First** - Never break existing CLI/MCP contracts
2. **Test Coverage ≥ 95%** for new features
3. **Version Bump Appropriately** - Follow semver
4. **Update All Docs** - AGENT.md, ARCHITECTURE.md, README.md
5. **MCP Tool Changes** - Must update tool schemas + descriptions
6. **Template Changes** - Test across all supported stacks
7. **CLI Changes** - Maintain JSON output contract
8. **No Breaking Changes** without major version bump

---

## 🛠️ Stack-Specific Patterns (Gigaspec Internals)

### MCP Server Development

```javascript
// ✅ DO: Use Zod schemas with descriptions
const InitInputSchema = z.object({
  name: z.string().optional().describe('Project name'),
  stack: z.string().optional().describe('Tech stack')
});

// ✅ DO: Return structured JSON content
return {
  content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
};

// ❌ DON'T: Return plain text without structure
return { content: [{ type: 'text', text: "Done!" }] };
```

### CLI Development

```javascript
// ✅ DO: Support both interactive and JSON modes
async function command(options, brand) {
  if (options.json) {
    return { status: 'success', data: result };
  }
  // Interactive output
  brand.success('Done!');
}

// ✅ DO: Validate inputs early
if (!options.stack && !options.yes) {
  return { status: 'help_shown' };
}
```

### Template Development

```javascript
// ✅ DO: Use function-based templates with config param
function myTemplate(config) {
  return `# My Doc
> Project: ${config.name}
Stack: ${config.stack}
`;
}

// ✅ DO: Handle missing config gracefully
const stack = config.stack || 'Node.js/Express';
```

---

## 🚫 Forbidden Patterns

| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
| `process.exit()` in MCP | Kills server | Return error response |
| Breaking CLI output format | Breaks parsing | Add new fields, don't change existing |
| Hardcoded paths | Not portable | Use `path.join()` |
| `fs` without `fs-extra` | Inconsistent API | Always use `fs-extra` |
| Missing Zod validation | Runtime errors | Validate all inputs |
| No tests for new features | Regression risk | Write tests first |

---

## 🧪 Testing Requirements

- **Unit tests**: Every public function
- **Integration tests**: CLI commands, MCP tools
- **Template tests**: All generated documents
- **Compatibility tests**: Backward compatibility verification

```bash
# Run all checks before commit
npm test
npm run test:coverage  # Must be ≥ 95%
```

---

## 🔄 Improvement Workflow

### Phase 1: Analysis
1. Read current STATE.md
2. Identify improvement from IMPROVEMENTS.md
3. Check related code (framework.js, templates.js, mcp-server.js)

### Phase 2: Design
1. Draft changes in comments
2. Verify backward compatibility
3. Update tests if needed

### Phase 3: Implementation
1. Make minimal changes
2. Add/update tests
3. Run full test suite

### Phase 4: Documentation
1. Update CHANGELOG.md
2. Update relevant .md files
3. Update IMPLEMENTATION_SUMMARY.md if major

---

## 📋 Code Review Checklist

- [ ] No breaking changes (or major version bump)
- [ ] Tests added/updated
- [ ] Coverage ≥ 95%
- [ ] MCP schema updated if needed
- [ ] CLI JSON output valid
- [ ] Templates tested across stacks
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
