import type { Book } from "@/core/domain/entities/book";
import { BookCover } from "./book";
import { TypographyH2 } from "@/components/ui/typography";
import Link from "next/link";

export function Widget({
    book
}: {
    book: Book
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2b659b]/20">
            {/* Left Column */}
            <div className="flex flex-col items-center justify-center">
                <BookCover recommendationCount={book.recommendations.length} className="shadow-2xl w-75" src={book.coverImage} alt={book.title} />
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-center p-12">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <TypographyH2>{book.title}</TypographyH2>
                </div>
                <Link className="text-xl text-[#2b659b]/80 mb-10 hover:underline inline-block" href={`/authors/${book.author.id}`}>
                    {book.author.name}
                </Link>

                <p className="max-h-[40vh] overflow-y-auto">
                    {book.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                    {book.categories?.map((cat) => (
                        <span key={cat.id} className="bg-[#e9f0f8] text-[#2b659b]/80 text-xs px-2.5 py-1.5 rounded-sm">
                            {cat.name.toLowerCase()}
                        </span>
                    ))}
                    {(!book.categories || book.categories.length === 0) && (
                        <span className="bg-[#e9f0f8] text-[#2b659b]/80 text-xs px-2.5 py-1.5 rounded-sm">
                            fiction
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}