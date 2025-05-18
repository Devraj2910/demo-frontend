'use client';

import React from 'react';
import UserRequestsSection from './UserRequestsSection';

interface AdminDashboardProps {
  activeSection: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'requests':
        return <UserRequestsSection />;
      case 'teams':
        return (
          <div className='bg-white shadow rounded-lg p-6'>
            <h2 className='text-lg font-medium leading-6 text-gray-900 mb-4'>Team Management</h2>
            <p className='text-gray-500'>Team management features coming soon.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className='bg-white shadow rounded-lg p-6'>
            <h2 className='text-lg font-medium leading-6 text-gray-900 mb-4'>Analytics Dashboard</h2>
            <p className='text-gray-500'>Analytics features coming soon.</p>
          </div>
        );
      case 'settings':
        return (
          <div className='bg-white shadow rounded-lg p-6'>
            <h2 className='text-lg font-medium leading-6 text-gray-900 mb-4'>Admin Settings</h2>
            <p className='text-gray-500'>Settings features coming soon.</p>
          </div>
        );
      default:
        return <UserRequestsSection />;
    }
  };

  return (
    <div className='h-full'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h1>
        <p className='text-gray-500'>Manage your {activeSection} here.</p>
      </div>

      {renderSection()}
    </div>
  );
};

export default AdminDashboard;
