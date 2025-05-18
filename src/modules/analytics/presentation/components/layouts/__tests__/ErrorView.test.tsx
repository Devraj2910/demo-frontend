import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorView from "../ErrorView";

describe("ErrorView Component", () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the default error message when no specific error is provided", () => {
    // Arrange & Act
    render(<ErrorView error={null} onRetry={mockOnRetry} />);

    // Assert
    expect(screen.getByText("Error Loading Data")).toBeInTheDocument();
    expect(
      screen.getByText("Something went wrong. Please try again later.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("should render a custom error message when provided", () => {
    // Arrange & Act
    const customErrorMessage = "Unable to connect to the analytics service";
    render(<ErrorView error={customErrorMessage} onRetry={mockOnRetry} />);

    // Assert
    expect(screen.getByText("Error Loading Data")).toBeInTheDocument();
    expect(screen.getByText(customErrorMessage)).toBeInTheDocument();
  });

  it("should call onRetry when the retry button is clicked", () => {
    // Arrange
    render(<ErrorView error={null} onRetry={mockOnRetry} />);

    // Act
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));

    // Assert
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});
