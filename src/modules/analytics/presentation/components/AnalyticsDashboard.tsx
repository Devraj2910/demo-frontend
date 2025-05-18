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
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative'>
      {/* Dynamic background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob'></div>
        <div className='absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000'></div>
      </div>

      {/* Content container with subtle glass effect */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10'>
        <div className='space-y-12'>
          <DashboardHeader />
          <TimePeriodFilter timePeriod={timePeriod} setTimePeriod={setTimePeriod} TIME_PERIODS={TIME_PERIODS} />
          <StatsCardsSection dashboardData={dashboardData} summary={summary} />
          <ChartsFirstRow chartData={chartData} chartOptions={chartOptions} />
          <ChartsSecondRow chartData={chartData} chartOptions={chartOptions} />
          <UserRankingsSection dashboardData={dashboardData} />
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
