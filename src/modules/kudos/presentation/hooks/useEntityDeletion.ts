import { useState, useCallback } from 'react';
import { DeleteEntityUseCase } from '../../core/useCases/deleteEntityUseCase';

interface UseEntityDeletionResult {
  isDeleting: boolean;
  deleteEntity: (id: string) => Promise<boolean>;
  error: string | null;
}

/**
 * Hook for handling entity deletion with state management
 * @param deleteUseCase The use case for deleting the entity
 * @param onSuccess Optional callback for when deletion is successful
 */
export function useEntityDeletion<T>(
  deleteUseCase: DeleteEntityUseCase<T>,
  onSuccess?: (id: string) => void
): UseEntityDeletionResult {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEntity = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsDeleting(true);
        setError(null);

        const result = await deleteUseCase.execute(id);

        if (result.success) {
          // Call success callback if provided
          if (onSuccess) {
            onSuccess(id);
          }
          return true;
        } else {
          setError(result.error || 'Failed to delete');
          return false;
        }
      } catch (err) {
        console.error('Error in useEntityDeletion:', err);
        setError('An unexpected error occurred');
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteUseCase, onSuccess]
  );

  return {
    isDeleting,
    deleteEntity,
    error,
  };
}
