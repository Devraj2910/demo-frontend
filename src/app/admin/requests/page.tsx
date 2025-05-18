'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UserRequestsSection from '../presentation/components/UserRequestsSection';

export default function RequestsPage() {
  const router = useRouter();

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-6'>
        <button onClick={() => router.push('/admin')} className='text-blue-600 hover:text-blue-800'>
          &larr; Back to Admin Dashboard
        </button>
        <h1 className='text-2xl font-bold mt-2'>User Requests Management</h1>
        <p className='text-gray-600'>Approve or reject user access requests</p>
      </div>

      <UserRequestsSection />
    </div>
  );
}
