import { useState, useEffect } from 'react';
import { TimePeriod } from '../../domain/entities/AnalyticsData';
import { GetDashboardStats } from '../../application/usecases/GetDashboardStats';
import { AnalyticsService } from '../../application/services/AnalyticsService';
import { analyticsApi } from '../../infrastructure/api/analyticsApi';

/**
 * Custom hook for accessing analytics data
 * Connects the UI to the application and domain layers
 */
export function useAnalytics() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('Last Month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Initialize dependencies
  const repository = analyticsApi.getRepository();
  const analyticsService = new AnalyticsService(repository);
  const getDashboardStats = new GetDashboardStats(analyticsService);

  // Fetch analytics data when time period changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getDashboardStats.execute(timePeriod);

        if (result.success) {
          setData(result.data);
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
  const formatChartData = () => {
    if (!data) return null;

    // Format trend data for line chart
    const trendChartData = {
      labels: data.trendData.map((item: any) => item.period),
      datasets: [
        {
          label: 'Kudos Sent',
          data: data.trendData.map((item: any) => item.kudosSent),
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'New Users',
          data: data.trendData.map((item: any) => item.newUsers),
          borderColor: 'rgba(244, 63, 94, 1)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Format weekly activity data for bar chart
    const activityChartData = {
      labels: data.weeklyActivity.map((item: any) => item.day),
      datasets: [
        {
          label: 'Kudos Activity',
          data: data.weeklyActivity.map((item: any) => item.count),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(79, 70, 229, 0.8)',
            'rgba(67, 56, 202, 0.8)',
            'rgba(55, 48, 163, 0.8)',
            'rgba(49, 46, 129, 0.8)',
            'rgba(30, 58, 138, 0.8)',
            'rgba(30, 64, 175, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Format team data for bar chart
    const teamChartData = {
      labels: data.teamData.map((item: any) => item.team),
      datasets: [
        {
          label: 'Kudos Received',
          data: data.teamData.map((item: any) => item.count),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1,
        },
      ],
    };

    // Format category data for donut chart
    const categoryChartData = {
      labels: data.categoryData.map((item: any) => item.category),
      datasets: [
        {
          data: data.categoryData.map((item: any) => item.count),
          backgroundColor: data.categoryData.map((item: any) => item.color),
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 2,
        },
      ],
    };

    return {
      trendChartData,
      activityChartData,
      teamChartData,
      categoryChartData,
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
          text: 'Monthly Kudos Trend',
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
          text: 'Weekly Activity',
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
          text: 'Category Distribution',
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
    data,
    chartData: formatChartData(),
    chartOptions,
    isLoading,
    error,
    timePeriod,
    setTimePeriod,
    TIME_PERIODS: ['Last Week', 'Last Month', 'Last Quarter', 'Last Year', 'All Time'] as TimePeriod[],
  };
}
