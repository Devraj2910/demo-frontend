'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from './presentation/components/Sidebar';
import AdminDashboard from './presentation/components/AdminDashboard';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('requests');

  return (
    <div className='flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative'>
      {/* Dynamic background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob'></div>
        <div className='absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000'></div>
      </div>

      {/* Content container */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className='flex-1 overflow-auto p-4 relative z-10'>
        <AdminDashboard activeSection={activeSection} />
      </main>

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
