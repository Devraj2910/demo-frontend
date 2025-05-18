import { AnalyticsService } from '../../../application/services/AnalyticsService';
import { AnalyticsRepository } from '../../../domain/repositories/AnalyticsRepository';
import {
  AnalyticsDashboardData,
  AnalyticsSummary,
  AnalyticsFilters,
  TimePeriod,
} from '../../../domain/entities/AnalyticsData';

describe('AnalyticsService', () => {
  // Mock repository
  let mockRepository: jest.Mocked<AnalyticsRepository>;
  let service: AnalyticsService;

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

  const mockDateRange: AnalyticsFilters = {
    startDate: '2023-01-01',
    endDate: '2023-12-31',
  };

  beforeEach(() => {
    // Create a mock repository with jest.fn() implementations
    mockRepository = {
      getDashboardData: jest.fn(),
      calculateSummary: jest.fn(),
      getDateRangeFromPeriod: jest.fn(),
    };

    // Initialize service with mock repository
    service = new AnalyticsService(mockRepository);

    // Set up default mock implementations
    mockRepository.getDashboardData.mockResolvedValue(mockDashboardData);
    mockRepository.calculateSummary.mockReturnValue(mockSummary);
    mockRepository.getDateRangeFromPeriod.mockReturnValue(mockDateRange);
  });

  describe('getDashboardData', () => {
    it('should return dashboard data and summary for a time period', async () => {
      // Arrange
      const period: TimePeriod = 'Last Month';

      // Act
      const result = await service.getDashboardData(period);

      // Assert
      expect(mockRepository.getDateRangeFromPeriod).toHaveBeenCalledWith(period);
      expect(mockRepository.getDashboardData).toHaveBeenCalledWith(mockDateRange);
      expect(mockRepository.calculateSummary).toHaveBeenCalledWith(mockDashboardData);

      expect(result).toEqual({
        dashboardData: mockDashboardData,
        summary: mockSummary,
      });
    });

    it('should handle errors and throw them', async () => {
      // Arrange
      const errorMessage = 'API error';
      mockRepository.getDashboardData.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.getDashboardData('Last Month')).rejects.toThrow(errorMessage);
    });
  });

  describe('getCustomRangeData', () => {
    it('should return dashboard data and summary for custom date range', async () => {
      // Arrange
      const customDateRange: AnalyticsFilters = {
        startDate: '2023-06-01',
        endDate: '2023-06-30',
      };

      // Act
      const result = await service.getCustomRangeData(customDateRange);

      // Assert
      expect(mockRepository.getDashboardData).toHaveBeenCalledWith(customDateRange);
      expect(mockRepository.calculateSummary).toHaveBeenCalledWith(mockDashboardData);

      expect(result).toEqual({
        dashboardData: mockDashboardData,
        summary: mockSummary,
      });
    });
  });

  describe('exportData', () => {
    it('should export data to CSV format', async () => {
      // Act
      const result = await service.exportData(mockDashboardData, 'csv');

      // Assert
      expect(result).toBeInstanceOf(Blob);
      expect((result as Blob).type).toBe('text/csv;charset=utf-8;');
    });

    it('should export data to PDF format', async () => {
      // Act
      const result = await service.exportData(mockDashboardData, 'pdf');

      // Assert
      expect(result).toBeInstanceOf(Blob);
      expect((result as Blob).type).toBe('application/pdf');
    });

    it('should export data to Excel format', async () => {
      // Act
      const result = await service.exportData(mockDashboardData, 'excel');

      // Assert
      expect(result).toBeInstanceOf(Blob);
      expect((result as Blob).type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });

    it('should throw error for unsupported format', async () => {
      // Act & Assert
      // @ts-ignore - Testing invalid format
      await expect(service.exportData(mockDashboardData, 'invalid')).rejects.toThrow('Unsupported export format');
    });
  });
});
