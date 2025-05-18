import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  const mockSetSearchTerm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with the correct label and placeholder", () => {
    // Arrange & Act
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    // Assert
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search by name or content...")
    ).toBeInTheDocument();
  });

  it("displays the provided search term", () => {
    // Arrange
    const testSearchTerm = "test search";

    // Act
    render(
      <SearchBar
        searchTerm={testSearchTerm}
        setSearchTerm={mockSetSearchTerm}
      />
    );

    // Assert
    expect(screen.getByDisplayValue(testSearchTerm)).toBeInTheDocument();
  });

  it("calls setSearchTerm when input changes", () => {
    // Arrange
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    const input = screen.getByLabelText("Search");
    const newValue = "new search term";

    // Act
    fireEvent.change(input, { target: { value: newValue } });

    // Assert
    expect(mockSetSearchTerm).toHaveBeenCalledWith(newValue);
  });

  it("renders the search icon", () => {
    // Arrange & Act
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    // Assert - since the SVG is not easily queryable, we'll check for the container
    const svgContainer = document.querySelector(
      ".absolute.inset-y-0.left-0.pl-3.flex.items-center"
    );
    expect(svgContainer).toBeInTheDocument();
  });

  it("applies correct CSS classes for styling", () => {
    // Arrange & Act
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    // Assert
    const input = screen.getByLabelText("Search");
    expect(input).toHaveClass("border");
    expect(input).toHaveClass("border-gray-300");
    expect(input).toHaveClass("rounded-lg");
    expect(input).toHaveClass("w-full");
    expect(input).toHaveClass("pl-10");
  });
});
