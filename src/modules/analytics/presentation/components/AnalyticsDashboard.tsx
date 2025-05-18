'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth';
import { useAnalytics } from '../hooks/useAnalytics';

// Import ChartJS and required components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Import component layouts
import LoadingView from './layouts/LoadingView';
import ErrorView from './layouts/ErrorView';
import DashboardHeader from './layouts/DashboardHeader';
import TimePeriodFilter from './widgets/TimePeriodFilter';
import StatsCardsSection from './widgets/StatsCardsSection';
import ChartsFirstRow from './charts/ChartsFirstRow';
import ChartsSecondRow from './charts/ChartsSecondRow';
import UserRankingsSection from './widgets/UserRankingsSection';

/**
 * Main Analytics Dashboard component
 * Integrates all the analytics visualizations
 */
export default function AnalyticsDashboard() {
  const { dashboardData, summary, chartData, chartOptions, isLoading, error, timePeriod, setTimePeriod, TIME_PERIODS } =
    useAnalytics();

  // Redirect if not authenticated or doesn't have permission
  // React.useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/');
  //   } else if (!hasPermission(['admin'])) {
  //     router.push('/kudowall');
  //   }
  // }, [isAuthenticated, hasPermission, router]);

  // Loading state
  if (isLoading) {
    return <LoadingView />;
  }

  // Error state
  if (error || !dashboardData) {
    return <ErrorView error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='space-y-12'>
          <DashboardHeader />
          <TimePeriodFilter timePeriod={timePeriod} setTimePeriod={setTimePeriod} TIME_PERIODS={TIME_PERIODS} />
          <StatsCardsSection dashboardData={dashboardData} summary={summary} />
          <ChartsFirstRow chartData={chartData} chartOptions={chartOptions} />
          <ChartsSecondRow chartData={chartData} chartOptions={chartOptions} />
          <UserRankingsSection dashboardData={dashboardData} />
        </div>
      </div>
    </div>
  );
}
