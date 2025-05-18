import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import KudoList from "../KudoList";
import { Kudo } from "../../../core/types/kudoTypes";

// Mock the KudoCard component to simplify testing
jest.mock("../KudoCard", () => {
  return function MockKudoCard({ kudo }: { kudo: Kudo }) {
    return <div data-testid={`kudo-card-${kudo.id}`}>{kudo.title}</div>;
  };
});

describe("KudoList", () => {
  const mockKudos: Kudo[] = [
    {
      id: "1",
      title: "Great Work",
      content: "Thank you for your great work!",
      userId: "user1",
      createdFor: "user2",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      creator: {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        email: "john@example.com",
      },
      recipient: {
        id: "user2",
        firstName: "Jane",
        lastName: "Smith",
        fullName: "Jane Smith",
        email: "jane@example.com",
      },
      category: "Teamwork",
    },
    {
      id: "2",
      title: "Excellent Support",
      content: "Your help was invaluable!",
      userId: "user3",
      createdFor: "user1",
      createdAt: "2023-01-02",
      updatedAt: "2023-01-02",
      creator: {
        id: "user3",
        firstName: "Bob",
        lastName: "Johnson",
        fullName: "Bob Johnson",
        email: "bob@example.com",
      },
      recipient: {
        id: "user1",
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        email: "john@example.com",
      },
      category: "Helping Hand",
    },
  ];

  it("renders loading state when isLoading is true", () => {
    // Arrange & Act
    render(<KudoList kudos={[]} isLoading={true} />);

    // Assert
    expect(screen.getByText("Loading kudos...")).toBeInTheDocument();
  });

  it("renders empty state when no kudos are provided", () => {
    // Arrange & Act
    render(<KudoList kudos={[]} />);

    // Assert
    expect(screen.getByText("No kudos to display")).toBeInTheDocument();
    expect(
      screen.getByText("Be the first to share some appreciation!")
    ).toBeInTheDocument();
  });

  it("renders empty state with custom message when provided", () => {
    // Arrange & Act
    const customMessage = "Custom empty message";
    render(<KudoList kudos={[]} emptyMessage={customMessage} />);

    // Assert
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders empty state when kudos is null", () => {
    // Arrange & Act
    render(<KudoList kudos={null} />);

    // Assert
    expect(screen.getByText("No kudos to display")).toBeInTheDocument();
  });

  it("renders all kudos when they are provided", () => {
    // Arrange & Act
    render(<KudoList kudos={mockKudos} />);

    // Assert
    mockKudos.forEach((kudo) => {
      expect(screen.getByTestId(`kudo-card-${kudo.id}`)).toBeInTheDocument();
      expect(screen.getByText(kudo.title)).toBeInTheDocument();
    });
  });

  it("handles non-array values gracefully", () => {
    // Arrange & Act
    // @ts-ignore - intentionally passing invalid type for testing
    render(<KudoList kudos={{}} />);

    // Assert
    expect(screen.getByText("No kudos to display")).toBeInTheDocument();
  });
});
