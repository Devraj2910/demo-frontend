import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

interface TrendChartProps {
  data: any;
  options: any;
  title?: string;
}

/**
 * TrendChart component for line charts
 */
export default function TrendChart({ data, options, title = 'Trend Over Time' }: TrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className='bg-white rounded-lg shadow p-6'
    >
      <h2 className='text-lg font-medium text-gray-900 mb-4'>{title}</h2>
      <div className='h-64'>
        <Line data={data} options={options} />
      </div>
    </motion.div>
  );
}
