import axios from 'axios';
import { UserRepository } from '../../core/interfaces/repositories/userRepository';
import { User } from '../../core/types/kudoTypes';

const API_URL = 'https://demo-hackathon.onrender.com/api';

// Helper function to get auth token from localStorage
const getAuthHeaders = () => {
  let token = '';

  // Only access localStorage in browser environment
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token') || '';
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export class ApiUserRepository implements UserRepository {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        headers: getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  /**
   * Search for users by query string
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      // Make API request with search query
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { searchText: query },
        headers: getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Make API request to get current user
      const response = await axios.get(`${API_URL}/users/search`, {
        headers: getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
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
  async getTeams(): Promise<string[]> {
    try {
      // Make API request to get all teams
      const response = await axios.get(`${API_URL}/teams`, {
        headers: getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      // Return default teams if the API fails
      return ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Product', 'Design'];
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      // Make API request to get user by ID
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data;
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
}
