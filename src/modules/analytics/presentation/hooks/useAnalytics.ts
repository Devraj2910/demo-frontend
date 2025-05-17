'use client';

import { useState, useEffect } from 'react';
import { TimePeriod, AnalyticsDashboardData, AnalyticsSummary } from '../../domain/entities/AnalyticsData';
import { AnalyticsChartsData, AnalyticsChartOptions } from '../../core/types/ChartTypes';
import { getAnalyticsServices, initializeAnalyticsModule } from '../../core/services/setupAnalyticsService';
import { useAuth } from '@/modules/auth';
import { useRouter } from 'next/navigation';

// Constants
export const TIME_PERIODS: TimePeriod[] = ['Last Week', 'Last Month', 'Last Quarter', 'Last Year', 'All Time'];

/**
 * Custom hook for accessing analytics data
 * Connects the UI to the application and domain layers
 */
export function useAnalytics() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('Last Month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<AnalyticsChartsData | null>(null);
  const [chartOptions, setChartOptions] = useState<AnalyticsChartOptions | null>(null);
  const [services, setServices] = useState<ReturnType<typeof getAnalyticsServices> | null>(null);

  const { hasPermission, isAuthenticated } = useAuth();
  const router = useRouter();

  // Initialize services
  useEffect(() => {
    // Ensure analytics module is initialized
    initializeAnalyticsModule();

    // Get services
    setServices(getAnalyticsServices());
  }, []);

  // Check authentication and permissions
  useEffect(() => {
    // Skip redirects when refreshing the page
    const isPageRefresh = () => {
      if (typeof window === 'undefined') return false;

      const analyticsPageAccessed = sessionStorage.getItem('analytics_page_accessed') === 'true';
      sessionStorage.setItem('analytics_page_accessed', 'true');

      return analyticsPageAccessed;
    };

    // Only redirect if we're not on a page refresh
    if (!isAuthenticated && !isPageRefresh()) {
      router.push('/');
    } else if (isAuthenticated && !hasPermission(['admin']) && !isPageRefresh()) {
      router.push('/kudowall');
    }
  }, [isAuthenticated, hasPermission, router]);

  // Fetch analytics data when time period changes or services become available
  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch if services aren't available yet
      if (!services || !services.getDashboardStats) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await services.getDashboardStats.execute(timePeriod);

        if (result.success && result.data) {
          const { dashboardData: newData, summary: newSummary } = result.data;
          setDashboardData(newData);
          setSummary(newSummary);

          // Format chart data using the chart formatter service
          if (services.chartFormatter) {
            setChartData(services.chartFormatter.formatChartData(newData));
            setChartOptions(services.chartFormatter.getChartOptions());
          }
        } else {
          setError(result.error || 'An error occurred while fetching data');
        }
      } catch (err) {
        setError('Unexpected error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, services]);

  return {
    // State
    dashboardData,
    summary,
    chartData,
    chartOptions,
    isLoading,
    error,

    // Time period control
    timePeriod,
    setTimePeriod,
    TIME_PERIODS,
  };
}
