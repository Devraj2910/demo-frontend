# Standard Operating Procedure: Layered Architecture in avesta-ui-core

## Overview

The avesta-ui-core repository implements a layered architecture based on Clean Architecture principles. This approach separates business logic from presentation concerns, making the codebase more maintainable, testable, and adaptable to different UI implementations including web and mobile applications.

## Architecture Layers

Our implementation follows these layers from innermost to outermost:

1. **Domain Layer** (Core Business Logic)

   - Contains business entities, use cases, and business rules
   - Has no dependencies on external frameworks or UI
   - Located in `src/modules/[module-name]/domain`

2. **Application Layer** (Use Cases)

   - Implements application-specific business rules
   - Orchestrates the flow of data and interfaces with the domain layer
   - Located in `src/modules/[module-name]/application`

3. **Infrastructure Layer** (External Interfaces)

   - Implements interfaces defined by inner layers
   - Manages external resources like API calls, storage, etc.
   - Located in `src/modules/[module-name]/infrastructure`

4. **Presentation Adapters**

   - React-specific hooks and components that connect the business logic to UI
   - Located in `src/modules/[module-name]/presentation`

5. **Shared Utilities**
   - Common code shared across modules
   - Located in `src/shared`

## Module Structure

Each feature module should follow this directory structure:
