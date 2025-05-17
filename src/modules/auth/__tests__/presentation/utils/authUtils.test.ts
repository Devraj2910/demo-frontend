import { getAuthToken, getAuthHeaders, authFetch, isAuthenticated } from '../../../presentation/utils/authUtils';

// Mock localStorage
let localStorageMock: { [key: string]: string } = {};

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key: string) => localStorageMock[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete localStorageMock[key];
    }),
    clear: jest.fn(() => {
      localStorageMock = {};
    }),
  },
  writable: true,
});

// Mock fetch
global.fetch = jest.fn();

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock = {};
  });

  describe('getAuthToken', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'test-token-123';
      localStorageMock['auth_token'] = mockToken;

      const result = getAuthToken();

      expect(result).toBe(mockToken);
      expect(window.localStorage.getItem).toHaveBeenCalledWith('auth_token');
    });

    it('should return null when token is not in localStorage', () => {
      const result = getAuthToken();

      expect(result).toBeNull();
      expect(window.localStorage.getItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('getAuthHeaders', () => {
    it('should return headers with Authorization token when token exists', () => {
      const mockToken = 'test-token-123';
      localStorageMock['auth_token'] = mockToken;

      const headers = getAuthHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      });
    });

    it('should return headers without Authorization when token does not exist', () => {
      const headers = getAuthHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
      expect(headers).not.toHaveProperty('Authorization');
    });
  });

  describe('authFetch', () => {
    it('should call fetch with auth headers', async () => {
      const mockToken = 'test-token-123';
      localStorageMock['auth_token'] = mockToken;
      const url = 'https://api.example.com/data';
      const mockResponse = { ok: true };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authFetch(url);

      expect(global.fetch).toHaveBeenCalledWith(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      });
      expect(result).toBe(mockResponse);
    });

    it('should merge custom headers with auth headers', async () => {
      const mockToken = 'test-token-123';
      localStorageMock['auth_token'] = mockToken;
      const url = 'https://api.example.com/data';
      const customOptions = {
        method: 'POST',
        headers: {
          'X-Custom-Header': 'custom-value',
        },
        body: JSON.stringify({ data: 'test' }),
      };
      const mockResponse = { ok: true };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authFetch(url, customOptions);

      expect(global.fetch).toHaveBeenCalledWith(url, {
        ...customOptions,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
          'X-Custom-Header': 'custom-value',
        },
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorageMock['auth_token'] = 'test-token-123';

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when token does not exist', () => {
      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
