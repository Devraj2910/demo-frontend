import { GetDashboardStats } from '../../../application/usecases/GetDashboardStats';
import { AnalyticsService } from '../../../application/services/AnalyticsService';
import { AnalyticsDashboardData, AnalyticsSummary, TimePeriod } from '../../../domain/entities/AnalyticsData';

describe('GetDashboardStats', () => {
  // Mock service
  let mockAnalyticsService: jest.Mocked<AnalyticsService>;
  let useCase: GetDashboardStats;

  // Mock data
  const mockDashboardData: AnalyticsDashboardData = {
    topReceivers: [{ id: '1', firstName: 'John', lastName: 'Doe', cardCount: 10 }],
    topCreators: [{ id: '2', firstName: 'Jane', lastName: 'Smith', cardCount: 15 }],
    teamAnalytics: [{ id: 1, name: 'Team A', cardCount: 25 }],
    cardVolume: { total: 100 },
    activeUsers: { activeUsers: 50 },
    monthlyAnalytics: [{ month: 'Jan', activeUsers: 40, cardsCreated: 80 }],
    titleAnalytics: [{ title: 'Great Job', count: 40 }],
  };

  const mockSummary: AnalyticsSummary = {
    totalKudos: 100,
    activeUsers: 50,
    engagementRate: 80,
  };

  const mockServiceResponse = {
    dashboardData: mockDashboardData,
    summary: mockSummary,
  };

  beforeEach(() => {
    // Create mock service
    mockAnalyticsService = {
      getDashboardData: jest.fn(),
      getCustomRangeData: jest.fn(),
      exportData: jest.fn(),
    } as unknown as jest.Mocked<AnalyticsService>;

    // Initialize use case with mock service
    useCase = new GetDashboardStats(mockAnalyticsService);

    // Set up default mock implementation
    mockAnalyticsService.getDashboardData.mockResolvedValue(mockServiceResponse);
  });

  describe('execute', () => {
    it('should return success with dashboard data and summary', async () => {
      // Arrange
      const period: TimePeriod = 'Last Month';

      // Act
      const result = await useCase.execute(period);

      // Assert
      expect(mockAnalyticsService.getDashboardData).toHaveBeenCalledWith(period);
      expect(result).toEqual({
        success: true,
        data: mockServiceResponse,
      });
    });

    it('should handle errors and return error response', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch data';
      mockAnalyticsService.getDashboardData.mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await useCase.execute('Last Week');

      // Assert
      expect(result).toEqual({
        success: false,
        error: errorMessage,
      });
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      mockAnalyticsService.getDashboardData.mockRejectedValue('String error');

      // Act
      const result = await useCase.execute('Last Week');

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Failed to load analytics data',
      });
    });
  });
});
