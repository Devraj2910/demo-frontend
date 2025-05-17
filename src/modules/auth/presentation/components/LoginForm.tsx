'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
  loading: boolean;
  error: string;
  onSubmit: (data: { email: string; password: string }) => void;
  onSwitchToRegister: () => void;
}

type LoginFormValues = {
  email: string;
  password: string;
};

/**
 * Login form component
 * Using React Hook Form
 */
export default function LoginForm({ loading, error, onSubmit, onSwitchToRegister }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='h-full flex flex-col'>
      {error && (
        <div className='bg-red-50 border-l-4 border-auth-error p-4 mb-6 rounded-r'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-auth-error' viewBox='0 0 20 20' fill='currentColor'>
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

      <div className='mb-5'>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
          Email
        </label>
        <input
          id='email'
          type='email'
          className={`w-full px-3 py-2.5 border rounded-auth-input shadow-sm focus:ring-auth-primary focus:border-auth-primary transition-colors ${
            errors.email ? 'border-auth-error' : 'border-auth-border'
          }`}
          placeholder='youremail@example.com'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please enter a valid email',
            },
          })}
        />
        {errors.email && <p className='mt-1 text-sm text-auth-error'>{errors.email.message}</p>}
      </div>

      <div className='mb-5'>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
          Password
        </label>
        <input
          id='password'
          type='password'
          className={`w-full px-3 py-2.5 border rounded-auth-input shadow-sm focus:ring-auth-primary focus:border-auth-primary transition-colors ${
            errors.password ? 'border-auth-error' : 'border-auth-border'
          }`}
          placeholder='Your password'
          {...register('password', {
            required: 'Password is required',
          })}
        />
        {errors.password && <p className='mt-1 text-sm text-auth-error'>{errors.password.message}</p>}
      </div>

      <div className='mb-3 mt-2'>
        <button
          type='submit'
          disabled={loading}
          className={`w-full py-3 px-4 border border-transparent rounded-auth-button shadow-md text-sm font-medium text-white transition-colors ${
            loading ? 'bg-auth-secondary' : 'bg-auth-primary hover:bg-auth-highlight'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auth-primary`}
        >
          {loading ? (
            <span className='flex items-center justify-center'>
              <svg
                className='animate-auth-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </div>

      <div className='text-center mt-auto mb-2'>
        <p className='text-sm text-gray-600'>
          Need an account?
          <button
            type='button'
            className='ml-1 text-auth-primary hover:text-auth-highlight font-medium transition-colors'
            onClick={onSwitchToRegister}
          >
            Register here
          </button>
        </p>
      </div>
    </form>
  );
}
