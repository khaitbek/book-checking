"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AsyncSearchMultiDropdown } from "@/components/widgets/async-search-dropdown/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { ROLE_LABELS, USER_ROLES } from "@/core/domain/entities/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, FileSearchIcon, Loader2, XIcon } from "lucide-react";
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
      email: null,
      bio: "",
      industry: "",
      role: ["USER"],
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const watchedRole = form.watch("role");
  const showExtendedFields =
    watchedRole.includes("AUTHOR") || watchedRole.includes("INFLUENCER");

  async function onSubmit(data: FormFields) {
    const response = await mutate(data);
    if (!response.success) {
      toast.error(response.error || "Failed to create user");
      return;
    }
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });
    toast.success(`User "${response.user.name}" created successfully!`);
    form.reset();
    props.onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        {/* Role selector */}
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="user-role">Role</FieldLabel>
              <AsyncSearchMultiDropdown<string>
                id="user-role"
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);

                  // Clear extended fields when switching away from Author/Influencer
                  const hasAuthorOrInfluencer =
                    newValue.includes("AUTHOR") ||
                    newValue.includes("INFLUENCER");
                  if (!hasAuthorOrInfluencer) {
                    form.setValue("bio", "");
                    form.setValue("industry", "");
                    form.setValue("image", undefined);
                  }
                }}
                fetchPage={async ({ search }) => {
                  return USER_ROLES.filter((role) =>
                    (ROLE_LABELS[role] ?? role)
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  );
                }}
                getOptionValue={(role) => role}
                getOptionLabel={(role) => ROLE_LABELS[role] ?? role}
                placeholder="Select roles"
                searchPlaceholder="Search roles..."
                disabled={isSubmitting}
                invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="user-name">Full Name</FieldLabel>
              <Input
                {...field}
                id="user-name"
                placeholder="e.g. John Doe"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="user-email">
                Email{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="user-email"
                type="email"
                placeholder="e.g. user@example.com"
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Author/Influencer-specific fields */}
        {showExtendedFields && (
          <>
            <Controller
              name="industry"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-industry">Industry</FieldLabel>
                  <Input
                    {...field}
                    id="user-industry"
                    placeholder="e.g. Finance, Philosophy, Technology"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-bio">
                    Bio{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="user-bio"
                    placeholder="A short biography…"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    disabled={isSubmitting}
                    rows={4}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </>
        )}
      </FieldGroup>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            form.reset();
            router.push("/admin/users");
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
              Creating User...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </div>
    </form>
  );
}
