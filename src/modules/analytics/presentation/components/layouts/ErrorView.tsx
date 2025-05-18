import React from 'react';

interface ErrorViewProps {
  error: string | null;
  onRetry: () => void;
}

/**
 * Error component for the dashboard
 */
const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => (
  <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
    <div className='text-center max-w-md px-4'>
      <div className='text-red-500 text-5xl mb-4'>
        <svg className='h-16 w-16 mx-auto' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
      </div>
      <h2 className='text-2xl font-bold text-gray-800 mb-2'>Error Loading Data</h2>
      <p className='text-gray-600'>{error || 'Something went wrong. Please try again later.'}</p>
      <button
        onClick={onRetry}
        className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'
      >
        Retry
      </button>
    </div>
  </div>
);

export default ErrorView;
