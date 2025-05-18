import { UseCaseResult } from '../types/kudoTypes';

/**
 * Interface for entity deletion operations
 */
export interface EntityDeletionService<T> {
  /**
   * Delete an entity by ID
   * @param id Entity ID
   */
  deleteEntity(id: string): Promise<void>;

  /**
   * Check if user has permission to delete an entity
   * @param id Entity ID
   * @param userId Current user ID
   */
  canDelete(id: string, userId: string): Promise<boolean>;

  /**
   * Get current user ID
   */
  getCurrentUserId(): Promise<string | null>;

  /**
   * Log deletion action for audit purposes
   * @param id Entity ID
   * @param userId User who performed the deletion
   * @param entityType Type of entity that was deleted
   */
  logDeletion?(id: string, userId: string, entityType: string): Promise<void>;
}

/**
 * Generic use case for deleting entities with permission checks
 */
export class DeleteEntityUseCase<T> {
  private entityType: string;

  constructor(private deletionService: EntityDeletionService<T>, entityType: string) {
    this.entityType = entityType;
  }

  /**
   * Execute the deletion operation with proper permission checks
   * @param id Entity ID to delete
   */
  async execute(id: string): Promise<UseCaseResult<void>> {
    try {
      // Validate input
      if (!id) {
        return {
          success: false,
          error: `${this.entityType} ID is required`,
        };
      }

      // Get current user ID
      const userId = await this.deletionService.getCurrentUserId();
      if (!userId) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }

      // Check if user has permission to delete
      const hasPermission = await this.deletionService.canDelete(id, userId);
      if (!hasPermission) {
        return {
          success: false,
          error: `You don't have permission to delete this ${this.entityType.toLowerCase()}`,
        };
      }

      // Perform deletion
      await this.deletionService.deleteEntity(id);

      // Log deletion for audit if the method exists
      if (this.deletionService.logDeletion) {
        await this.deletionService.logDeletion(id, userId, this.entityType);
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error(`Error deleting ${this.entityType}:`, error);

      const errorMessage = error instanceof Error ? error.message : `Failed to delete ${this.entityType.toLowerCase()}`;

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
