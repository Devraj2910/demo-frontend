import { ITeamRepository } from '../interfaces/teamRepository';
import { TTeam, TTeamResponse } from '../types/authTypes';

/**
 * Service for team-related operations
 */
export class TeamService {
  /**
   * Constructor for TeamService
   * @param teamRepository - Repository for team data
   */
  constructor(private teamRepository: ITeamRepository) {}

  /**
   * Get all teams
   * @returns Promise with array of teams
   */
  async getTeams(): Promise<TTeam[]> {
    try {
      const response = await this.teamRepository.getTeams();
      return response.data;
    } catch (error) {
      console.error('Error in team service:', error);
      throw error;
    }
  }
}
