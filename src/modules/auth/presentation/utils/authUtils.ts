/**
 * Utility functions for authentication
 */

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
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

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
