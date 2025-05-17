import React from 'react';
import { motion } from 'framer-motion';
import { UserKudos } from '../../../domain/entities/AnalyticsData';

interface UserRankingListProps {
  title: string;
  users: UserKudos[];
  slideDirection?: 'left' | 'right';
}

/**
 * UserRankingList component for displaying top users
 */
export default function UserRankingList({ title, users, slideDirection = 'left' }: UserRankingListProps) {
  return (
    <div className='bg-white rounded-lg shadow'>
      <div className='px-6 py-5 border-b border-gray-200'>
        <h2 className='text-lg font-medium text-gray-900'>{title}</h2>
      </div>
      <div className='p-6'>
        <ul className='divide-y divide-gray-200'>
          {users.map((person, index) => (
            <motion.li
              key={person.name}
              initial={{ opacity: 0, x: slideDirection === 'left' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className='py-4 flex items-center'
            >
              <div className='flex-shrink-0 h-6 w-6 flex items-center justify-center'>
                <span className='text-gray-500 font-medium'>{index + 1}</span>
              </div>
              <div className='ml-3'>
                <img src={person.avatar} alt={person.name} className='h-10 w-10 rounded-full' />
              </div>
              <div className='ml-4 flex-1'>
                <p className='text-sm font-medium text-gray-900'>{person.name}</p>
                <p className='text-sm text-gray-500'>Team {person.team}</p>
              </div>
              <div className='ml-4'>
                <div className='text-sm font-medium text-indigo-600'>{person.count} kudos</div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
