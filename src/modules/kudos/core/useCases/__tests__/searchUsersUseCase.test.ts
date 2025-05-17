import { SearchUsersUseCase } from '../searchUsersUseCase';
import { KudoService } from '../../services/kudoService';
import { User } from '../../types/kudoTypes';
import { KudoRepository } from '../../interfaces/repositories/kudoRepository';
import { UserRepository } from '../../interfaces/repositories/userRepository';

// Create mock repositories
const mockKudoRepository = {} as jest.Mocked<KudoRepository>;
const mockUserRepository = {} as jest.Mocked<UserRepository>;

// Create mock KudoService
const createMockKudoService = () => {
  const service = new KudoService(mockKudoRepository, mockUserRepository);

  // Mock all service methods
  service.getAllKudos = jest.fn();
  service.getFilteredKudos = jest.fn();
  service.getKudoById = jest.fn();
  service.createKudo = jest.fn();
  service.getTeams = jest.fn();
  service.searchUsers = jest.fn();
  service.getCurrentUser = jest.fn();

  return service as jest.Mocked<KudoService>;
};

describe('SearchUsersUseCase', () => {
  let mockKudoService: jest.Mocked<KudoService>;
  let searchUsersUseCase: SearchUsersUseCase;

  beforeEach(() => {
    mockKudoService = createMockKudoService();
    searchUsersUseCase = new SearchUsersUseCase(mockKudoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock users for testing
  const mockUsers: User[] = [
    {
      id: 'user1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      avatar: 'https://example.com/avatar1.jpg',
      team: 'Engineering',
    },
    {
      id: 'user2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      avatar: 'https://example.com/avatar2.jpg',
      team: 'Design',
    },
  ];

  it('should search users successfully when query is valid', async () => {
    // Arrange
    const query = 'John';
    mockKudoService.searchUsers.mockResolvedValue([mockUsers[0]]);

    // Act
    const result = await searchUsersUseCase.execute(query);

    // Assert
    expect(mockKudoService.searchUsers).toHaveBeenCalledWith(query);
    expect(result).toEqual({
      success: true,
      data: [mockUsers[0]],
    });
  });

  it('should return error when query is too short', async () => {
    // Arrange
    const query = 'J';

    // Act
    const result = await searchUsersUseCase.execute(query);

    // Assert
    expect(mockKudoService.searchUsers).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Search query must be at least 2 characters',
    });
  });

  it('should return error when query is empty', async () => {
    // Arrange
    const query = '';

    // Act
    const result = await searchUsersUseCase.execute(query);

    // Assert
    expect(mockKudoService.searchUsers).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Search query must be at least 2 characters',
    });
  });

  it('should handle errors and return error result', async () => {
    // Arrange
    const query = 'John';
    const errorMessage = 'Failed to search users';
    mockKudoService.searchUsers.mockRejectedValue(new Error(errorMessage));

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const result = await searchUsersUseCase.execute(query);

    // Assert
    expect(mockKudoService.searchUsers).toHaveBeenCalledWith(query);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Failed to search users',
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
