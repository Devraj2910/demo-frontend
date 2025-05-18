'use client';

import React, { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUserRequests } from '../hooks/useUserRequests';
import { TUserRequest } from '../../core/types/adminTypes';

const UserRequestsSection: React.FC = () => {
  const { userRequests, loading, error, processRequest, refreshRequests } = useUserRequests();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleApproveRequest = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    const success = await processRequest(userId, 'approved');
    if (!success) {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    const success = await processRequest(userId, 'declined');
    if (!success) {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-100 p-4 rounded-md mb-4'>
        <p className='text-red-700'>{error}</p>
        <button onClick={refreshRequests} className='mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
          Try Again
        </button>
      </div>
    );
  }

  if (userRequests.length === 0) {
    return (
      <div className='text-center py-10'>
        <h3 className='text-lg font-medium text-gray-500'>No pending user requests</h3>
      </div>
    );
  }

  return (
    <div className='bg-white shadow rounded-lg'>
      <div className='px-4 py-5 sm:p-6'>
        <h2 className='text-lg font-medium leading-6 text-gray-900 mb-4'>Pending User Requests</h2>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  User
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Role
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Position
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Team
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Date
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {userRequests.map((request) => (
                <tr key={request.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {request.firstName} {request.lastName}
                        </div>
                        <div className='text-sm text-gray-500'>{request.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                      {request.role}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{request.position}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {request.teamName || 'Not assigned'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        disabled={processingIds.has(request.id)}
                        className={`inline-flex items-center p-2 rounded-full ${
                          processingIds.has(request.id)
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        <CheckIcon className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={processingIds.has(request.id)}
                        className={`inline-flex items-center p-2 rounded-full ${
                          processingIds.has(request.id)
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        <XMarkIcon className='h-5 w-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserRequestsSection;
