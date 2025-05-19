import { IUserRequestRepository } from '../../core/interfaces/userRequestRepository';
import { TUserRequestsResponse, TProcessRequestPayload, TProcessRequestResponse } from '../../core/types/adminTypes';
import { getAuthHeaders } from '../utils/authHeaders';

export class UserRequestRepositoryImpl implements IUserRequestRepository {
  private baseUrl = 'https://demo-hackathon.onrender.com/api';

  async fetchUserRequests(): Promise<TUserRequestsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/pending`, {
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
      const response = await fetch(`${this.baseUrl}/admin/users/process`, {
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
