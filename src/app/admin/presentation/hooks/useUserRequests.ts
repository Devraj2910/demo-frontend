'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TUserRequest } from '../../core/types/adminTypes';
import { UserRequestService } from '../../core/services/userRequestService';
import { UserRequestRepositoryImpl } from '../../infrastructure/repositories/userRequestRepositoryImpl';

export const useUserRequests = () => {
  const [userRequests, setUserRequests] = useState<TUserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize service with repository using useMemo to ensure it's only created once
  const userRequestService = useMemo(() => new UserRequestService(new UserRequestRepositoryImpl()), []);

  const fetchUserRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const requests = await userRequestService.getUserRequests();
      setUserRequests(requests);
    } catch (err) {
      setError('Failed to fetch user requests. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userRequestService]);

  const processRequest = useCallback(
    async (userId: string, status: 'approved' | 'declined') => {
      try {
        const success = await userRequestService.processUserRequest(userId, status);
        if (success) {
          // Update local state by removing the processed request
          setUserRequests((prevRequests) => prevRequests.filter((request) => request.id !== userId));
          return true;
        }
        return false;
      } catch (err) {
        setError('Failed to process user request. Please try again.');
        console.error(err);
        return false;
      }
    },
    [userRequestService]
  );

  useEffect(() => {
    fetchUserRequests();
  }, [fetchUserRequests]);

  return {
    userRequests,
    loading,
    error,
    processRequest,
    refreshRequests: fetchUserRequests,
  };
};
