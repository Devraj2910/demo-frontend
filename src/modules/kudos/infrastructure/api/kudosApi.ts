import { MockKudoRepository } from '../repositories/MockKudoRepository';
import { MockUserRepository } from '../repositories/MockUserRepository';
import { KudoRepository } from '../../domain/repositories/KudoRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';

/**
 * API client for the Kudos feature
 * This would typically connect to a real API, but we're using mock repositories for now
 */
export class KudosApiClient {
  private kudoRepository: KudoRepository;
  private userRepository: UserRepository;
  private static instance: KudosApiClient;

  constructor() {
    this.kudoRepository = new MockKudoRepository();
    this.userRepository = new MockUserRepository();
  }

  /**
   * Factory method to create an API client instance
   */
  static create(): KudosApiClient {
    return new KudosApiClient();
  }

  /**
   * Get singleton instance of the API client
   */
  static getInstance(): KudosApiClient {
    if (!KudosApiClient.instance) {
      KudosApiClient.instance = new KudosApiClient();
    }
    return KudosApiClient.instance;
  }

  /**
   * Get the kudo repository
   */
  getKudoRepository(): KudoRepository {
    return this.kudoRepository;
  }

  /**
   * Get the user repository
   */
  getUserRepository(): UserRepository {
    return this.userRepository;
  }
}

// Export a singleton instance
export const kudosApi = KudosApiClient.create();
