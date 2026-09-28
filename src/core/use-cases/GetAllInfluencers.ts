import type { InfluencerRepository } from "../application/ports/influencer";

interface Payload {
  limit: number;
  offset: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export class GetAllInfluencersUseCase {
  constructor(
    private readonly repo: InfluencerRepository,
  ) { }

  async execute(payload: Payload) {
    return await this.repo.getAll({
      limit: payload.limit,
      offset: payload.offset,
      search: payload.search,
      sortOrder: payload.sortOrder,
      sortBy: payload.sortBy,
    });
  }
}
