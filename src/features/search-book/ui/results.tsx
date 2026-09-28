import type { Book } from "@/core/domain/entities/book";
import Link from "next/link";

export function SearchBookResults({
    results
}: {
    results: Book[]
}) {
    return (
        <ul className="mt-4">
            {results.map((book) => (
                <li className="p-4 border-b" key={book.id}>
                    <Link href={`/books/${book.id}`} target="_blank">
                        <p className="font-bold">{book.title}</p>
                        <p className="text-sm text-muted-foreground">{book.author.name}</p>
                    </Link>
                </li>
            ))}
        </ul>
    )
}