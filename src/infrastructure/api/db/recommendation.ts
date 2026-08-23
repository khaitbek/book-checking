import { and, desc, eq } from "drizzle-orm";
import type {
  FindByBookIdResult,
  FindByInfluencerIdResult,
  GetAllRecommendationsParams,
  RecommendationRepository,
} from "@/core/application/ports/recommendation";
import type { Recommendation } from "@/core/domain/entities/recommendation";
import { db } from "./index";
import { books, recommendations, users } from "./schema";
import { type Result, ResultAsync } from "neverthrow";
import type { PaginatedResponse } from "@/core/application/types/paginatinated-response";

export class DrizzleRecommendationRepository
  implements RecommendationRepository
{
  async findByBookId(
    bookId: string,
  ): Promise<Result<FindByBookIdResult[], string>> {
    return ResultAsync.fromThrowable(async () => {
      const response = await db
        .select({
          recommendation: recommendations,
          author: users,
          book: books,
        })
        .from(recommendations)
        .innerJoin(users, eq(recommendations.authorId, users.id))
        .innerJoin(books, eq(recommendations.bookId, books.id))
        .where(eq(recommendations.bookId, bookId))
        .orderBy(desc(recommendations.createdAt));

      return response as unknown as FindByBookIdResult[];
    })().mapErr((err) =>
      err instanceof Error
        ? err.message
        : `Failed to invoke findByBookId: ${err}`,
    );
  }

  async findByInfluencerId(
    influencerId: string,
  ): Promise<Result<FindByInfluencerIdResult[], string>> {
    return await ResultAsync.fromThrowable(async () => {
      const result = await db
        .select({
          recommendation: recommendations,
          book: books,
        })
        .from(recommendations)
        .innerJoin(books, eq(recommendations.bookId, books.id))
        .where(eq(recommendations.authorId, influencerId));

      return result as unknown as FindByInfluencerIdResult[];
    })().mapErr((err) =>
      err instanceof Error
        ? err.message
        : `Failed to invoke findByInfluencerId: ${err}`,
    );
  }

  async create(
    recData: Omit<Recommendation, "createdAt" | "id" | "updatedAt">,
  ): Promise<Result<Recommendation, string>> {
    return await ResultAsync.fromThrowable(
      async () => {
        const [newRec] = await db
          .insert(recommendations)
          .values({
            authorId: recData.authorId,
            bookId: recData.bookId,
            quote: recData.quote,
            sourceUrl: recData.sourceUrl,
          })
          .returning();
        return newRec;
      },
      (error) => {
        console.error("Error creating recommendation:", error);
        return String(error);
      },
    )();
  }

  async getAll(
    params: GetAllRecommendationsParams,
  ): Promise<Result<PaginatedResponse<Recommendation>, string>> {
    const whereConditions = [];
    if (params.authorId) {
      whereConditions.push(eq(recommendations.authorId, params.authorId));
    }
    if (params.bookId) {
      whereConditions.push(eq(recommendations.bookId, params.bookId));
    }
    const where = and(...whereConditions);
    const result = await ResultAsync.fromThrowable(
      async () => {
        const recs = await db.query.recommendations.findMany({
          with: {
            author: true,
            book: true,
          },
          orderBy: [desc(recommendations.createdAt)],
          where,
        });
        const count = await db.$count(recommendations);
        return {
          data: recs,
          total: count,
          currentPage: params.offset / params.limit + 1,
          pageSize: params.limit,
          totalPages: Math.ceil(count / params.limit),
        };
      },
      (error) => String(error),
    )();
    return result;
  }
}
