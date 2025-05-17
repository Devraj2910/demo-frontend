import { KudoService } from '../services/KudoService';

/**
 * Use case for retrieving all team names
 */
export class GetTeamsUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to retrieve all team names
   */
  async execute() {
    try {
      const teams = await this.kudoService.getTeams();

      return {
        success: true,
        data: teams,
      };
    } catch (error) {
      console.error('Error retrieving teams:', error);

      return {
        success: false,
        error: 'Failed to retrieve teams',
      };
    }
  }
}
