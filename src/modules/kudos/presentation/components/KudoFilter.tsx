'use client';
import React, { useState, useEffect } from 'react';
import { KudoFilters, KudoCategory } from '../../core/types/kudoTypes';
import { GetTeamsUseCase } from '../../core/useCases/getTeamsUseCase';
import { KudoService } from '../../core/services/kudoService';
import { ApiKudoRepository } from '../../infrastructure/repositories/ApiKudoRepository';
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';
import TeamSelectDropdown from './TeamSelectDropdown';

// Initialize repositories and service once outside of the component
const kudoRepo = new ApiKudoRepository();
const userRepo = new ApiUserRepository();
const kudoService = new KudoService(kudoRepo, userRepo);
const getTeamsUseCase = new GetTeamsUseCase(kudoService);

interface KudoFilterProps {
  onFilterChange: (filters: KudoFilters) => void;
  initialFilters?: KudoFilters;
}

export default function KudoFilter({ onFilterChange, initialFilters }: KudoFilterProps) {
  // Setup local state for filters
  const [filters, setFilters] = useState<KudoFilters>(initialFilters || {});
  const [teams, setTeams] = useState<string[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  // Load teams on component mount
  useEffect(() => {
    const loadTeams = async () => {
      setIsLoadingTeams(true);
      try {
        const result = await getTeamsUseCase.execute();
        if (result.success && result.data) {
          setTeams(result.data);
        }
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setIsLoadingTeams(false);
      }
    };

    loadTeams();
  }, []);

  // Categories for filter dropdown
  const categories: KudoCategory[] = ['Teamwork', 'Innovation', 'Helping Hand', 'default'];

  // Handler for search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchTerm: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handler for team selection changes
  const handleTeamChange = (team: string) => {
    const newFilters = {
      ...filters,
      team: team || undefined,
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handler for category selection changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newFilters = {
      ...filters,
      category: value === 'All Categories' ? undefined : value,
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handler to clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Common styles for all filter inputs
  const inputStyles =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white';

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm mb-6'>
      <div className='mb-4'>
        <div className='text-lg font-medium mb-3'>Filter Kudos</div>
      </div>

      <div className='flex gap-4'>
        {/* Search input */}
        <div>
          <label htmlFor='search' className='block text-sm font-medium text-gray-700 mb-1'>
            Search
          </label>
          <input
            type='text'
            id='search'
            placeholder='Search by name, content...'
            className={inputStyles}
            value={filters.searchTerm || ''}
            onChange={handleSearchChange}
          />
        </div>

        {/* Team filter */}
        <div>
          <TeamSelectDropdown value={filters.team} onChange={handleTeamChange} includeAllTeams={true} />
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>
            Category
          </label>
          <select
            id='category'
            className={inputStyles}
            value={filters.category || 'All Categories'}
            onChange={handleCategoryChange}
          >
            <option value='All Categories'>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear filters button - show only when filters are applied */}
      {(filters.searchTerm || filters.team || filters.category) && (
        <div className='mt-4 flex justify-end'>
          <button
            onClick={handleClearFilters}
            className='px-4 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm'
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
