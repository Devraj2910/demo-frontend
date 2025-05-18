'use client';
import React, { useState, useEffect } from 'react';
import { GetTeamsUseCase } from '../../core/useCases/getTeamsUseCase';
import { KudoService } from '../../core/services/kudoService';
import { ApiKudoRepository } from '../../infrastructure/repositories/ApiKudoRepository';
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';
import { Team } from '../../core/types/kudoTypes';

// Initialize repositories and service once outside of the component
const kudoRepo = new ApiKudoRepository();
const userRepo = new ApiUserRepository();
const kudoService = new KudoService(kudoRepo, userRepo);
const getTeamsUseCase = new GetTeamsUseCase(kudoService);

interface TeamSelectDropdownProps {
  onChange: (teamId: string) => void;
  value?: string;
  label?: string;
  id?: string;
  required?: boolean;
  errorMessage?: string;
  className?: string;
  includeAllTeams?: boolean;
}

export default function TeamSelectDropdown({
  onChange,
  value = '',
  label = 'Team',
  id = 'team-select',
  required = false,
  errorMessage,
  className = '',
  includeAllTeams = true,
}: TeamSelectDropdownProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch teams from API on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        console.log('Fetching teams from API...');
        const result = await getTeamsUseCase.execute();

        console.log('Teams API response:', JSON.stringify(result, null, 2));

        if (result && result.success && Array.isArray(result.data)) {
          console.log(`Successfully loaded ${result.data.length} teams:`, result.data);
          setTeams(result.data);
        } else if (result && typeof result === 'object') {
          // Try to handle different response formats
          if (Array.isArray(result)) {
            console.log('Received direct array of teams:', result);
            setTeams(result);
          } else if ('teams' in result && Array.isArray(result.teams)) {
            console.log('Found teams in result.teams property:', result.teams);
            setTeams(result.teams);
          } else if ('data' in result && Array.isArray(result.data)) {
            console.log('Found teams in result.data property:', result.data);
            setTeams(result.data);
          } else {
            console.error('Unexpected teams response format:', result);
            // Fall back to default teams if we can't parse the response
            setTeams([
              { id: 1, name: 'Engineering', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
              { id: 2, name: 'Marketing', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ]);
          }
        } else {
          console.error('Failed to load teams or received invalid response:', result);
          // Fall back to default teams
          setTeams([
            { id: 1, name: 'Engineering', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, name: 'Marketing', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ]);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        // Fall back to default teams in case of error
        setTeams([
          { id: 1, name: 'Engineering', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, name: 'Marketing', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const baseStyles =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white';
  const selectStyles = `${baseStyles} appearance-none bg-no-repeat bg-right pr-8 ${className}`;

  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      <div className='relative'>
        <select id={id} className={selectStyles} value={value} onChange={handleChange} disabled={isLoading}>
          {includeAllTeams && <option value=''>All Teams</option>}

          {isLoading ? (
            <option disabled>Loading teams...</option>
          ) : (
            teams.map((team) => (
              <option key={team.id} value={team.id.toString()}>
                {team.name}
              </option>
            ))
          )}
        </select>

        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
          <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
            <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
          </svg>
        </div>
      </div>

      {errorMessage && <p className='mt-1 text-sm text-red-600'>{errorMessage}</p>}
    </div>
  );
}
