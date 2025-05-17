import { GetCurrentUserUseCase } from '../getCurrentUserUseCase';
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

describe('GetCurrentUserUseCase', () => {
  let mockKudoService: jest.Mocked<KudoService>;
  let getCurrentUserUseCase: GetCurrentUserUseCase;

  beforeEach(() => {
    mockKudoService = createMockKudoService();
    getCurrentUserUseCase = new GetCurrentUserUseCase(mockKudoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock user for testing
  const mockUser: User = {
    id: 'user1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    team: 'Engineering',
  };

  it('should get current user successfully when user is authenticated', async () => {
    // Arrange
    mockKudoService.getCurrentUser.mockResolvedValue(mockUser);

    // Act
    const result = await getCurrentUserUseCase.execute();

    // Assert
    expect(mockKudoService.getCurrentUser).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockUser,
    });
  });

  it('should return error when user is not authenticated', async () => {
    // Arrange
    mockKudoService.getCurrentUser.mockResolvedValue(null);

    // Act
    const result = await getCurrentUserUseCase.execute();

    // Assert
    expect(mockKudoService.getCurrentUser).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'User not authenticated',
    });
  });

  it('should handle errors and return error result', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch current user';
    mockKudoService.getCurrentUser.mockRejectedValue(new Error(errorMessage));

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const result = await getCurrentUserUseCase.execute();

    // Assert
    expect(mockKudoService.getCurrentUser).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Failed to get current user',
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
