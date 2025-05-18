'use client';
import React, { useEffect, useRef } from 'react';
import { Kudo } from '../../core/types/kudoTypes';
import { createPortal } from 'react-dom';

// Map categories to colors for the modal
const categoryColors: Record<string, string> = {
  Teamwork: 'bg-blue-50 text-blue-800 border-blue-300',
  Innovation: 'bg-purple-50 text-purple-800 border-purple-300',
  'Helping Hand': 'bg-green-50 text-green-800 border-green-300',
  Leadership: 'bg-red-50 text-red-800 border-red-300',
  Excellence: 'bg-indigo-50 text-indigo-800 border-indigo-300',
  default: 'bg-yellow-50 text-yellow-800 border-yellow-300',
};

// Map categories to emojis
const categoryEmojis: Record<string, string> = {
  Teamwork: '👥',
  Innovation: '💡',
  'Helping Hand': '🤝',
  Leadership: '🌟',
  Excellence: '🏆',
  default: '👍',
};

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface KudoDetailModalProps {
  kudo: Kudo;
  isOpen: boolean;
  onClose: () => void;
}

export default function KudoDetailModal({ kudo, isOpen, onClose }: KudoDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Get recipient and sender names with null checks
  const recipientName =
    kudo.recipient?.fullName ||
    `${kudo.recipient?.firstName || ''} ${kudo.recipient?.lastName || ''}`.trim() ||
    'Unknown Recipient';

  const senderName =
    kudo.creator?.fullName || `${kudo.creator?.firstName || ''} ${kudo.creator?.lastName || ''}`.trim() || 'Anonymous';

  // Avatars
  const recipientAvatar =
    kudo.recipient?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}&background=random&color=fff`;
  const senderAvatar =
    kudo.creator?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=random&color=fff`;

  // Get category styling
  const category = kudo.category || kudo.title || 'default';
  const categoryColor = categoryColors[category] || categoryColors.default;
  const emoji = categoryEmojis[category] || categoryEmojis.default;

  // Close modal when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Close on escape key
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use createPortal to render the modal at the document body level
  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity animate-fadeIn'>
      <div
        ref={modalRef}
        className='relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto transform transition-all animate-scaleIn'
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 transition-colors'
          aria-label='Close modal'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        {/* Top decoration - category badge with emoji */}
        <div className='relative h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl'>
          <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2'>
            <div className={`inline-flex items-center rounded-full px-4 py-2 ${categoryColor} border shadow-md`}>
              <span className='text-xl mr-2'>{emoji}</span>
              <span className='font-medium'>{category}</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='px-6 pt-12 pb-6'>
          {/* Header with profiles */}
          <div className='flex flex-col items-center mb-6 mt-2'>
            <div className='flex items-center justify-center mb-4'>
              {/* Recipient avatar */}
              <div className='relative'>
                <div className='h-20 w-20 rounded-full overflow-hidden ring-4 ring-white border-2 border-blue-100 shadow-lg'>
                  <img src={recipientAvatar} alt={recipientName} className='h-full w-full object-cover' />
                </div>
                {/* Sender avatar */}
                <div className='absolute -bottom-2 -right-2 h-10 w-10 rounded-full overflow-hidden ring-2 ring-white border border-blue-100 shadow-md'>
                  <img src={senderAvatar} alt={senderName} className='h-full w-full object-cover' />
                </div>
              </div>
            </div>

            {/* Recipient name with large styling */}
            <h2 className='text-2xl font-bold text-gray-800 text-center'>{recipientName}</h2>

            {/* Team info if available */}
            {kudo.recipient?.team && <p className='text-sm text-gray-500 mt-1'>{kudo.recipient.team}</p>}
          </div>

          {/* Message content with stylized quotation marks */}
          <div className='relative mb-8 mt-6'>
            <div
              className='absolute top-0 left-0 text-6xl text-blue-200 transform -translate-x-2 -translate-y-4'
              aria-hidden='true'
            >
              "
            </div>
            <div
              className='absolute bottom-0 right-0 text-6xl text-blue-200 transform translate-x-2 translate-y-0'
              aria-hidden='true'
            >
              "
            </div>
            <blockquote className='text-xl text-gray-700 px-8 py-4 italic text-center leading-relaxed'>
              {kudo.content}
            </blockquote>
          </div>

          {/* Sender and date info */}
          <div className='flex justify-between items-center border-t border-gray-200 pt-4 mt-4'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-500'>From:</span>
              <span className='text-sm font-medium text-gray-800'>{senderName}</span>
            </div>
            <div className='text-sm text-gray-500'>{formatDate(kudo.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
