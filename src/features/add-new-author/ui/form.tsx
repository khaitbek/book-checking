"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "../api/mutation";
import { type FormFields, formSchema } from "../model/schema";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  onSuccess?: () => void;
}

export function Form(props: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      name: "",
      bio: "",
      industry: "",
      email: null,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data: FormFields) {
    const response = await mutate(data);
    if (!response.success) {
      toast.error(response.error || "Failed to create author");
      return;
    }
    queryClient.invalidateQueries({
      queryKey: ["authors"],
    });
    toast.success(`Author "${response.author?.name}" created successfully!`);
    form.reset();
    props.onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="author-name">Full Name</FieldLabel>
              <Input
                {...field}
                id="author-name"
                placeholder="e.g. Nassim Nicholas Taleb"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="author-email">Email</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="author-email"
                type="email"
                placeholder="e.g. author@example.com"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="industry"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="author-industry">Industry</FieldLabel>
              <Input
                {...field}
                id="author-industry"
                placeholder="e.g. Finance, Philosophy, Technology"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="bio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="author-bio">
                Bio{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Textarea
                {...field}
                id="author-bio"
                placeholder="A short biography of the author..."
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="user-image">Image</FieldLabel>
              <Input
                onChange={(evt) => field.onChange(evt.target.files?.[0])}
                type="file"
                id="user-image"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 sm:justify-end">
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
              Creating Author...
            </>
          ) : (
            "Create Author"
          )}
        </Button>
      </div>
    </form>
  );
}
