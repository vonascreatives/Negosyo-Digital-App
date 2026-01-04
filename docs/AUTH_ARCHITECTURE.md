# Authentication Architecture

## Overview

The authentication system is now refactored into a clean, maintainable architecture using the **Repository Pattern** with custom hooks and service layers.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         UI Layer (Pages)                │
│  - signup/page.tsx                      │
│  - login/page.tsx                       │
└──────────────┬──────────────────────────┘
               │ uses
┌──────────────▼──────────────────────────┐
│      Hook Layer (Business Logic)        │
│  - hooks/useAuth.ts                     │
│  • signup()                             │
│  • login()                              │
│  • logout()                             │
│  • loading, error states                │
└──────────────┬──────────────────────────┘
               │ calls
┌──────────────▼──────────────────────────┐
│    Service Layer (API Interactions)     │
│  - lib/services/auth.service.ts         │
│  • authService.signup()                 │
│  • authService.login()                  │
│  • authService.logout()                 │
│  • authService.getCurrentUser()         │
└──────────────┬──────────────────────────┘
               │ interacts with
┌──────────────▼──────────────────────────┐
│         Supabase Client                 │
│  - lib/supabase/client.ts               │
└─────────────────────────────────────────┘
```

## File Structure

```
negosyo-digital/
├── hooks/
│   └── useAuth.ts              # Custom authentication hook
│
├── lib/
│   ├── services/
│   │   └── auth.service.ts     # Authentication service layer
│   └── supabase/
│       ├── client.ts           # Browser client
│       ├── server.ts           # Server client
│       └── middleware.ts       # Auth middleware
│
└── app/
    ├── signup/
    │   └── page.tsx            # Signup UI (uses useAuth)
    └── login/
        └── page.tsx            # Login UI (uses useAuth)
```

## Components

### 1. **Service Layer** (`lib/services/auth.service.ts`)

The service layer handles all direct interactions with Supabase Auth and database.

**Methods:**
- `signup(data)` - Create new user account + creator profile
- `login(data)` - Authenticate existing user
- `logout()` - Sign out current user
- `getCurrentUser()` - Get current authenticated user
- `getSession()` - Get current session

**Example:**
```typescript
import { authService } from '@/lib/services/auth.service'

// Sign up
await authService.signup({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
})

// Login
await authService.login({
  email: "john@example.com",
  password: "password123"
})
```

### 2. **Custom Hook** (`hooks/useAuth.ts`)

The hook layer provides state management and handles navigation/routing.

**Features:**
- ✅ Loading states
- ✅ Error handling
- ✅ Automatic navigation
- ✅ Success callbacks

**Example:**
```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { signup, login, logout, loading, error } = useAuth()

  const handleSignup = async () => {
    try {
      await signup({ name, email, password })
      // Automatically redirects to dashboard
    } catch (err) {
      // Error is stored in 'error' state
    }
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  )
}
```

### 3. **Pages** (`app/signup/page.tsx`, `app/login/page.tsx`)

Pages are now clean and focused only on UI rendering.

**Before (Inline Logic):**
```tsx
// 90+ lines of authentication logic mixed with UI
const handleSignup = async () => {
  setLoading(true)
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp(...)
  // ... 50 more lines
}
```

**After (Using Hook):**
```tsx
// Clean, focused UI code
const { signup, loading, error } = useAuth()

const handleSignup = async (e) => {
  e.preventDefault()
  try {
    await signup({ name, email, password })
  } catch (err) {
    // Error handled by hook
  }
}
```

## Benefits

### ✅ **Separation of Concerns**
- UI layer only handles rendering
- Hook layer handles state & navigation
- Service layer handles API calls

### ✅ **Reusability**
- Use `useAuth()` in any component
- Use `authService` in server actions
- No code duplication

### ✅ **Testability**
- Easy to unit test service layer
- Easy to mock hooks in components
- Isolated business logic

### ✅ **Maintainability**
- Authentication logic in one place
- Easy to add new auth methods
- Clear structure for new developers

### ✅ **Type Safety**
- TypeScript interfaces for all data
- Compile-time error checking
- Better IDE autocomplete

## Usage Examples

### Signup Form

```tsx
import { useAuth } from '@/hooks/useAuth'

export default function SignupPage() {
  const { signup, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      {/* Form fields */}
      <button disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}
```

### Login Form

```tsx
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}
      {/* Form fields */}
    </form>
  )
}
```

### Logout Button (Server Component)

```tsx
import { authService } from '@/lib/services/auth.service'
import { redirect } from 'next/navigation'

export default function LogoutButton() {
  const handleLogout = async () => {
    'use server'
    await authService.logout()
    redirect('/login')
  }

  return (
    <form action={handleLogout}>
      <button type="submit">Logout</button>
    </form>
  )
}
```

## Adding New Auth Features

### Example: Password Reset

1. **Add to Service:**
```typescript
// lib/services/auth.service.ts
export const authService = {
  // ... existing methods
  
  async resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }
}
```

2. **Add to Hook:**
```typescript
// hooks/useAuth.ts
export function useAuth() {
  // ... existing code
  
  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      await authService.resetPassword(email)
      // Show success message
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return { /* ... */ resetPassword }
}
```

3. **Use in Page:**
```tsx
const { resetPassword, loading, error } = useAuth()
await resetPassword(email)
```

## Testing

### Service Layer Tests
```typescript
import { authService } from '@/lib/services/auth.service'

describe('authService', () => {
  it('should signup a new user', async () => {
    const result = await authService.signup({
      name: 'Test',
      email: 'test@example.com',
      password: 'password123'
    })
    expect(result).toBeDefined()
  })
})
```

### Hook Tests
```typescript
import { renderHook, act } from '@testing-library/react-hooks'
import { useAuth } from '@/hooks/useAuth'

describe('useAuth', () => {
  it('should handle signup', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.signup({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      })
    })
    
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
```

## Best Practices

1. **Always use the hook in client components**
   ```tsx
   'use client'
   const { login } = useAuth()
   ```

2. **Use the service directly in server actions**
   ```tsx
   'use server'
   await authService.logout()
   ```

3. **Never mix service and hook logic**
   - Service = Pure API calls
   - Hook = State + Navigation
   - Page = UI only

4. **Handle errors gracefully**
   ```tsx
   try {
     await signup(data)
   } catch (err) {
     // Hook already sets error state
     // Optionally show toast notification
   }
   ```

## Migration Checklist

- ✅ Created `lib/services/auth.service.ts`
- ✅ Created `hooks/useAuth.ts`
- ✅ Refactored `app/signup/page.tsx`
- ✅ Refactored `app/login/page.tsx`
- ✅ Removed inline Supabase calls from pages
- ✅ Centralized error handling
- ✅ Added TypeScript types

## What's Next

Recommended additions:
- [ ] Add password reset functionality
- [ ] Add email verification resend
- [ ] Add social auth providers (Google, Facebook)
- [ ] Add refresh token handling
- [ ] Add session persistence
- [ ] Add remember me functionality
- [ ] Add 2FA support

Your authentication system is now clean, maintainable, and production-ready! 🚀
