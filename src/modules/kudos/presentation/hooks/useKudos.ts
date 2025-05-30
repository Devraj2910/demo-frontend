import { useState, useEffect, useCallback } from 'react';
import { Kudo, KudoFilters } from '../../core/types/kudoTypes';
import { KudoService } from '../../core/services/kudoService';
import { GetKudosUseCase } from '../../core/useCases/getKudosUseCase';
import { DeleteKudoUseCase } from '../../core/useCases/deleteKudoUseCase';
import { KudoRepository } from '../../core/interfaces/repositories/kudoRepository';
import { UserRepository } from '../../core/interfaces/repositories/userRepository';
import { ApiKudoRepository } from '../../infrastructure/repositories/ApiKudoRepository';
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';
import { KudoApiResponse } from '../../core/interfaces/repositories/kudoRepository';

// Initialize repositories and service once outside of the component
const kudoRepository: KudoRepository = new ApiKudoRepository();
const userRepository: UserRepository = new ApiUserRepository();
const kudoService = new KudoService(kudoRepository, userRepository);
const defaultGetKudosUseCase = new GetKudosUseCase(kudoService);
const deleteKudoUseCase = new DeleteKudoUseCase(kudoService);

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseKudosResult {
  kudos: Kudo[];
  isLoading: boolean;
  error: string | null;
  refreshKudos: () => void;
  filterKudos: (filters: KudoFilters) => void;
  deleteKudo: (id: string) => Promise<boolean>;
  pagination: PaginationData | null;
  setKudos: React.Dispatch<React.SetStateAction<Kudo[]>>;
}

/**
 * Hook for working with kudos data
 */
export const useKudos = (initialFilters?: KudoFilters, getKudosUseCase = defaultGetKudosUseCase): UseKudosResult => {
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<KudoFilters | undefined>(
    initialFilters || {
      page: 1,
      limit: 9, // Default to 9 items per page
    }
  );
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Function to load kudos with current filters
  const loadKudos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getKudosUseCase.execute(filters);

      if (result.success && result.data) {
        setKudos(result.data.cards);

        // Extract pagination data
        setPagination({
          total: result.data.total || 0,
          page: result.data.page || 1,
          limit: result.data.limit || 9,
          totalPages: result.data.totalPages || 1,
        });
      } else {
        setKudos([]);
        setPagination(null);
        setError(result.error || 'Failed to load kudos');
      }
    } catch (err) {
      console.error('Error in useKudos:', err);
      setKudos([]);
      setPagination(null);
      setError('An unexpected error occurred while loading kudos');
    } finally {
      setIsLoading(false);
    }
  }, [filters, getKudosUseCase]);

  // Load kudos on mount and when filters change
  useEffect(() => {
    loadKudos();
  }, [loadKudos]);

  // Function to manually refresh kudos
  const refreshKudos = useCallback(() => {
    loadKudos();
  }, [loadKudos]);

  // Function to apply new filters
  const filterKudos = useCallback((newFilters: KudoFilters) => {
    // Ensure pagination params are included
    const updatedFilters = {
      ...newFilters,
      page: newFilters.page || 1,
      limit: newFilters.limit || 9,
    };
    setFilters(updatedFilters);
  }, []);

  // Function to delete a kudo
  const deleteKudo = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const result = await deleteKudoUseCase.execute(id);

        if (result.success) {
          // Optimistically update the UI by removing the deleted kudo
          setKudos((prevKudos) => prevKudos.filter((kudo) => kudo.id !== id));

          // If we've deleted the last item on a page, go back a page (except on page 1)
          if (kudos.length === 1 && pagination && pagination.page > 1) {
            filterKudos({
              ...filters,
              page: pagination.page - 1,
            });
          } else {
            // Otherwise just refresh the current page
            refreshKudos();
          }

          return true;
        } else {
          setError(result.error || 'Failed to delete kudo');
          return false;
        }
      } catch (err) {
        console.error('Error deleting kudo:', err);
        setError('An unexpected error occurred while deleting the kudo');
        return false;
      }
    },
    [filters, kudos.length, pagination, refreshKudos, filterKudos]
  );

  return {
    kudos,
    isLoading,
    error,
    refreshKudos,
    filterKudos,
    deleteKudo,
    pagination,
    setKudos,
  };
};
