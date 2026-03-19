# Test Commands Quick Reference

## Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm test -- --watch

# Run with coverage report
npm run test:coverage
```

## Run Specific Tests

```bash
# Run single file
npm test -- components/student-card.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="useThemeColor"

# Run tests in specific directory
npm test -- __tests__/components/
```

## Debugging

```bash
# Run with verbose output
npm test -- --verbose

# Run single test file in isolation
npm test -- student-card.test.tsx --no-coverage

# Debug with Node inspector
npm test -- --inspect-brk

# Run with specific timeout (ms)
npm test -- --testTimeout=10000
```

## Maintenance

```bash
# Clear Jest cache
npm test -- --clearCache

# Update snapshots
npm test -- --updateSnapshot

# Show all tests without running
npm test -- --listTests

# Run failed tests only
npm test -- --onlyChanged
npm test -- --lastCommit
```

## Performance

```bash
# Run tests in serial (slower but more stable)
npm test -- --maxWorkers=1

# Show slowest tests
npm test -- --logHeapUsage

# Coverage report with lcov (for CI/CD)
npm test -- --coverage --collectCoverageFrom="src/**/*.ts(x)"
```

## Environment Variables

```bash
# Set test environment
NODE_ENV=test npm test

# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm test
```

## Watch Mode Tips

In watch mode, press:

- `a` - Run all tests
- `p` - Filter by file pattern
- `t` - Filter by test name
- `q` - Quit
- `Enter` - Re-run failed tests

## Integration with IDE

### VS Code

- Use Jest extension
- Add to VS Code settings.json:

```json
{
  "jest.runMode": "on-demand"
}
```

### IntelliJ/WebStorm

- Tests > Jest > Configure Jest
- Set Node interpreter and working directory

## Current Test Suite Status

- **Total Tests**: 78
- **Passing**: 40
- **Failing**: 38
- **Execution Time**: ~0.8s
- **Pass Rate**: 51%

## Next Steps

1. Run `npm test -- --verbose` to see failing tests
2. Fix failing tests one by one
3. Run watch mode: `npm test -- --watch`
4. Generate coverage: `npm run test:coverage`
