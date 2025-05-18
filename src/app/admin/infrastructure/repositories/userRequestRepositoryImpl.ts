import { IUserRequestRepository } from '../../core/interfaces/userRequestRepository';
import { TUserRequestsResponse, TProcessRequestPayload, TProcessRequestResponse } from '../../core/types/adminTypes';

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
//https://demo-hackathon.onrender.com

export class UserRequestRepositoryImpl implements IUserRequestRepository {
  async fetchUserRequests(): Promise<TUserRequestsResponse> {
    try {
      const response = await fetch('https://demo-hackathon.onrender.com/api/admin/users/pending', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error fetching user requests: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Repository error fetching user requests:', error);
      throw error;
    }
  }

  async processUserRequest(payload: TProcessRequestPayload): Promise<TProcessRequestResponse> {
    try {
      const response = await fetch('https://demo-hackathon.onrender.com/api/admin/users/process', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error processing user request: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Repository error processing user request:', error);
      throw error;
    }
  }
}
