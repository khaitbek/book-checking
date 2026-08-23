"use client";

import { DataTable } from "@/components/widgets/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllAuthors, searchAuthors } from "../_actions/query";
import { columns } from "./columns";
import type { User } from "@/core/domain/entities/user";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { X } from "lucide-react";
import { AsyncSearchDropdown } from "@/components/widgets/async-search-dropdown/ui/widget";
import { parseAsInteger, useQueryState } from "nuqs";

export function Table() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10),
  );
  const [search, setSearch] = useQueryState("search");

  const query = useQuery({
    queryKey: ["authors", page, pageSize, search],
    queryFn: async () => {
      const result = await getAllAuthors({
        limit: pageSize,
        offset: page * pageSize,
        search: search ?? undefined,
      });
      if (result.success === false) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const activeFilters = !!search;

  function resetFilters() {
    setSearch(null);
    setPage(0);
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-6 mb-6">
        <div className="flex gap-6 items-center">
          <div className="relative min-w-65">
            <AsyncSearchDropdown<User>
              value={search}
              getOptionValue={(author) => author.name}
              getOptionLabel={(author) => author.name}
              placeholder={
                search ? `Searching: "${search}"` : "Search authors…"
              }
              searchPlaceholder="Type a name…"
              onChange={(_value, item) => {
                if (item) {
                  setSearch(item.name);
                  setPage(0);
                }
              }}
              fetchPage={async ({ search: q }) => {
                const result = await searchAuthors(q);
                if (result.success === false) return [];
                return result.data ?? [];
              }}
              className="min-w-65"
            />
          </div>

          {activeFilters && (
            <Button variant="ghost" onClick={resetFilters}>
              <X className="mr-1 size-4" /> Reset
            </Button>
          )}
        </div>

        <Link href="/admin/new/author" className={buttonVariants()}>
          + New author
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
