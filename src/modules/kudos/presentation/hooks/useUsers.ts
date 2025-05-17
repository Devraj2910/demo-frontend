import { useState, useCallback, useEffect } from 'react';
import { User } from '../../core/types/kudoTypes';
import { KudoService } from '../../core/services/kudoService';
import { SearchUsersUseCase } from '../../core/useCases/searchUsersUseCase';
import { GetCurrentUserUseCase } from '../../core/useCases/getCurrentUserUseCase';
import { KudoRepository } from '../../core/interfaces/repositories/kudoRepository';
import { UserRepository } from '../../core/interfaces/repositories/userRepository';
import { ApiKudoRepository } from '../../infrastructure/repositories/ApiKudoRepository';
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';

// Initialize repositories and service once outside of the component
const kudoRepository: KudoRepository = new ApiKudoRepository();
const userRepository: UserRepository = new ApiUserRepository();
const kudoService = new KudoService(kudoRepository, userRepository);
const searchUsersUseCase = new SearchUsersUseCase(kudoService);
const getCurrentUserUseCase = new GetCurrentUserUseCase(kudoService);

interface UseUsersResult {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  searchUsers: (query: string, team?: string) => Promise<void>;
}

/**
 * Hook for working with user data and operations
 */
export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user data on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const result = await getCurrentUserUseCase.execute();

        if (result.success && result.data) {
          setCurrentUser(result.data);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Function to search for users
  const searchUsers = useCallback(async (query: string, team?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await searchUsersUseCase.execute(query);

      if (result.success && result.data) {
        // Filter results by team if a team is specified
        const filteredUsers = team ? result.data.filter((user) => user.team === team) : result.data;

        setUsers(filteredUsers);
      } else {
        setError(result.error || 'Failed to search users');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error searching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    currentUser,
    isLoading,
    error,
    searchUsers,
  };
};
