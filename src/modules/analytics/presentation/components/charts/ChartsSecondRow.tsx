import React from 'react';
import { motion } from 'framer-motion';
import DonutChart from './DonutChart';

interface ChartsSecondRowProps {
  chartData: any;
  chartOptions: any;
}

/**
 * Charts section component for the second row
 */
const ChartsSecondRow: React.FC<ChartsSecondRowProps> = ({ chartData, chartOptions }) => {
  if (!chartData) return null;

  return (
    <div>
      {chartOptions && (
        <motion.div
          className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className='bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-800 flex items-center'>
                <svg
                  className='w-5 h-5 mr-2 text-purple-500 flex-shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                <span className='truncate'>Kudos by Title</span>
              </h3>
              <span className='text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm whitespace-nowrap ml-2 flex-shrink-0'>
                {chartData.titleAnalyticsChart.labels.length} Categories
              </span>
            </div>
          </div>
          <div className='p-5'>
            <div className='flex flex-col items-center'>
              <div className='w-full max-w-md mb-8'>
                <div className='flex justify-center'>
                  <div className='w-64'>
                    <DonutChart
                      data={chartData.titleAnalyticsChart}
                      options={{
                        ...chartOptions.doughnut,
                        maintainAspectRatio: true,
                        responsive: true,
                        plugins: {
                          ...chartOptions.doughnut.plugins,
                          shadow: false,
                          dropShadow: {
                            enabled: false,
                          },
                          legend: {
                            display: false,
                          },
                        },
                        elements: {
                          arc: {
                            borderWidth: 0,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 0,
                            shadowColor: 'transparent',
                          },
                        },
                      }}
                      title=''
                    />
                  </div>
                </div>
              </div>

              <div className='w-full max-w-md'>
                <h4 className='text-sm font-bold text-gray-700 mb-4 flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 mr-1 text-purple-500 flex-shrink-0'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                  <span className='truncate'>Category Distribution</span>
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {chartData.titleAnalyticsChart.labels.map((label: string, index: number) => {
                    // Calculate percentage
                    const total = chartData.titleAnalyticsChart.datasets[0].data.reduce(
                      (a: number, b: number) => a + b,
                      0
                    );
                    const value = chartData.titleAnalyticsChart.datasets[0].data[index];
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

                    return (
                      <motion.div
                        key={label}
                        className='flex items-center justify-between'
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <div className='flex items-center flex-1 min-w-0 mr-2'>
                          <div
                            className='w-3 h-3 rounded-full mr-2 flex-shrink-0'
                            style={{
                              backgroundColor: chartData.titleAnalyticsChart.datasets[0].backgroundColor[index],
                            }}
                          />
                          <span className='text-sm text-gray-700 font-medium truncate max-w-[150px]'>{label}</span>
                        </div>
                        <div className='flex items-center flex-shrink-0'>
                          <span className='text-sm font-bold text-gray-900 mr-2'>{value}</span>
                          <span className='text-xs text-gray-500 whitespace-nowrap'>({percentage}%)</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className='mt-8 text-xs text-gray-500 border-t border-gray-100 pt-4'>
              <p className='font-medium'>Recognition Analysis</p>
              <p className='mt-1 line-clamp-2'>
                Distribution of kudos across different categories reveals the primary areas of appreciation in your
                organization.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChartsSecondRow;
