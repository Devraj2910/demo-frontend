import { User } from '../entities/KudoEntities';

/**
 * Repository interface for user operations
 */
export interface UserRepository {
  /**
   * Get all users
   */
  getAllUsers(): Promise<User[]>;

  /**
   * Search for users by name
   * @param query Search query string
   */
  searchUsers(query: string): Promise<User[]>;

  /**
   * Get a user by ID
   * @param id User ID
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): Promise<User | null>;
}
