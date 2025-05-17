import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  index?: number;
}

/**
 * StatsCard component for displaying summary statistics
 */
export default function StatsCard({ title, value, icon, color, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className='bg-white rounded-lg shadow p-6'
    >
      <div className='flex items-center'>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <div className='ml-5'>
          <p className='text-gray-500 text-sm'>{title}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className='text-2xl font-semibold text-gray-800'
          >
            {value}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
