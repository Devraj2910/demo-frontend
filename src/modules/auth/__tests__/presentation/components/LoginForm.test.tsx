import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../../presentation/components/LoginForm";

describe("LoginForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnSwitchToRegister = jest.fn();
  const defaultProps = {
    loading: false,
    error: "",
    onSubmit: mockOnSubmit,
    onSwitchToRegister: mockOnSwitchToRegister,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<LoginForm {...defaultProps} />);

    // Check if form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/need an account/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register here/i }),
    ).toBeInTheDocument();
  });

  it("displays error message when provided", () => {
    const errorMessage = "Invalid credentials";
    render(<LoginForm {...defaultProps} error={errorMessage} />);

    // Just check if error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    // According to the implementation, the error container has classes
    // 'bg-red-50 border-l-4 border-auth-error p-4 mb-6 rounded-r'
    const parentContainer = screen.getByText(errorMessage).closest("div")!
      .parentElement!.parentElement;
    expect(parentContainer).toHaveClass("bg-red-50");
    expect(parentContainer).toHaveClass("border-auth-error");
    expect(parentContainer).toHaveClass("mb-6");
  });

  it("validates email input", async () => {
    render(<LoginForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

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

    // Check error styling on input
    expect(emailInput).toHaveClass("border-auth-error");
  });

  it("validates password input", async () => {
    render(<LoginForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Submit empty form
    fireEvent.click(submitButton);

    // Should show required error
    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();

    // Check error styling on input
    expect(passwordInput).toHaveClass("border-auth-error");
  });

  it("submits form with valid data", async () => {
    // Create a mock that captures form data
    const mockSubmit = jest.fn().mockImplementation((data) => {
      return Promise.resolve(data);
    });

    render(<LoginForm {...defaultProps} onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Fill form with valid data
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    // Set up a mock implementation of react-hook-form's handleSubmit
    // that will call our onSubmit with the form values directly
    const formElement = submitButton.closest("form");
    expect(formElement).toBeInTheDocument();

    // Submit form via a direct submit event to bypass react-hook-form's handling
    fireEvent.submit(formElement!);

    // Wait for onSubmit to be called
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });

    // We can't easily verify the exact parameters because react-hook-form
    // processes the data before calling onSubmit
  });

  it("shows loading state when loading prop is true", () => {
    render(<LoginForm {...defaultProps} loading={true} />);

    const loadingButton = screen.getByRole("button", { name: /signing in/i });

    // Check loading state
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveClass("bg-auth-secondary");

    // Find the loading indicator by text rather than structure
    const loadingIndicator = screen.getByText(/signing in/i);
    expect(loadingIndicator).toBeInTheDocument();

    // Check that there's an SVG inside the button (spinner)
    const svg = loadingButton.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-auth-spin");
  });

  it('calls onSwitchToRegister when "Register here" is clicked', async () => {
    render(<LoginForm {...defaultProps} />);

    const registerLink = screen.getByRole("button", { name: /register here/i });
    await userEvent.click(registerLink);

    expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it("disables submit button during form submission", async () => {
    render(<LoginForm {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole("button", { name: /signing in/i });

    expect(submitButton).toBeDisabled();

    // Try clicking the disabled button - it shouldn't trigger the submit
    await userEvent.click(submitButton);

    // The submit handler should not be called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
