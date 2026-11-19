"use client";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AsyncSearchMultiDropdown } from "@/components/widgets/async-search-dropdown/ui/multi-select";
import { AsyncSearchDropdown } from "@/components/widgets/async-search-dropdown/ui/widget";
import { Widget as ImageUploadWidget } from "@/components/widgets/image-upload/ui/widget";
import { Category } from "@/core/domain/entities/category";
import { User } from "@/core/domain/entities/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { searchCategoriesAction, searchUsersAction } from "../api/actions";
import { mutation } from "../api/mutation";
import { FormFields, formSchema } from "../model/schema";

interface Props {
  authors: User[];
  categories: Category[];
  onSuccess?: () => void;
}

export function Form(props: Props) {
  const queryClient = useQueryClient();
  const mutationResult = useMutation({
    mutationKey: ["add-new-book"],
    mutationFn: async (fields: FormFields) => {
      const result = await mutation({
        ...fields,
      });
      if (result.success === false) {
        return toast.error(result.error);
      }
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      form.reset();
      toast.success("Successfully added!");
      props.onSuccess?.();
    },
  });
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      authorId: undefined,
      categoryIds: [],
      coverImage: undefined,
      description: undefined,
      title: undefined,
    },
  });

  function onSubmit(data: FormFields) {
    mutationResult.mutateAsync(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                {...field}
                id="title"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="authorId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="author">
                  Select the author of the book
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <AsyncSearchDropdown<User>
                id="author"
                value={field.value || null}
                onChange={(val) => field.onChange(val)}
                fetchPage={async ({ search }) => {
                  const result = await searchUsersAction(search);
                  if (result.success === false) {
                    return [];
                  }
                  return result.data;
                }}
                getOptionValue={(u) => u.id}
                getOptionLabel={(u) => u.name}
                placeholder="Select author"
                invalid={fieldState.invalid}
                initialItem={props.authors.find((a) => a.id === field.value)}
              />
            </Field>
          )}
        />

        <Controller
          name="categoryIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="category">
                  Select categories for the book
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <AsyncSearchMultiDropdown<Category>
                id="category"
                value={field.value || []}
                onChange={(val) => field.onChange(val)}
                fetchPage={async ({ search }) => {
                  return searchCategoriesAction(search);
                }}
                getOptionValue={(c) => c.id}
                getOptionLabel={(c) => c.name}
                placeholder="Select categories"
                invalid={fieldState.invalid}
                initialItems={props.categories.filter((c) =>
                  field.value?.includes(c.id),
                )}
              />
            </Field>
          )}
        />

        <Controller
          name="coverImage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="coverImage">Cover image</FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <ImageUploadWidget
                onImageCropped={(image) => {
                  const title = form.getValues("title") || "book";
                  const file = new File(
                    [image],
                    `${title.toLowerCase()}-cover`,
                    {
                      type: image.type,
                      lastModified: new Date().getTime(),
                    },
                  );
                  field.onChange(file);
                }}
              />
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        className="mt-6"
        disabled={mutationResult.isPending}
      >
        {mutationResult.isPending && <Loader2 className="animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
