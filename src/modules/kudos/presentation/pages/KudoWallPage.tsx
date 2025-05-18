'use client';
import React, { useState } from 'react';
import KudoList from '../components/KudoList';
import KudoFilter from '../components/KudoFilter';
import KudoForm from '../components/KudoForm';
import Pagination from '../components/Pagination';
import { useKudos } from '../hooks/useKudos';
import { useKudoDeletion } from '../hooks/useKudoDeletion';
import { KudoFilters } from '../../core/types/kudoTypes';
import { hasAdminOrTechLeadPrivileges } from '@/modules/auth/presentation/utils/authUtils';

export default function KudoWallPage() {
  // State for controlling form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);
  // State for status messages
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  // State for current filters
  const [currentFilters, setCurrentFilters] = useState<KudoFilters>({
    page: 1,
    limit: 9, // Show 9 cards per page
  });

  // Load kudos with the useKudos hook
  const {
    kudos,
    isLoading,
    error: kudosError,
    filterKudos,
    refreshKudos,
    setKudos,
    pagination,
  } = useKudos(currentFilters);

  // Use the deletion hook
  const {
    deleteKudo,
    isDeleting,
    error: deleteError,
  } = useKudoDeletion({
    kudos,
    onUpdateKudosList: setKudos,
    onDeleteSuccess: (id) => {
      setStatusMessage({ text: 'Kudo deleted successfully!', type: 'success' });
      // Clear success message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    },
  });

  // Handle form visibility toggle
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    setIsFormVisible(false);
    refreshKudos();
    setStatusMessage({ text: 'Kudo created successfully!', type: 'success' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle filter changes
  const handleFilterChange = (filters: KudoFilters) => {
    // When filters change, reset to page 1
    setCurrentFilters({
      ...filters,
      page: 1,
      limit: 9,
    });
    filterKudos({
      ...filters,
      page: 1,
      limit: 9,
    });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const updatedFilters = {
      ...currentFilters,
      page: newPage,
    };
    setCurrentFilters(updatedFilters);
    filterKudos(updatedFilters);

    // Scroll to top of the page for better UX
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle kudo deletion with loading and error states
  const handleDeleteKudo = async (id: string) => {
    try {
      const success = await deleteKudo(id);
      return success;
    } catch (err) {
      console.error('Error in handleDeleteKudo:', err);
      setStatusMessage({ text: 'An error occurred while deleting the kudo.', type: 'error' });
      setTimeout(() => setStatusMessage(null), 5000);
      return false;
    }
  };

  // Check if user can delete kudos
  const canDeleteKudos = hasAdminOrTechLeadPrivileges();

  // Any error to display (from loading kudos or deleting)
  const error = kudosError || deleteError;

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative'>
      {/* Dynamic background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob'></div>
        <div className='absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000'></div>
      </div>

      {/* Content container with subtle glass effect */}
      <div className='container mx-auto px-4 py-8 max-w-7xl relative z-10'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Kudos Wall</h1>
          {hasAdminOrTechLeadPrivileges() && (
            <button
              onClick={toggleForm}
              className='px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
            >
              {isFormVisible ? 'Cancel' : 'Give Kudos'}
            </button>
          )}
        </div>

        {/* Show form when isFormVisible is true */}
        {isFormVisible && (
          <div className='mb-8'>
            <KudoForm onSuccess={handleFormSuccess} onCancel={toggleForm} />{' '}
          </div>
        )}

        {/* Status messages */}
        {statusMessage && (
          <div
            className={`${
              statusMessage.type === 'success'
                ? 'bg-green-100 text-green-700 border-green-400'
                : 'bg-red-100 text-red-700 border-red-400'
            } border px-4 py-3 rounded mb-6 transition-opacity`}
          >
            <p>{statusMessage.text}</p>
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
        <KudoList
          kudos={kudos}
          isLoading={isLoading || isDeleting}
          emptyMessage='No kudos found matching your filters.'
          onDelete={canDeleteKudos ? handleDeleteKudo : undefined}
        />

        {/* Pagination component */}
        {pagination && (
          <Pagination
            currentPage={pagination.page || 1}
            totalPages={pagination.totalPages || 1}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
