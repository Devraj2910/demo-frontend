'use client';

import React from 'react';
import Link from 'next/link';
import { UserIcon, ClipboardDocumentCheckIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'requests', name: 'User Requests', icon: UserIcon },
    { id: 'teams', name: 'Team Management', icon: ClipboardDocumentCheckIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className='w-64 bg-gray-800 text-white h-full'>
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.id} className='mb-2'>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full p-3 rounded-md transition-colors ${
                    activeSection === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <item.icon className='h-5 w-5 mr-3' />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
