import { CreateKudoUseCase } from '../createKudoUseCase';
import { KudoService } from '../../services/kudoService';
import { CreateKudoRequest, Kudo } from '../../types/kudoTypes';
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

describe('CreateKudoUseCase', () => {
  let mockKudoService: jest.Mocked<KudoService>;
  let createKudoUseCase: CreateKudoUseCase;

  beforeEach(() => {
    mockKudoService = createMockKudoService();
    createKudoUseCase = new CreateKudoUseCase(mockKudoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock kudo data for testing
  const mockKudoRequest: CreateKudoRequest = {
    title: 'Great work',
    content: 'Thank you for your exceptional work!',
    recipientId: 'user123',
    category: 'Teamwork',
  };

  const mockCreatedKudo: Kudo = {
    id: 'kudo123',
    title: 'Great work',
    content: 'Thank you for your exceptional work!',
    userId: 'sender123',
    createdFor: 'user123',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    creator: {
      id: 'sender123',
      email: 'sender@example.com',
      firstName: 'Sender',
      lastName: 'User',
      fullName: 'Sender User',
    },
    recipient: {
      id: 'user123',
      email: 'recipient@example.com',
      firstName: 'Recipient',
      lastName: 'User',
      fullName: 'Recipient User',
    },
    category: 'Teamwork',
  };

  it('should successfully create a kudo when data is valid', async () => {
    // Arrange
    mockKudoService.createKudo.mockResolvedValue(mockCreatedKudo);

    // Act
    const result = await createKudoUseCase.execute(mockKudoRequest);

    // Assert
    expect(mockKudoService.createKudo).toHaveBeenCalledWith(mockKudoRequest);
    expect(result).toEqual({
      success: true,
      data: mockCreatedKudo,
    });
  });

  it('should return error when required fields are missing', async () => {
    // Arrange - Create an invalid request with missing fields
    const invalidRequest: CreateKudoRequest = {
      title: '',
      content: '',
      recipientId: '',
    };

    // Act
    const result = await createKudoUseCase.execute(invalidRequest);

    // Assert
    expect(mockKudoService.createKudo).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Missing required fields',
    });
  });

  it('should handle errors from the service and return error result', async () => {
    // Arrange
    const error = new Error('User not authenticated');
    mockKudoService.createKudo.mockRejectedValue(error);

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const result = await createKudoUseCase.execute(mockKudoRequest);

    // Assert
    expect(mockKudoService.createKudo).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'User not authenticated',
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should handle unknown errors from the service', async () => {
    // Arrange
    mockKudoService.createKudo.mockRejectedValue('Unknown error');

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const result = await createKudoUseCase.execute(mockKudoRequest);

    // Assert
    expect(mockKudoService.createKudo).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Failed to create kudo',
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
