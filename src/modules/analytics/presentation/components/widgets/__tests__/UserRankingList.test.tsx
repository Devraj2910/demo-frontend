import React from "react";
import { render, screen } from "@testing-library/react";
import UserRankingList from "../UserRankingList";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
  },
}));

describe("UserRankingList Component", () => {
  const mockUsers = [
    {
      id: "1",
      name: "John Doe",
      count: 12,
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      team: "Engineering",
    },
    {
      id: "2",
      name: "Jane Smith",
      count: 8,
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
      team: "Marketing",
    },
    {
      id: "3",
      name: "Mike Johnson",
      count: 5,
      avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
      team: "Design",
    },
  ];

  it("should render the title correctly", () => {
    // Arrange & Act
    render(<UserRankingList title="Top Receivers" users={mockUsers} />);

    // Assert
    expect(screen.getByText("Top Receivers")).toBeInTheDocument();
  });

  it("should render all users in the list", () => {
    // Arrange & Act
    render(<UserRankingList title="Top Receivers" users={mockUsers} />);

    // Assert
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Mike Johnson")).toBeInTheDocument();
  });

  it("should display correct kudos counts", () => {
    // Arrange & Act
    render(<UserRankingList title="Top Receivers" users={mockUsers} />);

    // Assert
    expect(screen.getByText("12 kudos")).toBeInTheDocument();
    expect(screen.getByText("8 kudos")).toBeInTheDocument();
    expect(screen.getByText("5 kudos")).toBeInTheDocument();
  });

  it("should display team information", () => {
    // Arrange & Act
    render(<UserRankingList title="Top Receivers" users={mockUsers} />);

    // Assert
    expect(screen.getByText("Team Engineering")).toBeInTheDocument();
    expect(screen.getByText("Team Marketing")).toBeInTheDocument();
    expect(screen.getByText("Team Design")).toBeInTheDocument();
  });

  it("should render user avatars", () => {
    // Arrange & Act
    render(<UserRankingList title="Top Receivers" users={mockUsers} />);

    // Assert
    const avatarImages = screen.getAllByRole("img");
    expect(avatarImages).toHaveLength(3);

    expect(avatarImages[0]).toHaveAttribute("alt", "John Doe");
    expect(avatarImages[1]).toHaveAttribute("alt", "Jane Smith");
    expect(avatarImages[2]).toHaveAttribute("alt", "Mike Johnson");

    expect(avatarImages[0]).toHaveAttribute("src", mockUsers[0].avatar);
    expect(avatarImages[1]).toHaveAttribute("src", mockUsers[1].avatar);
    expect(avatarImages[2]).toHaveAttribute("src", mockUsers[2].avatar);
  });

  it("should use left slide direction by default", () => {
    // Arrange & Act
    render(<UserRankingList title="Top Receivers" users={mockUsers} />);

    // Assert
    // Check for the success icon (checkmark) which appears when slideDirection is left
    const svgPath = screen
      .getByText("Top Receivers")
      .parentNode.querySelector("svg path");
    expect(svgPath).toHaveAttribute(
      "d",
      expect.stringContaining("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z")
    );
  });

  it("should use right slide direction when specified", () => {
    // Arrange & Act
    render(
      <UserRankingList
        title="Top Givers"
        users={mockUsers}
        slideDirection="right"
      />
    );

    // Assert
    // Check for the dollar/money icon which appears when slideDirection is right
    const svgPath = screen
      .getByText("Top Givers")
      .parentNode.querySelector("svg path");
    expect(svgPath).toHaveAttribute(
      "d",
      expect.stringContaining(
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      )
    );
  });
});
