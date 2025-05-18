import React from 'react';
import TrendChart from './TrendChart';
import BarChart from './BarChart';

interface ChartsFirstRowProps {
  chartData: any;
  chartOptions: any;
}

/**
 * Charts section component for the first row
 */
const ChartsFirstRow: React.FC<ChartsFirstRowProps> = ({ chartData, chartOptions }) => {
  if (!chartData) return null;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
      {chartOptions && (
        <>
          <div className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100'>
            <div className='bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-bold text-gray-800 flex items-center'>
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
                      d='M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
                    />
                  </svg>
                  <span className='truncate'>Monthly Activity</span>
                </h3>
                <span className='text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm whitespace-nowrap ml-2'>
                  {chartData?.monthlyTrendChart?.datasets?.[1]?.data?.reduce((a: number, b: number) => a + b, 0) || 0}{' '}
                  Total Kudos
                </span>
              </div>
            </div>
            <div className='p-6'>
              <div className='h-72'>
                <TrendChart data={chartData.monthlyTrendChart} options={chartOptions.line} title='Monthly Activity' />
              </div>
              <div className='mt-4 flex justify-between items-center text-xs text-gray-500 border-t px-8 border-gray-100 pt-5'>
                <div className='flex items-center'>
                  <div className='w-3 h-3 rounded-full bg-indigo-500 mr-1'></div>
                  <span>Active Users</span>
                </div>
                <div className='flex items-center'>
                  <div className='w-3 h-3 rounded-full bg-red-500 mr-1'></div>
                  <span>Cards Created</span>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100'>
            <div className='bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-bold text-gray-800 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2 text-blue-500 flex-shrink-0'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                  <span className='truncate'>Team Leaderboard</span>
                </h3>
                <span className='text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm whitespace-nowrap ml-2'>
                  {chartData?.teamAnalyticsChart?.labels?.length || 0} Teams
                </span>
              </div>
            </div>
            <div className='p-6'>
              <div className='h-72'>
                <BarChart data={chartData.teamAnalyticsChart} options={chartOptions.bar} title='Team Leaderboard' />
              </div>
              <div className='mt-4 text-xs text-gray-500 border-t border-gray-100 pt-12'>
                <p className='font-medium'>Team Performance Analysis</p>
                <p className='mt-1 line-clamp-2'>
                  Distribution of kudos across different teams shows collaborative recognition patterns.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartsFirstRow;
