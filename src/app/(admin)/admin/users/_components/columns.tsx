import { EntityLink } from "@/components/widgets/entity-link";
import { RoleBadge } from "@/components/widgets/user";
import {
  type AuthorUser,
  isAdminUser,
  type User,
} from "@/core/domain/entities/user";
import { formatHttpDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <EntityLink
          title={user.name}
          as={`/admin/users/${user.id}`}
          href="/admin/users/[userId]"
          imageUrl={user.image}
        />
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = (row.original as unknown as { email?: string }).email;
      if (!email) return <span className="text-muted-foreground">—</span>;
      return <span className="text-sm">{email}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <ul className="flex flex-wrap gap-1">
        {row.original.role.map((role) => (
          <RoleBadge key={role} role={role} />
        ))}
      </ul>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => {
      const industry = (row.original as unknown as { industry?: string })
        .industry;
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatHttpDate(row.original.createdAt),
  },
];
