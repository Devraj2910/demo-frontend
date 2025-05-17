import { AuthService } from '../services/authService';
import { TLoginCredentials, TUser } from '../types/authTypes';

/**
 * Login use case that handles user authentication
 * Encapsulates the business logic for the login process
 */
export class LoginUseCase {
  constructor(private authService: AuthService) {}

  /**
   * Execute the login use case
   * @param credentials User credentials
   * @returns User data if authentication is successful
   */
  async execute(credentials: TLoginCredentials): Promise<TUser> {
    // Validation logic
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Invalid email format');
    }

    // Password validation - could be more complex in a real application
    if (credentials.password.length < 1) {
      throw new Error('Password is required');
    }

    console.log('LoginUseCase: Executing with credentials', {
      email: credentials.email,
      passwordProvided: !!credentials.password,
    });

    try {
      // Call the service to perform the login
      const user = await this.authService.login(credentials);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
