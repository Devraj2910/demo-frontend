'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/clean-architecture/auth/AuthContext';
import KudoCard from './components/KudoCard';
import KudoForm from './components/KudoForm';
import { Kudo } from '../domain/entities/Kudo';
import { KudosApiClient } from '../infrastructure/KudosApiClient';

// Available filter options
const TEAMS = ['All Teams', 'Engineering', 'Product', 'Design', 'Marketing', 'Sales'];
const CATEGORIES = ['All Categories', 'Teamwork', 'Innovation', 'Helping Hand'];

export default function KudoWallPage() {
  const { user, hasPermission } = useAuth();
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [filteredKudos, setFilteredKudos] = useState<Kudo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('All Teams');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [showKudoForm, setShowKudoForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For dropdown state
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize API client
  const apiClient = KudosApiClient.getInstance();

  // Fetch kudos from API on component mount
  useEffect(() => {
    const fetchKudos = async () => {
      try {
        setIsLoading(true);
        const fetchedKudos = await apiClient.getAllKudos();

        if (fetchedKudos && fetchedKudos.length > 0) {
          setKudos(fetchedKudos);
          setFilteredKudos(fetchedKudos);
        } else {
          setKudos([]);
          setFilteredKudos([]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch kudos:', err);
        setError('Failed to load kudos. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchKudos();
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    let result = kudos;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((kudo) => {
        // Get recipient name (fullName, or firstName+lastName, or email)
        const recipientName =
          kudo.recipient?.fullName ||
          `${kudo.recipient?.firstName || ''} ${kudo.recipient?.lastName || ''}`.trim() ||
          kudo.recipient?.email ||
          '';

        // Get creator name
        const creatorName =
          kudo.creator?.fullName ||
          `${kudo.creator?.firstName || ''} ${kudo.creator?.lastName || ''}`.trim() ||
          kudo.creator?.email ||
          '';

        // Check if any of the fields match
        return (
          recipientName.toLowerCase().includes(term) ||
          creatorName.toLowerCase().includes(term) ||
          (kudo.content || '').toLowerCase().includes(term) ||
          (kudo.title || '').toLowerCase().includes(term)
        );
      });
    }

    // Apply team filter - not implemented in current API response
    if (teamFilter !== 'All Teams') {
      // This would need to be adjusted based on your actual data structure
      // For now, leaving this as a placeholder
    }

    // Apply category filter
    if (categoryFilter !== 'All Categories') {
      result = result.filter((kudo) => kudo.category === categoryFilter);
    }

    setFilteredKudos(result);
  }, [searchTerm, teamFilter, categoryFilter, kudos]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setTeamDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle adding a new kudo
  const handleAddKudo = (newKudo: Kudo) => {
    const updatedKudos = [newKudo, ...kudos];
    setKudos(updatedKudos);
    setFilteredKudos(updatedKudos);
    setShowKudoForm(false);
  };

  // Function to get random position adjustment
  const getRandomPosition = (id: string) => {
    const hashCode = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      x: (hashCode % 30) - 15, // Between -15 and 15px
      y: ((hashCode * 13) % 40) - 5, // Between -5 and 35px
    };
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url("/images/cork-board.png")',
          backgroundRepeat: 'repeat',
          backgroundSize: '500px 500px',
        }}
      >
        <div className='border-b border-gray-200 pb-5 mb-8'>
          <h1 className='text-4xl font-bold text-gray-900' style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
            Kudos Wall
          </h1>
          <p className='mt-2 text-sm text-gray-600'>Celebrate achievements and thank your colleagues publicly</p>
        </div>

        {/* Enhanced Filters - Single row with flexible search */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row items-end gap-4'>
            {/* Search field - fills available space */}
            <div className='flex-grow'>
              <label htmlFor='search' className='block text-sm font-medium text-gray-700 mb-1'>
                Search
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </div>
                <input
                  type='text'
                  id='search'
                  className='border border-gray-300 rounded-lg w-full pl-10 py-2.5 focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Search by name or content...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Team Filter */}
            <div className='w-full sm:w-44 shrink-0'>
              <label htmlFor='team' className='block text-sm font-medium text-gray-700 mb-1'>
                Team
              </label>
              <div className='relative' ref={teamDropdownRef}>
                <button
                  type='button'
                  className='w-full flex items-center justify-between border border-gray-300 rounded-lg py-2.5 px-3 bg-white'
                  onClick={() => setTeamDropdownOpen(!teamDropdownOpen)}
                  aria-expanded={teamDropdownOpen}
                >
                  <span className='block truncate'>{teamFilter}</span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${teamDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>

                {teamDropdownOpen && (
                  <div className='absolute right-0 z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto'>
                    <div className='py-1'>
                      {TEAMS.map((team) => (
                        <button
                          key={team}
                          onClick={() => {
                            setTeamFilter(team);
                            setTeamDropdownOpen(false);
                          }}
                          className={`${
                            team === teamFilter
                              ? 'bg-indigo-50 text-indigo-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          } block w-full text-left px-4 py-2 text-sm transition-colors`}
                        >
                          {team === teamFilter && <span className='mr-2 text-indigo-600'>✓</span>}
                          {team}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className='w-full sm:w-44 shrink-0'>
              <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>
                Category
              </label>
              <div className='relative' ref={categoryDropdownRef}>
                <button
                  type='button'
                  className='w-full flex items-center justify-between border border-gray-300 rounded-lg py-2.5 px-3 bg-white'
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  aria-expanded={categoryDropdownOpen}
                >
                  <span className='block truncate'>{categoryFilter}</span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>

                {categoryDropdownOpen && (
                  <div className='absolute right-0 z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto'>
                    <div className='py-1'>
                      {CATEGORIES.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setCategoryFilter(category);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`${
                            category === categoryFilter
                              ? 'bg-indigo-50 text-indigo-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          } block w-full text-left px-4 py-2 text-sm transition-colors`}
                        >
                          {category === categoryFilter && <span className='mr-2 text-indigo-600'>✓</span>}
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clear All button */}
            <button
              className='w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors shrink-0'
              onClick={() => {
                setSearchTerm('');
                setTeamFilter('All Teams');
                setCategoryFilter('All Categories');
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Add Kudo Button - Only visible to admins and tech leads */}
        {hasPermission(['admin', 'tech_lead']) && (
          <div className='flex justify-end mb-10'>
            <button
              onClick={() => setShowKudoForm(true)}
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-md transition-all transform hover:scale-105 flex items-center space-x-2'
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              }}
            >
              <span className='text-xl'>✨</span>
              <span>Give Kudos</span>
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className='text-center py-16 bg-white rounded-lg shadow-sm'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-4'></div>
            <p className='text-gray-500 text-lg'>Loading kudos...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className='text-center py-16 bg-white rounded-lg shadow-sm'>
            <div className='text-5xl mb-4'>😢</div>
            <p className='text-red-500 text-lg'>{error}</p>
            <button
              className='mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white'
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {/* Kudos Grid */}
        {!isLoading && !error && filteredKudos.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 pb-10'>
            {filteredKudos.map((kudo) => {
              const position = getRandomPosition(kudo.id);

              return (
                <div
                  key={kudo.id}
                  className='hover:shadow-lg hover:scale-[1.02] hover:z-10'
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    zIndex: 1,
                    transition: 'box-shadow 0.3s, transform 0.3s, z-index 0.3s',
                  }}
                >
                  <KudoCard kudo={kudo} />
                </div>
              );
            })}
          </div>
        ) : !isLoading && !error ? (
          <div className='text-center py-16 bg-white rounded-lg shadow-sm'>
            <div className='text-5xl mb-4'>😢</div>
            <p className='text-gray-500 text-lg'>No kudos found matching your filters.</p>
            <button
              className='mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-600'
              onClick={() => {
                setSearchTerm('');
                setTeamFilter('All Teams');
                setCategoryFilter('All Categories');
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : null}
      </div>

      {/* Kudo Form Modal */}
      {showKudoForm && <KudoForm onClose={() => setShowKudoForm(false)} onSubmit={handleAddKudo} />}
    </div>
  );
}
