import { TypographyH2 } from "@/components/ui/typography";
import { BooksGrid } from "@/components/widgets/books/ui/grid";
import { BookList } from "@/components/widgets/books/ui/list";
import type { Book } from "@/core/domain/entities/book";
import type { User } from "@/core/domain/entities/user";

export async function Root({ books, author }: { books: Book[]; author: User }) {
  const mappedBooks = books.map((book) => ({
    ...book,
    author,
  }));

  return (
    <>
      <section className="py-12">
        <div className="">
          <TypographyH2 className="mb-6">Muallifning kitoblari</TypographyH2>
          <BooksGrid>
            <BookList books={mappedBooks} />
          </BooksGrid>
        </div>
      </section>
    </>
  );
}
