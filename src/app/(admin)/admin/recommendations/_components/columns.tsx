import { EntityLink } from "@/components/widgets/entity-link";
import type { RecommendationWithEntities } from "@/infrastructure/api/types/recommendation";
import { formatHttpDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<RecommendationWithEntities>[] = [
  {
    accessorKey: "bookId",
    header: "Book",
    cell: ({ row }) => {
      const book = row.original.book;
      return (
        <EntityLink
          title={book.title}
          description={book.description}
          href="/admin/books/[bookId]"
          as={`/admin/books/[bookId]/${book.id}`}
          imageUrl={book.coverImage}
        />
      );
    },
  },
  {
    accessorKey: "authorId",
    header: "Author",
    cell: ({ row }) => {
      const author = row.original.author;
      return (
        <EntityLink
          title={author.name}
          description={author.bio}
          href="/admin/books/[authorId]"
          as={`/admin/books/[authorId]/${author.id}`}
          imageUrl={author.image}
        />
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatHttpDate(row.original.createdAt),
  },
];
