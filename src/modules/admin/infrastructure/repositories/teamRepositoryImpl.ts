import { ITeamRepository } from '../../core/interfaces/teamRepository';
import {
  TTeamsResponse,
  TCreateTeamPayload,
  TChangeTeamPayload,
  TTeamActionResponse,
} from '../../core/types/teamTypes';
import { getAuthHeaders } from '../utils/authHeaders';

export class TeamRepositoryImpl implements ITeamRepository {
  private baseUrl = 'https://demo-hackathon.onrender.com/api';

  async getTeamsWithUsers(): Promise<TTeamsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/teams/with-effective-users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error fetching teams: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Repository error fetching teams:', error);
      throw error;
    }
  }

  async createTeam(payload: TCreateTeamPayload): Promise<TTeamActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/teams`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error creating team: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Repository error creating team:', error);
      throw error;
    }
  }

  async deleteTeam(id: number): Promise<TTeamActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/teams/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error deleting team: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Repository error deleting team:', error);
      throw error;
    }
  }

  async changeUserTeam(payload: TChangeTeamPayload): Promise<TTeamActionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/change-team`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error changing user team: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Repository error changing user team:', error);
      throw error;
    }
  }
}
