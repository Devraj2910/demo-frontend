/**
 * Interface for browser storage services (localStorage, sessionStorage)
 */
export interface IStorageService {
  /**
   * Get a value from storage
   * @param key - The key to retrieve
   * @param defaultValue - Default value if key doesn't exist
   * @returns The stored value, defaultValue if not found, or null
   */
  get<T>(key: string, defaultValue?: T): T | null;

  /**
   * Set a value in storage
   * @param key - The key to store
   * @param value - The value to store
   */
  set<T>(key: string, value: T): void;

  /**
   * Remove a value from storage
   * @param key - The key to remove
   */
  remove(key: string): void;

  /**
   * Clear all values from storage
   */
  clear(): void;

  /**
   * Check if a key exists in storage
   * @param key - The key to check
   * @returns True if key exists, false otherwise
   */
  has(key: string): boolean;
}

/**
 * Cookie options interface
 */
export interface ICookieOptions {
  path?: string;
  domain?: string;
  expires?: Date | number | string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  httpOnly?: boolean;
}

/**
 * Interface for cookie service
 * Extends IStorageService for compatibility with storage service factory
 */
export interface ICookieService extends IStorageService {
  /**
   * Get a cookie value
   * @param name - The cookie name
   * @param defaultValue - Default value if cookie doesn't exist
   * @returns The cookie value, defaultValue if not found, or null
   */
  get<T>(name: string, defaultValue?: T): T | null;

  /**
   * Set a cookie
   * @param name - The cookie name
   * @param value - The cookie value
   * @param options - Cookie options
   */
  set<T>(name: string, value: T, options?: ICookieOptions): void;

  /**
   * Remove a cookie
   * @param name - The cookie name
   * @param options - Cookie options for removal
   */
  remove(name: string, options?: ICookieOptions): void;

  /**
   * Get all cookies as an object
   * @returns Object containing all cookies
   */
  getAll(): Record<string, any>;
}
