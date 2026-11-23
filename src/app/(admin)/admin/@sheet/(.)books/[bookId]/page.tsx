import { bookRepository } from "@/composition";
import { Book } from "@/core/domain/entities/book";
import { redirect } from "next/navigation";
import { SheetView } from "./_components/sheet";

export default async function Page({
  params,
}: {
  params: Promise<{
    bookId: Book["id"];
  }>;
}) {
  const { bookId } = await params;
  console.log({
    bookId,
    src: "intercepted bookId route",
  });
  const book = await bookRepository.findById(bookId);
  if (!book) redirect("/admin/books");

  return <SheetView book={book} />;
}
