/**
 * User entity representing a user in the application
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;

  /**
   * User's first name
   */
  firstName: string;

  /**
   * User's last name
   */
  lastName: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * User's role in the system
   */
  role?: string;

  /**
   * User's profile image URL
   */
  avatar?: string;

  /**
   * List of team IDs the user belongs to
   */
  teams?: string[];

  /**
   * Created date of the user
   */
  createdAt?: string;

  /**
   * Updated date of the user
   */
  updatedAt?: string;
}
