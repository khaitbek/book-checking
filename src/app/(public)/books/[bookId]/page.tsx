import { bookRepository } from "@/composition";
import type { Book } from "@/core/domain/entities/book";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import { Widget as BookDetailsWidget } from "@/components/widgets/books/ui/book-details";
import { InfluencerMentionsWidget } from "@/components/widgets/books/ui/influencer-mentions";

const getBook = cache((bookId: Book["id"]) => bookRepository.findById(bookId));

type Props = {
  params: Promise<{
    bookId: Book["id"];
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookId } = await params;
  const book = await getBook(bookId);
  if (!book) return {};

  return {
    title: book.title,
    description:
      book.description ||
      `Discover why ${book.title} by ${book.author?.name ?? "Unknown"} is recommended by top influencers.`,
    openGraph: {
      title: book.title,
      description:
        book.description ||
        `Discover why ${book.title} is recommended by top influencers.`,
      images: book.coverImage
        ? [
            {
              url: book.coverImage,
              alt: book.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description:
        book.description ||
        `Discover why ${book.title} is recommended by top influencers.`,
      images: book.coverImage ? [book.coverImage] : undefined,
    },
  };
}

export default async function ({ params }: Props) {
  const { bookId } = await params;
  const book = await getBook(bookId);
  if (!book) redirect("/");

  return (
    <section className="py-12">
      <div className="mx-auto container">
        <BookDetailsWidget book={book} />
        <InfluencerMentionsWidget bookId={bookId} />
      </div>
    </section>
  );
}
