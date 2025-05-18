import React from "react";
import { render } from "@testing-library/react";
import DonutChart from "../DonutChart";

// Mock the react-chartjs-2 module
jest.mock("react-chartjs-2", () => ({
  Doughnut: jest.fn(() => <div data-testid="mock-doughnut-chart" />),
}));

describe("DonutChart Component", () => {
  const mockData = {
    labels: ["Label 1", "Label 2", "Label 3"],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const mockOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  it("should render the DonutChart component correctly", () => {
    // Arrange & Act
    const { getByTestId } = render(
      <DonutChart data={mockData} options={mockOptions} />
    );

    // Assert
    expect(getByTestId("mock-doughnut-chart")).toBeInTheDocument();
  });
});
