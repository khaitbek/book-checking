"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/widgets/data-table";
import { Category } from "@/core/domain/entities/category";
import { useDeleteCategoryStore } from "@/features/delete-category/model/store";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { useState } from "react";
import { query } from "../api/query";
import Link from "next/link";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const category = props.row.original;
      return (
        <Link
          href="/admin/categories/[categoryId]"
          as={`/admin/categories/${category.id}`}
          className="underline"
        >
          {category.name}
        </Link>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const deleteCategoryStore = useDeleteCategoryStore();
      const category = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              deleteCategoryStore.open({
                category,
              });
            }}
          >
            <Trash />
            Delete
          </Button>
        </div>
      );
    },
  },
];

export function CategoriesTable() {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const queryResult = useQuery({
    queryKey: [
      "categories",
      {
        page,
        perPage,
      },
    ],
    queryFn: async () =>
      await query({
        pagination: {
          page,
          perPage,
        },
      }),
  });

  return (
    <DataTable
      withPagination
      page={page}
      perPage={perPage}
      totalData={queryResult.data?.totalCount ?? 0}
      onPaginationChange={(state) => {
        setPage(state.pageIndex);
        setPerPage(state.pageSize);
      }}
      columns={columns}
      data={queryResult.data?.data ?? []}
      loading={queryResult.isLoading}
      error={
        queryResult.isError
          ? "Failed to load categories. Please try again."
          : null
      }
    />
  );
}
