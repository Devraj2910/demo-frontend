import { AnalyticsRepositoryImpl } from '../repositories/AnalyticsRepositoryImpl';
import { AnalyticsRepository } from '../../domain/repositories/AnalyticsRepository';

/**
 * Analytics API client
 * Provides access to the analytics repository implementation
 */
class AnalyticsApiClient {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepositoryImpl();
  }

  /**
   * Factory method to create an instance of the API client
   * This pattern allows for easier switching between implementations
   */
  static create(): AnalyticsApiClient {
    return new AnalyticsApiClient();
  }

  /**
   * Gets the repository instance
   * This allows the application layer to access the repository methods
   */
  getRepository(): AnalyticsRepository {
    return this.repository;
  }
}

// Export a singleton instance
export const analyticsApi = AnalyticsApiClient.create();
