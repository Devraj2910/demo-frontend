import { AuthRepositoryImpl } from '../../infrastructure/repositories/authRepositoryImpl';
import { TLoginCredentials, TRegisterData } from '../../core/types/authTypes';

// Mock fetch globally
global.fetch = jest.fn();
let localStorageMock: { [key: string]: string } = {};

// Mock localStorage
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

describe('AuthRepositoryImpl', () => {
  let authRepository: AuthRepositoryImpl;
  const mockUser = {
    id: '12345',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: 'admin',
    position: 'Developer',
    expiresIn: 3600,
    token: 'mock-token-123',
    success: true,
  };
  const mockToken = 'mock-token-123';

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    localStorageMock = {};
    authRepository = new AuthRepositoryImpl();
  });

  describe('login', () => {
    const loginCredentials: TLoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login and store user data', async () => {
      // Arrange
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockUser),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.login(loginCredentials);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('https://demo-hackathon.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCredentials),
      });
      expect(result.user).toBeDefined();
      expect(result.token).toBe(mockToken);
      expect(result.status).toBe(200);
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should throw an error when login fails', async () => {
      // Arrange
      const errorMessage = 'Invalid credentials';
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: errorMessage }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(authRepository.login(loginCredentials)).rejects.toThrow(errorMessage);
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should throw a default error when login fails without message', async () => {
      // Arrange
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(authRepository.login(loginCredentials)).rejects.toThrow('Invalid email or password');
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerData: TRegisterData = {
      email: 'new@example.com',
      password: 'newpassword',
      name: 'New User',
      role: 'team_member',
      team: 'Engineering',
    };

    it('should successfully register a new user', async () => {
      // Arrange
      const registrationResponse = {
        ...mockUser,
        email: registerData.email,
        firstName: registerData.name,
        position: registerData.team,
        role: registerData.role,
      };

      const mockResponse = {
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue({
          data: registrationResponse,
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.register(registerData);

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('https://demo-hackathon.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.name,
          lastName: '',
          role: registerData.role,
          position: registerData.team,
        }),
      });
      expect(result.user).toBeDefined();
      expect(result.token).toBe(mockToken);
      expect(result.status).toBe(201);
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should handle direct response format for registration', async () => {
      // Arrange
      const registrationResponse = {
        ...mockUser,
        email: registerData.email,
        firstName: registerData.name,
        position: registerData.team,
        role: registerData.role,
      };

      const mockResponse = {
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue(registrationResponse),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await authRepository.register(registerData);

      // Assert
      expect(result.user).toBeDefined();
      expect(result.token).toBe(mockToken);
      expect(result.status).toBe(201);
    });

    it('should throw an error when registration fails', async () => {
      // Arrange
      const errorMessage = 'Email already in use';
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: errorMessage }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(authRepository.register(registerData)).rejects.toThrow(errorMessage);
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear user data from localStorage', async () => {
      // Act
      await authRepository.logout();

      // Assert
      expect(window.localStorage.removeItem).toHaveBeenCalledTimes(2);
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_user');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user data if it exists in localStorage', async () => {
      // Arrange
      const storedUser = {
        id: '12345',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        team: 'Engineering',
      };
      localStorageMock['auth_user'] = JSON.stringify(storedUser);
      localStorageMock['auth_token'] = mockToken;

      // Act
      const result = await authRepository.getCurrentUser();

      // Assert
      expect(result).not.toBeNull();
      if (result) {
        expect(result.user).toEqual(storedUser);
        expect(result.token).toBe(mockToken);
        expect(result.status).toBe(200);
      }
    });

    it('should return null if no user data exists in localStorage', async () => {
      // Act
      const result = await authRepository.getCurrentUser();

      // Assert
      expect(result).toBeNull();
    });

    it('should handle and clear invalid JSON in localStorage', async () => {
      // Arrange
      localStorageMock['auth_user'] = 'invalid-json';

      // Act
      const result = await authRepository.getCurrentUser();

      // Assert
      expect(result).toBeNull();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_user');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('mapRole', () => {
    it('should map admin role correctly', () => {
      // This is a private method, so we need to access it using any
      const repo = authRepository as any;

      expect(repo.mapRole('admin')).toBe('admin');
    });

    it('should map any other role to team_member', () => {
      // This is a private method, so we need to access it using any
      const repo = authRepository as any;

      expect(repo.mapRole('user')).toBe('team_member');
      expect(repo.mapRole('other')).toBe('team_member');
      expect(repo.mapRole('')).toBe('team_member');
    });
  });
});
