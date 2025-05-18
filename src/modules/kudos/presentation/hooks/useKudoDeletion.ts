import { useState, useCallback } from 'react';
import { Kudo } from '../../core/types/kudoTypes';
import { ApiKudoRepository } from '../../infrastructure/repositories/ApiKudoRepository';
import { hasAdminOrTechLeadPrivileges } from '@/modules/auth/presentation/utils/authUtils';

// Initialize repository
const kudoRepository = new ApiKudoRepository();

interface UseKudoDeletionProps {
  onDeleteSuccess?: (id: string) => void;
  onUpdateKudosList?: (newKudos: Kudo[]) => void;
  kudos?: Kudo[];
}

/**
 * Hook for handling kudo deletion with UI updates
 */
export function useKudoDeletion({ onDeleteSuccess, onUpdateKudosList, kudos }: UseKudoDeletionProps = {}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteKudo = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsDeleting(true);
        setError(null);

        // Check permissions
        if (!hasAdminOrTechLeadPrivileges()) {
          setError('You do not have permission to delete this kudo');
          return false;
        }

        // Delete the kudo
        await kudoRepository.deleteKudo(id);

        // Handle UI updates
        if (kudos && onUpdateKudosList) {
          const updatedKudos = kudos.filter((kudo) => kudo.id !== id);
          onUpdateKudosList(updatedKudos);
        }

        // Call success callback
        if (onDeleteSuccess) {
          onDeleteSuccess(id);
        }

        return true;
      } catch (err) {
        console.error('Error deleting kudo:', err);
        setError('Failed to delete kudo');
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [kudos, onUpdateKudosList, onDeleteSuccess]
  );

  return {
    isDeleting,
    deleteKudo,
    error,
  };
}
