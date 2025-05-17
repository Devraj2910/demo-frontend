import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/KudoEntities';

/**
 * Mock implementation of the UserRepository
 */
export class MockUserRepository implements UserRepository {
  // Mock data for users
  private users: User[] = [
    {
      id: '1',
      firstName: 'Grace',
      lastName: 'Coleman',
      name: 'Grace Coleman',
      team: 'Alpha',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      team: 'Bravo',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      firstName: 'Adele',
      lastName: 'Belo',
      name: 'Adele Belo',
      team: 'Charlie',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
      id: '4',
      firstName: 'Sophie',
      lastName: 'Chen',
      name: 'Sophie Chen',
      team: 'Data',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    {
      id: '5',
      firstName: 'Emma',
      lastName: 'Taylor',
      name: 'Emma Taylor',
      team: 'AI',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    {
      id: '6',
      firstName: 'Robert',
      lastName: 'Clark',
      name: 'Robert Clark',
      team: 'Alpha',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
      id: '7',
      firstName: 'Michael',
      lastName: 'Jordan',
      name: 'Michael Jordan',
      team: 'Bravo',
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    },
    {
      id: '8',
      firstName: 'Samantha',
      lastName: 'Lee',
      name: 'Samantha Lee',
      team: 'Charlie',
      avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
    },
    {
      id: '9',
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Sarah Johnson',
      team: 'Bravo',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      role: 'admin',
    },
    {
      id: '10',
      firstName: 'David',
      lastName: 'Wilson',
      name: 'David Wilson',
      team: 'Data',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      role: 'admin',
    },
    {
      id: '11',
      firstName: 'Emily',
      lastName: 'Davis',
      name: 'Emily Davis',
      team: 'Charlie',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      id: '12',
      firstName: 'Michael',
      lastName: 'Brown',
      name: 'Michael Brown',
      team: 'AI',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      role: 'admin',
    },
    {
      id: '13',
      firstName: 'Lisa',
      lastName: 'Martinez',
      name: 'Lisa Martinez',
      team: 'Alpha',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    },
  ];

  // Current user (mock)
  private currentUser: User = {
    id: '10',
    firstName: 'David',
    lastName: 'Wilson',
    name: 'David Wilson',
    team: 'Data',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    role: 'admin',
  };

  /**
   * Simulates an API call with a delay
   * @param data The data to return
   * @returns Promise that resolves with the data after a short delay
   */
  private async mockApiCall<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 200); // Simulate network delay
    });
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    return this.mockApiCall([...this.users]);
  }

  /**
   * Search for users by name
   * @param query Search query string
   */
  async searchUsers(query: string): Promise<User[]> {
    if (!query) {
      return this.mockApiCall([]);
    }

    const filtered = this.users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });

    return this.mockApiCall(filtered);
  }

  /**
   * Get a user by ID
   * @param id User ID
   */
  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id) || null;
    return this.mockApiCall(user);
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    return this.mockApiCall(this.currentUser);
  }
}
