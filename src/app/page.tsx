'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/clean-architecture/auth/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [team, setTeam] = useState('Alpha');

  // Redirect authenticated users to kudos wall
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/kudowall');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/kudowall');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // For demo, just show a message
    setTimeout(() => {
      setLoading(false);
      setError('');
      setActiveTab('login');
      alert('Registration is disabled in this demo. Please use one of the demo accounts.');
    }, 1000);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            Digital <span className='text-indigo-600'>Kudos Wall</span>
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
                  <div className='flex-shrink-0 h-6 w-6 text-indigo-600'>
                    <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                  </div>
                  <p className='ml-3 text-lg text-gray-600'>{item}</p>
                </li>
              ))}
            </ul>

            <div className='mt-12 hidden sm:block'>
              <Link
                href='/kudowall'
                className='inline-flex justify-center items-center px-8 py-4 border border-indigo-600 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:text-lg'
              >
                View Kudos Wall
              </Link>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-xl overflow-hidden'>
            <div className='flex border-b border-gray-200'>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'login'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'register'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>

            <div className='p-6'>
              {error && (
                <div className='bg-red-50 border-l-4 border-red-400 p-4 mb-6'>
                  <div className='flex'>
                    <div className='flex-shrink-0'>
                      <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm text-red-700'>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className='min-h-[420px]'>
                {activeTab === 'login' ? (
                  <form onSubmit={handleLogin} className='h-full flex flex-col'>
                    <div className='mb-5'>
                      <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                        Email
                      </label>
                      <input
                        id='email'
                        type='email'
                        required
                        className='w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='admin@company.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className='mb-5'>
                      <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                        Password
                      </label>
                      <input
                        id='password'
                        type='password'
                        required
                        className='w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className='flex justify-between items-center mt-2'>
                        <p className='text-xs text-gray-500'>For demo use: "password"</p>
                        <button type='button' className='text-xs text-indigo-600 hover:text-indigo-800'>
                          Forgot Password?
                        </button>
                      </div>
                    </div>

                    <div className='mb-3 mt-2'>
                      <button
                        type='submit'
                        disabled={loading}
                        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {loading ? 'Signing in...' : 'Sign in'}
                      </button>
                    </div>

                    <div className='border-t border-gray-200 my-5 pt-5'>
                      <div className='text-sm text-center mb-4'>
                        <div className='font-medium text-gray-600 mb-3'>Demo Accounts:</div>
                        <div className='grid grid-cols-3 gap-3 text-xs'>
                          <div className='bg-gray-50 p-3 rounded-md'>
                            <div className='font-semibold'>Admin</div>
                            <div className='text-gray-500'>admin@company.com</div>
                          </div>
                          <div className='bg-gray-50 p-3 rounded-md'>
                            <div className='font-semibold'>Tech Lead</div>
                            <div className='text-gray-500'>techlead@company.com</div>
                          </div>
                          <div className='bg-gray-50 p-3 rounded-md'>
                            <div className='font-semibold'>Team Member</div>
                            <div className='text-gray-500'>member@company.com</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='text-center mt-auto mb-2'>
                      <p className='text-sm text-gray-600'>
                        Need an account?
                        <button
                          type='button'
                          className='ml-1 text-indigo-600 hover:text-indigo-800'
                          onClick={() => setActiveTab('register')}
                        >
                          Register here
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className='h-full flex flex-col'>
                    <div className='mb-4'>
                      <label htmlFor='reg-name' className='block text-sm font-medium text-gray-700 mb-1'>
                        Full Name
                      </label>
                      <input
                        id='reg-name'
                        type='text'
                        required
                        className='w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='John Doe'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='reg-email' className='block text-sm font-medium text-gray-700 mb-1'>
                        Email
                      </label>
                      <input
                        id='reg-email'
                        type='email'
                        required
                        className='w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='john@company.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='reg-team' className='block text-sm font-medium text-gray-700 mb-1'>
                        Team
                      </label>
                      <select
                        id='reg-team'
                        required
                        className='w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                      >
                        <option value='Alpha'>Alpha</option>
                        <option value='Bravo'>Bravo</option>
                        <option value='Charlie'>Charlie</option>
                        <option value='Data'>Data</option>
                        <option value='AI'>AI</option>
                      </select>
                    </div>
                    <div className='mb-6'>
                      <label htmlFor='reg-password' className='block text-sm font-medium text-gray-700 mb-1'>
                        Password
                      </label>
                      <input
                        id='reg-password'
                        type='password'
                        required
                        className='w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                        placeholder='Must be 8+ characters'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className='mb-6'>
                      <button
                        type='submit'
                        disabled={loading}
                        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {loading ? 'Registering...' : 'Create Account'}
                      </button>
                    </div>

                    <div className='mt-auto'>
                      <p className='text-xs text-gray-500 text-center mb-4'>
                        By registering, you agree to our terms of service and privacy policy.
                      </p>

                      <div className='text-center'>
                        <p className='text-sm text-gray-600'>
                          Already have an account?
                          <button
                            type='button'
                            className='ml-1 text-indigo-600 hover:text-indigo-800'
                            onClick={() => setActiveTab('login')}
                          >
                            Sign in
                          </button>
                        </p>
                      </div>
                    </div>
                  </form>
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
                  <svg className='h-8 w-8 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
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
                  <svg className='h-8 w-8 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
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
                  <svg className='h-8 w-8 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
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
