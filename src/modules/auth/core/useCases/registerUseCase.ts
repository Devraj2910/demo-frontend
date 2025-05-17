import { AuthService } from '../services/authService';
import { TRegisterData, TUser } from '../types/authTypes';

/**
 * Register use case that handles user registration
 * Encapsulates the business logic for the registration process
 */
export class RegisterUseCase {
  constructor(private authService: AuthService) {}

  /**
   * Execute the register use case
   * @param userData User registration data
   * @returns User data if registration is successful
   */
  async execute(userData: TRegisterData): Promise<TUser> {
    // Validation logic
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Email, password, and name are required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Password validation
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Name validation
    if (userData.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    // Call the service to perform the registration
    return this.authService.register(userData);
  }
}
