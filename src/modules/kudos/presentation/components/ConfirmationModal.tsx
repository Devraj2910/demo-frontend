'use client';
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  confirmButtonColor?: 'red' | 'blue' | 'green';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A reusable confirmation modal component
 */
export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmButtonText,
  cancelButtonText = 'Cancel',
  confirmButtonColor = 'red',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  // Determine button color classes based on the confirmButtonColor prop
  const buttonColorClasses = {
    red: 'bg-red-600 hover:bg-red-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
  };

  const confirmButtonClasses = `px-3 py-1.5 rounded transition-colors ${buttonColorClasses[confirmButtonColor]}`;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-lg max-w-md w-full p-5 mx-4' onClick={(e) => e.stopPropagation()}>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
        <p className='text-gray-700 mb-6'>{message}</p>

        <div className='flex justify-end gap-3'>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className='px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors'
          >
            {cancelButtonText}
          </button>
          <button onClick={onConfirm} disabled={isLoading} className={confirmButtonClasses}>
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              confirmButtonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
