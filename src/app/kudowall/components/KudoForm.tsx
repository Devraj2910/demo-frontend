'use client';

import React, { useState, useEffect } from 'react';
import { KudosApiClient, User, CreateKudoRequest } from '@/modules/kudos';
import { CreateKudoUseCase, SearchUsersUseCase } from '@/modules/kudos/application/usecases';
import { KudoService } from '@/modules/kudos/application/services/KudoService';
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
];

export default function KudoForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (kudo: any) => void }) {
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

  // Initialize service
  const kudoService = new KudoService(apiClient.getKudoRepository(), apiClient.getUserRepository());

  // Initialize use cases
  const searchUsersUseCase = new SearchUsersUseCase(kudoService);
  const createKudoUseCase = new CreateKudoUseCase(kudoService);

  // Handle user search
  useEffect(() => {
    const searchUsers = async () => {
      if (recipientSearch.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      const result = await searchUsersUseCase.execute(recipientSearch);
      setIsLoading(false);

      if (result.success && result.data) {
        setSearchResults(result.data);
        setShowResults(true);
      } else if (result.error) {
        setError(result.error);
        setSearchResults([]);
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

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (message.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    setIsLoading(true);

    const kudoData: CreateKudoRequest = {
      recipientId: selectedRecipient.id,
      category,
      message,
      isPublic,
    };

    const result = await createKudoUseCase.execute(kudoData);
    setIsLoading(false);

    if (result.success) {
      // Reset form
      setSelectedRecipient(null);
      setRecipientSearch('');
      setCategory('');
      setMessage('');
      setIsPublic(true);
      setSuccess(true);

      // Notify parent component
      if (onSubmit) {
        onSubmit(result.data);
      }

      // Clear success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else if (result.error) {
      setError(result.error);
    }
  };

  // Handle recipient selection
  const handleSelectRecipient = (user: User) => {
    setSelectedRecipient(user);
    setRecipientSearch(`${user.firstName} ${user.lastName}`);
    setShowResults(false);
  };

  // Generate preview kudo
  const previewKudo = {
    id: 'preview',
    sender: 'Alex Smith',
    senderAvatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    recipient: selectedRecipient ? `${selectedRecipient.firstName} ${selectedRecipient.lastName}` : 'Recipient Name',
    recipientAvatar: selectedRecipient?.avatar || '',
    team: selectedRecipient?.team || 'Team',
    category: category || 'Category',
    message: message || 'Your message will appear here...',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row'>
        {/* Form section */}
        <div className='p-6 md:p-8 flex-1 overflow-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>Give Kudos</h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 transition-colors'
              aria-label='Close'
            >
              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {success && <div className='bg-green-100 text-green-700 p-4 mb-6 rounded-md'>Kudos sent successfully!</div>}

          {error && <div className='bg-red-100 text-red-700 p-4 mb-6 rounded-md'>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Recipient Selection */}
            <div className='mb-4 relative'>
              <label htmlFor='recipient' className='block text-gray-700 font-medium mb-2'>
                Recipient *
              </label>
              <input
                type='text'
                id='recipient'
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Search for a colleague...'
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                onFocus={() => setShowResults(true)}
                required
              />

              {showResults && searchResults.length > 0 && (
                <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className='p-2 hover:bg-gray-100 cursor-pointer flex items-center'
                      onClick={() => handleSelectRecipient(user)}
                    >
                      <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2'>
                        {user && user.firstName ? user.firstName.charAt(0) : '?'}
                      </div>
                      <div>
                        <div className='font-medium'>
                          {user && user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.name || 'Unknown'}
                        </div>
                        <div className='text-sm text-gray-600'>Team: {user.team || 'No team'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isLoading && <div className='mt-2 text-gray-600'>Searching...</div>}
            </div>

            {/* Category Selection */}
            <div className='mb-4'>
              <label htmlFor='category' className='block text-gray-700 font-medium mb-2'>
                Category *
              </label>
              <select
                id='category'
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
            <div className='mb-4'>
              <label htmlFor='message' className='block text-gray-700 font-medium mb-2'>
                Message *
              </label>
              <textarea
                id='message'
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32'
                placeholder='Why do you want to recognize this person?'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <div className='text-sm text-gray-600 mt-1'>{message.length} / 10 characters minimum</div>
            </div>

            {/* Visibility Toggle */}
            <div className='mb-6'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  className='form-checkbox h-5 w-5 text-blue-600'
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span className='ml-2 text-gray-700'>Make this kudo visible to everyone</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition'
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Kudos'}
            </button>
          </form>
        </div>

        {/* Preview section */}
        {selectedRecipient && (
          <div className='bg-gray-100 p-6 md:p-8 flex-1 flex flex-col'>
            <h3 className='text-lg font-medium text-gray-700 mb-4'>Preview</h3>
            <div className='flex-grow overflow-auto flex items-center justify-center p-4'>
              <div className='w-full max-w-sm transform transition-all'>
                <KudoCard kudo={previewKudo} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
