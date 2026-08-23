"use server";

import {
  getAllBooksUseCase,
  getAllInfluencersUseCase,
  recommendationRepository,
} from "@/composition";
import type { GetAllBooksQuery } from "@/core/application/ports/book";
import type { GetAllRecommendationsParams } from "@/core/application/ports/recommendation";

export async function getAllRecommendations(
  params: GetAllRecommendationsParams,
) {
  const result = await recommendationRepository.getAll(params);
  if (result.isErr()) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    data: result.value,
  };
}

export async function searchBooks(
  query: Omit<GetAllBooksQuery, "limit" | "offset">,
) {
  const result = await getAllBooksUseCase.execute({
    limit: 20,
    offset: 0,
    ...query,
  });
  if (result.isErr()) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    data: result.value.data,
  };
}

export async function searchInfluencersByName(search: string) {
  const result = await getAllInfluencersUseCase.execute({
    limit: 20,
    offset: 0,
    search,
  });

  if (result.isErr()) {
    return {
      success: false as const,
      error: result.error,
    };
  }

  return {
    success: true as const,
    value: result.value.data,
  };
}
