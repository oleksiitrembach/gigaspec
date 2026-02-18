/**
 * Gigaspec v5.0 - Testing Rules Module
 * Topic-specific testing requirements
 */

function testingRules(config) {
  const coverage = config.coverageTarget || '95';
  
  return `# Testing Rules

> **Module**: Testing  
> **Severity**: REQUIRED  
> **Applies To**: All production code

---

## 1. Test Requirements

### 1.1 Mandatory Tests
You MUST write tests for:
- All public functions
- All API endpoints
- All business logic
- All error handling paths

### 1.2 Test Coverage
- **Minimum**: ${coverage}% line coverage
- **Target**: 100% of critical paths
- **Exclusions**: Configuration, type definitions

---

## 2. Test Types

### 2.1 Unit Tests
- Test one function/component in isolation
- Mock all dependencies
- Fast execution (< 100ms per test)
- Descriptive test names

### 2.2 Integration Tests
- Test component interactions
- Use test database/containers
- Verify end-to-end flows
- Test error scenarios

### 2.3 E2E Tests (Critical Paths)
- Test complete user journeys
- Minimum: authentication, core workflows
- Run in CI/CD pipeline

---

## 3. Test Structure

### 3.1 Test File Organization
\`\`\`
src/
  utils/
    calculate.ts
tests/
  unit/
    utils/
      calculate.test.ts  # Mirrors src structure
  integration/
    api.test.ts
\`\`\`

### 3.2 Test Naming
\`\`\`typescript
// Pattern: should [expected behavior] when [condition]
describe('calculateTotal', () => {
  it('should return correct sum when given valid numbers', () => {});
  it('should throw error when given negative values', () => {});
  it('should handle decimal precision correctly', () => {});
});
\`\`\`

### 3.3 Test Structure (Arrange-Act-Assert)
\`\`\`typescript
it('should process order successfully', async () => {
  // Arrange
  const order = createTestOrder({ items: [item1, item2] });
  
  // Act
  const result = await processOrder(order);
  
  // Assert
  expect(result.success).toBe(true);
  expect(result.data.total).toBe(150.00);
});
\`\`\`

---

## 4. Test Quality

### 4.1 Good Test Characteristics
- Independent (no shared state)
- Repeatable (same result every time)
- Fast (< 100ms ideally)
- Focused (one concept per test)
- Readable (clear intent)

### 4.2 Test Data
- Use factories/fixtures, not hardcoded data
- Create test data per test (no shared fixtures)
- Clean up after tests

---

## 5. Coverage Requirements

### 5.1 Minimum Coverage
\`\`\`
Statements: ${coverage}%
Branches: ${coverage}%
Functions: ${coverage}%
Lines: ${coverage}%
\`\`\`

### 5.2 Coverage Exclusions
- Type definitions
- Configuration files
- Generated code
- Index/barrel files

---

## 6. Test Commands

### 6.1 Common Commands
\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific file
npm test -- calculate.test.ts

# Run in watch mode
npm run test:watch

# Run only changed files
npm run test:changed
\`\`\`

### 6.2 Coverage Report
\`\`\`bash
# Generate HTML report
npm run test:coverage -- --reporter=html

# View report
open coverage/index.html
\`\`\`

---

## 7. Verification

### 7.1 Pre-Commit Checklist
- [ ] All new code has tests
- [ ] All tests pass
- [ ] Coverage ≥ ${coverage}%
- [ ] No test warnings

### 7.2 CI/CD Requirements
- Tests run on every PR
- Coverage report generated
- Coverage cannot decrease
- Failed tests block merge
`;
}

module.exports = { testingRules };
