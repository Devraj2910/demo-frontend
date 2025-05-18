import React from "react";
import { render, screen } from "@testing-library/react";
import BarChart from "../BarChart";

// Mock the react-chartjs-2 module
jest.mock("react-chartjs-2", () => ({
  Bar: jest.fn(() => <div data-testid="mock-bar-chart" />),
}));

describe("BarChart Component", () => {
  const mockData = {
    labels: ["Team A", "Team B", "Team C"],
    datasets: [
      {
        label: "Kudos Count",
        data: [25, 15, 10],
        backgroundColor: ["#4F46E5", "#3B82F6", "#6366F1"],
      },
    ],
  };

  const mockOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  it("should render with default title", () => {
    // Arrange & Act
    render(<BarChart data={mockData} options={mockOptions} />);

    // Assert
    expect(screen.getByText("Bar Chart")).toBeInTheDocument();
    expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
  });

  it("should render with custom title", () => {
    // Arrange & Act
    const customTitle = "Team Performance";
    render(
      <BarChart data={mockData} options={mockOptions} title={customTitle} />
    );

    // Assert
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByTestId("mock-bar-chart")).toBeInTheDocument();
  });

  it("should pass props to Bar chart component", () => {
    // Arrange & Act
    render(<BarChart data={mockData} options={mockOptions} />);

    // Assert
    const barChart = screen.getByTestId("mock-bar-chart");
    expect(barChart).toBeInTheDocument();
  });
});
