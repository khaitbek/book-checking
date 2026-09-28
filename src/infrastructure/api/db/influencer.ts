import type { GetAllPayload } from "@/core/application/ports/user";
import type { PaginatedResponse } from "@/core/application/types/paginatinated-response";
import type { InfluencerWithRecommendationCount } from "@/core/domain/entities/influencer";
import { and, arrayOverlaps, asc, desc, ilike, sql } from "drizzle-orm";
import { type Result, ResultAsync } from "neverthrow";
import { recommendations, users } from "./schema";
import { db } from ".";
import type { InfluencerRepository } from "@/core/application/ports/influencer";

export class DrizzleInfluencerRepository implements InfluencerRepository {
  async getAll(
    payload: GetAllPayload,
  ): Promise<
    Result<PaginatedResponse<InfluencerWithRecommendationCount>, string>
  > {
    return await ResultAsync.fromThrowable(async () => {
      const conditions = [];
      if (payload.search) {
        conditions.push(ilike(users.name, `%${payload.search}%`));
      }
      conditions.push(arrayOverlaps(users.role, ["INFLUENCER"]));
      const sortConditions = [];
      const recommendationCountQuery = sql<number>`cast((
                        SELECT count(*)
                        FROM ${recommendations}
                        WHERE ${recommendations.authorId} = "users"."id"
                    ) as int)`;
      if (payload.sortBy) {
        if (payload.sortOrder === "ASC")
          sortConditions.push(asc(recommendationCountQuery));
        else sortConditions.push(desc(recommendationCountQuery));
      } else {
        sortConditions.push(desc(users.createdAt));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const result = await db
        .select({
          numberOfRecommendations: recommendationCountQuery,
          id: users.id,
          name: users.name,
          role: users.role,
          image: users.image,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(where)
        .orderBy(...sortConditions)
        .limit(payload.limit)
        .offset(payload.offset)
        .execute();
      const count = await db.$count(users, where);
      const response: PaginatedResponse<InfluencerWithRecommendationCount> = {
        data: result as unknown as InfluencerWithRecommendationCount[],
        total: count,
        currentPage: payload.offset,
        pageSize: payload.limit,
        totalPages: Math.ceil(count / payload.limit),
      };
      return response;
    })().mapErr((error) =>
      error instanceof Error
        ? error.message
        : `Failed to execute the findAll method in DrizzleAuthorRepository: ${error}`,
    );
  }
}
