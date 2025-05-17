import { GetKudosUseCase } from '../getKudosUseCase';
import { KudoService } from '../../services/kudoService';
import { KudoFilters, Kudo } from '../../types/kudoTypes';
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

describe('GetKudosUseCase', () => {
  let mockKudoService: jest.Mocked<KudoService>;
  let getKudosUseCase: GetKudosUseCase;

  beforeEach(() => {
    mockKudoService = createMockKudoService();
    getKudosUseCase = new GetKudosUseCase(mockKudoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock kudos for testing
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

  it('should get all kudos when no filters are provided', async () => {
    // Arrange
    mockKudoService.getAllKudos.mockResolvedValue(mockKudos);

    // Act
    const result = await getKudosUseCase.execute();

    // Assert
    expect(mockKudoService.getAllKudos).toHaveBeenCalled();
    expect(mockKudoService.getFilteredKudos).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockKudos,
    });
  });

  it('should get filtered kudos when filters are provided', async () => {
    // Arrange
    const filters: KudoFilters = { searchTerm: 'test', team: 'Team A' };
    mockKudoService.getFilteredKudos.mockResolvedValue(mockKudos);

    // Act
    const result = await getKudosUseCase.execute(filters);

    // Assert
    expect(mockKudoService.getFilteredKudos).toHaveBeenCalledWith(filters);
    expect(mockKudoService.getAllKudos).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockKudos,
    });
  });

  it('should handle errors and return error result', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch kudos';
    mockKudoService.getAllKudos.mockRejectedValue(new Error(errorMessage));

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const result = await getKudosUseCase.execute();

    // Assert
    expect(mockKudoService.getAllKudos).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Failed to load kudos',
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
