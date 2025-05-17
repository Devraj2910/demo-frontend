'use client';
import React, { useState } from 'react';
import KudoList from '../components/KudoList';
import KudoFilter from '../components/KudoFilter';
import KudoForm from '../components/KudoForm';
import { useKudos } from '../hooks/useKudos';
import { KudoFilters } from '../../core/types/kudoTypes';

export default function KudoWallPage() {
  // State for controlling form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load kudos with the useKudos hook
  const { kudos, isLoading, error, filterKudos, refreshKudos } = useKudos();

  // Handle form visibility toggle
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    setIsFormVisible(false);
    refreshKudos();
  };

  // Handle filter changes
  const handleFilterChange = (filters: KudoFilters) => {
    filterKudos(filters);
  };

  console.log(kudos);

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Kudos Wall</h1>

        <button
          onClick={toggleForm}
          className='px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          {isFormVisible ? 'Cancel' : 'Give Kudos'}
        </button>
      </div>

      {/* Show form when isFormVisible is true */}
      {isFormVisible && (
        <div className='mb-8'>
          {' '}
          <KudoForm onSuccess={handleFormSuccess} onCancel={toggleForm} />{' '}
        </div>
      )}

      {/* Filter component */}
      <KudoFilter onFilterChange={handleFilterChange} />

      {/* Error message if any */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          <p>{error}</p>
        </div>
      )}

      {/* Kudos list */}
      <KudoList kudos={kudos} isLoading={isLoading} emptyMessage='No kudos found matching your filters.' />
    </div>
  );
}
