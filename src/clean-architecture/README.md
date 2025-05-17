# Clean Architecture Implementation

This directory contains the implementation of the clean architecture pattern for the application. It separates the codebase into distinct layers with clear dependencies between them.

## Structure

```
/clean-architecture/
└── modules/
    └── auth/
        ├── domain/
        │   ├── entities/       # Contains core business entities
        │   └── interfaces/     # Defines repository interfaces
        ├── application/
        │   └── useCases/       # Contains business logic use cases
        └── infrastructure/
            └── repositories/   # Implements repository interfaces
```

## Key Concepts

### Domain Layer

The domain layer contains the core business entities and interfaces. It has no dependencies on other layers.

- **Entities**: Core business objects that represent domain concepts like User, Product, etc.
- **Interfaces**: Contracts that define how to interact with external systems without specifying implementations.

### Application Layer

The application layer contains the business logic of the application. It depends on the domain layer but has no dependencies on the infrastructure layer.

- **Use Cases**: Implementation of business logic that orchestrates the flow of data to and from entities.

### Infrastructure Layer

The infrastructure layer provides concrete implementations of the interfaces defined in the domain layer. It depends on the domain layer.

- **Repositories**: Implementations of repository interfaces that interact with external systems like databases, APIs, etc.

## Usage

To use the clean architecture in your application:

1. Define the domain entities and interfaces
2. Create use cases that implement business logic
3. Implement repositories that provide data access
4. Wire everything together in your application

Example:

```typescript
import { LoginUseCase } from "./clean-architecture/modules/auth/application/useCases/LoginUseCase";
import { MockAuthRepository } from "./clean-architecture/modules/auth/infrastructure/repositories/MockAuthRepository";

// Create repository implementation
const authRepository = new MockAuthRepository();

// Create use case with repository dependency
const loginUseCase = new LoginUseCase(authRepository);

// Use the use case
const user = await loginUseCase.execute({
  email: "user@example.com",
  password: "password123",
});
```

## Future Integration

When integrating with a real backend:

1. Create a real implementation of the repository that makes API calls
2. Replace the mock repository with the real one
3. The rest of your application should continue to work without changes

This approach allows you to easily switch between mock and real implementations without affecting the business logic.
