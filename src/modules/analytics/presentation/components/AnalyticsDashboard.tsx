import React from 'react';
import { motion } from 'framer-motion';
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

// Import components
import StatsCard from './widgets/StatsCard';
import UserRankingList from './widgets/UserRankingList';
import TrendChart from './charts/TrendChart';
import BarChart from './charts/BarChart';
import DonutChart from './charts/DonutChart';

/**
 * Main Analytics Dashboard component
 * Integrates all the analytics visualizations
 */
export default function AnalyticsDashboard() {
  const { hasPermission, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data, chartData, chartOptions, isLoading, error, timePeriod, setTimePeriod, TIME_PERIODS } = useAnalytics();

  // Redirect if not authenticated or doesn't have permission
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (!hasPermission(['admin', 'tech_lead'])) {
      router.push('/kudowall');
    }
  }, [isAuthenticated, hasPermission, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md px-4'>
          <div className='text-red-500 text-5xl mb-4'>
            <svg className='h-16 w-16 mx-auto' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Error Loading Data</h2>
          <p className='text-gray-600'>{error || 'Something went wrong. Please try again later.'}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Icons for stats cards
  const icons = {
    kudos: (
      <svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
      </svg>
    ),
    users: (
      <svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
        />
      </svg>
    ),
    engagement: (
      <svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        />
      </svg>
    ),
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold text-gray-900'>Kudos Analytics</h1>
          <p className='mt-2 text-gray-600'>Insights and statistics about recognition across teams</p>
        </motion.div>

        {/* Time period filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='mb-8 flex justify-end'
        >
          <div className='relative inline-block'>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as any)}
              className='appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            >
              {TIME_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
        >
          <StatsCard
            title='Total Kudos'
            value={data.summary.totalKudos}
            icon={icons.kudos}
            color='bg-indigo-100 text-indigo-600'
            index={0}
          />
          <StatsCard
            title='Active Users'
            value={data.summary.activeUsers}
            icon={icons.users}
            color='bg-green-100 text-green-600'
            index={1}
          />
          <StatsCard
            title='Engagement Rate'
            value={`${data.summary.engagementRate}%`}
            icon={icons.engagement}
            color='bg-purple-100 text-purple-600'
            index={2}
          />
        </motion.div>

        {/* Charts - First Row */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {chartData && (
            <>
              <TrendChart data={chartData.trendChartData} options={chartOptions.line} title='Trend Over Time' />
              <BarChart data={chartData.activityChartData} options={chartOptions.bar} title='Weekly Activity' />
            </>
          )}
        </div>

        {/* Charts - Second Row */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {chartData && (
            <>
              <BarChart data={chartData.teamChartData} options={chartOptions.bar} title='Team Leaderboard' />
              <DonutChart
                data={chartData.categoryChartData}
                options={chartOptions.doughnut}
                title='Category Distribution'
              />
            </>
          )}
        </div>

        {/* User Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='grid grid-cols-1 lg:grid-cols-2 gap-8'
        >
          {data && (
            <>
              <UserRankingList title='Top Kudos Receivers' users={data.topReceivers} slideDirection='left' />
              <UserRankingList title='Top Kudos Givers' users={data.topGivers} slideDirection='right' />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
