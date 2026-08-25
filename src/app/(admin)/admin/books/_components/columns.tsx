import { EntityLink } from "@/components/widgets/entity-link";
import type { Book } from "@/core/domain/entities/book";
import { formatHttpDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <EntityLink
          href="/admin/books/[bookId]"
          as={`/admin/books/${row.original.id}`}
          title={book.title}
          imageUrl={book.coverImage}
          description={book.description}
        />
      );
    },
  },
  {
    accessorKey: "author.name",
    header: "Author",
    cell: ({ row }) => {
      const book = row.original;

      return (
        <EntityLink
          href="/admin/authors/[authorId]"
          as={`/admin/authors/${book.authorId}`}
          title={book.author.name}
          imageUrl={book.author.image}
        />
      );
    },
  },
  {
    accessorFn: (row) => row.recommendations.length,
    header: "Recommendations",
    cell: ({ row }) => (
      <span className="text-center w-full inline-block">
        {row.original.recommendations.length}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return formatHttpDate(row.original.createdAt);
    },
  },
];
