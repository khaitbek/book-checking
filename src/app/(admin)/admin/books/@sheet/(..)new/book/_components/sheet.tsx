"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Form } from "@/features/add-new-book/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SheetView() {
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
          <SheetTitle>Add a new book</SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-6">
          <Form
            authors={[]}
            categories={[]}
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
