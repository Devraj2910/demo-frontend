import { ITeamRepository } from '../core/interfaces/teamRepository';
import { TTeamResponse } from '../core/types/authTypes';

const API_BASE_URL = 'https://demo-hackathon.onrender.com/api';

/**
 * Implementation of the team repository interface
 * Handles API interactions related to teams
 */
export class TeamRepositoryImpl implements ITeamRepository {
  /**
   * Fetches all teams from the API
   * @returns Promise with team response data
   */
  async getTeams(): Promise<TTeamResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch teams');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }
}
