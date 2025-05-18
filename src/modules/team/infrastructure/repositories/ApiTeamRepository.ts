import axios from 'axios';
import { TeamRepository } from '../../core/interfaces/repositories/teamRepository';
import { Team } from '../../core/types/teamTypes';
import { AuthStorageService } from '@/modules/auth/infrastructure/services/authStorageService';

const API_URL = 'https://demo-hackathon.onrender.com/api';

export class ApiTeamRepository implements TeamRepository {
  private authStorageService: AuthStorageService;

  constructor() {
    // Get the singleton instance of AuthStorageService
    this.authStorageService = AuthStorageService.getInstance();
  }

  /**
   * Get auth headers for API requests
   * @returns Headers with auth token if available
   */
  private getAuthHeaders(): Record<string, string> {
    const token = this.authStorageService.getToken();

    return {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  async getAllTeams(): Promise<Team[]> {
    try {
      const response = await axios.get(`${API_URL}/teams`, {
        headers: this.getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data?.data?.teams || [];
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  async getTeamById(id: string): Promise<Team | null> {
    try {
      const response = await axios.get(`${API_URL}/teams/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data.data;
      } else if (response.status === 404) {
        return null;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching team with ID ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}
