import { AnalyticsRepository } from '../../domain/repositories/AnalyticsRepository';
import {
  AnalyticsDashboardData,
  AnalyticsSummary,
  TimePeriod,
  AnalyticsFilters,
} from '../../domain/entities/AnalyticsData';

/**
 * Analytics Service
 * Orchestrates the operations related to analytics
 */
export class AnalyticsService {
  constructor(private repository: AnalyticsRepository) {}

  /**
   * Get all analytics data for the dashboard based on time period
   * @param period Time period for the analytics
   * @returns Complete dashboard data and calculated summary
   */
  async getDashboardData(period: TimePeriod): Promise<{
    dashboardData: AnalyticsDashboardData;
    summary: AnalyticsSummary;
  }> {
    try {
      // Convert time period to date range
      const dateRange = this.repository.getDateRangeFromPeriod(period);

      // Fetch dashboard data
      const dashboardData = await this.repository.getDashboardData(dateRange);

      // Calculate summary statistics
      const summary = this.repository.calculateSummary(dashboardData);

      return {
        dashboardData,
        summary,
      };
    } catch (error) {
      console.error('Error in analytics service:', error);
      throw error;
    }
  }

  /**
   * Get analytics data with custom date filters
   * @param filters Custom date filters
   * @returns Complete dashboard data and calculated summary
   */
  async getCustomRangeData(filters: AnalyticsFilters): Promise<{
    dashboardData: AnalyticsDashboardData;
    summary: AnalyticsSummary;
  }> {
    try {
      // Fetch dashboard data with custom filters
      const dashboardData = await this.repository.getDashboardData(filters);

      // Calculate summary statistics
      const summary = this.repository.calculateSummary(dashboardData);

      return {
        dashboardData,
        summary,
      };
    } catch (error) {
      console.error('Error in analytics service:', error);
      throw error;
    }
  }
}
