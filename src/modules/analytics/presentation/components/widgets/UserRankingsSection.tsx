import React from 'react';
import { motion } from 'framer-motion';
import UserRankingList from './UserRankingList';
import { getFullName } from '@/modules/analytics/core/utils/helpers';

interface UserRankingsSectionProps {
  dashboardData: any;
}

/**
 * User rankings section component
 */
const UserRankingsSection: React.FC<UserRankingsSectionProps> = ({ dashboardData }) => {
  if (!dashboardData) return null;

  // Format user data for the ranking lists
  const topReceivers = dashboardData.topReceivers.map((user: any) => ({
    id: user.id,
    name: getFullName(user.firstName, user.lastName),
    count: user.cardCount,
    // Placeholder for avatar and team since API doesn't provide them
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getFullName(user.firstName, user.lastName)
    )}&background=random`,
    team: 'Team Member',
  }));

  const topGivers = dashboardData.topCreators.map((user: any) => ({
    id: user.id,
    name: getFullName(user.firstName, user.lastName),
    count: user.cardCount,
    // Placeholder for avatar and team since API doesn't provide them
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getFullName(user.firstName, user.lastName)
    )}&background=random`,
    team: 'Team Member',
  }));

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='mb-6'
      >
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Recognition Leaders</h2>
        <p className='text-gray-600'>Top contributors who are actively engaging with the recognition platform.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='grid grid-cols-1 lg:grid-cols-2 gap-8'
      >
        <UserRankingList title='Top Kudos Receivers' users={topReceivers} slideDirection='left' />
        <UserRankingList title='Top Kudos Givers' users={topGivers} slideDirection='right' />
      </motion.div>
    </div>
  );
};

export default UserRankingsSection;
