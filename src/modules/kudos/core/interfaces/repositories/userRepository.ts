import { User, Team } from '../../types/kudoTypes';

/**
 * Repository interface for user operations
 */
export interface UserRepository {
  /**
   * Get a list of all users
   */
  getAllUsers(): Promise<User[]>;

  /**
   * Get a user by their ID
   * @param id User ID
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Get the currently authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Search for users by name/email
   * @param query The search query string
   */
  searchUsers(query: string): Promise<User[]>;

  /**
   * Get all available teams
   */
  getTeams(): Promise<Team[]>;
}
