"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Book } from "@/core/domain/entities/book";

import { Form } from "@/features/edit-book/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  book: Book;
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
          <SheetTitle>Edit book</SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-6">
          <Form
            book={props.book}
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
