import { KudoService } from '../services/kudoService';
import { UseCaseResult } from '../types/kudoTypes';

/**
 * Use case for deleting a kudo
 */
export class DeleteKudoUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to delete a kudo
   * @param id Kudo ID to delete
   */
  async execute(id: string): Promise<UseCaseResult<void>> {
    try {
      // Validate input
      if (!id) {
        return {
          success: false,
          error: 'Kudo ID is required',
        };
      }

      await this.kudoService.deleteKudo(id);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting kudo:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to delete kudo';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
