import {
  AnalyticsDashboardData,
  AnalyticsSummary,
  TimePeriod,
  AnalyticsFilters,
} from '../../domain/entities/AnalyticsData';

/**
 * Analytics Service Interface
 * Defines the contract for analytics operations
 */
export interface IAnalyticsService {
  /**
   * Get all analytics data for the dashboard based on time period
   * @param period Time period for the analytics
   * @returns Complete dashboard data and calculated summary
   */
  getDashboardData(period: TimePeriod): Promise<{
    dashboardData: AnalyticsDashboardData;
    summary: AnalyticsSummary;
  }>;

  /**
   * Get analytics data with custom date filters
   * @param filters Custom date filters
   * @returns Complete dashboard data and calculated summary
   */
  getCustomRangeData(filters: AnalyticsFilters): Promise<{
    dashboardData: AnalyticsDashboardData;
    summary: AnalyticsSummary;
  }>;

  /**
   * Export analytics data to a specified format
   * @param data Dashboard data to export
   * @param format Export format (e.g., 'csv', 'pdf', 'excel')
   * @returns URL or Blob of the exported file
   */
  exportData(data: AnalyticsDashboardData, format: 'csv' | 'pdf' | 'excel'): Promise<string | Blob>;
}
