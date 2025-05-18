'use client';
import React, { useState } from 'react';
import { Kudo } from '../../core/types/kudoTypes';
import KudoCard from './KudoCard';
import ConfirmationModal from './ConfirmationModal';

interface KudoListProps {
  kudos: Kudo[] | null;
  isLoading?: boolean;
  emptyMessage?: string;
  onDelete?: (id: string) => Promise<boolean>;
}

export default function KudoList({
  kudos,
  isLoading = false,
  emptyMessage = 'No kudos to display',
  onDelete,
}: KudoListProps) {
  // State for deletion modal
  const [selectedKudoId, setSelectedKudoId] = useState<string | null>(null);
  const [selectedKudoName, setSelectedKudoName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle requesting kudo deletion (opens the confirmation modal)
  const handleDeleteRequest = (id: string, recipientName: string) => {
    setSelectedKudoId(id);
    setSelectedKudoName(recipientName);
  };

  // Handle confirming kudo deletion
  const handleConfirmDelete = async () => {
    if (!selectedKudoId || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(selectedKudoId);
    } catch (error) {
      console.error('Failed to delete kudo:', error);
    } finally {
      setIsDeleting(false);
      setSelectedKudoId(null);
    }
  };

  // Handle canceling kudo deletion
  const handleCancelDelete = () => {
    setSelectedKudoId(null);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center p-8 h-64'>
        <div className='w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin'></div>
        <p className='mt-4 text-gray-500'>Loading kudos...</p>
      </div>
    );
  }

  // Show empty state
  if (!kudos || !Array.isArray(kudos) || kudos.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-8 h-64 bg-gray-50 rounded-lg'>
        <p className='text-xl text-gray-400'>{emptyMessage}</p>
        <p className='mt-2 text-sm text-gray-400'>Be the first to share some appreciation!</p>
      </div>
    );
  }

  // Show kudos grid - ensure kudos is an array before mapping
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {Array.isArray(kudos) &&
          kudos.map((kudo) => (
            <div key={kudo.id} className='flex'>
              <KudoCard
                kudo={kudo}
                onDelete={
                  onDelete
                    ? () =>
                        handleDeleteRequest(kudo.id, kudo.recipient?.fullName || kudo.recipientName || 'this recipient')
                    : undefined
                }
              />
            </div>
          ))}
      </div>

      {/* Confirmation Modal for deletion */}
      <ConfirmationModal
        isOpen={selectedKudoId !== null}
        title='Delete Kudo?'
        message={`Are you sure you want to delete the kudo for ${selectedKudoName}? This action cannot be undone.`}
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmButtonColor='red'
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
