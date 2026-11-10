import type { Book } from "@/core/domain/entities/book";
import type { Recommendation } from "@/core/domain/entities/recommendation";
import type { AuthorUser, User } from "@/core/domain/entities/user";

export interface RecommendationWithEntities extends Recommendation {
  book: Book;
  author: User & AuthorUser;
}
