import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../Sidebar';

// Mock the Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  UserIcon: () => <svg data-testid='user-icon' />,
  ClipboardDocumentCheckIcon: () => <svg data-testid='clipboard-icon' />,
  ChartBarIcon: () => <svg data-testid='chart-icon' />,
  Cog6ToothIcon: () => <svg data-testid='cog-icon' />,
}));

describe('Sidebar', () => {
  const mockSetActiveSection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sidebar with all menu items', () => {
    // Arrange & Act
    render(<Sidebar activeSection='requests' setActiveSection={mockSetActiveSection} />);

    // Assert
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Requests')).toBeInTheDocument();
    expect(screen.getByText('Team Management')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Check icons are rendered
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('clipboard-icon')).toBeInTheDocument();
    expect(screen.getByTestId('cog-icon')).toBeInTheDocument();
  });

  it('applies active styling to currently selected section', () => {
    // Arrange & Act
    render(<Sidebar activeSection='teams' setActiveSection={mockSetActiveSection} />);

    // Assert
    const requestsButton = screen.getByText('User Requests').closest('button');
    const teamsButton = screen.getByText('Team Management').closest('button');
    const settingsButton = screen.getByText('Settings').closest('button');

    expect(requestsButton).not.toHaveClass('bg-blue-600');
    expect(teamsButton).toHaveClass('bg-blue-600');
    expect(settingsButton).not.toHaveClass('bg-blue-600');
  });

  it('calls setActiveSection when menu item is clicked', () => {
    // Arrange
    render(<Sidebar activeSection='requests' setActiveSection={mockSetActiveSection} />);

    // Act
    fireEvent.click(screen.getByText('Team Management'));

    // Assert
    expect(mockSetActiveSection).toHaveBeenCalledWith('teams');
  });

  it('calls setActiveSection when settings is clicked', () => {
    // Arrange
    render(<Sidebar activeSection='requests' setActiveSection={mockSetActiveSection} />);

    // Act
    fireEvent.click(screen.getByText('Settings'));

    // Assert
    expect(mockSetActiveSection).toHaveBeenCalledWith('settings');
  });
});
