import { KudoService } from '../services/KudoService';

/**
 * Use case for retrieving the current user
 */
export class GetCurrentUserUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to retrieve the current user
   */
  async execute() {
    try {
      const currentUser = await this.kudoService.getCurrentUser();

      if (!currentUser) {
        return {
          success: false,
          error: 'No user is currently authenticated',
        };
      }

      return {
        success: true,
        data: currentUser,
      };
    } catch (error) {
      console.error('Error retrieving current user:', error);

      return {
        success: false,
        error: 'Failed to retrieve current user',
      };
    }
  }
}
