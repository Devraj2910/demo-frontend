import React from "react";
import { render, screen } from "@testing-library/react";
import AnalyticsDashboard from "../AnalyticsDashboard";
import { useAnalytics } from "../../hooks/useAnalytics";

// Mock the useAnalytics hook
jest.mock("../../hooks/useAnalytics", () => ({
  useAnalytics: jest.fn(),
}));

// Mock the components used by AnalyticsDashboard
jest.mock("../layouts/DashboardHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-dashboard-header" />,
}));

jest.mock("../layouts/LoadingView", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-loading-view" />,
}));

jest.mock("../layouts/ErrorView", () => ({
  __esModule: true,
  default: ({ onRetry }: { onRetry: () => void }) => (
    <div data-testid="mock-error-view">
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock("../widgets/StatsCardsSection", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-stats-cards-section" />,
}));

jest.mock("../charts/ChartsFirstRow", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-charts-first-row" />,
}));

jest.mock("../charts/ChartsSecondRow", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-charts-second-row" />,
}));

describe("AnalyticsDashboard Component", () => {
  const mockSetTimePeriod = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading view when data is loading", () => {
    // Arrange
    (useAnalytics as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      dashboardData: null,
      summary: null,
      chartData: null,
      timePeriod: "Last Month",
      setTimePeriod: mockSetTimePeriod,
      TIME_PERIODS: ["Last Week", "Last Month", "Last Quarter"],
    });

    // Act
    render(<AnalyticsDashboard />);

    // Assert
    expect(screen.getByTestId("mock-loading-view")).toBeInTheDocument();
  });

  it("should render error view when there is an error", () => {
    // Arrange
    (useAnalytics as jest.Mock).mockReturnValue({
      isLoading: false,
      error: "API error occurred",
      dashboardData: null,
      summary: null,
      chartData: null,
      timePeriod: "Last Month",
      setTimePeriod: mockSetTimePeriod,
      TIME_PERIODS: ["Last Week", "Last Month", "Last Quarter"],
    });

    // Act
    render(<AnalyticsDashboard />);

    // Assert
    expect(screen.getByTestId("mock-error-view")).toBeInTheDocument();
  });

  it("should render dashboard content when data is loaded successfully", () => {
    // Arrange
    (useAnalytics as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      dashboardData: {
        topReceivers: [],
        topCreators: [],
        teamAnalytics: [],
        cardVolume: { total: 10 },
        activeUsers: { activeUsers: 5 },
        monthlyAnalytics: [],
        titleAnalytics: [],
      },
      summary: {
        totalKudos: 10,
        activeUsers: 5,
        engagementRate: 50,
      },
      chartData: {
        monthlyTrendChart: { labels: [], datasets: [] },
        teamAnalyticsChart: { labels: [], datasets: [] },
        titleAnalyticsChart: { labels: [], datasets: [] },
      },
      chartOptions: {},
      timePeriod: "Last Month",
      setTimePeriod: mockSetTimePeriod,
      TIME_PERIODS: ["Last Week", "Last Month", "Last Quarter"],
    });

    // Act
    render(<AnalyticsDashboard />);

    // Assert
    expect(screen.getByTestId("mock-dashboard-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-stats-cards-section")).toBeInTheDocument();
    expect(screen.getByTestId("mock-charts-first-row")).toBeInTheDocument();
    expect(screen.getByTestId("mock-charts-second-row")).toBeInTheDocument();
  });
});
