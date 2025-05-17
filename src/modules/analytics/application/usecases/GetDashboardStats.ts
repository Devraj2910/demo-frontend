import { TimePeriod, AnalyticsDashboardData, AnalyticsSummary } from '../../domain/entities/AnalyticsData';
import { AnalyticsService } from '../services/AnalyticsService';

interface GetDashboardStatsResult {
  success: boolean;
  data?: {
    dashboardData: AnalyticsDashboardData;
    summary: AnalyticsSummary;
  };
  error?: string;
}

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
  async execute(period: TimePeriod): Promise<GetDashboardStatsResult> {
    try {
      const result = await this.analyticsService.getDashboardData(period);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics data';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
