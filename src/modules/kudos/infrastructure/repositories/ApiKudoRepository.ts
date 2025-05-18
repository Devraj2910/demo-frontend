import axios from 'axios';
import { KudoRepository, KudoApiResponse } from '../../core/interfaces/repositories/kudoRepository';
import { Kudo, KudoFilters, CreateKudoRequest } from '../../core/types/kudoTypes';
import { AuthStorageService } from '@/modules/auth/infrastructure/services/authStorageService';

const API_URL = 'https://demo-hackathon.onrender.com/api';

/**
 * Implementation of the KudoRepository interface that connects to the API
 */
export class ApiKudoRepository implements KudoRepository {
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
   * Get all kudos
   */
  async getAllKudos(): Promise<KudoApiResponse> {
    try {
      // Default to first page with 9 items per page
      const response = await axios.get(`${API_URL}/cards?page=1&limit=9`, {
        headers: this.getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data.data;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching all kudos:', error);
      throw error;
    }
  }

  /**
   * Get kudos with filters applied
   */
  async getFilteredKudos(filters: KudoFilters): Promise<KudoApiResponse> {
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();

      if (filters.searchTerm) {
        queryParams.append('searchText', filters.searchTerm);
      }

      if (filters.category) {
        queryParams.append('title', filters.category);
      }

      if (filters.team) {
        queryParams.append('teamId', filters.team);
      }

      // Add pagination parameters with defaults
      queryParams.append('page', String(filters.page || 1));
      queryParams.append('limit', String(filters.limit || 9)); // Default to 9 items per page

      // Build URL with query parameters
      const url = `${API_URL}/cards${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      // Make the API request
      const response = await axios.get(url, {
        headers: this.getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data.data;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching filtered kudos:', error);
      throw error;
    }
  }

  /**
   * Get a single kudo by ID
   */
  async getKudoById(id: string): Promise<Kudo | null> {
    try {
      const response = await axios.get(`${API_URL}/cards/${id}`, {
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
      console.error(`Error fetching kudo with ID ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new kudo
   */
  async createKudo(data: CreateKudoRequest, senderId: string): Promise<Kudo> {
    try {
      // Format the data for the API request
      const requestData = {
        title: data.category || data.title,
        teamId: data.team,
        content: data.content,
        createdFor: data.recipientId,
      };

      const response = await axios.post(`${API_URL}/cards`, requestData, {
        headers: this.getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return response.data.data;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating kudo:', error);
      throw error;
    }
  }

  /**
   * Delete a kudo by ID
   */
  async deleteKudo(id: string): Promise<void> {
    try {
      const response = await axios.delete(`${API_URL}/cards/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.status >= 200 && response.status < 300) {
        return;
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting kudo:', error);
      throw error;
    }
  }
}
