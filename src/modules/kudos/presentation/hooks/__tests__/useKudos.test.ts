import { renderHook, act } from '@testing-library/react-hooks';
import { useKudos } from '../useKudos';
import { GetKudosUseCase } from '../../../core/useCases/getKudosUseCase';
import { KudoService } from '../../../core/services/kudoService';
import { KudoFilters } from '../../../core/types/kudoTypes';

// Mock dependencies
jest.mock('../../../core/useCases/getKudosUseCase');
jest.mock('../../../core/services/kudoService');
jest.mock('../../../infrastructure/repositories/mockKudoRepository');
jest.mock('../../../infrastructure/repositories/mockUserRepository');

describe('useKudos hook', () => {
  // Sample data
  const mockKudos = [
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

  // Mock implementation
  const mockExecute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup success response
    mockExecute.mockResolvedValue({
      success: true,
      data: mockKudos,
    });

    // Mock GetKudosUseCase implementation
    (GetKudosUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));
  });

  it('should fetch kudos on initial render', async () => {
    // Arrange & Act
    const { result, waitForNextUpdate } = renderHook(() => useKudos());

    // Assert - Initial state
    expect(result.current.kudos).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.error).toBeNull();

    // Wait for the async operation to complete
    await waitForNextUpdate();

    // Assert - After data load
    expect(mockExecute).toHaveBeenCalled();
    expect(result.current.kudos).toEqual(mockKudos);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('should filter kudos when filterKudos is called', async () => {
    // Arrange
    const { result, waitForNextUpdate } = renderHook(() => useKudos());

    // Wait for initial load
    await waitForNextUpdate();

    // Setup new mock response for filtered data
    const filters: KudoFilters = { searchTerm: 'test' };
    const filteredKudos = [mockKudos[0]]; // Pretend this is filtered

    mockExecute.mockResolvedValueOnce({
      success: true,
      data: filteredKudos,
    });

    // Act - Call filter function
    act(() => {
      result.current.filterKudos(filters);
    });

    // Wait for the filter operation to complete
    await waitForNextUpdate();

    // Assert
    expect(mockExecute).toHaveBeenCalledWith(filters);
    expect(result.current.kudos).toEqual(filteredKudos);
  });

  it('should handle errors during data fetch', async () => {
    // Arrange
    const errorMessage = 'Failed to load kudos';
    mockExecute.mockResolvedValueOnce({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result, waitForNextUpdate } = renderHook(() => useKudos());

    // Wait for the async operation to complete
    await waitForNextUpdate();

    // Assert
    expect(result.current.kudos).toEqual([]);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBe(errorMessage);
  });

  it('should refresh kudos when refreshKudos is called', async () => {
    // Arrange
    const { result, waitForNextUpdate } = renderHook(() => useKudos());

    // Wait for initial load
    await waitForNextUpdate();

    // Clear previous calls count
    mockExecute.mockClear();

    // Act - Call refresh function
    act(() => {
      result.current.refreshKudos();
    });

    // Wait for the refresh operation to complete
    await waitForNextUpdate();

    // Assert
    expect(mockExecute).toHaveBeenCalled();
  });
});
