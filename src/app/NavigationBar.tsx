'use client';

import { useAuth } from '@/clean-architecture/auth/AuthContext';
import Link from 'next/link';

export default function NavigationBar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link href='/' className='text-xl font-bold text-gray-800'>
                Digital Kudos
              </Link>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {isAuthenticated && (
                <>
                  <Link
                    href='/kudowall'
                    className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                  >
                    Kudos Wall
                  </Link>

                  {/* Admin and Tech Lead can see analytics */}
                  {user?.role !== 'team_member' && (
                    <Link
                      href='/analytics'
                      className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    >
                      Analytics
                    </Link>
                  )}

                  {/* Only Admin can manage users */}
                  {user?.role === 'admin' && (
                    <Link
                      href='/admin'
                      className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className='flex items-center'>
            {isAuthenticated ? (
              <div className='flex items-center space-x-4'>
                {user?.avatar && (
                  <img src={user.avatar} alt={user.name} className='h-8 w-8 rounded-full border border-gray-200' />
                )}
                <div className='text-sm'>
                  <span className='text-gray-700'>{user?.name}</span>
                  <span className='text-gray-400 text-xs ml-1'>({user?.role.replace('_', ' ')})</span>
                </div>
                <button onClick={logout} className='text-sm text-gray-500 hover:text-gray-700'>
                  Logout
                </button>

                {/* Only Admin and Tech Lead can create kudos */}
                {user?.role !== 'team_member' && (
                  <Link
                    href='/kudowall'
                    className='ml-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium'
                  >
                    Give Kudos
                  </Link>
                )}
              </div>
            ) : (
              <Link href='/login' className='text-indigo-600 hover:text-indigo-800 text-sm font-medium'>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
