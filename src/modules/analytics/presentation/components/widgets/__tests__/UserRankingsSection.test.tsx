import React from "react";
import { render, screen } from "@testing-library/react";
import UserRankingsSection from "../UserRankingsSection";

// Mock child components
jest.mock("../UserRankingList", () => ({
  __esModule: true,
  default: ({ title, users }) => (
    <div data-testid="user-ranking-list">
      <h3>{title}</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.count}
          </li>
        ))}
      </ul>
    </div>
  ),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe("UserRankingsSection Component", () => {
  const mockDashboardData = {
    topReceivers: [
      { id: "1", firstName: "John", lastName: "Doe", cardCount: 12 },
      { id: "2", firstName: "Jane", lastName: "Smith", cardCount: 10 },
    ],
    topCreators: [
      { id: "3", firstName: "Mike", lastName: "Johnson", cardCount: 8 },
      { id: "4", firstName: "Sarah", lastName: "Williams", cardCount: 6 },
    ],
  };

  it("should render nothing when dashboardData is null", () => {
    // Arrange & Act
    const { container } = render(<UserRankingsSection dashboardData={null} />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it("should render section title and description", () => {
    // Arrange & Act
    render(<UserRankingsSection dashboardData={mockDashboardData} />);

    // Assert
    expect(screen.getByText("Recognition Leaders")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Top contributors who are actively engaging with the recognition platform."
      )
    ).toBeInTheDocument();
  });

  it("should render two UserRankingList components", () => {
    // Arrange & Act
    render(<UserRankingsSection dashboardData={mockDashboardData} />);

    // Assert
    const rankingLists = screen.getAllByTestId("user-ranking-list");
    expect(rankingLists).toHaveLength(2);
  });

  it("should pass correctly formatted data to UserRankingList components", () => {
    // Arrange & Act
    render(<UserRankingsSection dashboardData={mockDashboardData} />);

    // Assert
    expect(screen.getByText("Top Kudos Receivers")).toBeInTheDocument();
    expect(screen.getByText("Top Kudos Givers")).toBeInTheDocument();

    // Check that the names are properly formatted from firstName and lastName
    expect(screen.getByText("John Doe - 12")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith - 10")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson - 8")).toBeInTheDocument();
    expect(screen.getByText("Sarah Williams - 6")).toBeInTheDocument();
  });
});
