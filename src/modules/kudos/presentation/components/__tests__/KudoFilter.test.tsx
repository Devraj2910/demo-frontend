import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import KudoFilter from "../KudoFilter";
import { GetTeamsUseCase } from "../../../core/useCases/getTeamsUseCase";

// Mock the GetTeamsUseCase
jest.mock("../../../core/useCases/getTeamsUseCase");

describe("KudoFilter", () => {
  const mockOnFilterChange = jest.fn();
  const mockTeams = [
    {
      id: 1,
      name: "Engineering",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 2,
      name: "Marketing",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock console.error to keep test output clean
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Setup mock for GetTeamsUseCase with a promise that we can resolve
    const mockExecute = jest.fn().mockResolvedValue({
      success: true,
      data: mockTeams,
    });

    // Apply the mock implementation
    (GetTeamsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));
  });

  afterEach(() => {
    // Restore console.error
    (console.error as jest.Mock).mockRestore();
  });

  it("renders the filter component with all options", async () => {
    // Arrange & Act
    await act(async () => {
      render(<KudoFilter onFilterChange={mockOnFilterChange} />);
    });

    // Assert
    expect(screen.getByText("Filter Kudos")).toBeInTheDocument();
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(screen.getByLabelText("Team")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();

    // Category options should be present
    expect(screen.getByText("All Categories")).toBeInTheDocument();
    expect(screen.getByText("Teamwork")).toBeInTheDocument();
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Helping Hand")).toBeInTheDocument();
    expect(screen.getByText("default")).toBeInTheDocument();
  });

  it("calls onFilterChange when search input changes", async () => {
    // Arrange
    await act(async () => {
      render(<KudoFilter onFilterChange={mockOnFilterChange} />);
    });
    const searchInput = screen.getByLabelText("Search");

    // Act
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "test search" } });
    });

    // Assert
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      searchTerm: "test search",
    });
  });

  it("calls onFilterChange when category is selected", async () => {
    // Arrange
    await act(async () => {
      render(<KudoFilter onFilterChange={mockOnFilterChange} />);
    });
    const categorySelect = screen.getByLabelText("Category");

    // Act
    await act(async () => {
      fireEvent.change(categorySelect, { target: { value: "Teamwork" } });
    });

    // Assert
    expect(mockOnFilterChange).toHaveBeenCalledWith({ category: "Teamwork" });
  });

  it("displays and functions the clear filters button when filters are applied", async () => {
    // Arrange
    await act(async () => {
      render(
        <KudoFilter
          onFilterChange={mockOnFilterChange}
          initialFilters={{ searchTerm: "test" }}
        />
      );
    });

    // Should show the clear button
    const clearButton = screen.getByText("Clear Filters");
    expect(clearButton).toBeInTheDocument();

    // Act - clear the filters
    await act(async () => {
      fireEvent.click(clearButton);
    });

    // Assert
    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it("doesnt show clear filters button when no filters are applied", async () => {
    // Arrange & Act
    await act(async () => {
      render(<KudoFilter onFilterChange={mockOnFilterChange} />);
    });

    // Assert
    expect(screen.queryByText("Clear Filters")).not.toBeInTheDocument();
  });

  it("handles team selection changes", async () => {
    // Arrange
    await act(async () => {
      render(<KudoFilter onFilterChange={mockOnFilterChange} />);
    });

    // Wait for teams to load
    await waitFor(() => {
      expect(screen.queryByText("Loading teams...")).not.toBeInTheDocument();
    });

    // Act - select a team (need to wait for teams to load)
    await act(async () => {
      const teamSelect = screen.getByLabelText("Team");
      fireEvent.change(teamSelect, { target: { value: "1" } });
    });

    // Assert
    expect(mockOnFilterChange).toHaveBeenCalledWith({ team: "1" });
  });
});
