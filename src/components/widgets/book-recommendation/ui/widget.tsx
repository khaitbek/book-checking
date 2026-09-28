import { TypographyH3 } from "@/components/ui/typography";
import type { Book } from "@/core/domain/entities/book";
import type { Recommendation } from "@/core/domain/entities/recommendation";
import type { AuthorUser, User } from "@/core/domain/entities/user";
import Image from "next/image";
import Link from "next/link";
import { match } from "ts-pattern";

interface Props {
  recommendation: Recommendation;
  book: Pick<Book, "coverImage" | "title" | "id">;
  author: User & AuthorUser;
  variant?: "author" | "book";
}

export function BookRecommendation({
  recommendation,
  book,
  author,
  variant = "author",
}: Props) {
  return (
    <div
      key={recommendation.id}
      className="flex flex-col md:flex-row gap-8 md:gap-12 items-start"
    >
      {/* Rank and Book Cover */}
      <div className="flex gap-6 md:gap-8 shrink-0 w-full md:w-auto">
        <div className="w-40 md:w-48 shrink-0">
          {match(variant)
            .with("author", () => (
              <Link href={`/books/${book.id}`}>
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  width={192}
                  height={288}
                  className="w-full h-auto object-cover shadow-md transition-transform hover:-translate-y-1"
                />
              </Link>
            ))
            .with("book", () => (
              <Link href={`/influencers/${recommendation.authorId}`}>
                <Image
                  src={author.image}
                  alt={author.name}
                  width={192}
                  height={288}
                  className="w-full h-auto object-cover shadow-md transition-transform hover:-translate-y-1"
                />
              </Link>
            ))
            .otherwise(() => null)}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col space-y-4">
        {match(variant)
          .with("author", () => (
            <>
              <TypographyH3>
                <Link href={`/books/${book.id}`} className="">
                  {book.title}
                </Link>
              </TypographyH3>
              <Link
                href={author.role.includes("AUTHOR") ? `/authors/${author.id}` : `/influencers/${author.id}`}
                target="_blank"
                className="text-neutral-600 text-lg mb-6 underline"
              >
               Muallif - {author.name}
              </Link>
            </>
          ))
          .with("book", () => (
            <>
              <TypographyH3>
                <Link
                  href={`/influencers/${author.id}`}
                  className="underline"
                  target="_blank"
                >
                  {author.name}
                </Link>
              </TypographyH3>
            </>
          ))
          .otherwise(() => null)}

        <blockquote className="text-lg leading-relaxed flex gap-3 italic">
          <span className="text-3xl mt-1 text-neutral-400">“</span>
          <span>{recommendation.quote}</span>
        </blockquote>

        <Link
          target="_blank"
          rel="noopener noreferrer"
          // @ts-expect-error recommendation.sourceUrl is an external URL
          href={recommendation.sourceUrl}
          className="text-sm transition-colors inline-block px-2 py-1 rounded-sm max-w-max bg-foreground text-background"
        >
          Manbani ko‘rish
        </Link>
      </div>
    </div>
  );
}
