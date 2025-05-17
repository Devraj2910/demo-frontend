/**
 * Base types for Analytics data
 */

export interface TeamKudos {
  team: string;
  count: number;
  trend: string;
}

export interface UserKudos {
  name: string;
  team: string;
  count: number;
  avatar: string;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  color: string;
}

export interface TrendData {
  period: string;
  kudosSent: number;
  newUsers?: number;
}

export interface WeeklyActivity {
  day: string;
  count: number;
}

export interface AnalyticsSummary {
  totalKudos: number;
  activeUsers: number;
  engagementRate: number;
}

export type TimePeriod = 'Last Week' | 'Last Month' | 'Last Quarter' | 'Last Year' | 'All Time';
