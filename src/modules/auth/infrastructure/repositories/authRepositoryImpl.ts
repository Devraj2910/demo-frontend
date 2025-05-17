import { IAuthRepository } from '../../core/interfaces/authRepository';
import {
  TLoginCredentials,
  TRegisterData,
  TAuthResponse,
  TUser,
  UserRole,
  TAPIAuthResponse,
} from '../../core/types/authTypes';

const API_BASE_URL = 'https://demo-hackathon.onrender.com/api';

/**
 * Implementation of the auth repository
 * This class handles the actual data access logic
 */
export class AuthRepositoryImpl implements IAuthRepository {
  private authUserKey = 'auth_user';
  private authTokenKey = 'auth_token';

  /**
   * Authenticate a user with email and password
   * @param credentials Login credentials
   * @returns Authentication response with user data
   */
  async login(credentials: TLoginCredentials): Promise<TAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const data = (await response.json()) as TAPIAuthResponse;
      console.log('Login API response:', data);

      // Map API response to our TUser type
      const user: TUser = {
        id: data.id,
        name: data.firstName || '', // Use first part of email as name if firstName not available
        email: data.email,
        role: this.mapRole(data.role),
        team: data.position || 'Not specified',
      };

      // Store user and token in localStorage
      localStorage.setItem(this.authUserKey, JSON.stringify(user));
      localStorage.setItem(this.authTokenKey, data.token);

      return {
        user,
        token: data.token,
        status: response.status,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Authentication response with new user data
   */
  async register(userData: TRegisterData): Promise<TAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.name, // API expects firstName
          lastName: '',
          role: userData.role || 'team_member',
          position: userData.team || 'Not specified',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseJson = await response.json();
      console.log('Register API response:', responseJson);

      // The response may be wrapped in a data property or directly contain the user data
      const data = responseJson.data || (responseJson as TAPIAuthResponse);

      // Map API response to our TUser type
      const user: TUser = {
        id: data.id,
        name: data.firstName,
        email: data.email,
        role: this.mapRole(data.role),
        team: data.position || 'Not specified',
      };

      // Store user and token in localStorage
      localStorage.setItem(this.authUserKey, JSON.stringify(user));
      localStorage.setItem(this.authTokenKey, data.token);

      return {
        user,
        token: data.token,
        status: response.status,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    // Remove user and token from localStorage
    localStorage.removeItem(this.authUserKey);
    localStorage.removeItem(this.authTokenKey);
  }

  /**
   * Get the currently authenticated user
   * @returns Authentication response with user data or null if not authenticated
   */
  async getCurrentUser(): Promise<TAuthResponse | null> {
    const storedUser = localStorage.getItem(this.authUserKey);
    const token = localStorage.getItem(this.authTokenKey);

    if (storedUser) {
      try {
        const user: TUser = JSON.parse(storedUser);
        return {
          user,
          token: token || undefined,
          status: 200,
        };
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(this.authUserKey);
        localStorage.removeItem(this.authTokenKey);
      }
    }

    return null;
  }

  /**
   * Map API role to our UserRole type
   * @param apiRole Role from API response
   * @returns Mapped UserRole
   */
  private mapRole(apiRole: string): UserRole {
    // Handle different role formats from the API
    if (apiRole === 'admin') {
      return 'admin';
    }
    return 'team_member';
  }
}
