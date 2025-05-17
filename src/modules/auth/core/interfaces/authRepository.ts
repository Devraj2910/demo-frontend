import { TLoginCredentials, TRegisterData, TAuthResponse, TUser } from '../types/authTypes';

/**
 * Interface for auth repository operations
 * This defines the contract that any auth repository implementation must follow
 */
export interface IAuthRepository {
  /**
   * Authenticate a user with credentials
   * @param credentials User login credentials
   * @returns Authentication response with user data
   */
  login(credentials: TLoginCredentials): Promise<TAuthResponse>;

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Authentication response with the new user data
   */
  register(userData: TRegisterData): Promise<TAuthResponse>;

  /**
   * Log out the current user
   * @returns Promise that resolves when logout is complete
   */
  logout(): Promise<void>;

  /**
   * Get the currently authenticated user
   * @returns Authentication response with user data or null if not authenticated
   */
  getCurrentUser(): Promise<TAuthResponse | null>;
}
