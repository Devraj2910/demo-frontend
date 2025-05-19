import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPage from '@/app/admin/page';

// Mock the components used in AdminPage
jest.mock('../presentation/components/Sidebar', () => ({
  Sidebar: ({
    activeSection,
    setActiveSection,
  }: {
    activeSection: string;
    setActiveSection: (section: string) => void;
  }) => (
    <div data-testid='mock-sidebar'>
      <div data-testid='active-section'>{activeSection}</div>
      <button onClick={() => setActiveSection('teams')} data-testid='change-section-btn'>
        Change to Teams
      </button>
    </div>
  ),
}));

jest.mock('../presentation/components/AdminDashboard', () => ({
  __esModule: true,
  default: ({ activeSection }: { activeSection: string }) => (
    <div data-testid='mock-dashboard'>
      <div data-testid='dashboard-section'>{activeSection}</div>
    </div>
  ),
}));

describe('AdminPage', () => {
  it('renders the admin page with default active section', () => {
    // Arrange & Act
    render(<AdminPage />);

    // Assert
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('active-section').textContent).toBe('requests');
    expect(screen.getByTestId('dashboard-section').textContent).toBe('requests');
  });

  it('updates the active section when changed from sidebar', () => {
    // Arrange
    render(<AdminPage />);

    // Act
    fireEvent.click(screen.getByTestId('change-section-btn'));

    // Assert
    expect(screen.getByTestId('active-section').textContent).toBe('teams');
    expect(screen.getByTestId('dashboard-section').textContent).toBe('teams');
  });

  it('renders the background animation elements', () => {
    // Arrange & Act
    const { container } = render(<AdminPage />);

    // Assert
    // Check for animation blob elements
    const animationBlobs = container.querySelectorAll('.animate-blob');
    expect(animationBlobs.length).toBe(3);

    // Check for animation delay classes
    expect(container.querySelector('.animation-delay-2000')).toBeInTheDocument();
    expect(container.querySelector('.animation-delay-4000')).toBeInTheDocument();
  });
});
