import { KudoService } from '../services/KudoService';

/**
 * Use case for searching users
 */
export class SearchUsersUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to search for users
   * @param query The search query string
   */
  async execute(query: string) {
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
