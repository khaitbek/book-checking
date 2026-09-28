"use client";

import { Input } from "@/components/ui/input";
import type { Book } from "@/core/domain/entities/book";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { query } from "../api/query";

export function SearchBookInput({
  onChange,
}: {
  onChange: (value: Book[]) => void;
}) {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, 500);

  async function search() {
    const result = await query(debouncedValue);
    console.log(result);
    if (result.success) {
      onChange(result.data);
    } else {
      onChange([]);
    }
  }

  useEffect(() => {
    search();
  }, [debouncedValue]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Kitob nomi bo'yicha qidirish..."
    />
  );
}
