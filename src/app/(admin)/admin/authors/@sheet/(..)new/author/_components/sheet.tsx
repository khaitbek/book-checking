"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Form } from "@/features/add-new-author/ui/form";
import { redirect } from "next/navigation";
import { useState } from "react";

export function SheetView() {
  const [open, setIsOpen] = useState(true);

  return (
    <Sheet
      open={open}
      onOpenChange={(state) => {
        setIsOpen(state);
        if (state == false) {
          redirect("/admin/authors");
        }
      }}
    >
      <SheetContent className="overflow-y-auto sm:max-w-md md:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>Add a new author</SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-6">
          <Form
            onSuccess={() => {
              setIsOpen(false);
              redirect("/admin/authors");
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
