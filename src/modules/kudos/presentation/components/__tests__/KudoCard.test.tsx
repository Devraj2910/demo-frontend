import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KudoCard from '../KudoCard';
import { Kudo } from '../../../core/types/kudoTypes';

describe('KudoCard', () => {
  // Mock kudo data
  const mockKudo: Kudo = {
    id: '123',
    title: 'Great Work',
    content: 'Thank you for your exceptional work on the project!',
    userId: 'sender123',
    createdFor: 'recipient123',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-15T10:30:00Z',
    creator: {
      id: 'sender123',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    recipient: {
      id: 'recipient123',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    category: 'Teamwork',
  };

  it('renders the KudoCard with all necessary components', () => {
    // Arrange & Act
    render(<KudoCard kudo={mockKudo} />);

    // Assert
    expect(screen.getByText(mockKudo.title)).toBeInTheDocument();
    expect(screen.getByText(`"${mockKudo.content}"`)).toBeInTheDocument();
    expect(screen.getByText(mockKudo.recipient.fullName)).toBeInTheDocument();
    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText(mockKudo.creator.fullName)).toBeInTheDocument();

    // Check for images
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // Recipient and sender images
    expect(images[0]).toHaveAttribute('src', mockKudo.recipient.avatar);
    expect(images[1]).toHaveAttribute('src', mockKudo.creator.avatar);
  });

  it('displays the formatted date', () => {
    // Arrange & Act
    render(<KudoCard kudo={mockKudo} />);

    // Format the date as expected by the component
    const formattedDate = new Date(mockKudo.createdAt).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // Assert
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('handles missing avatars with default placeholders', () => {
    // Arrange
    const kudoWithoutAvatars: Kudo = {
      ...mockKudo,
      creator: {
        ...mockKudo.creator,
        avatar: undefined,
      },
      recipient: {
        ...mockKudo.recipient,
        avatar: undefined,
      },
    };

    // Act
    render(<KudoCard kudo={kudoWithoutAvatars} />);

    // Assert
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);

    // Should use the UI Avatars service for both images
    expect(images[0].getAttribute('src')).toContain('https://ui-avatars.com/api');
    expect(images[1].getAttribute('src')).toContain('https://ui-avatars.com/api');
  });

  it('applies the correct background color based on category', () => {
    // Arrange & Act
    const { container } = render(<KudoCard kudo={mockKudo} />);

    // Assert - Check if the bg-blue-100 class is applied (Teamwork category)
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('bg-blue-100');
  });

  it('uses the default category when no category is provided', () => {
    // Arrange
    const kudoWithoutCategory: Kudo = {
      ...mockKudo,
      category: undefined,
    };

    // Act
    const { container } = render(<KudoCard kudo={kudoWithoutCategory} />);

    // Assert - Check if the default class is applied
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('bg-yellow-100');
  });
});
