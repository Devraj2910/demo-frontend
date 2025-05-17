import { AnalyticsRepository } from '../../domain/repositories/AnalyticsRepository';
import {
  TeamKudos,
  UserKudos,
  CategoryDistribution,
  TrendData,
  WeeklyActivity,
  AnalyticsSummary,
  TimePeriod,
} from '../../domain/entities/AnalyticsData';

/**
 * Analytics Service
 * Orchestrates the operations related to analytics
 */
export class AnalyticsService {
  constructor(private repository: AnalyticsRepository) {}

  /**
   * Get all analytics data for the dashboard
   * @param period Time period for the analytics
   */
  async getDashboardData(period: TimePeriod) {
    // Fetch data in parallel for better performance
    const [summary, teamData, categoryData, trendData, weeklyActivity, topReceivers, topGivers] = await Promise.all([
      this.repository.getAnalyticsSummary(period),
      this.repository.getTeamKudosData(period),
      this.repository.getCategoryDistribution(period),
      this.repository.getTrendData(period),
      this.repository.getWeeklyActivity(period),
      this.repository.getTopReceivers(period),
      this.repository.getTopGivers(period),
    ]);

    return {
      summary,
      teamData,
      categoryData,
      trendData,
      weeklyActivity,
      topReceivers,
      topGivers,
    };
  }

  /**
   * Get summary analytics data
   * @param period Time period for the analytics
   */
  async getSummary(period: TimePeriod): Promise<AnalyticsSummary> {
    return this.repository.getAnalyticsSummary(period);
  }

  /**
   * Get team kudos data
   * @param period Time period for the analytics
   */
  async getTeamData(period: TimePeriod): Promise<TeamKudos[]> {
    return this.repository.getTeamKudosData(period);
  }

  /**
   * Get category distribution data
   * @param period Time period for the analytics
   */
  async getCategoryData(period: TimePeriod): Promise<CategoryDistribution[]> {
    return this.repository.getCategoryDistribution(period);
  }

  /**
   * Get trend data over time
   * @param period Time period for the analytics
   */
  async getTrendData(period: TimePeriod): Promise<TrendData[]> {
    return this.repository.getTrendData(period);
  }

  /**
   * Get weekly activity data
   * @param period Time period for the analytics
   */
  async getWeeklyActivityData(period: TimePeriod): Promise<WeeklyActivity[]> {
    return this.repository.getWeeklyActivity(period);
  }

  /**
   * Get top users who received kudos
   * @param period Time period for the analytics
   * @param limit Maximum number of users to return
   */
  async getTopReceivers(period: TimePeriod, limit?: number): Promise<UserKudos[]> {
    return this.repository.getTopReceivers(period, limit);
  }

  /**
   * Get top users who gave kudos
   * @param period Time period for the analytics
   * @param limit Maximum number of users to return
   */
  async getTopGivers(period: TimePeriod, limit?: number): Promise<UserKudos[]> {
    return this.repository.getTopGivers(period, limit);
  }
}
