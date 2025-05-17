import { KudoService } from '../services/KudoService';
import { CreateKudoRequest } from '../../domain/entities/KudoEntities';

/**
 * Use case for creating a new kudo
 */
export class CreateKudoUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to create a new kudo
   * @param data Data required to create a kudo
   */
  async execute(data: CreateKudoRequest) {
    try {
      // Validate input
      if (!data.recipientId) {
        return {
          success: false,
          error: 'Recipient is required',
        };
      }

      if (!data.category) {
        return {
          success: false,
          error: 'Category is required',
        };
      }

      if (!data.message || data.message.length < 10) {
        return {
          success: false,
          error: 'Message must be at least 10 characters',
        };
      }

      // Create kudo
      const newKudo = await this.kudoService.createKudo(data);

      return {
        success: true,
        data: newKudo,
      };
    } catch (error) {
      console.error('Error creating kudo:', error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message === 'User not authenticated') {
          return {
            success: false,
            error: 'You must be logged in to give kudos',
          };
        }

        if (error.message === 'Sender or recipient not found') {
          return {
            success: false,
            error: 'Invalid sender or recipient',
          };
        }
      }

      // Generic error
      return {
        success: false,
        error: 'Failed to create kudo',
      };
    }
  }
}
