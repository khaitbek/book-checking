import type {
  CreateAuthorPayload,
  CreatePayload,
  GetAllPayload,
  SearchByNamePayload,
  UpdateByIdPayload,
  UserRepository,
} from "@/core/application/ports/user";
import type { User } from "@/core/domain/entities/user";
import { and, desc, eq, ilike, arrayOverlaps, sql } from "drizzle-orm";
import { db } from "./index";
import { recommendations, users } from "./schema";
import { type Result, ResultAsync } from "neverthrow";
import type { PaginatedResponse } from "@/core/application/types/paginatinated-response";
import {
  Influencer,
  InfluencerWithRecommendationCount,
} from "@/core/domain/entities/influencer";

export class DrizzleUserRepository<TUser>
  implements UserRepository<User & TUser>
{
  async findById(id: string): Promise<Result<User & TUser, string>> {
    return await ResultAsync.fromThrowable(async () => {
      const result = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      if (result === undefined)
        throw new Error(`Failed to find user with the ID: ${id}`);
      return result as unknown as User & TUser;
    })().mapErr((err) =>
      err instanceof Error
        ? err.message
        : `Failed to invoke findById() method in DrizzleUserRepository: ${err}`,
    );
  }

  async findAll(
    payload: GetAllPayload,
  ): Promise<Result<PaginatedResponse<User & TUser>, string>> {
    return await ResultAsync.fromThrowable(async () => {
      const result = await db.query.users.findMany({
        limit: payload.limit,
        offset: payload.offset,
        where: payload.search
          ? ilike(users.name, `%${payload.search}%`)
          : undefined,
        orderBy: [desc(users.createdAt)],
      });
      const count = await db.$count(users);
      const response: PaginatedResponse<User & TUser> = {
        data: result as unknown as (User & TUser)[],
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

  async findByRole(payload: {
    role: User["role"] | [];
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<Result<(User & TUser)[], string>> {
    return ResultAsync.fromThrowable(async () => {
      const conditions = [];
      if (payload.search) {
        conditions.push(ilike(users.name, `%${payload.search}%`));
      }
      if (payload.role && payload.role.length > 0) {
        conditions.push(arrayOverlaps(users.role, payload.role));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const result = await db.query.users.findMany({
        where,
        limit: payload.limit,
        offset: payload.offset,
        orderBy: [desc(users.createdAt)],
      });

      return result as unknown as (User & TUser)[];
    })().mapErr((err) =>
      err instanceof Error
        ? err.message
        : `findByRole() method failed in DrizzleUserRepository: ${err}`,
    );
  }

  async create(payload: CreatePayload): Promise<Result<User & TUser, string>> {
    return await ResultAsync.fromThrowable(async () => {
      const [newPerson] = await db
        .insert(users)
        .values([
          {
            ...payload,
          },
        ])
        .returning();
      return newPerson as unknown as User & TUser;
    })().mapErr((err) =>
      err instanceof Error
        ? err.message
        : `create() method failed in DrizzleUserRepository: ${err}`,
    );
  }

  async updateById({
    id,
    update,
  }: UpdateByIdPayload): Promise<Result<User & TUser, string>> {
    return await ResultAsync.fromThrowable(async () => {
      const [updatedUser] = await db
        .update(users)
        .set(update)
        .where(eq(users.id, id))
        .returning();
      return updatedUser as unknown as User & TUser;
    })().mapErr((err) =>
      err instanceof Error
        ? err.message
        : `updateById() method failed in DrizzleUserRepository: ${err}`,
    );
  }

  async searchByName({
    name,
    limit = 20,
    offset = 0,
  }: SearchByNamePayload): Promise<Result<(User & TUser)[], string>> {
    return await ResultAsync.fromThrowable(
      async () => {
        const result = await db
          .select()
          .from(users)
          .where(ilike(users.name, `%${name}%`))
          .limit(limit)
          .offset(offset);

        return result as unknown as (User & TUser)[];
      },
      (error) => {
        return `searchByName() method failed in DrizzleUserRepository: ${error}`;
      },
    )();
  }
}

export class DrizzleAuthorRepository<
  AuthorUser,
> extends DrizzleUserRepository<AuthorUser> {
  async findAll(payload: GetAllPayload) {
    return await ResultAsync.fromThrowable(async () => {
      const conditions = [arrayOverlaps(users.role, ["AUTHOR"])];
      if (payload.search) {
        conditions.push(ilike(users.name, `%${payload.search}`));
      }
      const where = and(...conditions);

      const result = await db.query.users.findMany({
        limit: payload.limit,
        offset: payload.offset,
        where,
        orderBy: [desc(users.createdAt)],
        with: {
          authoredBooks: true,
        },
      });
      const count = await db.$count(users);
      const response: PaginatedResponse<User & AuthorUser> = {
        data: result as unknown as (User & AuthorUser)[],
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

  async findById(id: string) {
    return await ResultAsync.fromThrowable(async () => {
      const result = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          authoredBooks: {
            with: {
              recommendations: true,
            },
          },
        },
      });
      if (result === undefined)
        throw new Error(`Failed to find user with the ID: ${id}`);
      return result as unknown as User & AuthorUser;
    })().mapErr((err) =>
      err instanceof Error
        ? err.message
        : `Failed to invoke findById() method in DrizzleUserRepository: ${err}`,
    );
  }

  async create(payload: CreateAuthorPayload) {
    return await super.create(payload);
  }
}
