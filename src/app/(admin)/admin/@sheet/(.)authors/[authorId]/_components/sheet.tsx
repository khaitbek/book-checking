"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AuthorUser, User } from "@/core/domain/entities/user";

import { Form } from "@/features/edit-author/ui/form";
import { UploadAuthorImageForm } from "@/features/upload-author-image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  author: User & AuthorUser;
}

export function SheetView(props: Props) {
  const router = useRouter();
  const [open, setIsOpen] = useState(true);

  return (
    <Sheet
      open={open}
      onOpenChange={(state) => {
        setIsOpen(state);
        if (state == false) {
          router.back();
        }
      }}
    >
      <SheetContent className="overflow-y-auto sm:max-w-md md:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>Edit author</SheetTitle>
        </SheetHeader>
        <div className="px-6 py-6 space-y-6">
          <UploadAuthorImageForm author={props.author} />
          <Form
            author={props.author}
            onSuccess={() => {
              setIsOpen(false);
              router.back();
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
