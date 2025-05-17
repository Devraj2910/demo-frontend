'use client';

import { useState } from 'react';
import { Satisfy } from 'next/font/google';

// Initialize the cursive font
const cursiveFont = Satisfy({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

// Define the Kudo type
type Kudo = {
  id: string;
  sender: string;
  recipient: string;
  team?: string;
  category: string;
  message: string;
  createdAt: string;
  senderAvatar?: string;
  recipientAvatar?: string;
  extraLikes?: string[]; // Additional avatars for likes
};

// Map categories to colors for the entire card
const categoryColors: Record<string, string> = {
  Amazing: 'bg-yellow-100',
  Thanks: 'bg-blue-100',
  'Totally Awesome': 'bg-green-100',
};

// Map categories to highlight colors (darker than the card background)
const categoryHighlightColors: Record<string, string> = {
  Amazing: 'bg-yellow-200',
  Thanks: 'bg-blue-200',
  'Totally Awesome': 'bg-green-200',
  // Default color
  default: 'bg-gray-200',
};

// Map categories to emojis
const categoryEmojis: Record<string, string> = {
  Amazing: '✨',
  Thanks: '🙏',
  'Totally Awesome': '🌟',
  // Default emoji for other categories
  default: '👍',
};

// Simple date formatter function
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function KudoCard({ kudo }: { kudo: Kudo }) {
  // Format the date
  const formattedDate = formatDate(kudo.createdAt);

  // Default avatars if not provided
  const recipientAvatar =
    kudo.recipientAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(kudo.recipient)}&background=random&color=fff`;
  const senderAvatar =
    kudo.senderAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(kudo.sender)}&background=random&color=fff`;

  // Get the color for the category or use a default
  const bgColor = categoryColors[kudo.category] || 'bg-yellow-100';
  const highlightColor = categoryHighlightColors[kudo.category] || categoryHighlightColors.default;

  // Get the emoji for the category or use a default
  const emoji = categoryEmojis[kudo.category] || categoryEmojis.default;

  return (
    <div
      className={`${bgColor} hover:rotate-1 rounded-lg overflow-hidden mx-auto w-full h-[400px] flex flex-col relative`}
      style={{
        boxShadow:
          '0 20px 30px -8px rgba(0, 0, 0, 0.2), 0 15px 15px -8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 1px 3px rgba(255, 255, 255, 0.5)',
      }}
    >
      {/* Large emoji in top-right corner */}
      <div
        className='absolute top-1 right-2 text-7xl opacity-40 transform -rotate-12 z-10'
        style={{
          fontSize: '5rem',
          filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.2))',
        }}
      >
        {emoji}
      </div>

      {/* Tape effect at the top */}
      <div
        className='w-16 h-4 bg-gray-200 opacity-70 mx-auto -mt-1 rounded-b-lg'
        style={{
          boxShadow: '0 3px 6px -2px rgba(0,0,0,0.15)',
        }}
      ></div>

      {/* Header section */}
      <div className='p-6 flex flex-col items-center'>
        {/* Profile images with larger recipient image */}
        <div className='relative mb-2'>
          <div
            className='h-20 w-20 rounded-full overflow-hidden ring-4 ring-white'
            style={{ boxShadow: '0 5px 12px rgba(0,0,0,0.25)' }}
          >
            <img src={recipientAvatar} alt={kudo.recipient} className='h-full w-full object-cover' />
          </div>
          <div
            className='absolute bottom-0 right-0 h-8 w-8 rounded-full overflow-hidden ring-2 ring-white'
            style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.2)' }}
          >
            <img src={senderAvatar} alt={kudo.sender} className='h-full w-full object-cover' />
          </div>
        </div>

        {/* Recipient name */}
        <h2
          className='text-xl font-bold text-gray-900 mt-2'
          style={{ textShadow: '0 1px 2px rgba(255,255,255,0.6), 0 -1px 1px rgba(0,0,0,0.05)' }}
        >
          {kudo.recipient}
        </h2>

        {/* Category - simple text without highlight */}
        <p className='text-sm text-gray-700 font-medium mt-1' style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>
          {kudo.category}
        </p>
      </div>

      {/* Message content */}
      <div className='p-4 flex-grow overflow-auto'>
        <p
          className={`text-gray-700 text-center text-lg leading-relaxed`}
          style={{
            textShadow: '0px 2px 3px rgba(0,0,0,0.2)',
            transform: 'rotate(-1deg)',
          }}
        >
          "{kudo.message}"
        </p>
      </div>

      {/* Footer with sender info and date */}
      <div className='px-4 py-3 flex justify-between items-center mt-auto'>
        <div className='flex items-center space-x-2'>
          <span className='text-xs text-gray-600'>From:</span>
          <span className='text-xs font-medium text-gray-800'>{kudo.sender}</span>
        </div>
        <div className='text-xs text-gray-500'>{formattedDate}</div>
      </div>
    </div>
  );
}
