'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  UserIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';
import { useTeams } from '../hooks/useTeams';
import { TTeamWithUsers, TTeamUser } from '../../core/types/teamTypes';
import { toast } from 'react-hot-toast';

const TeamsSection: React.FC = () => {
  const { teams, loading, error, isProcessing, fetchTeams, createTeam, deleteTeam, changeUserTeam } = useTeams();

  const [newTeamName, setNewTeamName] = useState('');
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [processingTeamId, setProcessingTeamId] = useState<number | null>(null);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [draggedUser, setDraggedUser] = useState<{ user: TTeamUser; sourceTeamId: number } | null>(null);
  const [dropTargetTeamId, setDropTargetTeamId] = useState<number | null>(null);
  const [showDropHint, setShowDropHint] = useState(false);
  const [showUserTransferModal, setShowUserTransferModal] = useState(false);
  const [userToTransfer, setUserToTransfer] = useState<TTeamUser | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<{ id: number; name: string; userCount: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedUserId, setDraggedUserId] = useState<string | null>(null);

  // Reference for auto-scrolling during drag
  const teamListRef = useRef<HTMLDivElement>(null);

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Close expanded team on mobile devices to avoid cluttered display
      if (window.innerWidth < 640 && expandedTeam !== null) {
        setExpandedTeam(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [expandedTeam]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim() && !isProcessing) {
      const success = await createTeam(newTeamName.trim());
      if (success) {
        setNewTeamName('');
      }
    }
  };

  const initiateDeleteTeam = (teamWithUsers: TTeamWithUsers) => {
    setTeamToDelete({
      id: teamWithUsers.team.id,
      name: teamWithUsers.team.name,
      userCount: teamWithUsers.users.length,
    });
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteTeam = async () => {
    if (teamToDelete && teamToDelete.userCount === 0 && !isProcessing) {
      setProcessingTeamId(teamToDelete.id);
      const success = await deleteTeam(teamToDelete.id);
      setProcessingTeamId(null);
      setShowDeleteConfirmModal(false);
      setTeamToDelete(null);
      return success;
    }
    return false;
  };

  const toggleTeamExpand = (teamId: number) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLElement>, userId: string, teamId: number, userName: string) => {
    e.dataTransfer.setData('userId', userId);
    e.dataTransfer.setData('sourceTeamId', teamId.toString());
    e.dataTransfer.setData('userName', userName);
    setIsDragging(true);
    setDraggedUserId(userId);

    // Add visual styles to the dragged element
    if (e.currentTarget) {
      e.currentTarget.classList.add('opacity-50', 'border-dashed', 'border-2', 'border-blue-400');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>, teamId: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Only highlight if dragging to a different team
    const sourceTeamId = e.dataTransfer.getData('sourceTeamId');
    if (sourceTeamId && sourceTeamId !== teamId.toString()) {
      setDropTargetTeamId(teamId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetTeamId(null);
  };

  // Drag and drop transfer functionality
  const handleDragDropTransfer = async (userId: string, targetTeamId: number, userName: string = '') => {
    if (!userId || isProcessing) return;

    setProcessingUserId(userId);
    const success = await changeUserTeam(userId, targetTeamId);
    if (success && userName) {
      toast.success(`${userName} transferred successfully`);
    }
    setProcessingUserId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, teamId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const userId = e.dataTransfer.getData('userId');
    const sourceTeamId = e.dataTransfer.getData('sourceTeamId');
    const userName = e.dataTransfer.getData('userName');

    if (userId && sourceTeamId && sourceTeamId !== teamId.toString()) {
      handleDragDropTransfer(userId, teamId, userName);
    }

    setDropTargetTeamId(null);
    setIsDragging(false);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLElement>) => {
    // Remove visual styles from the dragged element
    if (e.currentTarget) {
      e.currentTarget.classList.remove('opacity-50', 'border-dashed', 'border-2', 'border-blue-400');
    }

    setIsDragging(false);
    setDraggedUserId(null);
    setDropTargetTeamId(null);
  };

  // Manual transfer handlers
  const openTransferModal = (user: TTeamUser, currentTeamId: number) => {
    setUserToTransfer(user);
    setCurrentTeamId(currentTeamId);
    setSelectedTeamId(null);
    setShowUserTransferModal(true);
  };

  const handleTransferUser = async () => {
    if (userToTransfer && selectedTeamId !== null && !isProcessing) {
      setProcessingUserId(userToTransfer.id);
      const success = await changeUserTeam(userToTransfer.id, selectedTeamId);
      if (success) {
        setShowUserTransferModal(false);
        setUserToTransfer(null);
        setSelectedTeamId(null);
      }
      setProcessingUserId(null);
    }
  };

  // Team Members Section
  const renderTeamMembers = (teamWithUsers: TTeamWithUsers) => {
    return (
      <div className='p-4'>
        <div className='flex justify-between items-center mb-3'>
          <h5 className='text-sm font-bold text-gray-700 uppercase tracking-wider'>TEAM MEMBERS</h5>
        </div>

        {teamWithUsers.users.length === 0 ? (
          <p className='text-sm text-gray-500 italic'>No members in this team.</p>
        ) : (
          <div className='bg-gray-50 rounded-lg'>
            {/* Users list */}
            <ul className='divide-y divide-gray-200'>
              {(expandedTeam === teamWithUsers.team.id ? teamWithUsers.users : teamWithUsers.users.slice(0, 4)).map(
                (user: TTeamUser) => (
                  <li
                    key={user.id}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, user.id, teamWithUsers.team.id, `${user.firstName} ${user.lastName}`)
                    }
                    onDragEnd={(e) => handleDragEnd(e)}
                    className={`flex flex-wrap items-center p-3 transition-all duration-150 group
                    ${processingUserId === user.id ? 'opacity-50 bg-blue-50' : 'hover:bg-gray-100'}
                    ${draggedUserId === user.id ? 'border-2 border-dashed border-blue-400 bg-blue-50' : ''}
                  `}
                  >
                    <div className='w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3'>
                      <span className='font-medium text-indigo-700'>{user.firstName.charAt(0)}</span>
                    </div>
                    <div className='flex-1 min-w-0 mr-2'>
                      <p className='text-sm font-medium text-gray-800 truncate'>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                    </div>
                    {user.position && (
                      <span className='px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 mr-3 mb-1 sm:mb-0 hidden md:inline-block'>
                        {user.position}
                      </span>
                    )}
                    <div className='flex items-center mt-2 sm:mt-0 w-full sm:w-auto'>
                      <button
                        onClick={() => openTransferModal(user, teamWithUsers.team.id)}
                        disabled={isProcessing || processingUserId === user.id}
                        className={`ml-auto sm:ml-2 px-3 py-1 rounded-md text-xs flex items-center ${
                          isProcessing || processingUserId === user.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 focus:outline-none transition-colors duration-200'
                        }`}
                      >
                        <ArrowRightIcon className='h-3.5 w-3.5 mr-1' />
                        Transfer
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>

            {/* Show more button if more than 4 users and not expanded */}
            {expandedTeam !== teamWithUsers.team.id && teamWithUsers.users.length > 4 && (
              <button
                onClick={() => toggleTeamExpand(teamWithUsers.team.id)}
                className='w-full py-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center justify-center'
              >
                Show {teamWithUsers.users.length - 4} more
                <ChevronDownIcon className='ml-1 h-4 w-4' />
              </button>
            )}

            {/* Show less button if expanded */}
            {expandedTeam === teamWithUsers.team.id && teamWithUsers.users.length > 4 && (
              <button
                onClick={() => toggleTeamExpand(teamWithUsers.team.id)}
                className='w-full py-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center justify-center'
              >
                Show less
                <ChevronDownIcon className='ml-1 h-4 w-4 transform rotate-180' />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='h-12 w-12 relative'>
          <div className='absolute top-0 left-0 right-0 bottom-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
          <div className='absolute top-1 left-1 right-1 bottom-1 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin-slow'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl shadow-sm mb-6 border-l-4 border-red-500'>
        <p className='text-red-700 font-medium'>{error}</p>
        <button
          onClick={() => fetchTeams()}
          className='mt-3 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Create New Team Form */}
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg rounded-xl p-4 sm:p-8 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 opacity-40'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full -ml-12 -mb-12 opacity-40'></div>

        <h3 className='text-xl font-bold text-gray-800 mb-4 sm:mb-6 relative z-10'>Create New Team</h3>
        <form
          onSubmit={handleCreateTeam}
          className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 relative z-10'
        >
          <input
            type='text'
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder='Enter team name...'
            className='flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block px-4 py-3 text-md border-gray-300 rounded-lg'
            disabled={isProcessing}
          />
          <button
            type='submit'
            disabled={!newTeamName.trim() || isProcessing}
            className={`px-6 py-3 rounded-lg shadow-md flex items-center justify-center ${
              !newTeamName.trim() || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:translate-y-[-2px] transition-all duration-200'
            }`}
          >
            <PlusIcon className='h-5 w-5 mr-2' />
            <span className='font-medium'>Add Team</span>
          </button>
        </form>
      </div>

      {/* Usage Instructions */}
      <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center'>
        <div className='bg-yellow-100 rounded-full p-2 mr-3 flex-shrink-0'>
          <UserIcon className='h-5 w-5 sm:h-6 sm:w-6 text-yellow-600' />
        </div>
        <p className='text-yellow-800 text-sm sm:text-base'>
          <span className='font-bold'>Pro tip:</span> Drag and drop users between teams or use the transfer button to
          move them!
        </p>
      </div>

      {/* Team Grid */}
      <div className='bg-white shadow-lg rounded-xl overflow-hidden'>
        <div className='bg-gradient-to-r from-indigo-600 to-blue-600 py-4 px-6'>
          <h3 className='text-xl font-bold text-white'>Teams</h3>
        </div>

        {teams.length === 0 ? (
          <div className='py-12 text-center'>
            <div className='bg-gray-100 inline-block p-5 rounded-full mb-4'>
              <UserIcon className='h-10 w-10 text-gray-400' />
            </div>
            <p className='text-gray-500 text-lg'>No teams found. Create your first team above.</p>
          </div>
        ) : (
          <div className='p-3 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' ref={teamListRef}>
            {teams.map((teamWithUsers) => (
              <div
                key={teamWithUsers.team.id}
                className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden
                  ${dropTargetTeamId === teamWithUsers.team.id ? 'ring-2 ring-blue-400 bg-blue-50 shadow-md' : ''}
                `}
                onDragOver={(e) => handleDragOver(e, teamWithUsers.team.id)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e, teamWithUsers.team.id)}
              >
                {/* Team Header */}
                <div className='bg-gray-50 p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500'][
                          teamWithUsers.team.id % 5
                        ]
                      }`}
                    >
                      <span className='text-white font-bold'>{teamWithUsers.team.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className='ml-3 min-w-0'>
                      <h4 className='text-base sm:text-lg font-bold text-gray-800 truncate'>
                        {teamWithUsers.team.name}
                      </h4>
                      <p className='text-xs sm:text-sm text-gray-500'>
                        {teamWithUsers.users.length} {teamWithUsers.users.length === 1 ? 'member' : 'members'}
                      </p>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => initiateDeleteTeam(teamWithUsers)}
                    disabled={isProcessing || processingTeamId === teamWithUsers.team.id}
                    className={`p-2 rounded-full ${
                      isProcessing || processingTeamId === teamWithUsers.team.id
                        ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                        : 'bg-red-100 hover:bg-red-200 text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-110 transition-all duration-200'
                    }`}
                    title='Delete team'
                  >
                    <TrashIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                  </button>
                </div>

                {/* Drop indicator */}
                {dropTargetTeamId === teamWithUsers.team.id && (
                  <div className='px-4 py-3 bg-blue-100 text-blue-700 text-xs sm:text-sm flex items-center justify-center font-medium border-b border-blue-200'>
                    <span className='animate-pulse'>Drop user here to transfer to {teamWithUsers.team.name}</span>
                  </div>
                )}

                {/* Render team members using the extracted function */}
                {renderTeamMembers(teamWithUsers)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Transfer Modal */}
      {showUserTransferModal && userToTransfer && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md mx-auto transform transition-all duration-300 scale-100'>
            <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-4'>Transfer User to Another Team</h3>

            <div className='mb-6'>
              <div className='flex items-center mb-4'>
                <div className='w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center mr-3 flex-shrink-0'>
                  <span className='font-medium text-indigo-700'>{userToTransfer.firstName.charAt(0)}</span>
                </div>
                <div className='min-w-0'>
                  <p className='font-medium text-gray-800 truncate'>
                    {userToTransfer.firstName} {userToTransfer.lastName}
                  </p>
                  <p className='text-sm text-gray-500 truncate'>{userToTransfer.email}</p>
                </div>
              </div>

              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-600'>Select new team:</p>
                <div className='max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y'>
                  {teams
                    .filter((team) => team.team.id !== currentTeamId)
                    .map((team) => (
                      <button
                        key={team.team.id}
                        onClick={() => setSelectedTeamId(team.team.id)}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3 ${
                          selectedTeamId === team.team.id
                            ? 'bg-indigo-50 border-l-4 border-indigo-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                            ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500'][
                              team.team.id % 5
                            ]
                          }`}
                        >
                          <span className='text-xs sm:text-sm text-white font-bold'>
                            {team.team.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className='font-medium text-gray-800 truncate'>{team.team.name}</span>
                        <span className='text-xs text-gray-500 ml-auto'>
                          {team.users.length} {team.users.length === 1 ? 'member' : 'members'}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3'>
              <button
                onClick={() => setShowUserTransferModal(false)}
                className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg focus:outline-none'
              >
                Cancel
              </button>
              <button
                onClick={handleTransferUser}
                disabled={selectedTeamId === null || isProcessing}
                className={`px-4 py-2 rounded-lg ${
                  selectedTeamId === null || isProcessing
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                }`}
              >
                {isProcessing ? 'Transferring...' : 'Transfer User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Confirmation Modal */}
      {showDeleteConfirmModal && teamToDelete && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md mx-auto transform transition-all duration-300 scale-100'>
            <div className='flex items-start mb-5'>
              <div className='flex-shrink-0 bg-red-100 rounded-full p-3'>
                <ExclamationTriangleIcon className='h-5 w-5 sm:h-6 sm:w-6 text-red-600' />
              </div>
              <div className='ml-4 flex-1 min-w-0'>
                <h3 className='text-lg sm:text-xl font-bold text-gray-800'>Delete team?</h3>
                {teamToDelete.userCount > 0 ? (
                  <p className='mt-2 text-red-600 text-sm sm:text-base'>
                    This team has {teamToDelete.userCount} {teamToDelete.userCount === 1 ? 'member' : 'members'}. Please
                    transfer all members to another team first, and then delete the team.
                  </p>
                ) : (
                  <p className='mt-2 text-gray-600 text-sm sm:text-base'>
                    Are you sure you want to delete <span className='font-semibold'>{teamToDelete.name}</span>? This
                    action cannot be undone.
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setTeamToDelete(null);
                }}
                className='flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-100'
              >
                <XMarkIcon className='h-4 w-4 sm:h-5 sm:w-5 text-gray-500' />
              </button>
            </div>

            <div className='flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3'>
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setTeamToDelete(null);
                }}
                className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg focus:outline-none'
              >
                Cancel
              </button>
              {teamToDelete.userCount > 0 ? (
                <button
                  onClick={() => {
                    setShowDeleteConfirmModal(false);
                    setTeamToDelete(null);
                    setExpandedTeam(teamToDelete.id);
                  }}
                  className='px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700'
                >
                  Manage Team Members
                </button>
              ) : (
                <button
                  onClick={handleDeleteTeam}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-lg ${
                    isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isProcessing ? 'Deleting...' : 'Delete Team'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsSection;
