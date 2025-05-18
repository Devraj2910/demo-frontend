'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from './presentation/components/Sidebar';
import AdminDashboard from './presentation/components/AdminDashboard';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('requests');

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className='flex-1 overflow-auto p-4'>
        <AdminDashboard activeSection={activeSection} />
      </main>
    </div>
  );
}
