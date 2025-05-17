import { User, UserRegistration } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/interfaces/AuthRepository";

/**
 * Use case for user registration
 * Follows the clean architecture pattern where use cases contain business logic
 * and depend on repository interfaces, not implementations
 */
export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Execute the registration use case
   * @param userData User registration data
   * @returns The newly registered user
   */
  async execute(userData: UserRegistration): Promise<User> {
    // Additional business logic could be added here
    // For example, validation, password strength checking, etc.
    return this.authRepository.register(userData);
  }
}
