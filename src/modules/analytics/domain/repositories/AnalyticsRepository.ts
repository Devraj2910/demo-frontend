import {
  TeamKudos,
  UserKudos,
  CategoryDistribution,
  TrendData,
  WeeklyActivity,
  AnalyticsSummary,
  TimePeriod,
} from '../entities/AnalyticsData';

/**
 * Analytics Repository Interface
 * Defines the contract for data access operations related to analytics
 */
export interface AnalyticsRepository {
  /**
   * Get summary statistics for the analytics dashboard
   * @param period Time period for the stats
   */
  getAnalyticsSummary(period: TimePeriod): Promise<AnalyticsSummary>;

  /**
   * Get kudos data for each team
   * @param period Time period for the stats
   */
  getTeamKudosData(period: TimePeriod): Promise<TeamKudos[]>;

  /**
   * Get top kudos receivers
   * @param period Time period for the stats
   * @param limit Maximum number of users to return
   */
  getTopReceivers(period: TimePeriod, limit?: number): Promise<UserKudos[]>;

  /**
   * Get top kudos givers
   * @param period Time period for the stats
   * @param limit Maximum number of users to return
   */
  getTopGivers(period: TimePeriod, limit?: number): Promise<UserKudos[]>;

  /**
   * Get distribution of kudos by category
   * @param period Time period for the stats
   */
  getCategoryDistribution(period: TimePeriod): Promise<CategoryDistribution[]>;

  /**
   * Get trend data over time (e.g., monthly trend)
   * @param period Time period for the stats
   */
  getTrendData(period: TimePeriod): Promise<TrendData[]>;

  /**
   * Get weekly activity data
   * @param period Time period for the stats
   */
  getWeeklyActivity(period: TimePeriod): Promise<WeeklyActivity[]>;
}
