import { KudoRepository } from '../interfaces/repositories/kudoRepository';
import { UserRepository } from '../interfaces/repositories/userRepository';
import { Kudo, KudoFilters, CreateKudoRequest, User } from '../types/kudoTypes';

/**
 * Service for managing kudos operations
 */
export class KudoService {
  constructor(private kudoRepository: KudoRepository, private userRepository: UserRepository) {}

  /**
   * Get all kudos
   */
  async getAllKudos(): Promise<Kudo[]> {
    return this.kudoRepository.getAllKudos();
  }

  /**
   * Get filtered kudos
   * @param filters Filters to apply
   */
  async getFilteredKudos(filters: KudoFilters): Promise<Kudo[]> {
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
   * Get available teams
   */
  async getTeams(): Promise<string[]> {
    const users = await this.userRepository.getAllUsers();
    const teams = users.map((user) => user.team).filter((team): team is string => team !== undefined);

    // Get unique team names
    return Array.from(new Set(teams));
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
