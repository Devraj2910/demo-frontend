import { KudoRepository, KudoApiResponse } from '../../core/interfaces/repositories/kudoRepository';
import { Kudo, KudoFilters, CreateKudoRequest } from '../../core/types/kudoTypes';
import { MockUserRepository } from './mockUserRepository';

/**
 * Mock implementation of the KudoRepository for development and testing
 */
export class MockKudoRepository implements KudoRepository {
  // Mock data for kudos
  private kudos: Kudo[] = [
    {
      id: '1',
      title: 'Outstanding dedication',
      content: 'I am impressed by how much dedication you put in your work!',
      userId: 'user-1',
      createdFor: 'user-2',
      createdAt: '2023-12-01T10:30:00Z',
      updatedAt: '2023-12-01T10:30:00Z',
      creator: {
        id: 'user-1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        team: 'Alpha',
      },
      recipient: {
        id: 'user-2',
        email: 'grace.coleman@example.com',
        firstName: 'Grace',
        lastName: 'Coleman',
        fullName: 'Grace Coleman',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        team: 'Alpha',
      },
      category: 'Innovation',
      team: 'Alpha',
      // Legacy properties
      sender: 'John Doe',
      senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      recipientName: 'Grace Coleman',
      recipientAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      message: 'I am impressed on how much dedication you put in your work!',
    },
    {
      id: '2',
      title: 'Thank you for your support',
      content: 'For the support you give me when I have questions.',
      userId: 'user-3',
      createdFor: 'user-1',
      createdAt: '2023-02-18T14:20:00Z',
      updatedAt: '2023-02-18T14:20:00Z',
      creator: {
        id: 'user-3',
        email: 'sarah.johnson@example.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        fullName: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        team: 'Bravo',
      },
      recipient: {
        id: 'user-1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        team: 'Alpha',
      },
      category: 'Teamwork',
      team: 'Bravo',
      // Legacy properties
      sender: 'Sarah Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      recipientName: 'John Doe',
      recipientAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      message: 'For the support you give me when I have questions.',
    },
    {
      id: '3',
      title: 'Bug fixing hero',
      content: 'For the migrations and fixing all the bugs!',
      userId: 'user-4',
      createdFor: 'user-5',
      createdAt: '2023-02-10T09:15:00Z',
      updatedAt: '2023-02-10T09:15:00Z',
      creator: {
        id: 'user-4',
        email: 'emily.davis@example.com',
        firstName: 'Emily',
        lastName: 'Davis',
        fullName: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        team: 'Charlie',
      },
      recipient: {
        id: 'user-5',
        email: 'adele.belo@example.com',
        firstName: 'Adele',
        lastName: 'Belo',
        fullName: 'Adele Belo',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        team: 'Charlie',
      },
      category: 'Helping Hand',
      team: 'Charlie',
      // Legacy properties
      sender: 'Emily Davis',
      senderAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      recipientName: 'Adele Belo',
      recipientAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      message: 'For the migrations and fixing all the bugs!',
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
   * Wrap kudos array in KudoApiResponse format
   * @param kudos Array of kudos to wrap
   * @param page Current page number
   * @param limit Items per page
   */
  private wrapInApiResponse(kudos: Kudo[], page: number = 1, limit: number = 10): KudoApiResponse {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedKudos = kudos.slice(startIndex, endIndex);

    return {
      cards: paginatedKudos,
      total: kudos.length,
      page,
      limit,
      totalPages: Math.ceil(kudos.length / limit),
    };
  }

  /**
   * Get all kudos
   */
  async getAllKudos(): Promise<KudoApiResponse> {
    const sortedKudos = [...this.kudos].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return this.mockApiCall(this.wrapInApiResponse(sortedKudos));
  }

  /**
   * Get kudos with filters applied
   * @param filters Filters to apply
   */
  async getFilteredKudos(filters: KudoFilters): Promise<KudoApiResponse> {
    let result = [...this.kudos];

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (kudo) =>
          kudo.recipient.fullName.toLowerCase().includes(term) ||
          kudo.creator.fullName.toLowerCase().includes(term) ||
          kudo.content.toLowerCase().includes(term) ||
          kudo.title.toLowerCase().includes(term)
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

    // Apply pagination if provided
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    return this.mockApiCall(this.wrapInApiResponse(result, page, limit));
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

    const now = new Date().toISOString();

    // Create new kudo
    const newKudo: Kudo = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title || '',
      content: data.content || data.message || '',
      userId: senderId,
      createdFor: data.recipientId,
      createdAt: now,
      updatedAt: now,
      creator: sender,
      recipient: recipient,
      category: data.category,
      team: recipient.team,
      // Legacy properties
      sender: sender.fullName,
      senderAvatar: sender.avatar,
      recipientName: recipient.fullName,
      recipientAvatar: recipient.avatar,
      message: data.content || data.message || '',
    };

    // Add to mock data
    this.kudos.unshift(newKudo);

    return this.mockApiCall(newKudo);
  }
}
