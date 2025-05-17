export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatar?: string;
  team?: string;
  name?: string;
}

export interface Kudo {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdFor: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  recipient: User;
  category?: string;
  team?: string;

  // Legacy/mock properties
  sender?: string;
  senderAvatar?: string;
  recipientName?: string;
  recipientAvatar?: string;
  message?: string;
}

export interface KudoFilters {
  searchTerm?: string;
  team?: string;
  category?: string;
}

export interface CreateKudoRequest {
  title: string;
  content: string;
  recipientId: string;
  category?: string;
  message?: string;
}

export interface UseCaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type KudoCategory = 'Teamwork' | 'Innovation' | 'Helping Hand' | 'default';

export interface Team {
  id: string;
  name: string;
}
