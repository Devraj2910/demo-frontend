'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { Kudo, KudoFilters, User } from '../../core/types/kudoTypes';
import { useKudos } from '../hooks/useKudos';
import { useUsers } from '../hooks/useUsers';
import { useKudoForm } from '../hooks/useKudoForm';

// Define the context type
interface KudoContextType {
  // Kudos data and functions
  kudos: Kudo[];
  isLoadingKudos: boolean;
  errorKudos: string | null;
  refreshKudos: () => void;
  filterKudos: (filters: KudoFilters) => void;
  filters: KudoFilters;

  // Users data and functions
  users: User[];
  currentUser: User | null;
  isLoadingUsers: boolean;
  errorUsers: string | null;
  searchUsers: (query: string, team?: string) => Promise<void>;

  // Kudo creation
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  submitKudo: (data: any) => Promise<any>;
  resetKudoForm: () => void;
}

// Create the context
const KudoContext = createContext<KudoContextType | undefined>(undefined);

// Context provider component
export const KudoContextProvider = ({ children }: { children: ReactNode }) => {
  // Get hooks
  const { kudos, isLoading: isLoadingKudos, error: errorKudos, refreshKudos, filterKudos } = useKudos();
  const { users, currentUser, isLoading: isLoadingUsers, error: errorUsers, searchUsers } = useUsers();
  const { isSubmitting, success: submitSuccess, error: submitError, submitKudo, resetForm } = useKudoForm();

  // Track current filters
  const [filters, setFilters] = useState<KudoFilters>({});

  // Wrap filterKudos to track current filters
  const handleFilterKudos = useCallback(
    (newFilters: KudoFilters) => {
      setFilters(newFilters);
      filterKudos(newFilters);
    },
    [filterKudos]
  );

  // Context value
  const contextValue: KudoContextType = {
    // Kudos data and functions
    kudos,
    isLoadingKudos,
    errorKudos,
    refreshKudos,
    filterKudos: handleFilterKudos,
    filters,

    // Users data and functions
    users,
    currentUser,
    isLoadingUsers,
    errorUsers,
    searchUsers,

    // Kudo creation
    isSubmitting,
    submitSuccess,
    submitError,
    submitKudo,
    resetKudoForm: resetForm,
  };

  return <KudoContext.Provider value={contextValue}>{children}</KudoContext.Provider>;
};

// Custom hook to use the context
export const useKudoContext = () => {
  const context = useContext(KudoContext);

  if (context === undefined) {
    throw new Error('useKudoContext must be used within a KudoContextProvider');
  }

  return context;
};
