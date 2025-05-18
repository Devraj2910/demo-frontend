import { KudoService } from '../services/kudoService';
import { UseCaseResult, User } from '../types/kudoTypes';

/**
 * Use case for searching users
 */
export class SearchUsersUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to search for users
   * @param query The search query
   */
  async execute(query: string): Promise<UseCaseResult<User[]>> {
    try {
      if (!query || query.trim().length < 2) {
        return {
          success: false,
          error: 'Search query must be at least 2 characters',
        };
      }

      const users = await this.kudoService.searchUsers(query);

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        error: 'Failed to search users',
      };
    }
  }
}
