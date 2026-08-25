import { EntityLink } from "@/components/widgets/entity-link";
import type { AuthorUser, User } from "@/core/domain/entities/user";
import { formatHttpDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User & AuthorUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <EntityLink
        href="/admin/authors/[authorId]"
        as={`/admin/authors/${row.original.id}`}
        title={row.original.name}
        description={row.original.bio}
        imageUrl={row.original.image}
      />
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => {
      const industry = row.original.industry;
      if (!industry) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {industry
            .split(",")
            .slice(0, 3)
            .map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-sm"
              >
                {tag.trim().toLowerCase()}
              </span>
            ))}
        </div>
      );
    },
  },
  {
    id: "books",
    header: "Books",
    cell: ({ row }) => {
      const count = row.original.authoredBooks?.length ?? 0;
      return <span className="text-sm tabular-nums">{count}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatHttpDate(row.original.createdAt),
  },
];
