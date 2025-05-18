import { analyticsApi } from '../../infrastructure/api/analyticsApi';
import { AnalyticsService } from '../../application/services/AnalyticsService';
import { GetDashboardStats } from '../../application/usecases/GetDashboardStats';
import { ChartFormatterService } from './ChartFormatterService';

// Simple DI container
class DIContainer {
  private services: Record<string, any> = {};
  private initialized = false;

  register(name: string, instance: any): void {
    this.services[name] = instance;
  }

  get<T>(name: string): T {
    if (!this.services[name]) {
      // If services aren't registered yet, initialize them first
      if (!this.initialized) {
        setupAnalyticsServices();
        if (!this.services[name]) {
          throw new Error(`Service ${name} not registered even after initialization`);
        }
      } else {
        throw new Error(`Service ${name} not registered`);
      }
    }
    return this.services[name] as T;
  }

  setInitialized(): void {
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export a singleton instance
export const analyticsContainer = new DIContainer();

/**
 * Setup function to initialize all analytics services
 * This should be called when the application starts
 */
export function setupAnalyticsServices(): void {
  // Don't initialize twice
  if (analyticsContainer.isInitialized()) {
    return;
  }

  try {
    // Get repository from API
    const repository = analyticsApi.getRepository();

    // Register domain and application services
    analyticsContainer.register('AnalyticsRepository', repository);
    analyticsContainer.register('AnalyticsService', new AnalyticsService(repository));
    analyticsContainer.register('ChartFormatterService', new ChartFormatterService());

    // Register use cases
    analyticsContainer.register('GetDashboardStats', new GetDashboardStats(analyticsContainer.get('AnalyticsService')));

    // Mark container as initialized
    analyticsContainer.setInitialized();
    console.log('Analytics services registered successfully');
  } catch (error) {
    console.error('Error initializing analytics services:', error);
  }
}

/**
 * Initialize the analytics module
 * This should be called at application startup
 */
export function initializeAnalyticsModule(): void {
  setupAnalyticsServices();
  console.log('Analytics module initialized');
}

/**
 * Get all analytics services in a convenient object
 * This can be used in hooks or components
 */
export function getAnalyticsServices() {
  // Ensure services are initialized before accessing them
  if (!analyticsContainer.isInitialized()) {
    setupAnalyticsServices();
  }

  try {
    return {
      analyticsService: analyticsContainer.get<AnalyticsService>('AnalyticsService'),
      chartFormatter: analyticsContainer.get<ChartFormatterService>('ChartFormatterService'),
      getDashboardStats: analyticsContainer.get<GetDashboardStats>('GetDashboardStats'),
    };
  } catch (error) {
    console.error('Error getting analytics services:', error);
    // Return empty objects as fallback
    return {
      analyticsService: null,
      chartFormatter: null,
      getDashboardStats: null,
    };
  }
}
