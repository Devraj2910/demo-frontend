'use client';

import { useAuth } from '@/modules/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NavigationBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const isKudosWallPage = pathname === '/kudowall';
  const [scrolled, setScrolled] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white border-b border-gray-100 fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link
                href='/'
                className='text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 hover:from-purple-600 hover:to-indigo-600'
              >
                Digital Kudos
              </Link>
            </div>
            <div className='hidden sm:ml-8 sm:flex sm:space-x-8'>
              {isAuthenticated && (
                <>
                  <Link
                    href='/kudowall'
                    className={`${
                      isKudosWallPage
                        ? 'border-indigo-500 text-indigo-600 font-medium'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm transition-all duration-200`}
                  >
                    <svg
                      className={`w-4 h-4 mr-1.5 ${isKudosWallPage ? 'text-indigo-500' : 'text-gray-400'}`}
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                      />
                    </svg>
                    Kudos Wall
                  </Link>

                  {/* Both user and admin can see analytics */}
                  <Link
                    href='/analytics'
                    className={`${
                      pathname === '/analytics'
                        ? 'border-indigo-500 text-indigo-600 font-medium'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm transition-all duration-200`}
                  >
                    <svg
                      className={`w-4 h-4 mr-1.5 ${pathname === '/analytics' ? 'text-indigo-500' : 'text-gray-400'}`}
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                    Analytics
                  </Link>

                  {/* Only Admin can manage users */}
                  {user?.role === 'admin' && (
                    <Link
                      href='/admin'
                      className={`${
                        pathname === '/admin'
                          ? 'border-indigo-500 text-indigo-600 font-medium'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm transition-all duration-200`}
                    >
                      <svg
                        className={`w-4 h-4 mr-1.5 ${pathname === '/admin' ? 'text-indigo-500' : 'text-gray-400'}`}
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                        />
                      </svg>
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className='flex items-center'>
            {isAuthenticated ? (
              <div className='flex items-center space-x-5'>
                <div className='flex items-center gap-3 pr-2'>
                  {user?.avatar && (
                    <div className='relative'>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='h-9 w-9 rounded-full object-cover border-2 border-gray-200 hover:border-indigo-300 transition-all duration-200 shadow-sm'
                      />
                      {user?.role === 'admin' && (
                        <div className='absolute -top-1 -right-1 bg-indigo-500 rounded-full w-4 h-4 flex items-center justify-center shadow'>
                          <svg className='w-3 h-3 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-700'>{user?.name}</span>
                    <span className='text-xs text-gray-400'>
                      {user?.role === 'admin'
                        ? 'Administrator'
                        : user?.role === 'tech-lead'
                        ? 'Tech Lead'
                        : 'Team Member'}
                    </span>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  <button
                    onClick={logout}
                    className='text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center px-3 py-1.5 rounded-full hover:bg-gray-100'
                  >
                    <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                      />
                    </svg>
                    Logout
                  </button>

                  {/* Only Admin and Tech Lead can create kudos and button is hidden on Kudos Wall page */}
                  {(user?.role === 'admin' || user?.role === 'tech-lead') && !isKudosWallPage && (
                    <Link
                      href='/kudowall'
                      className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center shadow-md hover:shadow-lg'
                    >
                      <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                        />
                      </svg>
                      Give Kudos
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
