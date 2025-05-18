import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TimePeriodFilter from "../TimePeriodFilter";

describe("TimePeriodFilter Component", () => {
  const mockTimePeriods = [
    "Last Week",
    "Last Month",
    "Last Quarter",
    "Last Year",
    "All Time",
  ];
  const mockSetTimePeriod = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all time periods", () => {
    // Arrange & Act
    render(
      <TimePeriodFilter
        timePeriod="Last Month"
        setTimePeriod={mockSetTimePeriod}
        TIME_PERIODS={mockTimePeriods}
      />
    );

    // Assert
    expect(screen.getByText("Time Period")).toBeInTheDocument();
    mockTimePeriods.forEach((period) => {
      expect(screen.getByText(period)).toBeInTheDocument();
    });
  });

  it("should highlight the selected time period", () => {
    // Arrange & Act
    render(
      <TimePeriodFilter
        timePeriod="Last Week"
        setTimePeriod={mockSetTimePeriod}
        TIME_PERIODS={mockTimePeriods}
      />
    );

    // Assert - the select should have the selected value
    const selectElement = screen.getByDisplayValue("Last Week");
    expect(selectElement).toBeInTheDocument();
  });

  it("should call setTimePeriod when a different period is selected", () => {
    // Arrange
    render(
      <TimePeriodFilter
        timePeriod="Last Month"
        setTimePeriod={mockSetTimePeriod}
        TIME_PERIODS={mockTimePeriods}
      />
    );

    // Act
    fireEvent.change(screen.getByDisplayValue("Last Month"), {
      target: { value: "Last Quarter" },
    });

    // Assert
    expect(mockSetTimePeriod).toHaveBeenCalledWith("Last Quarter");
  });

  it("should display the currently selected time period", () => {
    // Arrange
    render(
      <TimePeriodFilter
        timePeriod="Last Month"
        setTimePeriod={mockSetTimePeriod}
        TIME_PERIODS={mockTimePeriods}
      />
    );

    // Assert
    const selectElement = screen.getByDisplayValue("Last Month");
    expect(selectElement).toBeInTheDocument();
  });
});
