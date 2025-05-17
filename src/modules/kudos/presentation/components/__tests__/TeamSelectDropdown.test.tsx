import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamSelectDropdown from '../TeamSelectDropdown';
import { GetTeamsUseCase } from '../../../core/useCases/getTeamsUseCase';

// Mock the GetTeamsUseCase
jest.mock('../../../core/useCases/getTeamsUseCase');

describe('TeamSelectDropdown', () => {
  const mockTeams = ['Engineering', 'Marketing', 'Sales', 'HR'];
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock response for teams
    const mockExecute = jest.fn().mockResolvedValue({
      success: true,
      data: mockTeams,
    });

    // Apply the mock implementation
    (GetTeamsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));
  });

  it('renders with loading state initially', () => {
    // Arrange & Act
    render(<TeamSelectDropdown onChange={mockOnChange} />);

    // Assert
    expect(screen.getByText('Loading teams...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('loads and displays teams after API call completes', async () => {
    // Arrange & Act
    render(<TeamSelectDropdown onChange={mockOnChange} />);

    // Assert - wait for teams to load
    await waitFor(() => {
      expect(screen.queryByText('Loading teams...')).not.toBeInTheDocument();
    });

    // Default option should be present
    expect(screen.getByText('All Teams')).toBeInTheDocument();

    // All teams should be present
    mockTeams.forEach((team) => {
      expect(screen.getByText(team)).toBeInTheDocument();
    });

    // Dropdown should be enabled
    expect(screen.getByRole('combobox')).not.toBeDisabled();
  });

  it('calls onChange with correct value when a team is selected', async () => {
    // Arrange
    render(<TeamSelectDropdown onChange={mockOnChange} />);

    // Wait for teams to load
    await waitFor(() => {
      expect(screen.queryByText('Loading teams...')).not.toBeInTheDocument();
    });

    // Act - select a team
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Engineering' } });

    // Assert
    expect(mockOnChange).toHaveBeenCalledWith('Engineering');
  });

  it('handles the case when API call fails', async () => {
    // Arrange - Override the mock to return an error
    const mockExecute = jest.fn().mockResolvedValue({
      success: false,
      error: 'Failed to load teams',
    });

    (GetTeamsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    // Act
    render(<TeamSelectDropdown onChange={mockOnChange} />);

    // Assert - should no longer show loading state
    await waitFor(() => {
      expect(screen.queryByText('Loading teams...')).not.toBeInTheDocument();
    });

    // Should still render the dropdown (but with no options except the default)
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('All Teams')).toBeInTheDocument();
  });

  it('renders with a custom label when provided', async () => {
    // Arrange & Act
    render(<TeamSelectDropdown onChange={mockOnChange} label='Custom Team Label' />);

    // Assert
    expect(screen.getByText('Custom Team Label')).toBeInTheDocument();
  });

  it('displays required indicator when required is true', () => {
    // Arrange & Act
    render(<TeamSelectDropdown onChange={mockOnChange} required={true} />);

    // Assert
    const label = screen.getByText('Team');
    expect(label.parentElement).toHaveTextContent('*');
  });

  it('displays error message when provided', async () => {
    // Arrange & Act
    const errorMessage = 'Team selection is required';
    render(<TeamSelectDropdown onChange={mockOnChange} errorMessage={errorMessage} />);

    // Wait for teams to load
    await waitFor(() => {
      expect(screen.queryByText('Loading teams...')).not.toBeInTheDocument();
    });

    // Assert
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders without All Teams option when includeAllTeams is false', async () => {
    // Arrange & Act
    render(<TeamSelectDropdown onChange={mockOnChange} includeAllTeams={false} />);

    // Wait for teams to load
    await waitFor(() => {
      expect(screen.queryByText('Loading teams...')).not.toBeInTheDocument();
    });

    // Assert
    expect(screen.queryByText('All Teams')).not.toBeInTheDocument();

    // All actual teams should be present
    mockTeams.forEach((team) => {
      expect(screen.getByText(team)).toBeInTheDocument();
    });
  });
});
