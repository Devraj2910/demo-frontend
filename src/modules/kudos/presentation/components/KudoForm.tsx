'use client';

import React, { useState, useEffect } from 'react';
import { useKudoForm } from '../hooks/useKudoForm';
import { useUsers } from '../hooks/useUsers';
import { CreateKudoRequest, KudoCategory, User, Kudo } from '../../core/types/kudoTypes';
import KudoCard from './KudoCard';
import TeamSelectDropdown from './TeamSelectDropdown';

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

interface KudoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function KudoForm({ onSuccess, onCancel }: KudoFormProps) {
  // Get form submission hook
  const { submitKudo, isSubmitting, success, error } = useKudoForm();

  // Get users data
  const { users, searchUsers, isLoading: isLoadingUsers } = useUsers();

  // Form state
  const [formData, setFormData] = useState<CreateKudoRequest>({
    title: '',
    content: '',
    recipientId: '',
    category: 'default',
  });

  // State for recipient search
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  // Categories for dropdown
  const categories: KudoCategory[] = ['Teamwork', 'Innovation', 'Helping Hand', 'default'];

  // Search for users when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchUsers(searchTerm, selectedTeam);
      setShowUserList(true);
    } else {
      setShowUserList(false);
    }
  }, [searchTerm, searchUsers, selectedTeam]);

  // Reset form on successful submission
  useEffect(() => {
    if (success) {
      onSuccess();
    }
  }, [success, onSuccess]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!e.target.value) {
      setSelectedRecipient(null);
      setFormData((prev) => ({ ...prev, recipientId: '' }));
    }
  };

  // Handle team selection change
  const handleTeamChange = (team: string) => {
    setSelectedTeam(team);
    // Reset recipient if team changes
    if (selectedRecipient) {
      setSelectedRecipient(null);
      setSearchTerm('');
      setFormData((prev) => ({ ...prev, recipientId: '' }));
    }
  };

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setSelectedRecipient(user);
    setSearchTerm(`${user.fullName}`);
    setFormData((prev) => ({ ...prev, recipientId: user.id }));
    setShowUserList(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipientId) {
      alert('Please select a recipient');
      return;
    }

    try {
      // Add current timestamp
      const requestData = {
        ...formData,
        createdAt: new Date().toISOString(),
      };

      const result = await submitKudo(requestData);

      if (result.success) {
        // If successful, notify the parent component
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting kudos:', error);
    }
  };

  // Generate preview kudo
  const previewKudo: Kudo = {
    id: 'preview',
    title: formData.title || 'Kudos',
    content: formData.content || 'Your message will appear here...',
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
    category: formData.category,
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-md max-w-3xl w-full max-h-[85vh] overflow-hidden flex'>
        {/* Form section */}
        <div className='p-5 md:p-6 flex-1 overflow-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-gray-800'>Give Kudos</h2>
            <button
              onClick={onCancel}
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
            {/* Team filter */}
            <div className='mb-4'>
              <TeamSelectDropdown
                label='Filter by Team (Optional)'
                includeAllTeams={true}
                defaultOption='All Teams'
                value={selectedTeam}
                onChange={handleTeamChange}
              />
            </div>

            {/* Recipient search */}
            <div className='mb-4'>
              <label htmlFor='recipient' className='block text-sm font-medium text-gray-700 mb-1'>
                Recipient *
              </label>
              <div className='relative'>
                <input
                  type='text'
                  id='recipient'
                  placeholder='Search for a colleague...'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoComplete='off'
                />

                {showUserList && searchTerm.length >= 2 && (
                  <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
                    {isLoadingUsers ? (
                      <div className='p-3 text-center text-gray-500'>Loading...</div>
                    ) : users.length > 0 ? (
                      <ul>
                        {users.map((user) => (
                          <li
                            key={user.id}
                            className='px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center'
                            onClick={() => handleSelectUser(user)}
                          >
                            {user.avatar && (
                              <img src={user.avatar} alt={user.fullName} className='h-8 w-8 rounded-full mr-2' />
                            )}
                            <div>
                              <div className='font-medium'>{user.fullName}</div>
                              <div className='text-sm text-gray-500'>{user.email}</div>
                              {user.team && <div className='text-xs text-gray-400'>{user.team}</div>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className='p-3 text-center text-gray-500'>No users found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Category selection */}
            <div className='mb-4'>
              <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>
                Category
              </label>
              <select
                id='category'
                name='category'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Title field */}
            <div className='mb-4'>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>
                Title *
              </label>
              <input
                type='text'
                id='title'
                name='title'
                placeholder='E.g., Thanks for your help!'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Content field */}
            <div className='mb-4'>
              <label htmlFor='content' className='block text-sm font-medium text-gray-700 mb-1'>
                Message *
              </label>
              <textarea
                id='content'
                name='content'
                rows={4}
                placeholder='Write your appreciation message here...'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                value={formData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Submit button */}
            <div className='flex justify-end'>
              <button
                type='button'
                onClick={onCancel}
                className='mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Kudos'}
              </button>
            </div>
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
