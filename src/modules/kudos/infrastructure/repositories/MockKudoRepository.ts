import { KudoRepository } from '../../domain/repositories/KudoRepository';
import { Kudo, KudoFilters, CreateKudoRequest } from '../../domain/entities/KudoEntities';
import { MockUserRepository } from './MockUserRepository';

/**
 * Mock implementation of the KudoRepository
 */
export class MockKudoRepository implements KudoRepository {
  // Mock data for kudos
  private kudos: Kudo[] = [
    {
      id: '1',
      sender: 'John Doe',
      recipient: 'Grace Coleman',
      team: 'Alpha',
      category: 'Innovation',
      message: 'I am impressed on how much dedication you put in your work!',
      createdAt: '2023-12-01T10:30:00Z',
      senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      recipientAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      sender: 'Sarah Johnson',
      recipient: 'John Doe',
      team: 'Bravo',
      category: 'Teamwork',
      message: 'For the support you give me when I have questions.',
      createdAt: '2023-02-18T14:20:00Z',
      senderAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      recipientAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      sender: 'Emily Davis',
      recipient: 'Adele Belo',
      team: 'Charlie',
      category: 'Helping Hand',
      message: 'For the migrations and fixing all the bugs!',
      createdAt: '2023-02-10T09:15:00Z',
      senderAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      recipientAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
      id: '4',
      sender: 'David Wilson',
      recipient: 'Sophie Chen',
      team: 'Data',
      category: 'Innovation',
      message: 'Your code quality is outstanding! Thanks for always writing clean and maintainable code.',
      createdAt: '2023-03-05T11:45:00Z',
      senderAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      recipientAvatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    {
      id: '5',
      sender: 'Michael Brown',
      recipient: 'Emma Taylor',
      team: 'AI',
      category: 'Teamwork',
      message: 'You always go above and beyond to make our customers happy. Your positivity is contagious!',
      createdAt: '2023-03-12T09:30:00Z',
      senderAvatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      recipientAvatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    {
      id: '6',
      sender: 'Lisa Martinez',
      recipient: 'Robert Clark',
      team: 'Alpha',
      category: 'Helping Hand',
      message: 'The last campaign was a huge success thanks to your creative ideas and dedication.',
      createdAt: '2023-03-18T16:20:00Z',
      senderAvatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      recipientAvatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
  ];

  private userRepository = new MockUserRepository();

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
   * Get all kudos
   */
  async getAllKudos(): Promise<Kudo[]> {
    return this.mockApiCall(
      [...this.kudos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  }

  /**
   * Get kudos with filters applied
   * @param filters Filters to apply
   */
  async getFilteredKudos(filters: KudoFilters): Promise<Kudo[]> {
    let result = [...this.kudos];

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (kudo) =>
          kudo.recipient.toLowerCase().includes(term) ||
          kudo.sender.toLowerCase().includes(term) ||
          kudo.message.toLowerCase().includes(term)
      );
    }

    // Apply team filter
    if (filters.team && filters.team !== 'All Teams') {
      result = result.filter((kudo) => kudo.team === filters.team);
    }

    // Apply category filter
    if (filters.category && filters.category !== 'All Categories') {
      result = result.filter((kudo) => kudo.category === filters.category);
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return this.mockApiCall(result);
  }

  /**
   * Get a single kudo by ID
   * @param id Kudo ID
   */
  async getKudoById(id: string): Promise<Kudo | null> {
    const kudo = this.kudos.find((k) => k.id === id) || null;
    return this.mockApiCall(kudo);
  }

  /**
   * Create a new kudo
   * @param data Kudo creation data
   * @param senderId ID of the sender
   */
  async createKudo(data: CreateKudoRequest, senderId: string): Promise<Kudo> {
    // Get sender and recipient data
    const sender = await this.userRepository.getUserById(senderId);
    const recipient = await this.userRepository.getUserById(data.recipientId);

    if (!sender || !recipient) {
      throw new Error('Sender or recipient not found');
    }

    // Create new kudo
    const newKudo: Kudo = {
      id: Math.random().toString(36).substr(2, 9),
      sender: sender.name || `${sender.firstName} ${sender.lastName}`,
      senderAvatar: sender.avatar,
      recipient: recipient.name || `${recipient.firstName} ${recipient.lastName}`,
      recipientAvatar: recipient.avatar,
      team: recipient.team,
      category: data.category,
      message: data.message,
      createdAt: new Date().toISOString(),
    };

    // Add to mock data
    this.kudos.unshift(newKudo);

    return this.mockApiCall(newKudo);
  }
}
