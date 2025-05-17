import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

interface DonutChartProps {
  data: any;
  options: any;
  title?: string;
}

/**
 * DonutChart component for displaying doughnut charts
 */
export default function DonutChart({ data, options, title = 'Donut Chart' }: DonutChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className='bg-white rounded-lg shadow p-6'
    >
      <h2 className='text-lg font-medium text-gray-900 mb-4'>{title}</h2>
      <div className='h-64 flex items-center justify-center'>
        <Doughnut data={data} options={options} />
      </div>
    </motion.div>
  );
}
