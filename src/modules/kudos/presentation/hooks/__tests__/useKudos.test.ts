import { renderHook, act } from "@testing-library/react-hooks";
import { useKudos } from "../useKudos";
import { GetKudosUseCase } from "../../../core/useCases/getKudosUseCase";
import { KudoFilters } from "../../../core/types/kudoTypes";

// No need to mock modules, we'll inject the mock directly
jest.mock("console", () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

describe("useKudos hook", () => {
  // Sample data
  const mockKudoData = [
    {
      id: "1",
      title: "Great job",
      content: "Thanks for your help",
      userId: "user1",
      createdFor: "user2",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      creator: {
        id: "user1",
        email: "user1@example.com",
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
      },
      recipient: {
        id: "user2",
        email: "user2@example.com",
        firstName: "Jane",
        lastName: "Smith",
        fullName: "Jane Smith",
      },
    },
  ];

  // Create API response structure matching what the hook expects
  const mockApiResponse = {
    cards: mockKudoData,
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  // Mock implementation
  let mockExecute;
  let mockUseCaseInstance;

  beforeEach(() => {
    // Setup fresh mocks for each test
    mockExecute = jest.fn().mockResolvedValue({
      success: true,
      data: mockApiResponse,
    });

    // Create a mock use case instance
    mockUseCaseInstance = {
      execute: mockExecute,
    };
  });

  it("should fetch kudos on initial render", async () => {
    // Arrange & Act - Pass the mock use case instance directly
    const { result, waitForNextUpdate } = renderHook(() =>
      useKudos(undefined, mockUseCaseInstance as unknown as GetKudosUseCase)
    );

    // Assert - Initial state
    expect(result.current.kudos).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.error).toBeNull();

    // Wait for the async operation to complete
    await waitForNextUpdate();

    // Assert - After data load
    expect(mockExecute).toHaveBeenCalled();
    expect(result.current.kudos).toEqual(mockKudoData);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it("should filter kudos when filterKudos is called", async () => {
    // Arrange - Pass the mock use case instance directly
    const { result, waitForNextUpdate } = renderHook(() =>
      useKudos(undefined, mockUseCaseInstance as unknown as GetKudosUseCase)
    );

    // Wait for initial load
    await waitForNextUpdate();

    // Setup new mock response for filtered data
    const filters: KudoFilters = { searchTerm: "test" };
    const filteredKudoData = [mockKudoData[0]]; // Pretend this is filtered
    const filteredApiResponse = {
      cards: filteredKudoData,
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    mockExecute.mockResolvedValueOnce({
      success: true,
      data: filteredApiResponse,
    });

    // Act - Call filter function
    act(() => {
      result.current.filterKudos(filters);
    });

    // Wait for the filter operation to complete
    await waitForNextUpdate();

    // Assert
    expect(mockExecute).toHaveBeenCalledWith(filters);
    expect(result.current.kudos).toEqual(filteredKudoData);
  });

  it("should handle errors during data fetch", async () => {
    // Arrange
    const errorMessage = "Failed to load kudos";
    mockExecute.mockResolvedValueOnce({
      success: false,
      error: errorMessage,
    });

    // Act - Pass the mock use case instance directly
    const { result, waitForNextUpdate } = renderHook(() =>
      useKudos(undefined, mockUseCaseInstance as unknown as GetKudosUseCase)
    );

    // Wait for the async operation to complete
    await waitForNextUpdate();

    // Assert
    expect(result.current.kudos).toEqual([]);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBe(errorMessage);
  });

  it("should refresh kudos when refreshKudos is called", async () => {
    // Arrange - Pass the mock use case instance directly
    const { result, waitForNextUpdate } = renderHook(() =>
      useKudos(undefined, mockUseCaseInstance as unknown as GetKudosUseCase)
    );

    // Wait for initial load
    await waitForNextUpdate();

    // Clear previous calls count
    mockExecute.mockClear();

    // Setup a new response for the refresh
    mockExecute.mockResolvedValueOnce({
      success: true,
      data: mockApiResponse,
    });

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
