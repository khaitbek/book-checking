"use client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AuthorUser, User } from "@/core/domain/entities/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutation } from "../api/mutation";
import { type FormFields, formSchema } from "../model/schema";

interface Props {
  author: User & AuthorUser;
  onSuccess?: () => void;
}

export function Form(props: Props) {
  const router = useRouter();
  const mutationResult = useMutation({
    mutationKey: ["edit-author", props.author.id],
    mutationFn: async (fields: FormFields) => {
      const result = await mutation({
        id: props.author.id,
        update: {
          ...fields,
          image: null,
        },
      });
      if (result.success === false) {
        return toast.error(result.error);
      }
      toast.success("Successfully updated!");
      router.refresh();
      props.onSuccess?.();
    },
  });

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      bio: props.author.bio,
      industry: props.author.industry,
      name: props.author.name,
    },
  });

  function onSubmit(data: FormFields) {
    mutationResult.mutateAsync(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <FieldGroup className="max-h-[74vh] overflow-y-auto">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Textarea
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
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
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                id="bio"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                className="min-h-37.5"
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
              <FieldLabel htmlFor="industry">Industry</FieldLabel>
              <Input
                {...field}
                id="industry"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        className="mt-6 w-full"
        disabled={mutationResult.isPending || !form.formState.isDirty}
      >
        {mutationResult.isPending && <Loader2 className="animate-spin mr-2" />}
        Save changes
      </Button>
    </form>
  );
}
