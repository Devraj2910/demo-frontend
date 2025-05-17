import { UserRepository } from '../../core/interfaces/repositories/userRepository';
import { User } from '../../core/types/kudoTypes';

/**
 * Mock implementation of the UserRepository for development and testing
 */
export class MockUserRepository implements UserRepository {
  // Mock data
  private users: User[] = [
    {
      id: 'user-1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      team: 'Alpha',
    },
    {
      id: 'user-2',
      email: 'grace.coleman@example.com',
      firstName: 'Grace',
      lastName: 'Coleman',
      fullName: 'Grace Coleman',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      team: 'Alpha',
    },
    {
      id: 'user-3',
      email: 'sarah.johnson@example.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      fullName: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      team: 'Bravo',
    },
    {
      id: 'user-4',
      email: 'emily.davis@example.com',
      firstName: 'Emily',
      lastName: 'Davis',
      fullName: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      team: 'Charlie',
    },
    {
      id: 'user-5',
      email: 'adele.belo@example.com',
      firstName: 'Adele',
      lastName: 'Belo',
      fullName: 'Adele Belo',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      team: 'Charlie',
    },
    {
      id: 'user-6',
      email: 'david.wilson@example.com',
      firstName: 'David',
      lastName: 'Wilson',
      fullName: 'David Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      team: 'Data',
    },
    {
      id: 'user-7',
      email: 'sophie.chen@example.com',
      firstName: 'Sophie',
      lastName: 'Chen',
      fullName: 'Sophie Chen',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      team: 'Data',
    },
  ];

  /**
   * Simulates an API call with a delay
   * @param data The data to return
   * @returns Promise that resolves with the data after a short delay
   */
  private async mockApiCall<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 300); // Simulate network delay
    });
  }

  /**
   * Retrieves a list of all users
   */
  async getAllUsers(): Promise<User[]> {
    return this.mockApiCall([...this.users]);
  }

  /**
   * Get a user by ID
   * @param id User ID to find
   */
  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id) || null;
    return this.mockApiCall(user);
  }

  /**
   * Get the currently authenticated user (mock assumes user-1 is logged in)
   */
  async getCurrentUser(): Promise<User | null> {
    return this.mockApiCall(this.users[0]);
  }

  /**
   * Search for users by name or email
   * @param query Search query string
   */
  async searchUsers(query: string): Promise<User[]> {
    const searchTerm = query.toLowerCase();

    const results = this.users.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm))
      );
    });

    return this.mockApiCall(results);
  }
}
