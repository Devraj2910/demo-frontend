'use client';

import { useState, useEffect } from 'react';
import { TimePeriod, AnalyticsDashboardData, AnalyticsSummary } from '../../domain/entities/AnalyticsData';
import { GetDashboardStats } from '../../application/usecases/GetDashboardStats';
import { AnalyticsService } from '../../application/services/AnalyticsService';
import { analyticsApi } from '../../infrastructure/api/analyticsApi';
import { useAuth } from '@/modules/auth';
import { useRouter } from 'next/navigation';

// Chart.js types
interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }>;
}

interface ChartsData {
  monthlyTrendChart: ChartData;
  teamAnalyticsChart: ChartData;
  titleAnalyticsChart: ChartData;
}

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

  const { hasPermission, isAuthenticated } = useAuth();
  const router = useRouter();

  // Initialize dependencies
  const repository = analyticsApi.getRepository();
  const analyticsService = new AnalyticsService(repository);
  const getDashboardStats = new GetDashboardStats(analyticsService);

  // Check authentication and permissions
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (!hasPermission(['admin'])) {
      router.push('/kudowall');
    }
  }, [isAuthenticated, hasPermission, router]);

  // Fetch analytics data when time period changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getDashboardStats.execute(timePeriod);

        if (result.success && result.data) {
          setDashboardData(result.data.dashboardData);
          setSummary(result.data.summary);
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
  }, [timePeriod]);

  // Format data for chart.js
  const formatChartData = (): ChartsData | null => {
    if (!dashboardData) return null;

    // Format monthly analytics data for line chart
    const monthlyTrendChart: ChartData = {
      labels: dashboardData.monthlyAnalytics.map((item) => item.month),
      datasets: [
        {
          label: 'Active Users',
          data: dashboardData.monthlyAnalytics.map((item) => item.activeUsers),
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Cards Created',
          data: dashboardData.monthlyAnalytics.map((item) => item.cardsCreated),
          borderColor: 'rgba(244, 63, 94, 1)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Format team analytics data for bar chart
    const teamAnalyticsChart: ChartData = {
      labels: dashboardData.teamAnalytics.map((item) => item.name),
      datasets: [
        {
          label: 'Cards Count',
          data: dashboardData.teamAnalytics.map((item) => item.cardCount),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(79, 70, 229, 0.8)',
            'rgba(67, 56, 202, 0.8)',
            'rgba(55, 48, 163, 0.8)',
            'rgba(49, 46, 129, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Format title analytics data for donut chart
    const titleAnalyticsChart: ChartData = {
      labels: dashboardData.titleAnalytics.map((item) => item.title),
      datasets: [
        {
          label: 'Kudos Count',
          data: dashboardData.titleAnalytics.map((item) => item.count),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(244, 63, 94, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(20, 184, 166, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return {
      monthlyTrendChart,
      teamAnalyticsChart,
      titleAnalyticsChart,
    };
  };

  // Chart options
  const chartOptions = {
    line: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Monthly Activity',
        },
      },
      animation: {
        duration: 2000,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    bar: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Team Analytics',
        },
      },
      animation: {
        duration: 1500,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    doughnut: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        title: {
          display: true,
          text: 'Kudos by Title',
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 2000,
      },
    },
  };

  return {
    dashboardData,
    summary,
    chartData: formatChartData(),
    chartOptions,
    isLoading,
    error,
    timePeriod,
    setTimePeriod,
    TIME_PERIODS: ['Last Week', 'Last Month', 'Last Quarter', 'Last Year', 'All Time'] as TimePeriod[],
  };
}
