/**
 * Base types for Analytics data
 */

export interface UserAnalytics {
  id: string;
  firstName: string | null;
  lastName: string | null;
  cardCount: number;
}

export interface TeamAnalytics {
  id: number;
  name: string;
  cardCount: number;
}

export interface CardVolume {
  total: number;
}

export interface ActiveUsers {
  activeUsers: number;
}

export interface MonthlyAnalytics {
  month: string;
  activeUsers: number;
  cardsCreated: number;
}

export interface TitleAnalytics {
  title: string;
  count: number;
}

export interface AnalyticsDashboardData {
  topReceivers: UserAnalytics[];
  topCreators: UserAnalytics[];
  teamAnalytics: TeamAnalytics[];
  cardVolume: CardVolume;
  activeUsers: ActiveUsers;
  monthlyAnalytics: MonthlyAnalytics[];
  titleAnalytics: TitleAnalytics[];
}

export interface AnalyticsSummary {
  totalKudos: number;
  activeUsers: number;
  engagementRate: number;
}

export type TimePeriod = 'Last Week' | 'Last Month' | 'Last Quarter' | 'Last Year' | 'All Time';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
}
