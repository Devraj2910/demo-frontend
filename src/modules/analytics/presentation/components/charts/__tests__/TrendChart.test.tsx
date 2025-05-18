import React from "react";
import { render, screen } from "@testing-library/react";
import TrendChart from "../TrendChart";

// Mock the react-chartjs-2 module
jest.mock("react-chartjs-2", () => ({
  Line: jest.fn(() => <div data-testid="mock-line-chart" />),
}));

describe("TrendChart Component", () => {
  const mockData = {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Active Users",
        data: [10, 15, 20],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
      },
    ],
  };

  const mockOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  it("should render with default title", () => {
    // Arrange & Act
    render(<TrendChart data={mockData} options={mockOptions} />);

    // Assert
    expect(screen.getByText("Trend Over Time")).toBeInTheDocument();
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });

  it("should render with custom title", () => {
    // Arrange & Act
    const customTitle = "Monthly Trend Analysis";
    render(
      <TrendChart data={mockData} options={mockOptions} title={customTitle} />
    );

    // Assert
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
  });

  it("should pass props to Line chart component", () => {
    // Arrange & Act
    render(<TrendChart data={mockData} options={mockOptions} />);

    // Assert
    const lineChart = screen.getByTestId("mock-line-chart");
    expect(lineChart).toBeInTheDocument();
  });
});
