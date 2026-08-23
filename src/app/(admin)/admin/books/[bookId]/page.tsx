import { bookRepository, sessionAdapter } from "@/composition";
import type { Book } from "@/core/domain/entities/book";
import { DeleteBook } from "./_components/actions/delete-book";
import { EditCover } from "./_components/actions/edit-cover";
import { EditBook } from "./_components/actions/edit-book";
import { redirect } from "next/navigation";
import { BookActions } from "@/components/widgets/books/ui/book";
import { UploadBookCover } from "@/features/upload-book-cover";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { isAdminUser } from "@/core/domain/entities/user";
import { Widget as BookDetailsWidget } from "@/components/widgets/books/ui/book-details";
import { InfluencerMentionsWidget } from "@/components/widgets/books/ui/influencer-mentions";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{
    bookId: Book["id"];
  }>;
}) {
  const { bookId } = await params;
  const book = await bookRepository.findById(bookId);
  if (!book) redirect("/admin/books");

  return (
    <section className="py-12">
      <div className="container mx-auto space-y-6">
        <Link
          href="/admin/books"
          className={buttonVariants({ variant: "secondary" })}
        >
          <ArrowLeft className="mr-2 inline-block h-4 w-4" />
          Back to books
        </Link>
        <div className="flex flex-wrap gap-12">
          <BookDetailsWidget book={book} />
          <Actions book={book} />
          <InfluencerMentionsWidget bookId={bookId} />
        </div>
      </div>
    </section>
  );
}

async function Actions({ book }: { book: Book }) {
  const session = await sessionAdapter.getSession();
  if (session.isErr()) return null;

  return (
    <BookActions>
      {isAdminUser(session.value.user) && <DeleteBook book={book} />}
      <EditCover book={book} />
      <EditBook book={book} />
      <UploadBookCover />
    </BookActions>
  );
}
