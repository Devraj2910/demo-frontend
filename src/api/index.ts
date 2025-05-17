// API service interfaces and implementations
// This file defines the interface for API services and provides factory functions

import { User as DomainUser } from "../clean-architecture/modules/auth/domain/entities/User";
import { MockAuthRepository } from "../clean-architecture/modules/auth/infrastructure/repositories/MockAuthRepository";
import { LoginUseCase } from "../clean-architecture/modules/auth/application/useCases/LoginUseCase";
import { RegisterUseCase } from "../clean-architecture/modules/auth/application/useCases/RegisterUseCase";

// Re-export the User type from the domain layer
export type User = DomainUser;

// Auth API interface
export interface AuthAPI {
  login(email: string, password: string): Promise<User>;
  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    position: string
  ): Promise<User>;
  validateToken(token: string): Promise<boolean>;
}

/**
 * Mock Auth API implementation that uses the clean architecture
 */
export class MockAuthAPI implements AuthAPI {
  private authRepository = new MockAuthRepository();

  async login(email: string, password: string): Promise<User> {
    const loginUseCase = new LoginUseCase(this.authRepository);
    return loginUseCase.execute({ email, password });
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    position: string
  ): Promise<User> {
    const registerUseCase = new RegisterUseCase(this.authRepository);
    return registerUseCase.execute({
      email,
      password,
      firstName,
      lastName,
      role,
      position,
    });
  }

  async validateToken(token: string): Promise<boolean> {
    return this.authRepository.validateToken(token);
  }
}

// API factory to get implementations
// In the future, this would return real API implementations
export function getAuthAPI(): AuthAPI {
  return new MockAuthAPI();
}
