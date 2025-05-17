'use client';

import React, { useState, useEffect } from 'react';
import { Kudo, User } from '@/modules/kudos/domain/entities/Kudo';
import { KudosApiClient } from '@/modules/kudos/infrastructure/KudosApiClient';
import KudoCard from './KudoCard';

// Define kudo categories
const KUDO_CATEGORIES = [
  'Teamwork',
  'Innovation',
  'Excellence',
  'Leadership',
  'Problem Solving',
  'Customer Focus',
  'Knowledge Sharing',
  'Helping Hand',
];

export default function KudoForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (kudo: Kudo) => void }) {
  // Form state
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // UI state
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize API client
  const apiClient = KudosApiClient.getInstance();

  // Search for users using the API
  useEffect(() => {
    const searchUsers = async () => {
      if (recipientSearch.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const users = await apiClient.searchUsers(recipientSearch);
        setSearchResults(users);
        setShowResults(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error searching users:', error);
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(debounce);
  }, [recipientSearch]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!selectedRecipient) {
      setError('Please select a recipient');
      return;
    }

    if (message.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    setIsLoading(true);

    // Create kudo data object that matches our API structure
    const kudoData = {
      title: category || '',
      content: message,
      createdFor: selectedRecipient.id,
      // category: category,
    };

    try {
      // Call the API to create a new kudo
      const createdKudo = await apiClient.createKudo(kudoData);

      // Reset form
      setSelectedRecipient(null);
      setRecipientSearch('');
      setCategory('');
      setMessage('');
      setIsPublic(true);
      setSuccess(true);

      // Notify parent component
      if (onSubmit) {
        onSubmit(createdKudo);
      }

      // Close modal immediately
      onClose();

      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 2000);

      setIsLoading(false);
    } catch (err) {
      console.error('Error creating kudo:', err);
      setError('Failed to create kudo. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle recipient selection
  const handleSelectRecipient = (user: User) => {
    setSelectedRecipient(user);
    setRecipientSearch(user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim());
    setShowResults(false);
  };

  // Generate preview kudo
  const previewKudo: Kudo = {
    id: 'preview',
    title: category || 'Kudos',
    content: message || 'Your message will appear here...',
    userId: 'current-user',
    createdFor: selectedRecipient?.id || 'recipient',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creator: {
      id: 'current-user',
      email: 'alex.smith@example.com',
      firstName: 'Alex',
      lastName: 'Smith',
      fullName: 'Alex Smith',
    },
    recipient: selectedRecipient || {
      id: 'recipient',
      email: 'recipient@example.com',
      firstName: 'Recipient',
      lastName: 'Name',
      fullName: 'Recipient Name',
    },
    category: category,
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-md max-w-3xl w-full max-h-[85vh] overflow-hidden flex'>
        {/* Form section */}
        <div className='p-5 md:p-6 flex-1 overflow-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-gray-800'>Give Kudos</h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 transition-colors'
              aria-label='Close'
            >
              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {success && (
            <div className='bg-green-100 text-green-700 p-3 mb-4 rounded text-sm'>Kudos sent successfully!</div>
          )}

          {error && <div className='bg-red-100 text-red-700 p-3 mb-4 rounded text-sm'>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Recipient Selection */}
            <div className='mb-3 relative'>
              <label htmlFor='recipient' className='block text-gray-700 font-medium mb-1 text-sm'>
                Recipient *
              </label>
              <input
                type='text'
                id='recipient'
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
                placeholder='Search for a colleague...'
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                required
              />

              {showResults && searchResults.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border rounded shadow-md max-h-48 overflow-y-auto'>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className='p-2 hover:bg-gray-100 cursor-pointer flex items-center'
                      onClick={() => handleSelectRecipient(user)}
                    >
                      <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2 text-xs'>
                        {user.firstName ? user.firstName.charAt(0) : '?'}
                      </div>
                      <div>
                        <div className='font-medium text-sm'>
                          {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown'}
                        </div>
                        <div className='text-xs text-gray-600'>Email: {user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isLoading && <div className='mt-1 text-gray-600 text-xs'>Searching...</div>}
            </div>

            {/* Category Selection */}
            <div className='mb-3'>
              <label htmlFor='category' className='block text-gray-700 font-medium mb-1 text-sm'>
                Category *
              </label>
              <select
                id='category'
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value=''>Select a category</option>
                {KUDO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className='mb-3'>
              <label htmlFor='message' className='block text-gray-700 font-medium mb-1 text-sm'>
                Message *
              </label>
              <textarea
                id='message'
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 text-sm'
                placeholder='Why do you want to recognize this person?'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <div className='text-xs text-gray-600 mt-1'>{message.length} / 10 characters minimum</div>
            </div>

            {/* Visibility Toggle */}
            <div className='mb-4'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  className='form-checkbox h-4 w-4 text-blue-600'
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span className='ml-2 text-gray-700 text-sm'>Make this kudo visible to everyone</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition text-sm'
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Kudos'}
            </button>
          </form>
        </div>

        {/* Preview section */}
        <div className='bg-gray-100 p-5 md:p-6 flex-1 flex flex-col'>
          <h3 className='text-sm font-medium text-gray-700 mb-3'>Preview</h3>
          <div className='flex-grow overflow-auto flex items-center justify-center p-2'>
            <div className='w-full max-w-xs transform transition-all'>
              <KudoCard kudo={previewKudo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
