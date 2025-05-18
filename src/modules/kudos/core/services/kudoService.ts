import { KudoRepository, KudoApiResponse } from '../interfaces/repositories/kudoRepository';
import { UserRepository } from '../interfaces/repositories/userRepository';
import { Kudo, KudoFilters, CreateKudoRequest, User, Team } from '../types/kudoTypes';

/**
 * Service for managing kudos operations
 */
export class KudoService {
  constructor(private kudoRepository: KudoRepository, private userRepository: UserRepository) {}

  /**
   * Get all kudos
   */
  async getAllKudos(): Promise<KudoApiResponse> {
    return this.kudoRepository.getAllKudos();
  }

  /**
   * Get filtered kudos
   * @param filters Filters to apply
   */
  async getFilteredKudos(filters: KudoFilters): Promise<KudoApiResponse> {
    return this.kudoRepository.getFilteredKudos(filters);
  }

  /**
   * Get a kudo by ID
   * @param id Kudo ID
   */
  async getKudoById(id: string): Promise<Kudo | null> {
    return this.kudoRepository.getKudoById(id);
  }

  /**
   * Create a new kudo
   * @param data Kudo creation data
   */
  async createKudo(data: CreateKudoRequest): Promise<Kudo> {
    // Get current user
    const currentUser = await this.userRepository.getCurrentUser();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    return this.kudoRepository.createKudo(data, currentUser.id);
  }

  /**
   * Delete a kudo by ID
   * @param id Kudo ID to delete
   */
  async deleteKudo(id: string): Promise<void> {
    // Get current user to verify authorization if needed
    const currentUser = await this.userRepository.getCurrentUser();

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    return this.kudoRepository.deleteKudo(id);
  }

  /**
   * Get available teams
   */
  async getTeams(): Promise<Team[]> {
    try {
      // Access the API through the repository
      return this.userRepository.getTeams();
    } catch (error) {
      console.error('Error fetching teams:', error);
      // Return empty array if API fails
      return [];
    }
  }

  /**
   * Search for users
   * @param query Search query string
   */
  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.searchUsers(query);
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    return this.userRepository.getCurrentUser();
  }
}
