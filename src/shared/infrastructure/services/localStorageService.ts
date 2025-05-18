import { IStorageService } from '../../core/interfaces/storageService';

/**
 * LocalStorage service implementation
 * Provides a type-safe wrapper around localStorage with JSON serialization/deserialization
 */
export class LocalStorageService implements IStorageService {
  private isAvailable: boolean;

  constructor(private prefix: string = '') {
    // Check if localStorage is available
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Checks if localStorage is available in the current environment
   * @returns True if localStorage is available, false otherwise
   */
  private checkAvailability(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the prefixed key
   * @param key - The key to prefix
   * @returns The prefixed key
   */
  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  /**
   * Get a value from localStorage
   * @param key - The key to retrieve
   * @param defaultValue - Default value if key doesn't exist
   * @returns The stored value, defaultValue if not found, or null
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable) return defaultValue || null;

    try {
      const item = window.localStorage.getItem(this.getKey(key));

      if (item === null) {
        return defaultValue || null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting key "${key}" from localStorage:`, error);
      return defaultValue || null;
    }
  }

  /**
   * Set a value in localStorage
   * @param key - The key to store
   * @param value - The value to store
   */
  set<T>(key: string, value: T): void {
    if (!this.isAvailable) return;

    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error(`Error setting key "${key}" in localStorage:`, error);
    }
  }

  /**
   * Remove a value from localStorage
   * @param key - The key to remove
   */
  remove(key: string): void {
    if (!this.isAvailable) return;

    try {
      window.localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing key "${key}" from localStorage:`, error);
    }
  }

  /**
   * Clear all values from localStorage with the current prefix
   * This only clears values with the current prefix, not all localStorage
   */
  clear(): void {
    if (!this.isAvailable) return;

    try {
      if (this.prefix) {
        // Only clear items with the current prefix
        const prefixLength = this.prefix.length + 1; // +1 for the colon
        const keys = Object.keys(window.localStorage).filter((key) => key.startsWith(`${this.prefix}:`));

        keys.forEach((key) => window.localStorage.removeItem(key));
      } else {
        // Clear all localStorage if no prefix is set
        window.localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if a key exists in localStorage
   * @param key - The key to check
   * @returns True if key exists, false otherwise
   */
  has(key: string): boolean {
    if (!this.isAvailable) return false;

    return window.localStorage.getItem(this.getKey(key)) !== null;
  }
}
