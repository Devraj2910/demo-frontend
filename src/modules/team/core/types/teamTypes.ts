/**
 * Team entity representing a team in the application
 */
export interface Team {
  /**
   * Unique identifier for the team
   */
  id: string;

  /**
   * Name of the team
   */
  name: string;

  /**
   * Optional description of the team
   */
  description?: string;

  /**
   * Created date of the team
   */
  createdAt?: string;

  /**
   * Updated date of the team
   */
  updatedAt?: string;

  /**
   * Member count in the team
   */
  memberCount?: number;
}
