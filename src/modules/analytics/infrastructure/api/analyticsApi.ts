import { MockAnalyticsRepository } from '../repositories/MockAnalyticsRepository';

/**
 * Analytics API client
 * This would normally connect to a backend API, but for now it uses the mock repository
 */
class AnalyticsApiClient {
  private repository: MockAnalyticsRepository;

  constructor() {
    this.repository = new MockAnalyticsRepository();
  }

  /**
   * Factory method to create an instance of the API client
   * This pattern allows for easier switching between mock and real implementations
   */
  static create(): AnalyticsApiClient {
    return new AnalyticsApiClient();
  }

  /**
   * Gets the repository instance
   * This allows the application layer to access the repository methods
   */
  getRepository(): MockAnalyticsRepository {
    return this.repository;
  }
}

// Export a singleton instance
export const analyticsApi = AnalyticsApiClient.create();
