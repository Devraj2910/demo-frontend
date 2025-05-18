import { IUserRequestRepository } from '../interfaces/userRequestRepository';
import { TUserRequest, TProcessRequestPayload } from '../types/adminTypes';

export class UserRequestService {
  constructor(private repository: IUserRequestRepository) {}

  async getUserRequests(): Promise<TUserRequest[]> {
    try {
      const response = await this.repository.fetchUserRequests();
      // Filter only pending requests
      return response.data.users.filter((user) => user.permission === 'pending');
    } catch (error) {
      console.error('Error fetching user requests:', error);
      throw error;
    }
  }

  async processUserRequest(userId: string, status: 'approved' | 'declined'): Promise<boolean> {
    try {
      const payload: TProcessRequestPayload = {
        userId,
        status,
      };

      const response = await this.repository.processUserRequest(payload);
      return response.success;
    } catch (error) {
      console.error('Error processing user request:', error);
      throw error;
    }
  }
}
