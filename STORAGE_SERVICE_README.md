# Storage Service Implementation

This document describes the implementation of storage services in the application, including the shared storage services and the specialized AuthStorageService.

## Overview

The storage service implementation follows clean architecture principles, providing a consistent interface for storing and retrieving data across the application. It includes:

1. A generic storage service interface for common storage operations
2. Implementations for common storage backends (localStorage, cookies)
3. A specialized AuthStorageService for auth-specific storage operations
4. Helper hooks for easy access to storage services

## Architecture

### Core Interfaces

- `IStorageService`: Base interface for all storage operations
- `ILocalStorageService`: Interface for localStorage operations
- `ICookieService`: Interface for cookie operations

### Implementations

- `LocalStorageService`: Implements `ILocalStorageService` for browser localStorage
- `CookieService`: Implements `ICookieService` for browser cookies
- `StorageServiceFactory`: Factory to create and manage storage service instances
- `AuthStorageService`: Specialized service for auth-related storage operations

### React Hooks

- `useStorage`: Generic hook for accessing storage services
- `useLocalStorage`: Hook for localStorage operations
- `useCookies`: Hook for cookie operations

## Auth Storage Service

The `AuthStorageService` is a specialized service for managing auth-related data, including:

- User data (`auth_user`)
- Authentication tokens (`auth_token`)

### Key Features

- Singleton pattern for global access
- Safe client-side operations
- Support for both localStorage and cookies for tokens
- Type-safe operations for auth-specific data

### Usage in Repositories

The AuthStorageService is used in various repositories to provide consistent auth token management:

- `AuthRepositoryImpl`: For login/registration/logout operations
- `ApiKudoRepository`: For CRUD operations on kudos
- `ApiTeamRepository`: For team-related operations
- `ApiUserRepository`: For user-related operations

### Example

```typescript
// Get the singleton instance
const authStorageService = AuthStorageService.getInstance();

// Store a token
authStorageService.setToken('my-auth-token');

// Get the token
const token = authStorageService.getToken();

// Store user data
authStorageService.setUser({
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'user',
});

// Get user data
const user = authStorageService.getUser();

// Clear all auth data
authStorageService.clearAuthData();
```

## Best Practices

1. **Repository Layer**:

   - Use AuthStorageService for token management
   - Create appropriate headers using the token

2. **Auth Utils**:

   - Use AuthStorageService for all storage operations
   - Provide helper functions for common auth operations

3. **Components**:
   - Use the provided hooks or the AuthContext for auth operations
   - Never access localStorage or cookies directly
