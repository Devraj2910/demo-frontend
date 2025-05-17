import { AnalyticsDashboardData, AnalyticsSummary, TimePeriod, AnalyticsFilters } from '../entities/AnalyticsData';

/**
 * Analytics Repository Interface
 * Defines the contract for data access operations related to analytics
 */
export interface AnalyticsRepository {
  /**
   * Get complete dashboard analytics data
   * @param filters Date filters for the analytics data
   */
  getDashboardData(filters: AnalyticsFilters): Promise<AnalyticsDashboardData>;

  /**
   * Get summary statistics calculated from analytics data
   * @param data The complete analytics data
   */
  calculateSummary(data: AnalyticsDashboardData): AnalyticsSummary;

  /**
   * Convert time period to date range filters
   * @param period Time period selection
   */
  getDateRangeFromPeriod(period: TimePeriod): AnalyticsFilters;
}
