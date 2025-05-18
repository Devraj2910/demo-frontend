import { DeleteEntityUseCase, EntityDeletionService } from '../deleteEntityUseCase';
import { UseCaseResult } from '../../types/kudoTypes';

// Mock entity for testing
interface TestEntity {
  id: string;
  name: string;
}

// Mock implementation of EntityDeletionService
class MockDeletionService implements EntityDeletionService<TestEntity> {
  private entities: TestEntity[] = [
    { id: 'entity1', name: 'Test Entity 1' },
    { id: 'entity2', name: 'Test Entity 2' },
  ];

  private currentUserId: string | null = 'user1';
  private deletionLog: { id: string; userId: string; entityType: string }[] = [];

  // Mock method to control currentUserId for testing
  setCurrentUserId(id: string | null) {
    this.currentUserId = id;
  }

  // Mock method to get deletion logs
  getDeletionLogs() {
    return [...this.deletionLog];
  }

  // Implementation of EntityDeletionService methods
  async deleteEntity(id: string): Promise<void> {
    const entityIndex = this.entities.findIndex((e) => e.id === id);
    if (entityIndex === -1) {
      throw new Error('Entity not found');
    }
    this.entities.splice(entityIndex, 1);
  }

  async canDelete(id: string, userId: string): Promise<boolean> {
    // For testing, entity1 can be deleted by any user
    // entity2 can only be deleted by user1
    if (id === 'entity1') return true;
    return userId === 'user1';
  }

  async getCurrentUserId(): Promise<string | null> {
    return this.currentUserId;
  }

  async logDeletion(id: string, userId: string, entityType: string): Promise<void> {
    this.deletionLog.push({ id, userId, entityType });
  }
}

describe('DeleteEntityUseCase', () => {
  let mockDeletionService: MockDeletionService;
  let deleteEntityUseCase: DeleteEntityUseCase<TestEntity>;

  beforeEach(() => {
    mockDeletionService = new MockDeletionService();
    deleteEntityUseCase = new DeleteEntityUseCase(mockDeletionService, 'TestEntity');
  });

  it('should successfully delete an entity when all checks pass', async () => {
    // Arrange
    const entityId = 'entity1';

    // Act
    const result = await deleteEntityUseCase.execute(entityId);

    // Assert
    expect(result.success).toBe(true);

    // Check if deletion was logged
    const logs = mockDeletionService.getDeletionLogs();
    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual({
      id: entityId,
      userId: 'user1',
      entityType: 'TestEntity',
    });
  });

  it('should return error when entity ID is not provided', async () => {
    // Act
    const result = await deleteEntityUseCase.execute('');

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('TestEntity ID is required');

    // Check no deletion was logged
    const logs = mockDeletionService.getDeletionLogs();
    expect(logs.length).toBe(0);
  });

  it('should return error when user is not authenticated', async () => {
    // Arrange
    mockDeletionService.setCurrentUserId(null);

    // Act
    const result = await deleteEntityUseCase.execute('entity1');

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('User not authenticated');

    // Check no deletion was logged
    const logs = mockDeletionService.getDeletionLogs();
    expect(logs.length).toBe(0);
  });

  it('should return error when user does not have permission to delete', async () => {
    // Arrange
    mockDeletionService.setCurrentUserId('user2');

    // Act
    const result = await deleteEntityUseCase.execute('entity2');

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("You don't have permission to delete this testentity");

    // Check no deletion was logged
    const logs = mockDeletionService.getDeletionLogs();
    expect(logs.length).toBe(0);
  });

  it('should handle errors during deletion operation', async () => {
    // Arrange
    jest.spyOn(mockDeletionService, 'deleteEntity').mockImplementation(() => {
      throw new Error('Database error');
    });

    // Act
    const result = await deleteEntityUseCase.execute('entity1');

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Database error');

    // Check no deletion was logged
    const logs = mockDeletionService.getDeletionLogs();
    expect(logs.length).toBe(0);
  });
});
