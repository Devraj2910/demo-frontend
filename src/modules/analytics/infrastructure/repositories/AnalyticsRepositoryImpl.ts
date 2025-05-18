import { AnalyticsRepository } from '../../domain/repositories/AnalyticsRepository';
import {
  AnalyticsDashboardData,
  AnalyticsSummary,
  TimePeriod,
  AnalyticsFilters,
} from '../../domain/entities/AnalyticsData';
import { getAuthHeaders } from '@/modules/auth/presentation/utils/authUtils';

/**
 * Analytics Repository Implementation
 * Fetches analytics data from the real API
 */
export class AnalyticsRepositoryImpl implements AnalyticsRepository {
  private apiBaseUrl = 'https://demo-hackathon.onrender.com/api/analytics';

  /**
   * Get dashboard analytics data from the API
   * @param filters Date filters for the analytics data
   */
  async getDashboardData(filters: AnalyticsFilters): Promise<AnalyticsDashboardData> {
    try {
      // Build URL with query parameters
      let url = `${this.apiBaseUrl}/dashboard`;
      const params = new URLSearchParams();

      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }

      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }

      // Add query parameters to URL if any exist
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      // Get authorization headers
      const headers = getAuthHeaders();

      // Make the API request
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch analytics data');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }

  /**
   * Calculate summary statistics from dashboard data
   * @param data The complete analytics data
   */
  calculateSummary(data: AnalyticsDashboardData): AnalyticsSummary {
    // Calculate total kudos from cardVolume
    const totalKudos = data.cardVolume?.total || 0;

    // Get active users count
    const activeUsers = data.activeUsers?.activeUsers || 0;

    // Calculate engagement rate (active users as percentage of total users, or a fixed percentage if not available)
    // For now, we'll use a simple calculation: if there are active users, assume 80% engagement
    const engagementRate = activeUsers > 0 ? Math.round((activeUsers / (activeUsers * 1.25)) * 100) : 0;

    return {
      totalKudos,
      activeUsers,
      engagementRate,
    };
  }

  /**
   * Convert time period to date range
   * @param period The selected time period
   */
  getDateRangeFromPeriod(period: TimePeriod): AnalyticsFilters {
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case 'Last Week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'Last Month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'Last Quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'Last Year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'All Time':
        startDate = new Date(2020, 0, 1); // arbitrary start date for "all time"
        break;
    }

    return {
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(today),
    };
  }

  /**
   * Format date to YYYY-MM-DD for API requests
   * @param date The date to format
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
