import { KudoService } from '../services/kudoService';
import { UseCaseResult, User } from '../types/kudoTypes';

/**
 * Use case for getting the current authenticated user
 */
export class GetCurrentUserUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to get the current user
   */
  async execute(): Promise<UseCaseResult<User>> {
    try {
      const user = await this.kudoService.getCurrentUser();

      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return {
        success: false,
        error: 'Failed to get current user',
      };
    }
  }
}
