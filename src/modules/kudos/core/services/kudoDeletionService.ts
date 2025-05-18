import { KudoRepository } from '../interfaces/repositories/kudoRepository';
import { UserRepository } from '../interfaces/repositories/userRepository';
import { Kudo } from '../types/kudoTypes';
import { EntityDeletionService } from '../useCases/deleteEntityUseCase';
import { hasAdminOrTechLeadPrivileges } from '@/modules/auth/presentation/utils/authUtils';

/**
 * Service for deleting kudos with proper permission checks
 */
export class KudoDeletionService implements EntityDeletionService<Kudo> {
  constructor(private kudoRepository: KudoRepository, private userRepository: UserRepository) {}

  /**
   * Delete a kudo by ID
   * @param id Kudo ID
   */
  async deleteEntity(id: string): Promise<void> {
    return this.kudoRepository.deleteKudo(id);
  }

  /**
   * Check if user has permission to delete a kudo
   * This implements authorization rules for kudo deletion
   * @param id Kudo ID
   * @param userId Current user ID
   */
  async canDelete(id: string, userId: string): Promise<boolean> {
    if (!userId) return false;

    // Fetch the kudo to check ownership
    const kudo = await this.kudoRepository.getKudoById(id);
    if (!kudo) return false;

    // Admins and tech leads can delete any kudo
    if (hasAdminOrTechLeadPrivileges()) {
      return true;
    }

    // Users can only delete their own kudos
    return kudo.userId === userId;
  }

  /**
   * Get current user ID
   */
  async getCurrentUserId(): Promise<string | null> {
    const currentUser = await this.userRepository.getCurrentUser();
    return currentUser?.id || null;
  }

  /**
   * Log deletion action for audit purposes
   * @param id Kudo ID
   * @param userId User who performed the deletion
   * @param entityType Type of entity that was deleted
   */
  async logDeletion(id: string, userId: string, entityType: string): Promise<void> {
    // In a real app, you might want to log this to a database or analytics service
    console.log(`AUDIT: User ${userId} deleted ${entityType} with ID ${id} at ${new Date().toISOString()}`);

    // This could be extended to call an audit logging service or repository
  }
}
