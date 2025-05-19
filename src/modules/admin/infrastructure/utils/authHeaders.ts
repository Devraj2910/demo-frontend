/**
 * Helper function to get auth token from localStorage and return properly formatted headers
 */
export const getAuthHeaders = (): Record<string, string> => {
  let token = '';

  // Only access localStorage in browser environment
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token') || '';
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
