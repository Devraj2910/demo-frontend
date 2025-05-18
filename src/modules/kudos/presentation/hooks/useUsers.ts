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

// Types for API response structures
interface UserApiResponse {
  users: User[];
}

interface NestedDataResponse {
  data: User[];
}

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

    console.log(`Searching users with query: "${query}", team filter: "${team || 'none'}"`);

    try {
      const result = await searchUsersUseCase.execute(query);

      console.log('Search users result:', JSON.stringify(result, null, 2));

      if (result.success && result.data) {
        // Handle different response formats
        let userData: User[] = [];

        console.log('Result data type:', typeof result.data);
        console.log('Is array?', Array.isArray(result.data));
        console.log('Result data keys:', result.data ? Object.keys(result.data) : 'null');

        if (Array.isArray(result.data)) {
          userData = result.data;
          console.log('Using array data directly');
        } else if (result.data && typeof result.data === 'object') {
          // Check all possible formats
          if ('users' in result.data) {
            userData = (result.data as UserApiResponse).users || [];
            console.log('Found users array in data.users');
          } else if ('data' in result.data && Array.isArray((result.data as NestedDataResponse).data)) {
            userData = (result.data as NestedDataResponse).data;
            console.log('Found users array in data.data');
          } else {
            // Treat the object as a single user if it has id property
            if ('id' in result.data) {
              userData = [result.data as unknown as User];
              console.log('Using single user object');
            } else {
              console.log('Could not find users array in response', result.data);
            }
          }
        }

        console.log('Extracted user data:', userData);

        const filteredUsers = team ? userData.filter((user: User) => user.team === team) : userData;
        console.log('Users after team filtering:', filteredUsers.length, 'users found');

        setUsers(filteredUsers);
      } else {
        console.error('Failed to search users:', result.error);
        setError(result.error || 'Failed to search users');
        setUsers([]);
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setError('An unexpected error occurred while searching users');
      setUsers([]);
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
