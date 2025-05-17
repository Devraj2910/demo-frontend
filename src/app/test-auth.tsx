'use client';

import { useState } from 'react';
import { testLoginAPI, testRegisterAPI } from '@/modules/auth/debug';

export default function TestAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await testLoginAPI(email, password);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTestRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await testRegisterAPI({
        email,
        password,
        firstName: name,
        role: 'team_member',
        position: 'Developer',
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-bold mb-4'>Test Auth API</h2>

      <form className='mb-6'>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            placeholder='Email'
            required
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            placeholder='Password'
            required
          />
        </div>

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Name (for Register)</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            placeholder='Full Name'
          />
        </div>

        <div className='flex gap-4'>
          <button
            type='button'
            onClick={handleTestLogin}
            disabled={loading}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Test Login
          </button>

          <button
            type='button'
            onClick={handleTestRegister}
            disabled={loading}
            className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
          >
            Test Register
          </button>
        </div>
      </form>

      {loading && <p className='text-gray-600'>Loading...</p>}

      {error && (
        <div className='p-3 bg-red-100 text-red-700 rounded-md mb-4'>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className='mt-6'>
          <h3 className='text-lg font-semibold mb-2'>API Response:</h3>
          <pre className='bg-gray-100 p-4 rounded-md overflow-auto max-h-80'>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
