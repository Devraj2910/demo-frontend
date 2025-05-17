import { User, UserCredentials, UserRegistration } from "../entities/User";

/**
 * Repository interface for authentication operations
 * This defines the contract that any auth repository implementation must fulfill
 */
export interface AuthRepository {
  /**
   * Authenticate a user with credentials
   * @param credentials User credentials (email, password)
   * @returns Authenticated user data
   */
  login(credentials: UserCredentials): Promise<User>;

  /**
   * Register a new user
   * @param userData User registration data
   * @returns The newly created user
   */
  register(userData: UserRegistration): Promise<User>;

  /**
   * Validate if a token is valid
   * @param token Authentication token
   * @returns Whether the token is valid
   */
  validateToken(token: string): Promise<boolean>;
}
