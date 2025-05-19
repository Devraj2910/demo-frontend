'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TTeamWithUsers, TTeam } from '../../core/types/teamTypes';
import { TeamService } from '../../core/services/teamService';
import { TeamRepositoryImpl } from '../../infrastructure/repositories/teamRepositoryImpl';

export const useTeams = () => {
  const [teams, setTeams] = useState<TTeamWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize service with repository using useMemo
  const teamService = useMemo(() => new TeamService(new TeamRepositoryImpl()), []);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const teamsData = await teamService.getTeamsWithUsers();
      setTeams(teamsData);
    } catch (err) {
      setError('Failed to fetch teams. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [teamService]);

  const createTeam = useCallback(
    async (name: string): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);
      try {
        const newTeam = await teamService.createTeam(name);
        if (newTeam) {
          // Refresh the teams list after creating a new team
          await fetchTeams();
          return true;
        }
        return false;
      } catch (err) {
        setError('Failed to create team. Please try again.');
        console.error(err);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [teamService, fetchTeams]
  );

  const deleteTeam = useCallback(
    async (id: number): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);
      try {
        const success = await teamService.deleteTeam(id);
        if (success) {
          // Remove the team from the local state
          setTeams((prevTeams) => prevTeams.filter((teamWithUsers) => teamWithUsers.team.id !== id));
          return true;
        }
        return false;
      } catch (err) {
        setError('Failed to delete team. Please try again.');
        console.error(err);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [teamService]
  );

  const changeUserTeam = useCallback(
    async (userId: string, teamId: number | string): Promise<boolean> => {
      setIsProcessing(true);
      setError(null);
      try {
        const success = await teamService.changeUserTeam(userId, teamId);
        if (success) {
          // Refresh teams data to reflect the change
          await fetchTeams();
          return true;
        }
        return false;
      } catch (err) {
        setError('Failed to change user team. Please try again.');
        console.error(err);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [teamService, fetchTeams]
  );

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    loading,
    error,
    isProcessing,
    fetchTeams,
    createTeam,
    deleteTeam,
    changeUserTeam,
  };
};
