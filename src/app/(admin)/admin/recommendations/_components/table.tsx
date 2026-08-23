"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getAllRecommendations,
  searchBooks,
  searchInfluencersByName,
} from "../_actions/query";
import { AsyncSearchDropdown } from "@/components/widgets/async-search-dropdown/ui/widget";
import type { InfluencerUser, User } from "@/core/domain/entities/user";
import { Button, buttonVariants } from "@/components/ui/button";
import { X } from "lucide-react";
import { DataTable } from "@/components/widgets/data-table";
import { columns } from "./columns";
import Link from "next/link";
import type { Book } from "@/core/domain/entities/book";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { parseAsInteger, useQueryState } from "nuqs";

export function Table() {
  const [page, setPage] = useQueryState(
    DEFAULT_CURRENT_PAGE.name,
    parseAsInteger.withDefault(DEFAULT_CURRENT_PAGE.value),
  );
  const [pageSize, setPageSize] = useQueryState(
    DEFAULT_PAGE_SIZE.name,
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE.value),
  );
  const [authorId, setAuthorId] = useQueryState("authorId");
  const [bookId, setBookId] = useQueryState("bookId");

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
              setPage(0)
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
              setPage(0)
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
