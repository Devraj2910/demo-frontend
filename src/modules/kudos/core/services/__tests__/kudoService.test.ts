import { KudoService } from '../kudoService';
import { KudoRepository } from '../../interfaces/repositories/kudoRepository';
import { UserRepository } from '../../interfaces/repositories/userRepository';
import { Kudo, KudoFilters, CreateKudoRequest, User } from '../../types/kudoTypes';

describe('KudoService', () => {
  let kudoService: KudoService;
  let mockKudoRepository: jest.Mocked<KudoRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  // Mock data
  const mockKudos: Kudo[] = [
    {
      id: '1',
      title: 'Great job',
      content: 'Thanks for your help',
      userId: 'user1',
      createdFor: 'user2',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      creator: {
        id: 'user1',
        email: 'user1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
      },
      recipient: {
        id: 'user2',
        email: 'user2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
      },
    },
  ];

  const mockUsers: User[] = [
    {
      id: 'user1',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      team: 'Engineering',
    },
    {
      id: 'user2',
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      team: 'Design',
    },
    {
      id: 'user3',
      email: 'user3@example.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      fullName: 'Bob Johnson',
      team: 'Marketing',
    },
  ];

  const mockCurrentUser: User = mockUsers[0];

  beforeEach(() => {
    // Create mock repositories
    mockKudoRepository = {
      getAllKudos: jest.fn(),
      getFilteredKudos: jest.fn(),
      getKudoById: jest.fn(),
      createKudo: jest.fn(),
      deleteKudo: jest.fn(),
    } as jest.Mocked<KudoRepository>;

    mockUserRepository = {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      getCurrentUser: jest.fn(),
      searchUsers: jest.fn(),
      getTeams: jest.fn(),
    } as jest.Mocked<UserRepository>;

    // Create service with mock repositories
    kudoService = new KudoService(mockKudoRepository, mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllKudos', () => {
    it('should call the repository and return all kudos', async () => {
      // Arrange
      const mockApiResponse = {
        cards: mockKudos,
        total: mockKudos.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockKudoRepository.getAllKudos.mockResolvedValue(mockApiResponse);

      // Act
      const result = await kudoService.getAllKudos();

      // Assert
      expect(mockKudoRepository.getAllKudos).toHaveBeenCalled();
      expect(result).toEqual(mockApiResponse);
    });
  });

  describe('getFilteredKudos', () => {
    it('should call the repository with filters and return filtered kudos', async () => {
      // Arrange
      const filters: KudoFilters = { searchTerm: 'test', team: 'Engineering' };
      const mockApiResponse = {
        cards: mockKudos,
        total: mockKudos.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockKudoRepository.getFilteredKudos.mockResolvedValue(mockApiResponse);

      // Act
      const result = await kudoService.getFilteredKudos(filters);

      // Assert
      expect(mockKudoRepository.getFilteredKudos).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockApiResponse);
    });
  });

  describe('getKudoById', () => {
    it('should call the repository with ID and return a kudo', async () => {
      // Arrange
      const kudoId = '1';
      mockKudoRepository.getKudoById.mockResolvedValue(mockKudos[0]);

      // Act
      const result = await kudoService.getKudoById(kudoId);

      // Assert
      expect(mockKudoRepository.getKudoById).toHaveBeenCalledWith(kudoId);
      expect(result).toEqual(mockKudos[0]);
    });

    it('should return null when kudo is not found', async () => {
      // Arrange
      const kudoId = 'non-existent';
      mockKudoRepository.getKudoById.mockResolvedValue(null);

      // Act
      const result = await kudoService.getKudoById(kudoId);

      // Assert
      expect(mockKudoRepository.getKudoById).toHaveBeenCalledWith(kudoId);
      expect(result).toBeNull();
    });
  });

  describe('createKudo', () => {
    it('should get current user and call repository to create kudo', async () => {
      // Arrange
      const kudoData: CreateKudoRequest = {
        title: 'Great work',
        content: 'Thank you!',
        recipientId: 'user2',
      };

      const createdKudo: Kudo = {
        ...mockKudos[0],
        title: kudoData.title || 'No Title',
        content: kudoData.content,
      };

      mockUserRepository.getCurrentUser.mockResolvedValue(mockCurrentUser);
      mockKudoRepository.createKudo.mockResolvedValue(createdKudo);

      // Act
      const result = await kudoService.createKudo(kudoData);

      // Assert
      expect(mockUserRepository.getCurrentUser).toHaveBeenCalled();
      expect(mockKudoRepository.createKudo).toHaveBeenCalledWith(kudoData, mockCurrentUser.id);
      expect(result).toEqual(createdKudo);
    });

    it('should throw error when user is not authenticated', async () => {
      // Arrange
      const kudoData: CreateKudoRequest = {
        title: 'Great work',
        content: 'Thank you!',
        recipientId: 'user2',
      };

      mockUserRepository.getCurrentUser.mockResolvedValue(null);

      // Act & Assert
      await expect(kudoService.createKudo(kudoData)).rejects.toThrow('User not authenticated');
      expect(mockUserRepository.getCurrentUser).toHaveBeenCalled();
      expect(mockKudoRepository.createKudo).not.toHaveBeenCalled();
    });
  });

  describe('getTeams', () => {
    it('should return unique teams from users', async () => {
      // Arrange
      const mockTeams = ['Engineering', 'Design', 'Marketing'].map((name, index) => ({
        id: index + 1,
        name,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      }));
      mockUserRepository.getTeams.mockResolvedValue(mockTeams);

      // Act
      const result = await kudoService.getTeams();

      // Assert
      expect(mockUserRepository.getTeams).toHaveBeenCalled();
      expect(result).toEqual(mockTeams);
    });

    it('should return empty array when no teams exist', async () => {
      // Arrange
      mockUserRepository.getTeams.mockResolvedValue([]);

      // Act
      const result = await kudoService.getTeams();

      // Assert
      expect(mockUserRepository.getTeams).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('searchUsers', () => {
    it('should call repository and return search results', async () => {
      // Arrange
      const query = 'John';
      mockUserRepository.searchUsers.mockResolvedValue([mockUsers[0]]);

      // Act
      const result = await kudoService.searchUsers(query);

      // Assert
      expect(mockUserRepository.searchUsers).toHaveBeenCalledWith(query);
      expect(result).toEqual([mockUsers[0]]);
    });
  });

  describe('getCurrentUser', () => {
    it('should call repository and return current user', async () => {
      // Arrange
      mockUserRepository.getCurrentUser.mockResolvedValue(mockCurrentUser);

      // Act
      const result = await kudoService.getCurrentUser();

      // Assert
      expect(mockUserRepository.getCurrentUser).toHaveBeenCalled();
      expect(result).toEqual(mockCurrentUser);
    });

    it('should return null when user is not authenticated', async () => {
      // Arrange
      mockUserRepository.getCurrentUser.mockResolvedValue(null);

      // Act
      const result = await kudoService.getCurrentUser();

      // Assert
      expect(mockUserRepository.getCurrentUser).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
