# Monorepo Setup Guide

This project has been structured as a frontend-only part of a monorepo architecture. This document provides guidance on how to integrate it with a backend service.

## Current Structure

The current frontend application uses mock data and simulated API calls to function without a backend. Key areas where backend integration will be required:

- Authentication services (login, registration, token validation)
- Data retrieval for dashboard statistics
- Employee data management
- Performance reporting

## Backend Integration

### 1. API Services

The application has been structured with a dedicated API service layer found in the `src/api` directory. This layer provides interfaces for all backend communication and currently implements mock versions of these services.

To integrate with the backend:

1. Complete the real API implementations in `src/api/real.ts`:

```typescript
// src/api/real.ts - Update with actual implementation
export class RealAuthAPI implements AuthAPI {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to login");
    }

    return await response.json();
  }

  // Implement other methods...
}
```

2. Configure the API factory to use the real implementation:

```typescript
// src/api/index.ts
import { RealAuthAPI } from "./real";

export function getAuthAPI(): AuthAPI {
  // Use environment variable to control which implementation to use
  if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
    return new RealAuthAPI();
  }
  return new MockAuthAPI();
}
```

### 2. Environment Configuration

Create environment variables for backend connectivity:

```
# .env.development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_REAL_API=true

# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.yourservice.com/api
```

### 3. Authentication Middleware

Update the middleware to validate tokens with the backend:

```typescript
// src/middleware.ts
// Replace the simple token check with:
const isValidToken = await validateTokenWithBackend(authToken);

if (!isPublicPath && !isValidToken) {
  // Redirect to login...
}
```

### 4. API Client Setup

Create a centralized API client for consistent backend communication:

```typescript
// src/api/client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors for authentication
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

## Recommended Backend Structure

For a complete monorepo setup, consider creating a backend service with:

1. A Node.js/Express or NestJS API
2. Authentication system (JWT-based)
3. Database integration (PostgreSQL, MongoDB, etc.)
4. Proper error handling and validation

## Repository Structure

A typical monorepo structure might look like:

```
/employee-performance-dashboard/
├── apps/
│   ├── frontend/       // This project
│   ├── backend/        // Backend API service
│   └── admin/          // Optional admin panel
├── packages/
│   ├── shared-types/   // Shared TypeScript interfaces
│   ├── ui-components/  // Shared UI components
│   └── utils/          // Shared utilities
├── tools/              // Build and deployment tools
└── package.json        // Root package.json for monorepo management
```

## Tools for Monorepo Management

- [Nx](https://nx.dev/) - Powerful build system for monorepos
- [Turborepo](https://turbo.build/repo) - High-performance build system
- [Lerna](https://lerna.js.org/) - Tool for managing JavaScript projects with multiple packages

## Next Steps

1. Create a backend service repository
2. Set up shared types between frontend and backend
3. Configure authentication flows and API endpoints
4. Implement a monorepo management tool
5. Update frontend integration points to use real APIs
