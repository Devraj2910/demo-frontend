import React from "react";
import { render, screen } from "@testing-library/react";
import ChartsFirstRow from "../ChartsFirstRow";

// Mock child components
jest.mock("../TrendChart", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-trend-chart" />),
}));

jest.mock("../BarChart", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-bar-chart" />),
}));

describe("ChartsFirstRow Component", () => {
  const mockChartData = {
    monthlyTrendChart: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [
        {
          label: "Active Users",
          data: [10, 15, 20],
        },
        {
          label: "Cards Created",
          data: [5, 8, 12],
        },
      ],
    },
    teamAnalyticsChart: {
      labels: ["Team A", "Team B", "Team C"],
      datasets: [
        {
          label: "Kudos Count",
          data: [25, 15, 10],
        },
      ],
    },
  };

  const mockChartOptions = {
    line: {
      responsive: true,
      maintainAspectRatio: false,
    },
    bar: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  it("should render nothing when chartData is null", () => {
    // Arrange & Act
    const { container } = render(
      <ChartsFirstRow chartData={null} chartOptions={mockChartOptions} />
    );

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("should render both charts when data is provided", () => {
    // Arrange & Act
    render(
      <ChartsFirstRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    expect(screen.getByText("Monthly Activity")).toBeInTheDocument();
    expect(screen.getByText("Team Leaderboard")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-trend-chart")).toHaveLength(1);
    expect(screen.getAllByTestId("mock-bar-chart")).toHaveLength(1);
  });

  it("should display chart legends", () => {
    // Arrange & Act
    render(
      <ChartsFirstRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("Cards Created")).toBeInTheDocument();
  });

  it("should show the total kudos count", () => {
    // Arrange & Act
    render(
      <ChartsFirstRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    // Sum of mockChartData.monthlyTrendChart.datasets[1].data is 5+8+12=25
    expect(screen.getByText("25 Total Kudos")).toBeInTheDocument();
  });

  it("should show the team count", () => {
    // Arrange & Act
    render(
      <ChartsFirstRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    // Length of mockChartData.teamAnalyticsChart.labels is 3
    expect(screen.getByText("3 Teams")).toBeInTheDocument();
  });
});
