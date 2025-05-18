import axios from 'axios';
import { UserRepository } from '../../core/interfaces/repositories/userRepository';
import { User, Team } from '../../core/types/kudoTypes';
import { AuthStorageService } from '@/modules/auth/infrastructure/services/authStorageService';

const API_URL = 'https://demo-hackathon.onrender.com/api';

// Interface for API responses with nested data structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Additional response types to handle various formats
interface UsersResponse {
  users: User[];
}

/**
 * Repository implementation for user-related data used in the kudos module
 */
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

  /**
   * Get all users
   * @returns Array of users with id, firstName, lastName properties
   */
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

  /**
   * Search for users by query string
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      // Make API request with search query
      console.log(`Making API request to search users with query: "${query}"`);
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { searchText: query },
        headers: this.getAuthHeaders(),
      });

      console.log('Raw API response status:', response.status);
      console.log('Raw API response headers:', response.headers);
      console.log('Raw API response data structure:', {
        type: typeof response.data,
        isNull: response.data === null,
        keys: response.data ? Object.keys(response.data) : [],
        success: response.data?.success,
        hasData: 'data' in (response.data || {}),
        dataType: response.data?.data ? typeof response.data.data : 'N/A',
        isDataArray: response.data?.data ? Array.isArray(response.data.data) : false,
      });

      let users: User[] = [];

      if (response.status >= 200 && response.status < 300) {
        // Try different ways to extract users based on the response structure
        if (response.data?.success && response.data?.data) {
          // Standard nested structure: { success: true, data: [...] }
          if (Array.isArray(response.data.data)) {
            users = response.data.data;
            console.log('Extracted users from standard data array');
          }
          // Structure: { success: true, data: { users: [...] } }
          else if (
            typeof response.data.data === 'object' &&
            'users' in response.data.data &&
            Array.isArray(response.data.data.users)
          ) {
            users = (response.data.data as UsersResponse).users;
            console.log('Extracted users from nested data.users array');
          }
        }
        // Direct array response
        else if (Array.isArray(response.data)) {
          users = response.data;
          console.log('Extracted users from direct array response');
        }
        // Structure: { users: [...] }
        else if ('users' in response.data && Array.isArray(response.data.users)) {
          users = (response.data as UsersResponse).users;
          console.log('Extracted users from top-level users array');
        }

        console.log(`Found ${users.length} users:`, users);
        return users;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      // Log more details about the error
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
          data: error.response?.data,
        });
      }
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Make API request to get current user
      const response = await axios.get<ApiResponse<User>>(`${API_URL}/users/me`, {
        headers: this.getAuthHeaders(),
      });

      console.log('Get current user response:', response.data);

      if (response.status >= 200 && response.status < 300) {
        // Extract user from nested data structure
        return response.data.success && response.data.data ? response.data.data : null;
      } else if (response.status === 401) {
        // User not authenticated
        return null;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }

      // For development, return a mock user if API fails
      return {
        id: 'current-user',
        email: 'current.user@example.com',
        firstName: 'Current',
        lastName: 'User',
        fullName: 'Current User',
        team: 'Development',
        avatar: undefined,
      };
    }
  }

  /**
   * Get all teams
   */
  async getTeams(): Promise<Team[]> {
    try {
      // Make API request to get all teams
      const response = await axios.get<ApiResponse<Team[]>>(`${API_URL}/teams`, {
        headers: this.getAuthHeaders(),
      });

      console.log('Get teams response:', response.data);

      if (response.status >= 200 && response.status < 300 && response.data.success) {
        // Return the full team objects
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return [];
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      // Return default teams matching the API format if the API fails
      return [
        { id: 1, name: 'Alpha', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 2, name: 'Bravo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 3, name: 'Charlie', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 4, name: 'Data', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 5, name: 'Engineering', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      // Make API request to get user by ID
      const response = await axios.get<ApiResponse<User>>(`${API_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
      });

      console.log('Get user by ID response:', response.data);

      if (response.status >= 200 && response.status < 300) {
        // Extract user from nested data structure
        return response.data.success && response.data.data ? response.data.data : null;
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

  /**
   * Get users by team ID
   * @param teamId Team ID to filter users
   * @returns Array of users in the team
   */
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
