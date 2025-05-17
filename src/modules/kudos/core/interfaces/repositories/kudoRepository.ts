import { Kudo, KudoFilters, CreateKudoRequest } from '../../types/kudoTypes';

/**
 * Repository interface for kudos operations
 */
export interface KudoRepository {
  /**
   * Get all kudos
   */
  getAllKudos(): Promise<Kudo[]>;

  /**
   * Get kudos with filters applied
   * @param filters Filters to apply
   */
  getFilteredKudos(filters: KudoFilters): Promise<Kudo[]>;

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
}
