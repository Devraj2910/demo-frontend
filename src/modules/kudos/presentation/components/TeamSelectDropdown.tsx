'use client';
import React, { useState, useEffect } from 'react';
import { GetTeamsUseCase } from '../../core/useCases/getTeamsUseCase';
import { KudoService } from '../../core/services/kudoService';
import { ApiKudoRepository } from '../../infrastructure/repositories/ApiKudoRepository';
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';

// Initialize repositories and service once outside of the component
const kudoRepo = new ApiKudoRepository();
const userRepo = new ApiUserRepository();
const kudoService = new KudoService(kudoRepo, userRepo);
const getTeamsUseCase = new GetTeamsUseCase(kudoService);

interface TeamSelectDropdownProps {
  onChange: (team: string) => void;
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
  const [teams, setTeams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch teams from API on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const result = await getTeamsUseCase.execute();

        if (result.success && result.data) {
          setTeams(result.data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const inputStyles =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white';

  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      <select
        id={id}
        className={`${inputStyles} ${className}`}
        value={value}
        onChange={handleChange}
        disabled={isLoading}
      >
        {includeAllTeams && <option value=''>All Teams</option>}

        {isLoading ? (
          <option disabled>Loading teams...</option>
        ) : (
          teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))
        )}
      </select>

      {errorMessage && <p className='mt-1 text-sm text-red-600'>{errorMessage}</p>}
    </div>
  );
}
