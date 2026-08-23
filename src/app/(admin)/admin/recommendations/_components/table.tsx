"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getAllRecommendations,
  searchBooks,
  searchInfluencersByName,
} from "../_actions/query";
import { AsyncSearchDropdown } from "@/components/widgets/async-search-dropdown/ui/widget";
import type { InfluencerUser, User } from "@/core/domain/entities/user";
import { searchAuthors } from "../../authors/_actions/query";
import { Button, buttonVariants } from "@/components/ui/button";
import { X } from "lucide-react";
import { DataTable } from "@/components/widgets/data-table";
import { columns } from "./columns";
import Link from "next/link";
import type { Book } from "@/core/domain/entities/book";
import { InfluencerWithRecommendationCount } from "@/core/domain/entities/influencer";

export function Table() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);
  const query = useQuery({
    queryKey: [
      "recommendations",
      {
        page,
        pageSize,
        authorId,
        bookId,
      },
    ],
    queryFn: async () => {
      const result = await getAllRecommendations({
        limit: pageSize,
        offset: page * pageSize,
        authorId: authorId ?? undefined,
        bookId: bookId ?? undefined,
      });
      if (result.success === false) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  function resetFilters() {
    setAuthorId(null);
    setPage(0);
    setPageSize(10);
    setBookId(null);
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-6 mb-6">
        <div className="flex gap-2 items-center flex-wrap *:max-w-max">
          <AsyncSearchDropdown<User & InfluencerUser>
            value={authorId}
            getOptionValue={(influencer) => influencer.id}
            getOptionLabel={(influencer) => influencer.name}
            placeholder="Search for an influencer"
            onChange={(influencerId) => {
              setAuthorId(influencerId);
            }}
            fetchPage={async ({ search }) => {
              const result = await searchInfluencersByName(search);
              if (result.success === false) {
                return [];
              }
              return result.value;
            }}
            className="max-w-max"
          />
          <AsyncSearchDropdown<Book>
            value={authorId}
            getOptionValue={(book) => book.id}
            getOptionLabel={(book) => book.title}
            placeholder="Search for a book"
            onChange={(bookId) => {
              setBookId(bookId);
            }}
            fetchPage={async ({ search }) => {
              const result = await searchBooks({
                search,
              });
              if (result.success === false) {
                return [];
              }
              return result.data ?? [];
            }}
            className="max-w-max"
          />
          <Button variant="ghost" onClick={resetFilters}>
            <X /> Reset filter
          </Button>
        </div>
        <Link
          href="/admin/new/recommendation"
          className={buttonVariants({ variant: "default" })}
        >
          Add Recommendation
        </Link>
      </div>
      <DataTable
        loading={query.isFetching}
        columns={columns}
        error={query.isError ? query.error.message : null}
        data={query.data?.data ?? []}
        page={page}
        perPage={pageSize}
        totalData={query.data?.total ?? 0}
        onPaginationChange={(state) => {
          setPage(state.pageIndex);
          setPageSize(state.pageSize);
        }}
        withPagination
      />
    </>
  );
}
