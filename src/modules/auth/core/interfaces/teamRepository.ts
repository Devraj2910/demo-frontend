import { TTeamResponse } from '../types/authTypes';

/**
 * Interface for team repository
 * Provides methods to interact with team data
 */
export interface ITeamRepository {
  /**
   * Fetches all teams
   * @returns Promise with team response data
   */
  getTeams(): Promise<TTeamResponse>;
}
