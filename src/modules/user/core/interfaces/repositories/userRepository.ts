import { User } from '../../types/userTypes';

/**
 * Interface for user data repository
 */
export interface UserRepository {
  /**
   * Get all users
   */
  getAllUsers(): Promise<User[]>;

  /**
   * Get a user by ID
   * @param id User ID
   * @returns User or null if not found
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Get all users in a team
   * @param teamId Team ID
   * @returns List of users in the team
   */
  getUsersByTeam(teamId: string): Promise<User[]>;
}
