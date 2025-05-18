'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TUser, UserRole, TLoginCredentials, TRegisterData } from '../../core/types/authTypes';
import { LoginUseCase } from '../../core/useCases/loginUseCase';
import { RegisterUseCase } from '../../core/useCases/registerUseCase';
import { GetCurrentUserUseCase } from '../../core/useCases/getCurrentUserUseCase';
import { AuthService } from '../../core/services/authService';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/authRepositoryImpl';
import { getAuthHeaders } from '../utils/authUtils';
import { AuthStorageService } from '../../infrastructure/services/authStorageService';

// Role hierarchy for permission checks
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 2,
  user: 1,
};

// Auth context type
interface AuthContextType {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: TRegisterData) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  getAuthHeaders: () => HeadersInit;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set up use cases
const setupUseCases = () => {
  const authRepository = new AuthRepositoryImpl();
  const authService = new AuthService(authRepository);

  return {
    loginUseCase: new LoginUseCase(authService),
    registerUseCase: new RegisterUseCase(authService),
    getCurrentUserUseCase: new GetCurrentUserUseCase(authService),
    authService,
  };
};

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authStorageService = AuthStorageService.getInstance();

  // Initialize use cases
  const { loginUseCase, registerUseCase, getCurrentUserUseCase, authService } = setupUseCases();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUserResponse = await getCurrentUserUseCase.execute();
        if (currentUserResponse) {
          setUser(currentUserResponse);
          const storedToken = authStorageService.getToken();
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const credentials: TLoginCredentials = { email, password };
      const authResponse = await loginUseCase.execute(credentials);
      console.log('Auth response from login:', authResponse);
      setUser(authResponse);

      const storedToken = authStorageService.getToken();
      console.log('Stored token:', storedToken);
      setToken(storedToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: TRegisterData) => {
    setIsLoading(true);

    try {
      await registerUseCase.execute(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      window.location.href = '/';
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Permission checking function
  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
      // Check if user role is in the array of allowed roles
      return requiredRole.includes(user.role);
    } else {
      // Check if user role has equal or higher level than required role
      return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
    }
  };

  const value = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    token,
    login,
    register,
    logout,
    hasPermission,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
