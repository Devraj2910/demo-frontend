import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../AdminDashboard';

// Mock the components used in AdminDashboard
jest.mock('../UserRequestsSection', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='user-requests-section'>Mocked User Requests Section</div>,
  };
});

jest.mock('../TeamsSection', () => {
  return {
    __esModule: true,
    default: () => <div data-testid='teams-section'>Mocked Teams Section</div>,
  };
});

describe('AdminDashboard', () => {
  it('renders the title with capitalized section name', () => {
    // Arrange & Act
    render(<AdminDashboard activeSection='requests' />);

    // Assert
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Manage your requests here.')).toBeInTheDocument();
  });

  it('renders UserRequestsSection when activeSection is "requests"', () => {
    // Arrange & Act
    render(<AdminDashboard activeSection='requests' />);

    // Assert
    expect(screen.getByTestId('user-requests-section')).toBeInTheDocument();
  });

  it('renders TeamsSection when activeSection is "teams"', () => {
    // Arrange & Act
    render(<AdminDashboard activeSection='teams' />);

    // Assert
    expect(screen.getByTestId('teams-section')).toBeInTheDocument();
  });

  it('renders Analytics placeholder when activeSection is "analytics"', () => {
    // Arrange & Act
    render(<AdminDashboard activeSection='analytics' />);

    // Assert
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics features coming soon.')).toBeInTheDocument();
  });

  it('renders Settings placeholder when activeSection is "settings"', () => {
    // Arrange & Act
    render(<AdminDashboard activeSection='settings' />);

    // Assert
    expect(screen.getByText('Admin Settings')).toBeInTheDocument();
    expect(screen.getByText('Settings features coming soon.')).toBeInTheDocument();
  });

  it('defaults to UserRequestsSection when activeSection is invalid', () => {
    // Arrange & Act
    render(<AdminDashboard activeSection='invalid' />);

    // Assert
    expect(screen.getByTestId('user-requests-section')).toBeInTheDocument();
  });
});
