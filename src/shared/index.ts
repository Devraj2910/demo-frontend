// Export interfaces
export * from './core/interfaces/storageService';

// Export services
export { LocalStorageService } from './infrastructure/services/localStorageService';
export { CookieService } from './infrastructure/services/cookieService';
export { StorageServiceFactory } from './infrastructure/services/storageServiceFactory';

// Export hooks
export { useStorage, useLocalStorage, useCookies, useStorageServices } from './presentation/hooks/useStorage';
