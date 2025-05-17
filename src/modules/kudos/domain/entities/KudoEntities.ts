/**
 * Core entities for the Kudos feature
 */

/**
 * Represents a single kudos recognition
 */
export interface Kudo {
  id: string;
  sender: string;
  recipient: string;
  team?: string;
  category: string;
  message: string;
  createdAt: string;
  senderAvatar?: string;
  recipientAvatar?: string;
}

/**
 * Represents a user in the system
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name?: string; // Keeping for backward compatibility
  team: string;
  avatar?: string;
  role?: string;
}

/**
 * Available filter options for the kudos wall
 */
export interface KudoFilters {
  searchTerm?: string;
  team?: string;
  category?: string;
}

/**
 * Possible categories for kudos
 */
export type KudoCategory =
  | 'Teamwork'
  | 'Innovation'
  | 'Excellence'
  | 'Leadership'
  | 'Problem Solving'
  | 'Knowledge Sharing';

/**
 * Teams in the organization
 */
export type TeamName = 'Alpha' | 'Bravo' | 'Charlie' | 'Data' | 'AI';

/**
 * Data needed to create a new kudo
 */
export interface CreateKudoRequest {
  recipientId: string;
  category: string;
  message: string;
  isPublic?: boolean;
}
