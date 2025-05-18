# Shared Storage Services

This document describes the implementation of shared storage services in the application using Clean Architecture principles.

## Overview

The shared storage services provide a consistent, type-safe way to interact with browser storage mechanisms (localStorage and cookies) across the application. These services follow clean architecture principles and are implemented as a shared module that can be used by all other modules.

## Directory Structure

```
src/shared/
├── core/
│   └── interfaces/
│       └── storageService.ts    # Service interfaces
├── infrastructure/
│   └── services/
│       ├── localStorageService.ts     # localStorage implementation
│       ├── cookieService.ts           # Cookies implementation
│       └── storageServiceFactory.ts   # Factory for getting service instances
├── presentation/
│   └── hooks/
│       └── useStorage.ts        # React hooks for storage access
└── index.ts                     # Central export point
```

## Key Components

### Core Layer

**Interfaces:**

- `IStorageService`: Common interface for any storage mechanism
- `ICookieService`: Extends IStorageService with cookie-specific methods
- `ICookieOptions`: Options for cookie operations (expiry, path, etc.)

### Infrastructure Layer

**Services:**

- `LocalStorageService`: Implementation for localStorage with JSON serialization/deserialization
- `CookieService`: Implementation for cookies with various options and prefixing
- `StorageServiceFactory`: Factory for creating and managing service instances

### Presentation Layer

**Hooks:**

- `useStorage`: General hook for any storage type
- `useLocalStorage`: Convenience hook for localStorage
- `useCookies`: Convenience hook for cookies
- `useStorageServices`: Direct access to all storage services

## Usage Examples

### Basic Usage with Hooks

```typescript
import { useLocalStorage, useCookies } from '@/shared';

// In a component
function UserPreferences() {
  // Use localStorage with type safety
  const [theme, setTheme, removeTheme] = useLocalStorage<string>('theme', 'light');

  // Use cookies with type safety
  const [language, setLanguage] = useCookies<string>('language', 'en-US');

  // Values are automatically serialized/deserialized
  const [user, setUser] = useLocalStorage<User>('user', { name: '', email: '' });

  // Function can be passed to update based on previous value
  const incrementCount = () => setCount(prev => prev + 1);

  return (
    // Component UI
  );
}
```

### Direct Service Access

```typescript
import { StorageServiceFactory } from '@/shared';

// Get localStorage service with 'app' prefix
const localStorage = StorageServiceFactory.getLocalStorage('app');

// Store and retrieve values
localStorage.set('user', { id: 1, name: 'John' });
const user = localStorage.get('user');

// Check if key exists
if (localStorage.has('user')) {
  // Do something
}

// Remove a value
localStorage.remove('user');

// Clear all values (with prefix)
localStorage.clear();
```

### Using Different Storage Mechanisms

```typescript
import { useStorage, useStorageServices } from '@/shared';

// Use preferred storage (localStorage if available, cookies as fallback)
const [value, setValue] = useStorage('key', 'default', { storage: 'preferred' });

// Force specific storage type
const [secureValue, setSecureValue] = useStorage('key', 'default', { storage: 'cookie' });

// Get direct access to services
const { localStorage, cookieService, preferredStorage } = useStorageServices('myPrefix');
```

## Integration with Auth Module

The authentication module has been updated to use these shared storage services instead of directly accessing localStorage and cookies. This provides several benefits:

1. Type safety for stored values
2. Consistent key prefixing
3. Automatic serialization/deserialization
4. Fallback mechanisms
5. Better testability
6. Centralized error handling

## Benefits

1. **Type Safety**: Full TypeScript support with generics
2. **Consistency**: Unified API across different storage mechanisms
3. **Prefixing**: Key/name prefixing to prevent collisions
4. **Error Handling**: Robust error handling and logging
5. **SSR Compatibility**: Safe for server-side rendering
6. **React Integration**: Custom hooks for React components
7. **Clean Architecture**: Proper separation of concerns
