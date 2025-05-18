import { IStorageService, ICookieService } from '../../core/interfaces/storageService';
import { LocalStorageService } from './localStorageService';
import { CookieService } from './cookieService';

/**
 * Factory for creating storage services
 * Provides access to different storage mechanisms with consistent interfaces
 */
export class StorageServiceFactory {
  private static localStorageInstances: Record<string, LocalStorageService> = {};
  private static cookieInstances: Record<string, CookieService> = {};

  /**
   * Get a localStorage service instance
   * @param prefix - Optional prefix for keys to prevent collisions
   * @returns LocalStorageService instance
   */
  static getLocalStorage(prefix: string = ''): IStorageService {
    const key = `localStorage:${prefix}`;

    if (!this.localStorageInstances[key]) {
      this.localStorageInstances[key] = new LocalStorageService(prefix);
    }

    return this.localStorageInstances[key];
  }

  /**
   * Get a cookie service instance
   * @param prefix - Optional prefix for cookie names to prevent collisions
   * @returns CookieService instance
   */
  static getCookieService(prefix: string = ''): ICookieService {
    const key = `cookie:${prefix}`;

    if (!this.cookieInstances[key]) {
      this.cookieInstances[key] = new CookieService(prefix);
    }

    return this.cookieInstances[key];
  }

  /**
   * Get the appropriate storage service based on environment and requirements
   * Prefer localStorage when available, fall back to cookies
   * @param prefix - Optional prefix for keys/names
   * @param forceType - Force specific storage type ('local' | 'cookie')
   * @returns Storage service instance
   */
  static getPreferredStorage(prefix: string = '', forceType?: 'local' | 'cookie'): IStorageService {
    // Force specific type if requested
    if (forceType === 'local') return this.getLocalStorage(prefix);
    if (forceType === 'cookie') return this.getCookieService(prefix);

    // Check if localStorage is available
    const isLocalStorageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

    // Use localStorage if available, otherwise cookies
    return isLocalStorageAvailable ? this.getLocalStorage(prefix) : this.getCookieService(prefix);
  }
}
