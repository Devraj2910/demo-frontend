import React from 'react';
import { motion } from 'framer-motion';

/**
 * Dashboard header component
 */
const DashboardHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='mb-10'
  >
    <div className='relative'>
      <div className='flex items-center mb-2'>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-3'
        >
          <span className='w-2 h-2 rounded-full bg-indigo-400 mr-1.5 animate-pulse'></span>
          Dashboard
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className='text-xs text-gray-500'
        >
          Updated just now
        </motion.span>
      </div>

      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500'
      >
        Kudos Analytics
      </motion.h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className='h-1 w-24 bg-gradient-to-r from-indigo-500 to-blue-500 mt-3 origin-left rounded-full'
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='mt-4 text-lg text-gray-600 max-w-2xl'
      >
        Comprehensive insights and statistics about recognition across teams
      </motion.p>
    </div>
  </motion.div>
);

export default DashboardHeader;
