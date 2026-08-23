import type { Result } from "neverthrow";
import type { Recommendation } from "../../domain/entities/recommendation";
import type { PaginatedResponse } from "../types/paginatinated-response";
import type { Book } from "@/core/domain/entities/book";
import type { AuthorUser, User } from "@/core/domain/entities/user";

export interface GetAllRecommendationsParams {
  limit: number;
  offset: number;
  bookId?: string;
  authorId?: string;
}

export interface FindByBookIdResult {
  book: Book;
  author: User & AuthorUser;
  recommendation: Recommendation;
}

export interface FindByInfluencerIdResult {
  book: Book;
  recommendation: Recommendation;
}

export interface RecommendationRepository {
  findByBookId(bookId: string): Promise<Result<FindByBookIdResult[], string>>;
  findByInfluencerId(
    influencerId: string,
  ): Promise<Result<FindByInfluencerIdResult[], string>>;
  create(
    recommendation: Omit<Recommendation, "createdAt" | "updatedAt" | "id">,
  ): Promise<Result<Recommendation, string>>;
  getAll(
    params: GetAllRecommendationsParams,
  ): Promise<Result<PaginatedResponse<Recommendation>, string>>;
}
