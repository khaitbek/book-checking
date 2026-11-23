import { categoryRepository } from "@/composition";
import { Category } from "@/core/domain/entities/category";
import { notFound } from "next/navigation";
import { Form } from "@/features/edit-category/ui/form";

export default async function ({
  params,
}: {
  params: Promise<{
    categoryId: Category["id"];
  }>;
}) {
  const { categoryId } = await params;

  const result = await categoryRepository.findById(categoryId);

  if (!result) {
    return notFound();
  }

  return (
    <>
      <Form category={result} />
    </>
  );
}
