import { AuthStorageService } from '../../infrastructure/services/authStorageService';

/**
 * Utility functions for authentication
 */

// Get auth token from storage service
export const getAuthToken = (): string | null => {
  const authStorageService = AuthStorageService.getInstance();
  return authStorageService.getToken();
};

// Create headers with auth token
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Make authenticated API request
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = getAuthHeaders();

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  };

  return fetch(url, fetchOptions);
};

/**
 * Utility function to check if user is currently authenticated
 * @returns boolean indicating authenticated state
 */
export function isAuthenticated(): boolean {
  const authStorageService = AuthStorageService.getInstance();
  return !!authStorageService.getToken();
}

/**
 * Get authenticated user from storage
 * @returns User object if authenticated, null otherwise
 */
export function getAuthenticatedUser() {
  const authStorageService = AuthStorageService.getInstance();
  return authStorageService.getUser();
}

/**
 * Clear all authentication data from storage
 */
export function clearAuthData(): void {
  const authStorageService = AuthStorageService.getInstance();
  authStorageService.clearAuthData();
}
