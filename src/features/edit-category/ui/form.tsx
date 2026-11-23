"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Category } from "@/core/domain/entities/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "../api/mutation";
import { FormFields, formSchema } from "../model/schema";
import { useEditCategoryStore } from "../model/store";

type Props = {
  category: Pick<Category, "id" | "name">;
  onSuccess?: () => void;
};

export function Form(props: Props) {
  const qc = useQueryClient();
  const store = useEditCategoryStore();
  const router = useRouter();
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: props.category,
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data: FormFields) {
    const response = await mutate(data);
    if (!response.success) {
      toast.error(response.error || "Failed to edit category");
      return;
    }

    toast.success(`Category edited successfully!`, {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    });

    qc.invalidateQueries({ queryKey: ["categories"] });
    store.close();
    form.reset();
    router.refresh();
    props.onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel
                htmlFor="category-name"
                className="text-sm font-medium text-muted-foreground"
              >
                Category Name
                <span className="text-destructive font-bold ml-1">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="category-name"
                placeholder="e.g. Artificial Intelligence, Philosophy, Fiction..."
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
                autoFocus
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="mt-1" />
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Use a descriptive name. Make sure it isn't a duplicate of any
                existing category.
              </p>
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
              Creating Category...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
}
