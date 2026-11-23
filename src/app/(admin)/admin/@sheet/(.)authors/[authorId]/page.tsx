import { authorRepository } from "@/composition";
import { notFound } from "next/navigation";
import { SheetView } from "./_components/sheet";
import type { User } from "@/core/domain/entities/user";

export default async function Page({
  params,
}: {
  params: Promise<{
    authorId: User["id"];
  }>;
}) {
  const { authorId } = await params;

  const result = await authorRepository.findById(authorId);

  if (result.isErr()) {
    notFound();
  }

  if (!result.value.role.includes("AUTHOR")) {
    notFound();
  }
  return <SheetView author={result.value} />;
}
