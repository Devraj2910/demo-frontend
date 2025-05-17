import { useState, useCallback } from 'react';
import { CreateKudoRequest, UseCaseResult, Kudo } from '../../core/types/kudoTypes';
import { KudoService } from '../../core/services/kudoService';
import { CreateKudoUseCase } from '../../core/useCases/createKudoUseCase';
import { KudoRepository } from '../../core/interfaces/repositories/kudoRepository';
import { UserRepository } from '../../core/interfaces/repositories/userRepository';
import { ApiKudoRepository } from '../../infrastructure/repositories/ApiKudoRepository';
import { MockUserRepository } from '../../infrastructure/repositories/mockUserRepository';

// Initialize repositories and service once outside of the component
const kudoRepository: KudoRepository = new ApiKudoRepository();
const userRepository: UserRepository = new MockUserRepository();
const kudoService = new KudoService(kudoRepository, userRepository);
const createKudoUseCase = new CreateKudoUseCase(kudoService);

interface UseKudoFormResult {
  isSubmitting: boolean;
  success: boolean;
  error: string | null;
  submitKudo: (data: CreateKudoRequest) => Promise<UseCaseResult<Kudo>>;
  resetForm: () => void;
}

/**
 * Hook for creating new kudos
 */
export const useKudoForm = (): UseKudoFormResult => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to submit a new kudo
  const submitKudo = useCallback(async (data: CreateKudoRequest): Promise<UseCaseResult<Kudo>> => {
    setIsSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      const result = await createKudoUseCase.execute(data);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to create kudo');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Function to reset the form state
  const resetForm = useCallback(() => {
    setSuccess(false);
    setError(null);
  }, []);

  return {
    isSubmitting,
    success,
    error,
    submitKudo,
    resetForm,
  };
};
