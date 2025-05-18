'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth';
import { TRegisterData, UserRole } from '@/modules/auth';
import LoginForm from '@/modules/auth/presentation/components/LoginForm';
import RegisterForm from '@/modules/auth/presentation/components/RegisterForm';
import toast, { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const { isAuthenticated, login, register: registerUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect authenticated users to kudos wall
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/kudowall');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      await login(data.email, data.password);
      router.push('/kudowall');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      // Show error toast for login failures
      toast.error(err.message || 'Invalid email or password', {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    team: string;
    role: UserRole;
  }) => {
    setError('');
    setLoading(true);

    // The password validation is now handled by the form component

    try {
      const userData: TRegisterData = {
        email: data.email,
        password: data.password,
        name: data.name,
        team: data.team,
        role: data.role,
      };

      await registerUser(userData);
      // Show success toast instead of setting message state
      toast.success('Registration successful! You can now log in with your credentials.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });
      // Switch to login tab after successful registration
      setActiveTab('login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      // Show error toast
      toast.error(err.message || 'Registration failed. Please try again.', {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  // Switch between login and register forms
  const switchToLogin = () => {
    setActiveTab('login');
    // Clear messages when switching tabs
    setError('');
  };

  const switchToRegister = () => {
    setActiveTab('register');
    // Clear messages when switching tabs
    setError('');
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white'>
      {/* Add Toaster component to render notifications */}
      <Toaster />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            Digital <span className='text-auth-primary'>Kudos Wall</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Celebrate achievements and foster a culture of appreciation by recognizing your colleagues' contributions
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-16 items-center'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>Show appreciation for your teammates</h2>
            <ul className='space-y-4'>
              {[
                'Give public recognition for great work',
                'Build a positive team culture',
                'Track recognition across teams',
                'Celebrate achievements together',
                'Boost morale and motivation',
              ].map((item, index) => (
                <li key={index} className='flex items-start'>
                  <div className='flex-shrink-0 h-6 w-6 text-auth-primary'>
                    <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                  </div>
                  <p className='ml-3 text-lg text-gray-600'>{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className='min-h-[420px]'>
            <div className='flex border-b border-auth-border'>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'text-auth-primary border-b-2 border-auth-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={switchToLogin}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'register'
                    ? 'text-auth-primary border-b-2 border-auth-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={switchToRegister}
              >
                Register
              </button>
            </div>

            <div className='p-6'>
              <div className='bg-white rounded-xl shadow-auth-card overflow-hidden p-6'>
                {activeTab === 'login' ? (
                  <LoginForm
                    loading={loading}
                    error={error}
                    onSubmit={handleLogin}
                    onSwitchToRegister={switchToRegister}
                  />
                ) : (
                  <RegisterForm
                    loading={loading}
                    error={error}
                    onSubmit={handleRegister}
                    onSwitchToLogin={switchToLogin}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='mt-24 text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>How It Works</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                title: 'Choose a recipient',
                description: 'Select a teammate you want to recognize for their work or support',
                icon: (
                  <svg className='h-8 w-8 text-auth-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                ),
              },
              {
                title: 'Write your kudos',
                description: 'Share what they did and how it made a positive impact',
                icon: (
                  <svg className='h-8 w-8 text-auth-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                ),
              },
              {
                title: 'Share publicly',
                description: 'Your recognition will be displayed on the kudos wall for everyone to see',
                icon: (
                  <svg className='h-8 w-8 text-auth-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <div key={index} className='flex flex-col items-center'>
                <div className='flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4'>
                  {step.icon}
                </div>
                <h3 className='text-xl font-medium text-gray-900 mb-2'>{step.title}</h3>
                <p className='text-gray-600'>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
