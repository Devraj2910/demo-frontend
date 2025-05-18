import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../../../presentation/components/RegisterForm";
import { useTeams } from "../../../presentation/hooks/useTeams";

// Mock the useTeams hook
jest.mock("../../../presentation/hooks/useTeams", () => ({
  useTeams: jest.fn(),
}));

describe("RegisterForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnSwitchToLogin = jest.fn();
  const defaultProps = {
    loading: false,
    error: "",
    onSubmit: mockOnSubmit,
    onSwitchToLogin: mockOnSwitchToLogin,
  };

  const mockTeams = [
    { id: "1", name: "Engineering" },
    { id: "2", name: "Design" },
    { id: "3", name: "Marketing" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useTeams as jest.Mock).mockReturnValue({
      teams: mockTeams,
      loading: false,
      error: null,
    });
  });

  it("renders correctly", () => {
    render(<RegisterForm {...defaultProps} />);

    // Check if form elements are rendered
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
  });

  it("displays error message when provided", () => {
    const errorMessage = "Registration failed";
    render(<RegisterForm {...defaultProps} error={errorMessage} />);

    // Check if error message is displayed
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();

    // According to the implementation, the error container has classes
    // 'bg-red-50 border-l-4 border-auth-error p-4 mb-6 rounded-r'
    const errorContainer =
      errorElement.closest("div")!.parentElement!.parentElement;
    expect(errorContainer).toHaveClass("bg-red-50");
    expect(errorContainer).toHaveClass("border-auth-error");
    expect(errorContainer).toHaveClass("mb-6");
  });

  it("displays teams correctly", () => {
    render(<RegisterForm {...defaultProps} />);

    // Check if all team options are rendered
    expect(screen.getByText("Select your team")).toBeInTheDocument();
    mockTeams.forEach((team) => {
      expect(screen.getByText(team.name)).toBeInTheDocument();
    });
  });

  it("shows loading state for teams", () => {
    (useTeams as jest.Mock).mockReturnValue({
      teams: [],
      loading: true,
      error: null,
    });

    render(<RegisterForm {...defaultProps} />);

    expect(screen.getByText(/loading teams/i)).toBeInTheDocument();

    // Team selector should be disabled during loading
    const teamSelect = screen.getByLabelText(/team/i);
    expect(teamSelect).toBeDisabled();
  });

  it("shows error state for teams", () => {
    (useTeams as jest.Mock).mockReturnValue({
      teams: [],
      loading: false,
      error: "Failed to load teams",
    });

    render(<RegisterForm {...defaultProps} />);

    expect(screen.getByText(/failed to load teams/i)).toBeInTheDocument();
  });

  it("validates name input", async () => {
    render(<RegisterForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    // Submit empty form
    fireEvent.click(submitButton);

    // Should show required error
    expect(
      await screen.findByText(/full name is required/i),
    ).toBeInTheDocument();

    // Check error styling
    expect(nameInput).toHaveClass("border-auth-error");

    // Enter valid name
    await userEvent.type(nameInput, "John Doe");

    // Click submit again to trigger validation
    fireEvent.click(submitButton);

    // Error message should disappear
    await waitFor(() => {
      expect(
        screen.queryByText(/full name is required/i),
      ).not.toBeInTheDocument();
    });

    // Input should no longer have error styling
    expect(nameInput).not.toHaveClass("border-auth-error");
  });

  it("validates email input", async () => {
    render(<RegisterForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    // Submit empty form
    fireEvent.click(submitButton);

    // Should show required error
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    // Enter invalid email
    await userEvent.type(emailInput, "invalid-email");
    fireEvent.click(submitButton);

    // Should show invalid email error
    expect(
      await screen.findByText(/please enter a valid email/i),
    ).toBeInTheDocument();

    // Check error styling
    expect(emailInput).toHaveClass("border-auth-error");

    // Enter valid email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "valid@example.com");

    // Submit again to trigger validation
    fireEvent.click(submitButton);

    // Error should no longer be displayed
    await waitFor(() => {
      expect(
        screen.queryByText(/please enter a valid email/i),
      ).not.toBeInTheDocument();
    });
  });

  it("validates team selection", async () => {
    render(<RegisterForm {...defaultProps} />);

    const teamSelect = screen.getByLabelText(/team/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    // Submit empty form
    fireEvent.click(submitButton);

    // Should show required error
    expect(await screen.findByText(/team is required/i)).toBeInTheDocument();

    // Check error styling
    expect(teamSelect).toHaveClass("border-auth-error");

    // Select a team
    await userEvent.selectOptions(teamSelect, "1");

    // Submit again to trigger validation
    fireEvent.click(submitButton);

    // Error should no longer be displayed
    await waitFor(() => {
      expect(screen.queryByText(/team is required/i)).not.toBeInTheDocument();
    });
  });

  it("validates password input", async () => {
    render(<RegisterForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    // Submit empty form
    fireEvent.click(submitButton);

    // Should show required error
    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();

    // Enter short password
    await userEvent.type(passwordInput, "short");
    fireEvent.click(submitButton);

    // Should show password length error
    expect(
      await screen.findByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument();

    // Check error styling
    expect(passwordInput).toHaveClass("border-auth-error");

    // Enter valid password
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, "validpassword123");

    // Submit again to trigger validation
    fireEvent.click(submitButton);

    // Error should no longer be displayed
    await waitFor(() => {
      expect(
        screen.queryByText(/password must be at least 6 characters/i),
      ).not.toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    render(<RegisterForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const teamSelect = screen.getByLabelText(/team/i);
    const roleSelect = screen.getByLabelText(/role/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    // Fill form with valid data
    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.selectOptions(teamSelect, "1");
    await userEvent.selectOptions(roleSelect, "tech-lead");
    await userEvent.type(passwordInput, "password123");

    // Submit the form
    const formElement = submitButton.closest("form");
    expect(formElement).toBeInTheDocument();
    fireEvent.submit(formElement!);

    // Check if onSubmit was called
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("shows loading state when loading prop is true", () => {
    render(<RegisterForm {...defaultProps} loading={true} />);

    // Find the loading button
    const loadingButton = screen.getByRole("button", { name: /registering/i });

    // Check button state
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveClass("bg-auth-secondary");

    // Verify that the loading text is within the button
    expect(loadingButton).toHaveTextContent(/registering/i);

    // Check for SVG spinner
    const svg = loadingButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-auth-spin");
  });

  it('calls onSwitchToLogin when "Sign in" is clicked', async () => {
    render(<RegisterForm {...defaultProps} />);

    const loginLink = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(loginLink);

    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1);
  });

  it("disables form submission when teams are loading", () => {
    (useTeams as jest.Mock).mockReturnValue({
      teams: [],
      loading: true,
      error: null,
    });

    render(<RegisterForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass("bg-auth-secondary");
  });
});
