import { TUser } from '../../core/types/authTypes';

/**
 * Options for cookie operations
 */
export interface AuthCookieOptions {
  path?: string;
  domain?: string;
  expires?: Date | number | string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  httpOnly?: boolean;
}

/**
 * Auth storage service for managing user data and tokens
 * This is a specialized service for auth-related storage operations
 */
export class AuthStorageService {
  private static instance: AuthStorageService;
  private authUserKey: string = 'auth_user';
  private authTokenKey: string = 'auth_token';
  private isClientSide: boolean;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.isClientSide = typeof window !== 'undefined';
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthStorageService {
    if (!AuthStorageService.instance) {
      AuthStorageService.instance = new AuthStorageService();
    }
    return AuthStorageService.instance;
  }

  /**
   * Set the user in localStorage
   * @param user The user to store
   */
  public setUser(user: TUser): void {
    if (!this.isClientSide) return;

    try {
      localStorage.setItem(this.authUserKey, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user in localStorage:', error);
    }
  }

  /**
   * Get the user from localStorage
   * @returns The stored user or null if not found
   */
  public getUser(): TUser | null {
    if (!this.isClientSide) return null;

    try {
      const userStr = localStorage.getItem(this.authUserKey);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error retrieving user from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove the user from localStorage
   */
  public removeUser(): void {
    if (!this.isClientSide) return;

    try {
      localStorage.removeItem(this.authUserKey);
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  }

  /**
   * Set the auth token in localStorage
   * @param token The token to store
   */
  public setToken(token: string): void {
    if (!this.isClientSide) return;

    try {
      localStorage.setItem(this.authTokenKey, token);
    } catch (error) {
      console.error('Error storing token in localStorage:', error);
    }
  }

  /**
   * Get the auth token from localStorage
   * @returns The stored token or null if not found
   */
  public getToken(): string | null {
    if (!this.isClientSide) return null;

    try {
      return localStorage.getItem(this.authTokenKey);
    } catch (error) {
      console.error('Error retrieving token from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove the auth token from localStorage
   */
  public removeToken(): void {
    if (!this.isClientSide) return;

    try {
      localStorage.removeItem(this.authTokenKey);
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  }

  /**
   * Set a cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   */
  public setCookie(name: string, value: string, options: AuthCookieOptions = {}): void {
    if (!this.isClientSide) return;

    try {
      const serializedValue = encodeURIComponent(value);

      let cookieString = `${name}=${serializedValue}`;

      if (options.path) cookieString += `; path=${options.path}`;
      if (options.domain) cookieString += `; domain=${options.domain}`;

      if (options.expires) {
        if (options.expires instanceof Date) {
          cookieString += `; expires=${options.expires.toUTCString()}`;
        } else if (typeof options.expires === 'number') {
          const date = new Date();
          date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
          cookieString += `; expires=${date.toUTCString()}`;
        } else {
          cookieString += `; expires=${options.expires}`;
        }
      }

      if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
      if (options.secure) cookieString += '; secure';
      if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

      document.cookie = cookieString;
    } catch (error) {
      console.error(`Error setting cookie "${name}":`, error);
    }
  }

  /**
   * Get a cookie
   * @param name Cookie name
   * @returns Cookie value or null if not found
   */
  public getCookie(name: string): string | null {
    if (!this.isClientSide) return null;

    try {
      const cookies = document.cookie.split(';');

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');

        if (cookieName === name) {
          return cookieValue ? decodeURIComponent(cookieValue) : null;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error getting cookie "${name}":`, error);
      return null;
    }
  }

  /**
   * Remove a cookie
   * @param name Cookie name
   * @param options Cookie options for removal
   */
  public removeCookie(name: string, options: AuthCookieOptions = {}): void {
    if (!this.isClientSide) return;

    try {
      // To remove a cookie, set it with an expired date
      const removeOptions: AuthCookieOptions = {
        ...options,
        expires: new Date(0), // Set to epoch time (past date)
      };

      this.setCookie(name, '', removeOptions);
    } catch (error) {
      console.error(`Error removing cookie "${name}":`, error);
    }
  }

  /**
   * Set the auth token in both localStorage and cookies
   * @param token Token to store
   */
  public storeAuthToken(token: string): void {
    // Set in localStorage
    this.setToken(token);

    // Set in cookies with 7 day expiry
    this.setCookie(this.authTokenKey, token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      sameSite: 'strict',
    });
  }

  /**
   * Remove the auth token from both localStorage and cookies
   */
  public clearAuthToken(): void {
    // Remove from localStorage
    this.removeToken();

    // Remove from cookies
    this.removeCookie(this.authTokenKey, { path: '/' });
  }

  /**
   * Clear all auth-related storage data
   */
  public clearAuthData(): void {
    this.removeUser();
    this.clearAuthToken();
  }
}
