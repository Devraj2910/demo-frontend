import { TimePeriod } from '../../domain/entities/AnalyticsData';
import { AnalyticsService } from '../services/AnalyticsService';

/**
 * Get Dashboard Stats Use Case
 * Encapsulates the business logic for retrieving analytics dashboard statistics
 */
export class GetDashboardStats {
  constructor(private analyticsService: AnalyticsService) {}

  /**
   * Execute the use case
   * @param period The time period to get stats for
   * @returns All dashboard statistics
   */
  async execute(period: TimePeriod) {
    try {
      const data = await this.analyticsService.getDashboardData(period);
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        error: 'Failed to load analytics data',
      };
    }
  }
}
