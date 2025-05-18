import axios from 'axios';
import { UserRepository } from '../../core/interfaces/repositories/userRepository';
import { User } from '../../core/types/userTypes';
import { AuthStorageService } from '@/modules/auth/infrastructure/services/authStorageService';

const API_URL = 'https://demo-hackathon.onrender.com/api';

export class ApiUserRepository implements UserRepository {
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

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: this.getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data?.data?.users || [];
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
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
      console.error(`Error fetching user with ID ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getUsersByTeam(teamId: string): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/teams/${teamId}/users`, {
        headers: this.getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data?.data?.users || [];
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching users for team ${teamId}:`, error);
      throw error;
    }
  }
}
