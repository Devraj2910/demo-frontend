import React from "react";
import { render, screen } from "@testing-library/react";
import ChartsSecondRow from "../ChartsSecondRow";

// Mock the DonutChart component
jest.mock("../DonutChart", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-donut-chart" />),
}));

// Mock framer-motion to prevent test issues
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: any;
    }) => <div {...props}>{children}</div>,
  },
}));

describe("ChartsSecondRow Component", () => {
  const mockChartData = {
    titleAnalyticsChart: {
      labels: ["Innovation", "Teamwork", "Leadership"],
      datasets: [
        {
          data: [45, 30, 25],
          backgroundColor: ["#8B5CF6", "#EC4899", "#10B981"],
        },
      ],
    },
  };

  const mockChartOptions = {
    doughnut: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  };

  it("should render nothing when chartData is null", () => {
    // Arrange & Act
    const { container } = render(
      <ChartsSecondRow chartData={null} chartOptions={mockChartOptions} />
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it("should render donut chart when data is provided", () => {
    // Arrange & Act
    render(
      <ChartsSecondRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    expect(screen.getByText("Kudos by Title")).toBeInTheDocument();
    expect(screen.getByText("Category Distribution")).toBeInTheDocument();
    expect(screen.getByTestId("mock-donut-chart")).toBeInTheDocument();
  });

  it("should display all category labels", () => {
    // Arrange & Act
    render(
      <ChartsSecondRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Teamwork")).toBeInTheDocument();
    expect(screen.getByText("Leadership")).toBeInTheDocument();
  });

  it("should display category counts correctly", () => {
    // Arrange & Act
    render(
      <ChartsSecondRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("should display percentage values correctly", () => {
    // Arrange & Act
    render(
      <ChartsSecondRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    // Total is 100%, Innovation is 45/100 = 45%
    expect(screen.getByText("(45%)")).toBeInTheDocument();
    expect(screen.getByText("(30%)")).toBeInTheDocument();
    expect(screen.getByText("(25%)")).toBeInTheDocument();
  });

  it("should display the category count in the header", () => {
    // Arrange & Act
    render(
      <ChartsSecondRow
        chartData={mockChartData}
        chartOptions={mockChartOptions}
      />
    );

    // Assert
    expect(screen.getByText("3 Categories")).toBeInTheDocument();
  });
});
