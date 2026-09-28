"use client"

import { SearchBookInput } from "./input";
import { SearchBookResults } from "./results";
import { useState } from "react";
import type { Book } from "@/core/domain/entities/book";

export function SearchBookRoot() {
    const [books, setBooks] = useState<Book[]>([]);

    return (
        <div>
            <SearchBookInput onChange={setBooks} />
            <SearchBookResults results={books} />
        </div>
    )
}