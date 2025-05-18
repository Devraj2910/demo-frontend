import { useState, useEffect } from 'react';
import { TTeam } from '../../core/types/authTypes';
import { TeamService } from '../../core/services/teamService';
import { TeamRepositoryImpl } from '../../infrastructure/teamRepositoryImpl';

/**
 * Custom hook to fetch and manage teams
 * @returns Object containing teams data, loading state, and error state
 */
export const useTeams = () => {
  const [teams, setTeams] = useState<TTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        // Create repository and service instances
        const teamRepository = new TeamRepositoryImpl();
        const teamService = new TeamService(teamRepository);

        // Fetch teams and update state
        const teamsData = await teamService.getTeams();
        setTeams(teamsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return { teams, loading, error };
};
