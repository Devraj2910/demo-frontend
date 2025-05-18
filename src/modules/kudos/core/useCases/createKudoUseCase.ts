import { KudoService } from '../services/kudoService';
import { CreateKudoRequest, UseCaseResult, Kudo } from '../types/kudoTypes';

/**
 * Use case for creating a new kudo
 */
export class CreateKudoUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to create a new kudo
   * @param data Kudo creation data
   */
  async execute(data: CreateKudoRequest): Promise<UseCaseResult<Kudo>> {
    try {
      // Validate required fields
      if (!data.title || !data.content || !data.recipientId) {
        return {
          success: false,
          error: 'Missing required fields',
        };
      }

      const kudo = await this.kudoService.createKudo(data);

      return {
        success: true,
        data: kudo,
      };
    } catch (error) {
      console.error('Error creating kudo:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to create kudo';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
