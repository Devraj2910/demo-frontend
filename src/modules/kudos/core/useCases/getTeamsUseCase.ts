import { KudoService } from '../services/kudoService';
import { UseCaseResult } from '../types/kudoTypes';

/**
 * Use case for getting a list of teams
 */
export class GetTeamsUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to get all teams
   */
  async execute(): Promise<UseCaseResult<string[]>> {
    try {
      const teams = await this.kudoService.getTeams();

      return {
        success: true,
        data: teams,
      };
    } catch (error) {
      console.error('Error fetching teams:', error);
      return {
        success: false,
        error: 'Failed to load teams',
      };
    }
  }
}
