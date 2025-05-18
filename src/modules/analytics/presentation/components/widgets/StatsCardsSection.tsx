import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from './StatsCard';

interface StatsCardsSectionProps {
  dashboardData: any;
  summary: any;
}

/**
 * Stats cards section component
 */
const StatsCardsSection: React.FC<StatsCardsSectionProps> = ({ dashboardData, summary }) => {
  // Icons for stats cards
  const icons = {
    kudos: (
      <svg className='h-9 w-9' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
      </svg>
    ),
    users: (
      <svg className='h-9 w-9' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
        />
      </svg>
    ),
    engagement: (
      <svg className='h-9 w-9' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        />
      </svg>
    ),
  };

  // Example comparison data (increase percentages) - replace with actual data
  const comparisonData = {
    kudos:
      dashboardData.cardVolume.previous > 0
        ? Math.round(
            ((dashboardData.cardVolume.total - dashboardData.cardVolume.previous) / dashboardData.cardVolume.previous) *
              100
          )
        : 100,
    users:
      dashboardData.activeUsers.previous > 0
        ? Math.round(
            ((dashboardData.activeUsers.activeUsers - dashboardData.activeUsers.previous) /
              dashboardData.activeUsers.previous) *
              100
          )
        : 100,
    engagement:
      summary?.previousEngagementRate > 0
        ? Math.round(
            ((summary?.engagementRate - summary?.previousEngagementRate) / summary?.previousEngagementRate) * 100
          )
        : 100,
  };

  // Comparison summary text
  const getComparisonText = () => {
    const avgChange = Math.round((comparisonData.kudos + comparisonData.users + comparisonData.engagement) / 3);
    if (avgChange > 20) return 'Significant growth across all metrics!';
    if (avgChange > 5) return 'Steady positive growth in engagement.';
    if (avgChange > 0) return 'Slight improvement from previous period.';
    if (avgChange === 0) return 'Metrics are stable with previous period.';
    return 'Potential areas for improvement identified.';
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-4'
      >
        <StatsCard
          title='Total Kudos'
          value={dashboardData.cardVolume.total}
          icon={icons.kudos}
          color='bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
          index={0}
          change={comparisonData.kudos}
          subtitle='Total recognition cards'
        />
        <StatsCard
          title='Active Users'
          value={dashboardData.activeUsers.activeUsers}
          icon={icons.users}
          color='bg-gradient-to-r from-green-500 to-green-600 text-white'
          index={1}
          change={comparisonData.users}
          subtitle='Employees engaging with platform'
        />
        <StatsCard
          title='Engagement Rate'
          value={`${summary?.engagementRate || 0}%`}
          icon={icons.engagement}
          color='bg-gradient-to-r from-purple-500 to-purple-600 text-white'
          index={2}
          change={comparisonData.engagement}
          subtitle='Overall platform activity'
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className='bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6'
      >
        <div className='flex items-center text-sm'>
          <div className='mr-3 bg-indigo-100 text-indigo-700 p-2 rounded-lg flex-shrink-0'>
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
            </svg>
          </div>
          <div className='min-w-0'>
            <p className='font-medium text-gray-700 truncate'>{getComparisonText()}</p>
            <p className='text-xs text-gray-500 mt-1'>Compared to previous period</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsCardsSection;
