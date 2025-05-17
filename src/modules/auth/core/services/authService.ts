import { IAuthRepository } from '../interfaces/authRepository';
import { TLoginCredentials, TRegisterData, TUser, TAuthResponse } from '../types/authTypes';

/**
 * Auth service that orchestrates authentication-related operations
 * This service uses the repository interface, not the concrete implementation
 */
export class AuthService {
  constructor(private repo: IAuthRepository) {}

  /**
   * Authenticate a user and return user data
   * @param credentials User login credentials
   * @returns User data if authenticated
   */
  async login(credentials: TLoginCredentials): Promise<TUser> {
    try {
      const response = await this.repo.login(credentials);
      return response.user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register a new user and return the user data
   * @param userData User registration data
   * @returns Newly created user data
   */
  async register(userData: TRegisterData): Promise<TUser> {
    try {
      const response = await this.repo.register(userData);
      return response.user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      await this.repo.logout();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the currently authenticated user
   * @returns Current user data or null if not authenticated
   */
  async getCurrentUser(): Promise<TUser | null> {
    try {
      const response = await this.repo.getCurrentUser();
      return response ? response.user : null;
    } catch (error) {
      return null;
    }
  }
}
