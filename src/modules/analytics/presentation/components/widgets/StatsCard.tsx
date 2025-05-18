import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  index?: number;
  change?: number;
  subtitle?: string;
}

/**
 * StatsCard component for displaying summary statistics
 */
export default function StatsCard({ title, value, icon, color, index = 0, change, subtitle }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <div
        className={`h-2 ${color.includes('bg-gradient') ? color : `bg-${color.split(' ')[0].substring(3)}-500`}`}
      ></div>
      <div className='p-5'>
        <div className='flex items-center justify-between mb-4'>
          <div className='min-w-0 pr-3 flex-1'>
            <p className='text-gray-500 text-sm font-medium uppercase tracking-wider truncate'>{title}</p>
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className='text-2xl sm:text-3xl font-bold text-gray-800 mt-1 truncate'
            >
              {value}
            </motion.p>
            {subtitle && <p className='text-xs text-gray-500 mt-1 truncate'>{subtitle}</p>}
          </div>
          <div className={`p-3 sm:p-4 rounded-lg ${color} flex-shrink-0`}>{icon}</div>
        </div>

        {change !== undefined && (
          <div className='flex items-center mt-2'>
            {change >= 0 ? (
              <div className='flex items-center text-green-600 text-xs font-medium'>
                <svg className='w-4 h-4 mr-1 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 10l7-7m0 0l7 7m-7-7v18' />
                </svg>
                <span className='truncate'>{change}% increase</span>
              </div>
            ) : (
              <div className='flex items-center text-red-600 text-xs font-medium'>
                <svg className='w-4 h-4 mr-1 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
                <span className='truncate'>{Math.abs(change)}% decrease</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
