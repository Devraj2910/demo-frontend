import React from "react";
import { render, screen } from "@testing-library/react";
import StatsCard from "../StatsCard";

describe("StatsCard Component", () => {
  it("should render with title and value", () => {
    // Arrange
    const props = {
      title: "Total Kudos",
      value: "150",
      icon: <span data-testid="award-icon">🏆</span>,
      change: 15,
      trend: "up",
      color: "bg-blue-100",
    };

    // Act
    render(<StatsCard {...props} />);

    // Assert
    expect(screen.getByText("Total Kudos")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("15% increase")).toBeInTheDocument();
    expect(screen.getByTestId("award-icon")).toBeInTheDocument();
  });

  it("should render with downward trend correctly", () => {
    // Arrange
    const props = {
      title: "Active Users",
      value: "42",
      icon: <span data-testid="users-icon">👥</span>,
      change: -5,
      trend: "down",
      color: "bg-green-100",
    };

    // Act
    render(<StatsCard {...props} />);

    // Assert
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("5% decrease")).toBeInTheDocument();
    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
  });

  it("should render without change and trend information", () => {
    // Arrange
    const props = {
      title: "Engagement Rate",
      value: "78%",
      icon: <span data-testid="activity-icon">📊</span>,
      color: "bg-purple-100",
    };

    // Act
    render(<StatsCard {...props} />);

    // Assert
    expect(screen.getByText("Engagement Rate")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
    expect(screen.getByTestId("activity-icon")).toBeInTheDocument();
    // Change percentage should not be present
    expect(screen.queryByTestId("trend-indicator")).not.toBeInTheDocument();
  });
});
