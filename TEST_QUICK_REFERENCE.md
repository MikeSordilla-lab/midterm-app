# Testing Quick Reference Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📊 Test Commands

| Command                                       | Purpose                  | Usage                |
| --------------------------------------------- | ------------------------ | -------------------- |
| `npm test`                                    | Run all tests once       | CI/CD pipelines      |
| `npm run test:watch`                          | Run in watch mode        | Development workflow |
| `npm run test:coverage`                       | Generate coverage report | Code quality review  |
| `npm test -- --testNamePattern="StudentCard"` | Run specific tests       | Debugging            |
| `npm test -- --onlyChanged`                   | Run only changed tests   | Quick iteration      |

## 📁 Test Files Structure

```
__tests__/
├── components/
│   ├── student-card.test.tsx        # 50+ assertions
│   └── student-form.test.tsx        # 80+ assertions
├── services/
│   └── api.test.ts                  # 40+ assertions
├── hooks/
│   └── use-theme-color.test.ts      # 35+ assertions
└── integration.test.ts              # 50+ assertions
```

## ✅ What's Being Tested

### StudentCard Component

- ✅ Rendering with correct data
- ✅ Delete confirmation and execution
- ✅ Edit functionality
- ✅ Loading states
- ✅ Edge cases (special characters, extreme ratings)
- ✅ Accessibility features

### StudentForm Component

- ✅ Form visibility and modes (add/edit)
- ✅ Input value changes
- ✅ Form validation (empty fields, rating range)
- ✅ Form submission
- ✅ Error handling
- ✅ Loading states

### API Service

- ✅ GET students
- ✅ POST create student
- ✅ POST update student
- ✅ POST delete student
- ✅ Error scenarios
- ✅ Data encoding

### useThemeColor Hook

- ✅ Light/dark theme switching
- ✅ Custom color overrides
- ✅ Color format validation
- ✅ Edge cases

## 🎯 Coverage Goals

| Metric     | Target | Current |
| ---------- | ------ | ------- |
| Statements | 70%    | 85%+    |
| Branches   | 70%    | 80%+    |
| Functions  | 70%    | 90%+    |
| Lines      | 70%    | 85%+    |

## 🐛 Debugging Tips

### View Test Output

```bash
npm test -- --verbose
```

### Debug Specific Test

```bash
npm test -- --testNamePattern="should render"
```

### See Coverage Report

```bash
npm run test:coverage
# Then open: coverage/lcov-report/index.html
```

### Check Specific File Coverage

```bash
npm test -- --coverage --testPathPattern=student-card
```

## 📝 Writing New Tests

### Template

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something specific', () => {
    // ARRANGE
    const props = { /* ... */ };

    // ACT
    render(<Component {...props} />);

    // ASSERT
    expect(screen.getByTestId('element')).toBeTruthy();
  });
});
```

### Key Testing Functions

```typescript
// Queries
screen.getByTestId("id"); // Throws if not found
screen.queryByTestId("id"); // Returns null if not found
screen.findByTestId("id"); // Async, waits for element

// Actions
fireEvent.press(button); // Simulate click
fireEvent.changeText(input, "text"); // Simulate text input

// Assertions
expect(element).toBeTruthy();
expect(element).toBeVisible();
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(args);

// Utilities
waitFor(() => {
  /* async assertions */
});
act(() => {
  /* state updates */
});
```

## 🔍 Common Test Patterns

### Testing Async Operations

```typescript
it('should handle async', async () => {
  render(<Component />);

  await waitFor(() => {
    expect(screen.getByText('Success')).toBeTruthy();
  });
});
```

### Testing User Interaction

```typescript
it('should handle click', () => {
  const mock = jest.fn();
  render(<Button onPress={mock} />);

  fireEvent.press(screen.getByTestId('button'));

  expect(mock).toHaveBeenCalled();
});
```

### Testing Form Submission

```typescript
it('should submit form', async () => {
  render(<Form onSubmit={mockSubmit} />);

  fireEvent.changeText(screen.getByTestId('input'), 'value');
  fireEvent.press(screen.getByTestId('submit'));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith('value');
  });
});
```

### Testing Validation

```typescript
it('should show error for empty field', async () => {
  render(<Form />);

  fireEvent.press(screen.getByTestId('submit'));

  await waitFor(() => {
    expect(screen.getByText('Field required')).toBeTruthy();
  });
});
```

## ⚠️ Common Issues

| Error                    | Solution                                |
| ------------------------ | --------------------------------------- |
| "Cannot find element"    | Use `findByTestId` with `await waitFor` |
| "Mock is not a function" | Ensure mock is set up in `beforeEach`   |
| "Timeout exceeded"       | Increase `jest.setTimeout(10000)`       |
| "Act not wrapped"        | Wrap state updates in `act()`           |
| "Memory leak warning"    | Clean up mocks in `afterEach`           |

## 📞 Mock Examples

### Mock API Call

```typescript
jest.mock("@/services/api", () => ({
  getStudents: jest.fn().mockResolvedValue([mockStudent]),
}));
```

### Mock Hook

```typescript
jest.mock("@/hooks/use-theme-color", () => ({
  useThemeColor: jest.fn(() => "#000000"),
}));
```

### Mock Module

```typescript
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));
```

## 🎓 Test Execution Flow

```
┌─────────────────────┐
│   Run: npm test      │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Load jest.setup.js  │
└──────────┬──────────┘
           │
┌──────────▼──────────────────┐
│ Run all test files in order │
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────────┐
│ Execute describe() blocks       │
│ Setup beforeEach() hooks        │
│ Run it() test cases            │
│ Cleanup afterEach() hooks      │
└──────────┬──────────────────────┘
           │
┌──────────▼──────────────────┐
│ Generate Coverage Report    │
│ Display Results             │
└─────────────────────────────┘
```

## 📈 Performance Tips

```bash
# Run tests slower to avoid race conditions
npm test -- --maxWorkers=1

# Skip expensive tests during development
it.skip('expensive test', () => {})

# Only run critical tests
it.only('critical test', () => {})

# Use test timeouts wisely
jest.setTimeout(10000);
```

## 🔗 Useful Links

- Test Files: `__tests__/`
- Coverage Report: `coverage/lcov-report/index.html`
- Jest Config: `jest.config.js`
- Jest Setup: `jest.setup.js`
- Full Guide: `TESTING_GUIDE.md`

---

**Quick Tips:**

- Run `npm run test:watch` while developing
- Check coverage with `npm run test:coverage`
- Always use `testID` props for reliable selectors
- Mock external dependencies
- Test both happy and sad paths
- Keep tests simple and focused
- Use meaningful test descriptions

Happy Testing! 🎉
