import React from 'react';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

interface BarChartProps {
  data: any;
  options: any;
  title?: string;
}

/**
 * BarChart component for displaying bar charts
 */
export default function BarChart({ data, options, title = 'Bar Chart' }: BarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className='bg-white rounded-lg shadow p-6'
    >
      <h2 className='text-lg font-medium text-gray-900 mb-4'>{title}</h2>
      <div className='h-64'>
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
}
