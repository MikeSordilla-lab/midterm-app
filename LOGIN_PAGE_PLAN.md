# Admin Login Page - Implementation Plan

## 📋 Project Overview

Create a clean, accessible admin-only login page that:

- Authenticates admin users via username/password
- Redirects to homepage after successful login
- Follows the existing design system and theme
- Provides clear feedback on login status
- Ensures accessibility and readability

---

## 🎨 Design System Integration

### Color Scheme (Using Existing Design Tokens)

- **Primary Color**: `#0ea5e9` (Sky Blue - Primary brand)
- **Background**: `#ffffff` (Light) / `#151718` (Dark)
- **Text Primary**: `#111827` (Dark gray - 14:1 contrast)
- **Text Secondary**: `#4b5563` (Medium gray - 8.5:1 contrast)
- **Border**: `#e5e7eb` (Light gray)
- **Success**: `#22c55e` (Green - for feedback)
- **Error**: `#ef4444` (Red - for error messages)

### Typography Hierarchy

- **Heading (H2)**: 24px, 600 weight - "Admin Login"
- **Label**: 14px, 500 weight - Form labels
- **Body**: 16px, 400 weight - Input text, helper text
- **Caption**: 12px, 400 weight - Error/hint messages

### Spacing System

- **Container Padding**: 24px (6 × 4px base unit)
- **Form Fields Gap**: 20px
- **Button Height**: 48px (touch-friendly)
- **Input Height**: 48px
- **Rounded Corners**: 8px (slightly rounded for modern feel)

---

## 🏗️ File Structure

```
midterm-app/
├── app/
│   ├── login.tsx                 // New: Login page component
│   └── _layout.tsx               // Update: Add login route
├── components/
│   └── login-form.tsx            // New: Reusable login form component
├── services/
│   └── auth.ts                   // New: Authentication service
├── hooks/
│   └── use-auth.ts               // New: Authentication hook
└── constants/
    └── design-tokens.ts          // Already exists (no changes)
```

---

## 📱 Page Layout Structure

### Login Page Wireframe

```
┌─────────────────────────────────────┐
│                                     │
│        ADMIN PANEL LOGIN            │  ← Heading (24px, centered)
│     Professional access only        │  ← Subheading (14px, secondary)
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Username                    │   │  ← Input field (48px height)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Password                    │   │  ← Input field (48px height)
│  └─────────────────────────────┘   │
│                                     │
│  [ Remember Me ]                    │  ← Checkbox (optional)
│                                     │
│  ┌─────────────────────────────┐   │
│  │   SIGN IN                   │   │  ← Button (48px, primary color)
│  └─────────────────────────────┘   │
│                                     │
│  Error message (if any)             │  ← Error feedback (red, 12px)
│                                     │
└─────────────────────────────────────┘
```

### Responsive Behavior

- **Mobile (< 640px)**:
  - Full width form, 20px margins
  - Centered content
  - Large touch targets (48px)

- **Tablet/Desktop (≥ 640px)**:
  - Max width: 400px
  - Centered horizontally
  - Same padding for consistency

---

## 🧩 Component Architecture

### 1. **LoginForm Component** (`components/login-form.tsx`)

**Purpose**: Reusable form component with input validation

**Props Interface**:

```typescript
interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  onClear?: () => void;
}
```

**Features**:

- Username input with label
- Password input with label
- Submit button with loading state
- Error message display (red, below form)
- Form validation (non-empty fields)
- Keyboard management (proper input types)

**States to Handle**:

- Idle (default)
- Loading (button shows spinner, inputs disabled)
- Error (show error message, shake animation)
- Success (brief confirmation, redirect)

---

### 2. **Authentication Service** (`services/auth.ts`)

**Purpose**: Handle API calls and session management

**Methods**:

```typescript
interface AuthService {
  login(username: string, password: string): Promise<LoginResponse>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  getSession(): Promise<Session | null>;
  saveSession(session: Session): Promise<void>;
  clearSession(): Promise<void>;
}
```

**LoginResponse**:

```typescript
interface LoginResponse {
  status: "ok" | "failed";
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  session_id?: string;
}
```

**Implementation Details**:

- Call POST `/api/login.php` with credentials
- Store session token (localStorage / AsyncStorage)
- Handle network errors gracefully
- Validate response format

---

### 3. **Authentication Hook** (`hooks/use-auth.ts`)

**Purpose**: Manage authentication state and logic

**Hooks**:

```typescript
const useAuth = () => ({
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
});
```

**Features**:

- Centralized auth state
- Automatic login status checking
- Error handling and displaying
- Loading state management

---

### 4. **Login Page** (`app/login.tsx`)

**Structure**:

```
SafeAreaView
├── ScrollView (for mobile usability)
│   └── View (centered container)
│       ├── View (header section)
│       │   ├── Text "Admin Panel Login" (H2)
│       │   └── Text "Professional access only" (caption)
│       │
│       └── LoginForm
│           ├── TextInput (username)
│           ├── TextInput (password)
│           ├── Button (Submit)
│           └── Text (error message)
│
└── StatusBar (set to dark content)
```

---

## 🔐 Authentication Flow

### Login Process

```
1. User enters username & password
   │
2. Click "SIGN IN" button
   │
3. Show loading spinner
   │
4. POST to /api/login.php
   ├─ If success (status: ok)
   │  ├─ Save session token (localStorage/AsyncStorage)
   │  ├─ Save user info
   │  └─ Redirect to home (tabs/index.tsx)
   │
   └─ If failed (status: failed)
      ├─ Show error message in red
      ├─ Clear password field
      └─ Allow retry
```

### Session Verification

```
On app load:
  ├─ Check for stored session token
  ├─ If valid → Show home
  └─ If invalid/expired → Show login
```

---

## 🎯 Implementation Phases

### Phase 1: Foundation (Day 1)

- [ ] Create `services/auth.ts` with login API call
- [ ] Create `hooks/use-auth.ts` for state management
- [ ] Create `components/login-form.tsx` with basic form
- [ ] Add styling following design tokens

### Phase 2: Integration (Day 2)

- [ ] Create `app/login.tsx` page
- [ ] Update `app/_layout.tsx` to show login based on auth state
- [ ] Add route navigation and redirects
- [ ] Test basic login flow

### Phase 3: Polish (Day 3)

- [ ] Add loading animations and feedback
- [ ] Implement form validation and error messages
- [ ] Add keyboard management (focus, return key)
- [ ] Test on mobile and web
- [ ] Add accessibility features (labels, focus indicators)

### Phase 4: Testing (Day 4)

- [ ] Unit tests for auth service
- [ ] Component tests for login form
- [ ] Integration tests for full flow
- [ ] Manual testing on devices

---

## ✅ Key Features

### UX Features

- **Clear Feedback**: Loading spinner, error messages, success notification
- **Keyboard Support**: Proper input types, return key submission
- **Responsive**: Works on mobile (320px) and desktop
- **Fast Loading**: Spinner indicates processing (no freezing)
- **Error Recovery**: User can edit and retry easily

### Accessibility Features

- **WCAG AA Compliant**: 4.5:1 contrast ratio on text
- **Keyboard Navigation**: Tab through inputs, Enter to submit
- **Screen Reader Support**: Proper labels for inputs
- **Touch Friendly**: 48px minimum touch targets
- **Focus Indicators**: Clear visual focus states

### Security Features

- **Password Field**: Masked input (dots/asterisks)
- **HTTPS Only**: Use secure API endpoint in production
- **Session Token**: Store securely (no passwords in storage)
- **Logout**: Clear session on app exit

---

## 🎨 Visual Design Details

### Button States

```
Default:
  Background: #0ea5e9 (Primary)
  Color: White
  Height: 48px
  Border Radius: 8px

Hover/Active:
  Background: #0284c7 (Primary dark)
  Transform: translateY(-1px)
  Shadow: 0 4px 6px rgba(0,0,0,0.1)

Loading:
  Background: #0284c7
  Show spinner
  Disabled: true

Disabled:
  Background: #d1d5db (Gray)
  Opacity: 0.6
  Cursor: not-allowed
```

### Input Field States

```
Default:
  Border: 1px solid #e5e7eb
  Background: #ffffff
  Height: 48px
  Padding: 12px
  Border Radius: 8px
  Font Size: 16px

Focus:
  Border: 1px solid #0ea5e9 (Primary)
  Box Shadow: 0 0 0 3px rgba(14, 165, 233, 0.1)

Error:
  Border: 1px solid #ef4444 (Red)
  Box Shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)

Disabled:
  Background: #f3f4f6
  Color: #9ca3af
  Cursor: not-allowed
```

### Error Message Display

```
Position: Below form
Color: #ef4444 (Error red)
Font Size: 12px
Font Weight: 400
Margin Top: 8px
Animation: Fade in (150ms)
```

---

## 📊 API Integration

### Endpoint

```
POST /api/login.php
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "password123"
}

Response (Success):
{
  "status": "ok",
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@school.edu",
    "first_name": "Admin",
    "last_name": "User"
  },
  "session_id": "abc123def456..."
}

Response (Failure):
{
  "status": "failed",
  "message": "Invalid username or password"
}
```

### Error Handling

- **Network Error**: Show "Connection failed. Please check your internet."
- **Invalid Credentials**: Show "Invalid username or password"
- **Server Error**: Show "Server error. Please try again later."
- **Timeout**: Show "Request timed out. Please try again."

---

## 🔄 Navigation & Routing

### Route Structure

```
app/
├── login.tsx              ← New login page
├── (tabs)/
│   ├── _layout.tsx        ← HomePage (protected)
│   └── index.tsx
└── _layout.tsx            ← Root layout (handle redirect)
```

### Protected Routes Logic

```typescript
// In app/_layout.tsx
if (!isAuthenticated) {
  return <Stack.Screen name="login" />;
} else {
  return <Stack.Screen name="(tabs)" />;
}
```

---

## 📝 Testing Checklist

### Functional Tests

- [ ] Valid credentials → login success → redirect to home
- [ ] Invalid credentials → show error message
- [ ] Empty fields → show validation error
- [ ] Network error → show connection error
- [ ] Successful logout → return to login page

### UI/UX Tests

- [ ] Form is centered on screen
- [ ] Button is disabled while loading
- [ ] Error message displays in red
- [ ] Inputs are properly labeled
- [ ] Layout is responsive (test on 320px, 768px, 1024px)

### Accessibility Tests

- [ ] 4.5:1 contrast ratio on all text
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter)
- [ ] Screen reader reads labels correctly
- [ ] Focus indicators are visible
- [ ] Touch targets are ≥ 48px

### Cross-Platform Tests

- [ ] Mobile (iOS/Android)
- [ ] Web (Chrome, Firefox, Safari)
- [ ] Tablet (landscape and portrait)
- [ ] Dark mode support

---

## 📚 Reference Files

### Existing Components to Reference

- `components/ui/button.tsx` - Button component pattern
- `components/ui/text-input.tsx` - Input component pattern
- `constants/design-tokens.ts` - Design system tokens
- `hooks/use-theme-color.ts` - Theme color hook

### API Reference

- `services/api.ts` - Existing API service pattern
- `api/login.php` - Login endpoint documentation

---

## 💡 Code Examples (Ready to Implement)

### Example: Service Call Structure

```typescript
// services/auth.ts
export const authService = {
  async login(username: string, password: string) {
    const response = await fetch(`${BASE_URL}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data; // Returns LoginResponse
  },
};
```

### Example: Component Structure

```typescript
// components/login-form.tsx
export default function LoginForm({ onSubmit, isLoading, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.form}>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      <Button onPress={() => onSubmit(username, password)} disabled={isLoading}>
        {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
      </Button>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
```

---

## 🎯 Success Criteria

- ✅ Admin can login with valid credentials
- ✅ Redirect to homepage after successful login
- ✅ Show error message for invalid credentials
- ✅ Form follows design system (colors, spacing, typography)
- ✅ Fully accessible (WCAG AA compliant)
- ✅ Works on mobile, tablet, and desktop
- ✅ Professional appearance with clear readability
- ✅ All tests pass

---

## 📞 Next Steps

1. **Review this plan** - Confirm the design and structure
2. **Start Phase 1** - Create auth service and hook
3. **Build components** - Create login form and page
4. **Test thoroughly** - Verify on devices
5. **Deploy** - Ship to production

Ready to implement? Let me know which phase you'd like to start with! 🚀
