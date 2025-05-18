import React from 'react';
import { motion } from 'framer-motion';

// Define the type locally since it's not exported from the domain
interface UserKudos {
  id: string;
  name: string;
  count: number;
  avatar: string;
  team: string;
}

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
    <motion.div
      className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className='px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'>
        <h2 className='text-lg font-bold text-gray-900 flex items-center'>
          {slideDirection === 'left' ? (
            <svg
              className='w-5 h-5 mr-2 text-indigo-500 flex-shrink-0'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          ) : (
            <svg
              className='w-5 h-5 mr-2 text-green-500 flex-shrink-0'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          )}
          <span className='truncate'>{title}</span>
        </h2>
      </div>
      <div className='p-6'>
        <ul className='divide-y divide-gray-200'>
          {users.map((person, index) => (
            <motion.li
              key={person.id || index}
              initial={{ opacity: 0, x: slideDirection === 'left' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className='py-4 flex items-center'
            >
              <div
                className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span className='font-medium text-sm'>{index + 1}</span>
              </div>
              <div className='ml-3 flex-shrink-0'>
                <img
                  src={person.avatar}
                  alt={person.name}
                  className='h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm'
                />
              </div>
              <div className='ml-4 flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>{person.name}</p>
                <p className='text-xs text-gray-500 truncate'>Team {person.team}</p>
              </div>
              <div className='ml-4 flex-shrink-0'>
                <div className='text-sm font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full whitespace-nowrap'>
                  {person.count} kudos
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
