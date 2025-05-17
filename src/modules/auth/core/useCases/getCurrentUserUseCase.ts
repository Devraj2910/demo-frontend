import { AuthService } from '../services/authService';
import { TUser } from '../types/authTypes';

/**
 * Get current user use case
 * Retrieves the currently authenticated user
 */
export class GetCurrentUserUseCase {
  constructor(private authService: AuthService) {}

  /**
   * Execute the get current user use case
   * @returns Current user data or null if not authenticated
   */
  async execute(): Promise<TUser | null> {
    return this.authService.getCurrentUser();
  }
}
