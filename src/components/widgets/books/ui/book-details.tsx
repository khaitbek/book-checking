import type { Book } from "@/core/domain/entities/book";
import { BookCover } from "./book";
import { TypographyH2 } from "@/components/ui/typography";
import Link from "next/link";
import { EntityLink } from "../../entity-link";

export function Widget({ book }: { book: Book }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2b659b]/20">
      {/* Left Column */}
      <div className="flex flex-col items-center justify-center">
        <BookCover
          recommendationCount={book.recommendations.length}
          className="shadow-2xl w-75 rounded-xl"
          src={book.coverImage}
          alt={book.title}
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col justify-center p-12">
        <div className="flex items-start justify-between gap-4 mb-4">
          <TypographyH2>{book.title}</TypographyH2>
        </div>
        <EntityLink
          as={`/authors/${book.author.id}`}
          href="/authors/[$authorId]"
          imageUrl={book.author.image}
          title={book.author.name}
          classNames={{
            root: "my-4",
          }}
        />

        <p className="max-h-[40vh] overflow-y-auto">{book.description}</p>
      </div>
    </div>
  );
}
