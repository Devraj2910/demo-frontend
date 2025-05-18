import React from 'react';
import { motion } from 'framer-motion';

interface TimePeriodFilterProps {
  timePeriod: string;
  setTimePeriod: React.Dispatch<React.SetStateAction<any>>;
  TIME_PERIODS: string[];
}

/**
 * Time period filter component
 */
const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({ timePeriod, setTimePeriod, TIME_PERIODS }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className='mb-8 flex justify-end'
  >
    <div className='relative inline-block group'>
      <label htmlFor='time-period' className='block text-sm font-medium text-gray-500 mb-2'>
        <div className='flex items-center space-x-1'>
          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <span>Time Period</span>
        </div>
      </label>
      <div className='relative'>
        <select
          id='time-period'
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className='appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:shadow group-hover:border-indigo-400'
        >
          {TIME_PERIODS.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
          <svg className='h-5 w-5 text-gray-500' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </div>
    </div>
  </motion.div>
);

export default TimePeriodFilter;
