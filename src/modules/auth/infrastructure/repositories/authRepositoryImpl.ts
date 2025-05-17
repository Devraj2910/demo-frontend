import { IAuthRepository } from '../../core/interfaces/authRepository';
import {
  TLoginCredentials,
  TRegisterData,
  TAuthResponse,
  TUser,
  UserRole,
  TAPIAuthResponse,
} from '../../core/types/authTypes';
import { Cookies } from 'react-cookie';

const API_BASE_URL = 'https://demo-hackathon.onrender.com/api';

/**
 * Implementation of the auth repository
 * This class handles the actual data access logic
 */
export class AuthRepositoryImpl implements IAuthRepository {
  private authUserKey = 'auth_user';
  private authTokenKey = 'auth_token';
  private cookies = new Cookies();

  /**
   * Set auth token in both localStorage and cookies
   * @param token The authentication token
   */
  private setAuthToken(token: string): void {
    // Set in localStorage for client-side access
    localStorage.setItem(this.authTokenKey, token);

    // Set in cookies for middleware access (7 day expiry)
    this.cookies.set(this.authTokenKey, token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      sameSite: 'strict',
    });
  }

  /**
   * Remove auth token from both localStorage and cookies
   */
  private removeAuthToken(): void {
    // Remove from localStorage
    localStorage.removeItem(this.authTokenKey);

    // Remove from cookies
    this.cookies.remove(this.authTokenKey, { path: '/' });
  }

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

      const data = await response.json();
      // Map API response to our TUser type
      const user: TUser = {
        id: data.data.id,
        name: data.data.firstName || '', // Use first part of email as name if firstName not available
        email: data.data.email,
        role: this.mapRole(data.data.role),
        team: data.data.position || 'Not specified',
      };

      // Store user in localStorage
      localStorage.setItem(this.authUserKey, JSON.stringify(user));

      // Store token in both localStorage and cookies
      this.setAuthToken(data.data.token);

      return {
        user,
        token: data.data.token,
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

      // Store user in localStorage
      localStorage.setItem(this.authUserKey, JSON.stringify(user));

      // Store token in both localStorage and cookies
      this.setAuthToken(data.token);

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
    // Remove user from localStorage
    localStorage.removeItem(this.authUserKey);

    // Remove token from both localStorage and cookies
    this.removeAuthToken();
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
        this.removeAuthToken();
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
