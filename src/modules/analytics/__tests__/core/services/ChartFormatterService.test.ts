import { ChartFormatterService } from '../../../core/services/ChartFormatterService';
import { AnalyticsDashboardData } from '../../../domain/entities/AnalyticsData';

describe('ChartFormatterService', () => {
  let service: ChartFormatterService;
  let mockDashboardData: AnalyticsDashboardData;

  beforeEach(() => {
    // Initialize the service
    service = new ChartFormatterService();

    // Create mock data for testing
    mockDashboardData = {
      topReceivers: [
        { id: '1', firstName: 'John', lastName: 'Doe', cardCount: 10 },
        { id: '2', firstName: 'Jane', lastName: 'Smith', cardCount: 8 },
      ],
      topCreators: [
        { id: '3', firstName: 'Bob', lastName: 'Johnson', cardCount: 15 },
        { id: '4', firstName: 'Alice', lastName: 'Williams', cardCount: 12 },
      ],
      teamAnalytics: [
        { id: 1, name: 'Team A', cardCount: 25 },
        { id: 2, name: 'Team B', cardCount: 20 },
        { id: 3, name: 'Team C', cardCount: 15 },
      ],
      cardVolume: { total: 100 },
      activeUsers: { activeUsers: 50 },
      monthlyAnalytics: [
        { month: 'Jan', activeUsers: 40, cardsCreated: 80 },
        { month: 'Feb', activeUsers: 45, cardsCreated: 90 },
        { month: 'Mar', activeUsers: 50, cardsCreated: 100 },
      ],
      titleAnalytics: [
        { title: 'Great Job', count: 40 },
        { title: 'Thank You', count: 30 },
        { title: 'Excellent Work', count: 20 },
        { title: 'Well Done', count: 10 },
      ],
    };
  });

  describe('formatChartData', () => {
    it('should format dashboard data into chart data', () => {
      // Act
      const result = service.formatChartData(mockDashboardData);

      // Assert
      expect(result).toHaveProperty('monthlyTrendChart');
      expect(result).toHaveProperty('teamAnalyticsChart');
      expect(result).toHaveProperty('titleAnalyticsChart');

      // Check monthly trend chart
      expect(result.monthlyTrendChart.labels).toEqual(['Jan', 'Feb', 'Mar']);
      expect(result.monthlyTrendChart.datasets).toHaveLength(2);
      expect(result.monthlyTrendChart.datasets[0].data).toEqual([40, 45, 50]); // Active users
      expect(result.monthlyTrendChart.datasets[1].data).toEqual([80, 90, 100]); // Cards created

      // Check team analytics chart
      expect(result.teamAnalyticsChart.labels).toEqual(['Team A', 'Team B', 'Team C']);
      expect(result.teamAnalyticsChart.datasets).toHaveLength(1);
      expect(result.teamAnalyticsChart.datasets[0].data).toEqual([25, 20, 15]);

      // Check title analytics chart
      expect(result.titleAnalyticsChart.labels).toEqual(['Great Job', 'Thank You', 'Excellent Work', 'Well Done']);
      expect(result.titleAnalyticsChart.datasets).toHaveLength(1);
      expect(result.titleAnalyticsChart.datasets[0].data).toEqual([40, 30, 20, 10]);
    });
  });

  describe('getChartOptions', () => {
    it('should return options for all chart types', () => {
      // Act
      const options = service.getChartOptions();

      // Assert
      expect(options).toHaveProperty('line');
      expect(options).toHaveProperty('bar');
      expect(options).toHaveProperty('doughnut');

      // Check that options contain expected properties
      expect(options.line.responsive).toBe(true);
      expect(options.line.plugins?.title?.text).toBe('Monthly Activity');

      expect(options.bar.responsive).toBe(true);
      expect(options.bar.plugins?.title?.text).toBe('Team Analytics');

      expect(options.doughnut.responsive).toBe(true);
      expect(options.doughnut.plugins?.title?.text).toBe('Kudos by Title');
    });
  });
});
