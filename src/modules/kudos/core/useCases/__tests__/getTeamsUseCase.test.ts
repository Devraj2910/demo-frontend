import { GetTeamsUseCase } from '../getTeamsUseCase';
import { KudoService } from '../../services/kudoService';
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

describe('GetTeamsUseCase', () => {
  let mockKudoService: jest.Mocked<KudoService>;
  let getTeamsUseCase: GetTeamsUseCase;

  beforeEach(() => {
    mockKudoService = createMockKudoService();
    getTeamsUseCase = new GetTeamsUseCase(mockKudoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock teams for testing
  const mockTeams = ['Engineering', 'Design', 'Marketing', 'Product'];

  it('should get teams successfully', async () => {
    // Arrange
    mockKudoService.getTeams.mockResolvedValue(mockTeams);

    // Act
    const result = await getTeamsUseCase.execute();

    // Assert
    expect(mockKudoService.getTeams).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: mockTeams,
    });
  });

  it('should return empty array when no teams are found', async () => {
    // Arrange
    mockKudoService.getTeams.mockResolvedValue([]);

    // Act
    const result = await getTeamsUseCase.execute();

    // Assert
    expect(mockKudoService.getTeams).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: [],
    });
  });

  it('should handle errors and return error result', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch teams';
    mockKudoService.getTeams.mockRejectedValue(new Error(errorMessage));

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const result = await getTeamsUseCase.execute();

    // Assert
    expect(mockKudoService.getTeams).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Failed to load teams',
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
