import { KudoApiResponse } from "../interfaces/repositories/kudoRepository";
import { KudoService } from "../services/kudoService";
import { KudoFilters, UseCaseResult, Kudo } from "../types/kudoTypes";

/**
 * Use case for retrieving kudos
 */
export class GetKudosUseCase {
  constructor(private kudoService: KudoService) {}

  /**
   * Execute the use case to get kudos with optional filters
   * @param filters Optional filters to apply
   */
  async execute(
    filters?: KudoFilters
  ): Promise<UseCaseResult<KudoApiResponse>> {
    try {
      const kudos = filters
        ? await this.kudoService.getFilteredKudos(filters)
        : await this.kudoService.getAllKudos();

      return {
        success: true,
        data: kudos,
      };
    } catch (error) {
      console.error("Error fetching kudos:", error);
      return {
        success: false,
        error: "Failed to load kudos",
      };
    }
  }
}
