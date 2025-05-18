import { ICookieService, ICookieOptions } from '../../core/interfaces/storageService';

/**
 * Cookie service implementation
 * Provides a type-safe wrapper around cookies with JSON serialization/deserialization
 */
export class CookieService implements ICookieService {
  private isAvailable: boolean;

  constructor(private prefix: string = '') {
    // Check if cookies are available (document exists)
    this.isAvailable = typeof document !== 'undefined';
  }

  /**
   * Get the prefixed name
   * @param name - The cookie name to prefix
   * @returns The prefixed cookie name
   */
  private getName(name: string): string {
    return this.prefix ? `${this.prefix}:${name}` : name;
  }

  /**
   * Get a cookie value
   * @param name - The cookie name
   * @param defaultValue - Default value if cookie doesn't exist
   * @returns The cookie value, defaultValue if not found, or null
   */
  get<T>(name: string, defaultValue?: T): T | null {
    if (!this.isAvailable) return defaultValue || null;

    try {
      const prefixedName = this.getName(name);
      const cookies = document.cookie.split(';');

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');

        if (cookieName === prefixedName) {
          try {
            return cookieValue ? (JSON.parse(decodeURIComponent(cookieValue)) as T) : null;
          } catch (e) {
            // If parsing fails, return as string
            return cookieValue as unknown as T;
          }
        }
      }

      return defaultValue || null;
    } catch (error) {
      console.error(`Error getting cookie "${name}":`, error);
      return defaultValue || null;
    }
  }

  /**
   * Set a cookie
   * @param name - The cookie name
   * @param value - The cookie value
   * @param options - Cookie options
   */
  set<T>(name: string, value: T, options: ICookieOptions = {}): void {
    if (!this.isAvailable) return;

    try {
      const prefixedName = this.getName(name);
      const serializedValue = encodeURIComponent(JSON.stringify(value));

      let cookieString = `${prefixedName}=${serializedValue}`;

      if (options.path) cookieString += `; path=${options.path}`;
      if (options.domain) cookieString += `; domain=${options.domain}`;

      // Handle expiration
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
   * Remove a cookie
   * @param name - The cookie name
   * @param options - Cookie options for removal
   */
  remove(name: string, options: ICookieOptions = {}): void {
    if (!this.isAvailable) return;

    try {
      // To remove a cookie, set it with an expired date
      const removeOptions: ICookieOptions = {
        ...options,
        expires: new Date(0), // Set to epoch time (past date)
      };

      this.set(name, '', removeOptions);
    } catch (error) {
      console.error(`Error removing cookie "${name}":`, error);
    }
  }

  /**
   * Get all cookies as an object
   * @returns Object containing all cookies
   */
  getAll(): Record<string, any> {
    if (!this.isAvailable) return {};

    try {
      const cookies: Record<string, any> = {};
      const cookiesArray = document.cookie.split(';');

      for (const cookie of cookiesArray) {
        if (!cookie.trim()) continue;

        const [name, value] = cookie.trim().split('=');
        const cookieName = this.prefix ? name.replace(`${this.prefix}:`, '') : name;

        try {
          cookies[cookieName] = value ? JSON.parse(decodeURIComponent(value)) : null;
        } catch (e) {
          // If parsing fails, use raw value
          cookies[cookieName] = value || null;
        }
      }

      return cookies;
    } catch (error) {
      console.error('Error getting all cookies:', error);
      return {};
    }
  }

  /**
   * Clear all cookies with the current prefix
   * This only clears cookies with the current prefix, not all cookies
   */
  clear(): void {
    if (!this.isAvailable) return;

    try {
      const cookies = this.getAll();

      // Get current path
      const path = '/';

      // Remove each cookie
      Object.keys(cookies).forEach((name) => {
        if (!this.prefix || name.startsWith(this.prefix)) {
          this.remove(name, { path });
        }
      });
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  }

  /**
   * Check if a cookie exists
   * @param name - The cookie name to check
   * @returns True if cookie exists, false otherwise
   */
  has(name: string): boolean {
    if (!this.isAvailable) return false;

    const cookies = document.cookie.split(';');
    const prefixedName = this.getName(name);

    for (const cookie of cookies) {
      const [cookieName] = cookie.trim().split('=');
      if (cookieName === prefixedName) {
        return true;
      }
    }

    return false;
  }
}
