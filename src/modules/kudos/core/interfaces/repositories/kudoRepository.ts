import { Kudo, KudoFilters, CreateKudoRequest } from '../../types/kudoTypes';

// API response interface to match server response format
export interface KudoApiResponse {
  cards: Kudo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Repository interface for kudos operations
 */
export interface KudoRepository {
  /**
   * Get all kudos
   */
  getAllKudos(): Promise<KudoApiResponse>;

  /**
   * Get kudos with filters applied
   * @param filters Filters to apply
   */
  getFilteredKudos(filters: KudoFilters): Promise<KudoApiResponse>;

  /**
   * Get a single kudo by ID
   * @param id Kudo ID
   */
  getKudoById(id: string): Promise<Kudo | null>;

  /**
   * Create a new kudo
   * @param data Kudo creation data
   * @param senderId ID of the sender
   */
  createKudo(data: CreateKudoRequest, senderId: string): Promise<Kudo>;

  /**
   * Delete a kudo by ID
   * @param id Kudo ID
   */
  deleteKudo(id: string): Promise<void>;
}
