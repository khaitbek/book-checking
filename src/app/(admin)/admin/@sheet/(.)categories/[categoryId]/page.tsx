import { categoryRepository } from "@/composition";
import { notFound } from "next/navigation";
import { SheetView } from "./_components/sheet";
import type { Category } from "@/core/domain/entities/category";

export default async function Page({
  params,
}: {
  params: Promise<{
    categoryId: Category["id"];
  }>;
}) {
  const { categoryId } = await params;

  const result = await categoryRepository.findById(categoryId);

  if (!result) {
    notFound();
  }

  return <SheetView category={result} />;
}
