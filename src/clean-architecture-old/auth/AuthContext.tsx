/**
 * @deprecated This file is deprecated. Use the implementation from @/modules/auth instead.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User role types as specified in the requirements
export type UserRole = 'admin' | 'tech_lead' | 'team_member';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  team?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/20.jpg',
    team: 'Management',
  },
  {
    id: '2',
    name: 'Tech Lead',
    email: 'techlead@company.com',
    role: 'tech_lead',
    avatar: 'https://randomuser.me/api/portraits/women/20.jpg',
    team: 'Alpha',
  },
  {
    id: '3',
    name: 'Team Member',
    email: 'member@company.com',
    role: 'team_member',
    avatar: 'https://randomuser.me/api/portraits/men/30.jpg',
    team: 'Bravo',
  },
];

// Role hierarchy for permission checks
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  tech_lead: 2,
  team_member: 1,
};

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user with matching email (case insensitive)
      const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser && password === 'password') {
        // Using simple password for demo
        setUser(foundUser);
        localStorage.setItem('auth_user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
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
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  throw new Error('This file is deprecated. Use the implementation from @/modules/auth instead.');
}
