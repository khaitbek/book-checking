"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "../api/mutation";
import { type FormFields, formSchema } from "../model/schema";
import { AsyncSearchDropdown } from "@/components/widgets/async-search-dropdown/ui/widget";
import type { User } from "@/core/domain/entities/user";
import type { Book } from "@/core/domain/entities/book";
import { Textarea } from "@/components/ui/textarea";
import { searchBooks, searchUsersAction } from "../api/query";

interface Props {
  onSuccess?: () => void;
}

export function Form(props: Props) {
  const router = useRouter();
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data: FormFields) {
    const response = await mutate(data);
    if (!response.success) {
      toast.error(response.error || "Failed to create category");
      return;
    }

    toast.success(`Recommendation added successfully!`);

    form.reset();
    router.refresh();
    props.onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="authorId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="author">
                  Select the author of the recommendation
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
              />
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="bookId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="author">Select the book</FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <AsyncSearchDropdown<Book>
                id="author"
                value={field.value || null}
                onChange={(val) => field.onChange(val)}
                fetchPage={async ({ search }) => {
                  const result = await searchBooks({
                    limit: 100,
                    offset: 0,
                    search,
                  });

                  if (!result.success) {
                    toast.error(result.error || "Failed to fetch books");
                    return [];
                  }

                  return result.data?.data || [];
                }}
                getOptionValue={(u) => u.id}
                getOptionLabel={(u) => u.title}
                placeholder="Select a book"
                invalid={fieldState.invalid}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="quote"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="author">
                  Enter the recommendation quote
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Textarea
                id="quote"
                className="min-h-37.5"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                {...field}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="sourceUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="author">
                  Enter the recommendation source URL
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Input
                id="sourceUrl"
                aria-invalid={fieldState.invalid}
                type="url"
                {...field}
              />
            </Field>
          )}
        />
      </FieldGroup>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            form.reset();
            router.push("/admin");
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
