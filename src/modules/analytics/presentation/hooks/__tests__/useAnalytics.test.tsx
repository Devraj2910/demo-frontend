import { renderHook, act } from '@testing-library/react-hooks';
import { useAnalytics } from '../useAnalytics';
import { GetDashboardStats } from '../../../application/usecases/GetDashboardStats';
import { AnalyticsService } from '../../../application/services/AnalyticsService';
import { analyticsApi } from '../../../infrastructure/api/analyticsApi';
import { useAuth } from '@/modules/auth';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/modules/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../application/usecases/GetDashboardStats');
jest.mock('../../../application/services/AnalyticsService');
jest.mock('../../../infrastructure/api/analyticsApi', () => ({
  analyticsApi: {
    getRepository: jest.fn(),
  },
}));

describe('useAnalytics hook', () => {
  // Setup mock responses and implementations
  const mockRouter = {
    push: jest.fn(),
  };

  const mockAuth = {
    hasPermission: jest.fn(),
    isAuthenticated: true,
  };

  const mockDashboardData = {
    topReceivers: [{ id: '1', firstName: 'John', lastName: 'Doe', cardCount: 5 }],
    topCreators: [{ id: '2', firstName: 'Jane', lastName: 'Smith', cardCount: 3 }],
    teamAnalytics: [{ id: 1, name: 'Team A', cardCount: 10 }],
    cardVolume: { total: 15 },
    activeUsers: { activeUsers: 8 },
    monthlyAnalytics: [{ month: 'Jan', activeUsers: 5, cardsCreated: 10 }],
    titleAnalytics: [{ title: 'Innovation', count: 7 }],
  };

  const mockSummary = {
    totalKudos: 15,
    activeUsers: 8,
    engagementRate: 80,
  };

  const mockExecResponse = {
    success: true,
    data: {
      dashboardData: mockDashboardData,
      summary: mockSummary,
    },
  };

  const mockExecute = jest.fn().mockResolvedValue(mockExecResponse);

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mocks
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockAuth);

    // Setup analytics mocks
    (GetDashboardStats as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    (AnalyticsService as jest.Mock).mockImplementation(() => ({}));
    (analyticsApi.getRepository as jest.Mock).mockReturnValue({});
  });

  it('should fetch analytics data on initial render', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAnalytics());

    // Initial state should show loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.dashboardData).toBeNull();

    // Wait for data fetch to complete
    await waitForNextUpdate();

    // Should have updated state with data
    expect(result.current.isLoading).toBe(false);
    expect(result.current.dashboardData).toEqual(mockDashboardData);
    expect(result.current.summary).toEqual(mockSummary);
    expect(mockExecute).toHaveBeenCalledWith('Last Month');
  });

  it('should update data when time period changes', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAnalytics());

    // Wait for initial fetch
    await waitForNextUpdate();

    // Change time period
    act(() => {
      result.current.setTimePeriod('Last Week');
    });

    // Should be loading again
    expect(result.current.isLoading).toBe(true);

    // Wait for second fetch
    await waitForNextUpdate();

    // Should have updated with new data
    expect(result.current.isLoading).toBe(false);
    expect(mockExecute).toHaveBeenCalledWith('Last Week');
  });

  it('should format chart data correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAnalytics());

    // Wait for fetch to complete
    await waitForNextUpdate();

    // Check formatted chart data
    expect(result.current.chartData).not.toBeNull();
    expect(result.current.chartData?.monthlyTrendChart.labels).toEqual(['Jan']);
    expect(result.current.chartData?.monthlyTrendChart.datasets).toHaveLength(2);
    expect(result.current.chartData?.teamAnalyticsChart.labels).toEqual(['Team A']);
    expect(result.current.chartData?.titleAnalyticsChart.labels).toEqual(['Innovation']);
  });

  it('should redirect unauthenticated users', async () => {
    // Mock unauthenticated state
    (useAuth as jest.Mock).mockReturnValue({
      ...mockAuth,
      isAuthenticated: false,
    });

    renderHook(() => useAnalytics());

    // Should redirect to home
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should redirect users without admin permission', async () => {
    // Mock user without permission
    (useAuth as jest.Mock).mockReturnValue({
      ...mockAuth,
      isAuthenticated: true,
      hasPermission: jest.fn().mockReturnValue(false),
    });

    renderHook(() => useAnalytics());

    // Should redirect to kudowall
    expect(mockRouter.push).toHaveBeenCalledWith('/kudowall');
  });

  it('should handle error state', async () => {
    // Mock error response
    const errorMessage = 'API Error';
    mockExecute.mockResolvedValueOnce({
      success: false,
      error: errorMessage,
    });

    const { result, waitForNextUpdate } = renderHook(() => useAnalytics());

    // Wait for fetch to complete
    await waitForNextUpdate();

    // Should show error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.dashboardData).toBeNull();
  });
});
