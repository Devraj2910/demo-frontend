# API Service Layer

This folder contains the API service layer for the application. It provides a clear interface for making API calls and allows for easy switching between mock and real implementations.

## Structure

- `index.ts` - Exports interfaces and mock implementations
- `real.ts` - Contains real API implementations (to be used when backend is ready)

## Usage

### Current Implementation

Currently, we're using mock implementations for all API calls. The mock data and logic is contained in `index.ts`.

```typescript
// Example of using the API service
import { getAuthAPI } from "../api";

const authAPI = getAuthAPI();

// Use the API
const user = await authAPI.login("user@example.com", "password");
```

### Switching to Real Implementation

When you're ready to switch to the real backend, you'll need to:

1. Complete the real API implementations in `real.ts`
2. Update the `getAuthAPI` function in `index.ts` to return the real implementation

```typescript
// In index.ts
import { RealAuthAPI } from "./real";

export function getAuthAPI(): AuthAPI {
  // We use an environment variable to determine whether to use mock or real implementation
  if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
    return new RealAuthAPI();
  }
  return new MockAuthAPI();
}
```

## API Interfaces

### AuthAPI

Interface for authentication-related API calls:

- `login(email: string, password: string): Promise<User>`
- `register(email: string, password: string, firstName: string, lastName: string, role: string, position: string): Promise<User>`
- `validateToken(token: string): Promise<boolean>`

## Adding New API Interfaces

To add a new API interface:

1. Define the interface in `index.ts`
2. Create a mock implementation in `index.ts`
3. Create a real implementation (or placeholder) in `real.ts`
4. Create a factory function to get the implementation
