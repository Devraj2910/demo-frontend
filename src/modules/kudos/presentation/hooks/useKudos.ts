import { useState, useEffect, useCallback } from 'react';
import { Kudo, KudoFilters } from '../../core/types/kudoTypes';
import { KudoService } from '../../core/services/kudoService';
import { GetKudosUseCase } from '../../core/useCases/getKudosUseCase';
import { KudoRepository } from '../../core/interfaces/repositories/kudoRepository';
import { UserRepository } from '../../core/interfaces/repositories/userRepository';
import { ApiKudoRepository } from '../../infrastructure/repositories/ApiKudoRepository';
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';

// Initialize repositories and service once outside of the component
const kudoRepository: KudoRepository = new ApiKudoRepository();
const userRepository: UserRepository = new ApiUserRepository();
const kudoService = new KudoService(kudoRepository, userRepository);
const getKudosUseCase = new GetKudosUseCase(kudoService);

interface UseKudosResult {
  kudos: Kudo[];
  isLoading: boolean;
  error: string | null;
  refreshKudos: () => void;
  filterKudos: (filters: KudoFilters) => void;
}

/**
 * Hook for working with kudos data
 */
export const useKudos = (initialFilters?: KudoFilters): UseKudosResult => {
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<KudoFilters | undefined>(initialFilters);

  // Function to load kudos with current filters
  const loadKudos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getKudosUseCase.execute(filters);

      if (result.success && result.data) {
        // Ensure we always have an array, even if the API returns something unexpected
        console.log(result.data);
        if (Array.isArray(result.data)) {
          setKudos(result.data);
        } else {
          console.error('Unexpected data format received from API:', result.data);
          setKudos([]);
          setError('Invalid data format received from server');
        }
      } else {
        setKudos([]);
        setError(result.error || 'Failed to load kudos');
      }
    } catch (err) {
      console.error('Error in useKudos:', err);
      setKudos([]);
      setError('An unexpected error occurred while loading kudos');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

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
    setFilters(newFilters);
  }, []);

  return {
    kudos,
    isLoading,
    error,
    refreshKudos,
    filterKudos,
  };
};
