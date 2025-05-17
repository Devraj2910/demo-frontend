import { User, UserCredentials } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/interfaces/AuthRepository";

/**
 * Use case for user login
 * Follows the clean architecture pattern where use cases contain business logic
 * and depend on repository interfaces, not implementations
 */
export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Execute the login use case
   * @param credentials User credentials
   * @returns Authenticated user data
   */
  async execute(credentials: UserCredentials): Promise<User> {
    // Additional business logic could be added here
    // For example, logging, validation, etc.
    return this.authRepository.login(credentials);
  }
}
