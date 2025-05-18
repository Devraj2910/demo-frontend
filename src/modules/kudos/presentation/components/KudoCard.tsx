'use client';
import { Kudo } from '../../core/types/kudoTypes';

// Map categories to colors for the entire card
const categoryColors: Record<string, string> = {
  Teamwork: 'bg-blue-100 from-blue-50 to-blue-200',
  Innovation: 'bg-purple-100 from-purple-50 to-purple-200',
  'Helping Hand': 'bg-green-100 from-green-50 to-green-200',
  Leadership: 'bg-red-100 from-red-50 to-red-200',
  Excellence: 'bg-indigo-100 from-indigo-50 to-indigo-200',
  default: 'bg-yellow-100 from-yellow-50 to-yellow-200',
};

// Map categories to emojis
const categoryEmojis: Record<string, string> = {
  Teamwork: '👥',
  Innovation: '💡',
  'Helping Hand': '🤝',
  Leadership: '🌟',
  Excellence: '🏆',
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

interface KudoCardProps {
  kudo: Kudo;
  onDelete?: () => void;
}

export default function KudoCard({ kudo, onDelete }: KudoCardProps) {
  // Format the date
  const formattedDate = formatDate(kudo.createdAt);

  // Get recipient and sender names with null checks
  const recipientName =
    kudo.recipient?.fullName ||
    `${kudo.recipient?.firstName || ''} ${kudo.recipient?.lastName || ''}`.trim() ||
    'Unknown Recipient';

  const senderName =
    kudo.creator?.fullName || `${kudo.creator?.firstName || ''} ${kudo.creator?.lastName || ''}`.trim() || 'Anonymous';

  // Use provided avatars or default to generated ones if not available
  const recipientAvatar =
    kudo.recipient?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}&background=random&color=fff`;
  const senderAvatar =
    kudo.creator?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=random&color=fff`;

  // Get the color for the category or use a default
  const category = kudo.category || kudo.title || 'default';
  const bgColor = categoryColors[category] || categoryColors.default;

  // Get the emoji for the category or use a default
  const emoji = categoryEmojis[category] || categoryEmojis.default;

  return (
    <div
      className={`${bgColor} hover:rotate-1 rounded-lg overflow-hidden mx-auto w-full h-[400px] flex flex-col max-w-xs relative`}
      style={{
        boxShadow:
          '0 20px 30px -8px rgba(0, 0, 0, 0.2), 0 15px 15px -8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 1px 3px rgba(255, 255, 255, 0.5)',
      }}
    >
      {/* Delete button - only show if onDelete is provided */}
      {onDelete && (
        <button
          onClick={onDelete}
          className='absolute top-2 right-2 z-30 rounded-full bg-white p-1 opacity-70 hover:opacity-100 transition-opacity'
          title='Delete kudo'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 text-red-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
        </button>
      )}

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

      {/* Category badge */}
      <div className='absolute top-4 left-4 z-20'>
        <span className='inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium shadow-sm'>
          {emoji} {category}
        </span>
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
            <img src={recipientAvatar} alt={recipientName} className='h-full w-full object-cover' />
          </div>
          <div
            className='absolute bottom-0 right-0 h-8 w-8 rounded-full overflow-hidden ring-2 ring-white'
            style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.2)' }}
          >
            <img src={senderAvatar} alt={senderName} className='h-full w-full object-cover' />
          </div>
        </div>

        {/* Recipient name */}
        <h2
          className='text-xl font-bold text-gray-900 mt-2'
          style={{
            textShadow: '0 1px 2px rgba(255,255,255,0.6), 0 -1px 1px rgba(0,0,0,0.05)',
          }}
        >
          {recipientName}
        </h2>

        {/* Title */}
        <p className='text-sm text-gray-700 font-medium mt-1' style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>
          {kudo.title || 'Kudos'}
        </p>
      </div>

      {/* Message content */}
      <div className='p-4 flex-grow overflow-hidden'>
        <p
          className={`text-gray-700 text-center text-lg leading-relaxed break-all hyphens-auto overflow-wrap-anywhere whitespace-pre-wrap`}
          style={{
            textShadow: '0px 2px 3px rgba(0,0,0,0.2)',
            transform: 'rotate(-1deg)',
            maxHeight: '130px',
            overflowY: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: '5',
            WebkitBoxOrient: 'vertical',
          }}
        >
          "{kudo.content}"
        </p>
      </div>

      {/* Footer with sender info and date */}
      <div className='px-4 py-3 flex justify-between items-center mt-auto'>
        <div className='flex items-center space-x-2'>
          <span className='text-xs text-gray-600'>From:</span>
          <span className='text-xs font-medium text-gray-800'>{senderName}</span>
        </div>
        <div className='text-xs text-gray-500'>{formattedDate}</div>
      </div>
    </div>
  );
}
