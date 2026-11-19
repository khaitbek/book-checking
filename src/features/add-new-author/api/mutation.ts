"use server";

import { addNewAuthorUseCase, uploadUserImageUseCase } from "@/composition";
import type { FormFields } from "../model/schema";
import { revalidatePath } from "next/cache";

export async function mutate(data: FormFields) {
  const result = await addNewAuthorUseCase.execute({
    ...data,
    image: null,
  });
  if (result.isErr()) {
    return { success: false as const, error: result.error };
  }
  const uploadResult = await uploadUserImageUseCase.execute(
    result.value.id,
    data.image,
  );
  if (uploadResult.isErr()) {
    return {
      success: false,
      error: uploadResult.error,
    };
  }
  revalidatePath("/authors");
  revalidatePath("/");
  return { success: true as const, author: uploadResult.value };
}
