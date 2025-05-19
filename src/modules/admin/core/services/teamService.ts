import { ITeamRepository } from '../interfaces/teamRepository';
import { TTeamWithUsers, TTeam, TCreateTeamPayload, TChangeTeamPayload } from '../types/teamTypes';

export class TeamService {
  constructor(private repository: ITeamRepository) {}

  async getTeamsWithUsers(): Promise<TTeamWithUsers[]> {
    try {
      const response = await this.repository.getTeamsWithUsers();
      return response.data.teams;
    } catch (error) {
      console.error('Error fetching teams with users:', error);
      throw error;
    }
  }

  async createTeam(name: string): Promise<TTeam | null> {
    try {
      const payload: TCreateTeamPayload = { name };
      const response = await this.repository.createTeam(payload);

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async deleteTeam(id: number): Promise<boolean> {
    try {
      const response = await this.repository.deleteTeam(id);
      return response.success;
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  async changeUserTeam(userId: string, teamId: number | string): Promise<boolean> {
    try {
      const payload: TChangeTeamPayload = { userId, teamId };
      const response = await this.repository.changeUserTeam(payload);
      return response.success;
    } catch (error) {
      console.error('Error changing user team:', error);
      throw error;
    }
  }
}
