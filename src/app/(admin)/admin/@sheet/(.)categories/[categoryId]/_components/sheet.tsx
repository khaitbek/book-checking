"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Category } from "@/core/domain/entities/category";

import { Form } from "@/features/edit-category/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  category: Category;
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
        <div className="px-6 pb-6">
          <Form
            category={props.category}
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
