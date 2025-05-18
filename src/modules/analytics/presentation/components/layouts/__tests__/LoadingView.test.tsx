import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingView from "../LoadingView";

describe("LoadingView Component", () => {
  it("should render loading spinner and text", () => {
    // Arrange & Act
    render(<LoadingView />);

    // Assert
    expect(screen.getByText("Loading analytics data...")).toBeInTheDocument();

    // Check for the spinner element
    const spinnerElement = document.querySelector(".animate-spin");
    expect(spinnerElement).toBeInTheDocument();
  });

  it("should have the correct styling classes", () => {
    // Arrange & Act
    render(<LoadingView />);

    // Assert
    // Check for container with proper classes
    const container = document.querySelector(
      ".min-h-screen.bg-gray-50.flex.items-center.justify-center"
    );
    expect(container).toBeInTheDocument();

    // Check for spinner with proper classes
    const spinner = document.querySelector(
      ".animate-spin.rounded-full.h-16.w-16.border-t-2.border-b-2.border-indigo-500"
    );
    expect(spinner).toBeInTheDocument();
  });

  it("should center the loading content", () => {
    // Arrange & Act
    render(<LoadingView />);

    // Assert
    const centeredContent = document.querySelector(".text-center");
    expect(centeredContent).toBeInTheDocument();
  });
});
