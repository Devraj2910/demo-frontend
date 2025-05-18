import { useState, useEffect, useCallback } from "react";
import { Kudo, KudoFilters } from "../../core/types/kudoTypes";
import { KudoService } from "../../core/services/kudoService";
import { GetKudosUseCase } from "../../core/useCases/getKudosUseCase";
import { KudoRepository } from "../../core/interfaces/repositories/kudoRepository";
import { UserRepository } from "../../core/interfaces/repositories/userRepository";
import { ApiKudoRepository } from "../../infrastructure/repositories/ApiKudoRepository";
import { ApiUserRepository } from "../../infrastructure/repositories/ApiUserRepository";
import { KudoApiResponse } from "../../core/interfaces/repositories/kudoRepository";

// Initialize repositories and service once outside of the component
const kudoRepository: KudoRepository = new ApiKudoRepository();
const userRepository: UserRepository = new ApiUserRepository();
const kudoService = new KudoService(kudoRepository, userRepository);
const defaultGetKudosUseCase = new GetKudosUseCase(kudoService);

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
  pagination: PaginationData | null;
}

/**
 * Hook for working with kudos data
 */
export const useKudos = (
  initialFilters?: KudoFilters,
  getKudosUseCase = defaultGetKudosUseCase
): UseKudosResult => {
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<KudoFilters | undefined>(
    initialFilters
  );
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Function to load kudos with current filters
  const loadKudos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getKudosUseCase.execute(filters);

      if (result.success && result.data) {
        console.log("API Response:", result.data);
        setKudos(result.data.cards);
        console.log(result.data.cards);

        // Extract pagination data
        setPagination({
          total: result.data.total || 0,
          page: result.data.page || 1,
          limit: result.data.limit || 20,
          totalPages: result.data.totalPages || 1,
        });
      } else {
        setKudos([]);
        setPagination(null);
        setError(result.error || "Failed to load kudos");
      }
    } catch (err) {
      console.error("Error in useKudos:", err);
      setKudos([]);
      setPagination(null);
      setError("An unexpected error occurred while loading kudos");
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
    setFilters(newFilters);
  }, []);

  return {
    kudos,
    isLoading,
    error,
    refreshKudos,
    filterKudos,
    pagination,
  };
};
