import { useState, useEffect, useCallback } from 'react';
import { IStorageService, ICookieService } from '../../core/interfaces/storageService';
import { StorageServiceFactory } from '../../infrastructure/services/storageServiceFactory';

/**
 * Custom hook for using storage (localStorage, cookies)
 * Provides a React-friendly interface with state management
 *
 * @param key - The storage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Storage options
 * @returns [storedValue, setValue, removeValue] tuple
 */
export function useStorage<T>(
  key: string,
  initialValue: T,
  options: {
    prefix?: string;
    storage?: 'local' | 'cookie' | 'preferred';
  } = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const { prefix = '', storage = 'preferred' } = options;

  // Get the appropriate storage service
  const getStorageService = useCallback((): IStorageService => {
    switch (storage) {
      case 'local':
        return StorageServiceFactory.getLocalStorage(prefix);
      case 'cookie':
        return StorageServiceFactory.getCookieService(prefix);
      case 'preferred':
      default:
        return StorageServiceFactory.getPreferredStorage(prefix);
    }
  }, [prefix, storage]);

  const storageService = getStorageService();

  // Initialize state
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get stored value or use initial value
      return storageService.get<T>(key, initialValue) ?? initialValue;
    } catch (error) {
      console.error(`Error reading from storage: ${error}`);
      return initialValue;
    }
  });

  // Update state and storage when value changes
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Handle function updates
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save to state
        setStoredValue(valueToStore);

        // Save to storage
        storageService.set(key, valueToStore);
      } catch (error) {
        console.error(`Error writing to storage: ${error}`);
      }
    },
    [key, storedValue, storageService]
  );

  // Remove value from storage
  const removeValue = useCallback(() => {
    try {
      storageService.remove(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing from storage: ${error}`);
    }
  }, [key, initialValue, storageService]);

  // Sync state with storage when key changes
  useEffect(() => {
    const value = storageService.get<T>(key, initialValue) ?? initialValue;
    setStoredValue(value);
  }, [key, initialValue, storageService]);

  return [storedValue, setValue, removeValue];
}

/**
 * Custom hook for using localStorage
 * Wrapper around useStorage with localStorage preference
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  prefix: string = ''
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  return useStorage(key, initialValue, { storage: 'local', prefix });
}

/**
 * Custom hook for using cookies
 * Wrapper around useStorage with cookie preference
 */
export function useCookies<T>(
  key: string,
  initialValue: T,
  prefix: string = ''
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  return useStorage(key, initialValue, { storage: 'cookie', prefix });
}

/**
 * Get direct access to storage services
 * For use cases that need the full storage API rather than hook-based state
 */
export function useStorageServices(prefix: string = '') {
  const localStorage = StorageServiceFactory.getLocalStorage(prefix);
  const cookieService = StorageServiceFactory.getCookieService(prefix);
  const preferredStorage = StorageServiceFactory.getPreferredStorage(prefix);

  return {
    localStorage,
    cookieService,
    preferredStorage,
  };
}
