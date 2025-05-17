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
 * Mock implementation of Analytics Repository
 * Provides dummy data for the analytics dashboard
 */
export class MockAnalyticsRepository implements AnalyticsRepository {
  // Mock team kudos data
  private readonly TEAM_KUDOS_DATA: TeamKudos[] = [
    { team: 'Alpha', count: 42, trend: '+12%' },
    { team: 'Bravo', count: 38, trend: '+5%' },
    { team: 'Charlie', count: 27, trend: '-3%' },
    { team: 'Data', count: 56, trend: '+23%' },
    { team: 'AI', count: 31, trend: '+8%' },
  ];

  // Mock top receivers data
  private readonly TOP_RECEIVERS: UserKudos[] = [
    { name: 'Sophie Chen', team: 'Data', count: 12, avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { name: 'Grace Coleman', team: 'Alpha', count: 8, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'John Doe', team: 'Bravo', count: 7, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { name: 'Robert Clark', team: 'Alpha', count: 6, avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { name: 'Adele Belo', team: 'Charlie', count: 5, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  ];

  // Mock top givers data
  private readonly TOP_GIVERS: UserKudos[] = [
    { name: 'David Wilson', team: 'Data', count: 15, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { name: 'Sarah Johnson', team: 'Bravo', count: 11, avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Michael Brown', team: 'AI', count: 9, avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { name: 'Lisa Martinez', team: 'Alpha', count: 8, avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
    { name: 'Emily Davis', team: 'Charlie', count: 7, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  ];

  // Mock category distribution data
  private readonly CATEGORY_DISTRIBUTION: CategoryDistribution[] = [
    { category: 'Teamwork', count: 45, color: 'rgba(59, 130, 246, 0.8)' },
    { category: 'Innovation', count: 32, color: 'rgba(168, 85, 247, 0.8)' },
    { category: 'Helping Hand', count: 37, color: 'rgba(34, 197, 94, 0.8)' },
  ];

  // Mock monthly trend data
  private readonly MONTHLY_TREND_DATA: TrendData[] = [
    { period: 'Jan', kudosSent: 12, newUsers: 5 },
    { period: 'Feb', kudosSent: 19, newUsers: 7 },
    { period: 'Mar', kudosSent: 15, newUsers: 4 },
    { period: 'Apr', kudosSent: 22, newUsers: 8 },
    { period: 'May', kudosSent: 30, newUsers: 6 },
    { period: 'Jun', kudosSent: 25, newUsers: 12 },
    { period: 'Jul', kudosSent: 28, newUsers: 9 },
    { period: 'Aug', kudosSent: 35, newUsers: 10 },
    { period: 'Sep', kudosSent: 32, newUsers: 7 },
    { period: 'Oct', kudosSent: 38, newUsers: 11 },
    { period: 'Nov', kudosSent: 42, newUsers: 9 },
    { period: 'Dec', kudosSent: 50, newUsers: 15 },
  ];

  // Mock weekly activity data
  private readonly WEEKLY_ACTIVITY_DATA: WeeklyActivity[] = [
    { day: 'Monday', count: 18 },
    { day: 'Tuesday', count: 25 },
    { day: 'Wednesday', count: 30 },
    { day: 'Thursday', count: 22 },
    { day: 'Friday', count: 17 },
    { day: 'Saturday', count: 8 },
    { day: 'Sunday', count: 5 },
  ];

  // Summary stats calculated from other data
  private readonly ANALYTICS_SUMMARY: AnalyticsSummary = {
    totalKudos: this.CATEGORY_DISTRIBUTION.reduce((sum, item) => sum + item.count, 0),
    activeUsers: 18,
    engagementRate: 78,
  };

  /**
   * Simulates an API call with a delay
   * @param data The data to return
   * @returns Promise that resolves with the data after a short delay
   */
  private async mockApiCall<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 300); // Simulate network delay
    });
  }

  /**
   * Get summary statistics for the analytics dashboard
   * @param period Time period for the stats (not used in mock implementation)
   */
  async getAnalyticsSummary(period: TimePeriod): Promise<AnalyticsSummary> {
    return this.mockApiCall(this.ANALYTICS_SUMMARY);
  }

  /**
   * Get kudos data for each team
   * @param period Time period for the stats (not used in mock implementation)
   */
  async getTeamKudosData(period: TimePeriod): Promise<TeamKudos[]> {
    return this.mockApiCall(this.TEAM_KUDOS_DATA);
  }

  /**
   * Get top kudos receivers
   * @param period Time period for the stats (not used in mock implementation)
   * @param limit Maximum number of users to return
   */
  async getTopReceivers(period: TimePeriod, limit: number = 5): Promise<UserKudos[]> {
    return this.mockApiCall(this.TOP_RECEIVERS.slice(0, limit));
  }

  /**
   * Get top kudos givers
   * @param period Time period for the stats (not used in mock implementation)
   * @param limit Maximum number of users to return
   */
  async getTopGivers(period: TimePeriod, limit: number = 5): Promise<UserKudos[]> {
    return this.mockApiCall(this.TOP_GIVERS.slice(0, limit));
  }

  /**
   * Get distribution of kudos by category
   * @param period Time period for the stats (not used in mock implementation)
   */
  async getCategoryDistribution(period: TimePeriod): Promise<CategoryDistribution[]> {
    return this.mockApiCall(this.CATEGORY_DISTRIBUTION);
  }

  /**
   * Get trend data over time (e.g., monthly trend)
   * @param period Time period for the stats (not used in mock implementation)
   */
  async getTrendData(period: TimePeriod): Promise<TrendData[]> {
    return this.mockApiCall(this.MONTHLY_TREND_DATA);
  }

  /**
   * Get weekly activity data
   * @param period Time period for the stats (not used in mock implementation)
   */
  async getWeeklyActivity(period: TimePeriod): Promise<WeeklyActivity[]> {
    return this.mockApiCall(this.WEEKLY_ACTIVITY_DATA);
  }
}
