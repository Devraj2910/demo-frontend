import { Team } from '../../types/teamTypes';

/**
 * Interface for team data repository
 */
export interface TeamRepository {
  /**
   * Get all teams
   */
  getAllTeams(): Promise<Team[]>;

  /**
   * Get a team by ID
   * @param id Team ID
   * @returns Team or null if not found
   */
  getTeamById(id: string): Promise<Team | null>;
}
