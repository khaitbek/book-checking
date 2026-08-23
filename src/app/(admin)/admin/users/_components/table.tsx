"use client";

import { DataTable } from "@/components/widgets/data-table";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { getAllUsers } from "../_actions/query";
import { columns } from "./columns";
import { ROLE_LABELS, USER_ROLES } from "@/core/domain/entities/user";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { AsyncSearchMultiDropdown } from "@/components/widgets/async-search-dropdown/ui/multi-select";
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";

export function Table() {
  const [page, setPage] = useQueryState(
    DEFAULT_CURRENT_PAGE.name,
    parseAsInteger.withDefault(DEFAULT_CURRENT_PAGE.value),
  );
  const [pageSize, setPageSize] = useQueryState(
    DEFAULT_PAGE_SIZE.name,
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE.value),
  );
  const [search, setSearch] = useQueryState("search");
  const [roleFilter, setRoleFilter] = useQueryState(
    "roleFilter",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const query = useQuery({
    queryKey: ["users", page, pageSize, search, roleFilter],
    queryFn: async () => {
      const result = await getAllUsers({
        limit: pageSize,
        offset: page * pageSize,
        search: search || undefined,
        role: roleFilter.length > 0 ? (roleFilter as any) : undefined,
      });
      if (result.success === false) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  const activeFilters = !!search || !!roleFilter;

  function resetFilters() {
    setSearch(null);
    setRoleFilter([]);
    setPage(0);
  }

  const handleSearchChange = (value: string) => {
    setPage(0);

    if (!value) return setSearch(null);
    setSearch(value);
  };

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-6 mb-6">
        <div className="flex gap-4 items-center flex-wrap">
          {/* Debounced search input */}
          <div className="relative min-w-65">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <DebouncedInput
              value={search ?? ""}
              debounceTime={500}
              onValueChange={handleSearchChange}
              placeholder="Search users…"
              className="pl-9"
            />
          </div>

          <AsyncSearchMultiDropdown<string>
            id="user-role"
            className="max-w-max"
            value={roleFilter}
            onChange={(newValue) => {
              setRoleFilter(newValue);
              setPage(0)
            }}
            fetchPage={async ({ search }) => {
              return USER_ROLES.filter((role) =>
                (ROLE_LABELS[role] ?? role)
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              );
            }}
            getOptionValue={(role) => role}
            getOptionLabel={(role) => ROLE_LABELS[role] ?? role}
            placeholder="Select roles"
            searchPlaceholder="Search roles..."
          />

          {activeFilters && (
            <Button variant="ghost" onClick={resetFilters}>
              <X className="mr-1 size-4" /> Reset
            </Button>
          )}
        </div>

        <Link href="/admin/new/user" className={buttonVariants()}>
          + New user
        </Link>
      </div>

      <DataTable
        loading={query.isFetching}
        columns={columns}
        error={query.isError ? query.error.message : null}
        data={query.data ?? []}
        page={page}
        perPage={pageSize}
        totalData={query.data?.length ?? 0}
        onPaginationChange={(state) => {
          setPage(state.pageIndex);
          setPageSize(state.pageSize);
        }}
        withPagination
      />
    </>
  );
}
