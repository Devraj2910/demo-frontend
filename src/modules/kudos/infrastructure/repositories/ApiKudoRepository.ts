import axios from 'axios';
import { KudoRepository } from '../../core/interfaces/repositories/kudoRepository';
import { Kudo, KudoFilters, CreateKudoRequest } from '../../core/types/kudoTypes';

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

// Define the API response type to match what the server returns
interface KudoApiResponse {
  cards: Kudo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiKudoRepository implements KudoRepository {
  /**
   * Get all kudos
   */
  async getAllKudos(): Promise<KudoApiResponse> {
    try {
      const response = await axios.get(`${API_URL}/cards`, {
        headers: getAuthHeaders(),
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

      // Build URL with query parameters
      const url = `${API_URL}/cards${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      // Make the API request
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
        headers: getAuthHeaders(),
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
      const response = await axios.delete(`${API_URL}/cards/${id}`);

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
