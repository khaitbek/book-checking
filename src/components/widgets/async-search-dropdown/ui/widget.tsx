import { ChevronsUpDownIcon, Loader2Icon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type AsyncSearchFetchArgs = {
  search: string;
  signal: AbortSignal;
};

export type AsyncSearchDropdownProps<T> = {
  /** Selected option's stable value (string). Pass `null` for unselected. */
  value: string | null;
  /**
   * Fired when the user picks an option. Receives the value plus the original
   * item so callers can hold onto the full record (avoids a second round-trip
   * to resolve label/etc.).
   */
  onChange: (value: string | null, item: T | null) => void;
  /** Async loader — receives current search and an abort signal. */
  fetchPage: (args: AsyncSearchFetchArgs) => Promise<T[]>;
  getOptionValue: (item: T) => string;
  getOptionLabel: (item: T) => string;
  /** Optional rich row content (defaults to `getOptionLabel`). */
  renderOption?: (item: T, opts: { selected: boolean }) => React.ReactNode;
  /**
   * Item the parent already knows about for the current `value` — surfaced
   * as the trigger label and prepended to the dropdown when it isn't in the
   * latest server page (so e.g. an inactive carrier still resolves).
   */
  initialItem?: T | null;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loadingText?: string;
  /** Debounce (ms) applied to the search input before re-fetching. */
  debounceMs?: number;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  contentClassName?: string;
  id?: string;
};

/**
 * Generic async-searchable dropdown. Keeps no opinions about the data shape
 * — pass `fetchPage` + `getOptionValue` + `getOptionLabel` and it works for
 * carriers, customers, loads, freight rates, etc.
 *
 * Server-side search: `shouldFilter={false}` on `Command` so cmdk doesn't
 * filter the page-load it just received from the API.
 */
export function AsyncSearchDropdown<T>({
  value,
  onChange,
  fetchPage,
  getOptionValue,
  getOptionLabel,
  renderOption,
  initialItem,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results",
  loadingText = "Loading...",
  debounceMs = 250,
  disabled,
  invalid,
  className,
  contentClassName,
  id,
}: AsyncSearchDropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Base UI's focus manager and cmdk's auto-`scrollIntoView` on the selected
  // item both run during the popup's mount and can scroll the document if the
  // popup hasn't been positioned by Floating UI yet. None of these are easily
  // tunable, so we snapshot scroll on open and snap it back after the mount
  // settles (two frames: one for layout, one for any deferred side effects).
  React.useLayoutEffect(() => {
    if (!open) return;
    const x = window.scrollX;
    const y = window.scrollY;
    const restore = () => {
      if (window.scrollX !== x || window.scrollY !== y) {
        window.scrollTo({
          left: x,
          top: y,
          behavior: "instant" as ScrollBehavior,
        });
      }
    };
    let cancelled = false;
    const id1 = requestAnimationFrame(() => {
      if (cancelled) return;
      restore();
      requestAnimationFrame(() => {
        if (cancelled) return;
        restore();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id1);
    };
  }, [open]);

  // Pin the freshest fetcher in a ref so the search effect doesn't refetch
  // every render when callers pass an inline arrow function.
  const fetchPageRef = React.useRef(fetchPage);
  React.useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  // Track the currently-selected item so the trigger can render its label
  // even before the dropdown is opened (and even when the value lives outside
  // the loaded page).
  const [selected, setSelected] = React.useState<T | null>(initialItem ?? null);
  React.useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    const fromItems = items.find((it) => getOptionValue(it) === value);
    if (fromItems) {
      setSelected(fromItems);
      return;
    }
    if (initialItem && getOptionValue(initialItem) === value) {
      setSelected(initialItem);
    }
  }, [value, items, initialItem, getOptionValue]);

  // Search → fetch with debounce + cancel on unmount/restart.
  React.useEffect(() => {
    // if (!open) return;
    const ctrl = new AbortController();
    const delay = search ? debounceMs : 0;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const next = await fetchPageRef.current({
          search,
          signal: ctrl.signal,
        });
        if (!ctrl.signal.aborted) setItems(next);
      } catch {
        if (!ctrl.signal.aborted) setItems([]);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, delay);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [search, debounceMs]);

  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  // Prepend `initialItem` to results when it isn't in the current page so the
  // selected value is always pickable (e.g. inactive entity, page-2 entry).
  const merged = React.useMemo<T[]>(() => {
    if (!initialItem) return items;
    const initialValue = getOptionValue(initialItem);
    if (items.some((it) => getOptionValue(it) === initialValue)) return items;
    return [initialItem, ...items];
  }, [items, initialItem, getOptionValue]);

  const label = selected ? getOptionLabel(selected) : "";

  return (
    <Popover open={open} onOpenChange={(o) => !disabled && setOpen(o)}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            "w-full justify-between gap-2 font-normal",
            !label && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">{label || placeholder}</span>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "w-(--anchor-width) min-w-(--anchor-width) p-0",
          contentClassName,
        )}
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={searchPlaceholder}
          />
          <CommandList className="mt-2 px-1">
            {loading ? (
              <div className="mt-2 flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" /> {loadingText}
              </div>
            ) : merged.length === 0 ? (
              <CommandEmpty>{emptyText}</CommandEmpty>
            ) : (
              merged.map((item, index) => {
                const v = getOptionValue(item);
                const isSelected = value === v;
                return (
                  <CommandItem
                    className={cn(index > 0 ? "mt-1" : "")}
                    key={v}
                    value={v}
                    data-checked={isSelected || undefined}
                    onSelect={() => {
                      onChange(v, item);
                      setSelected(item);
                      setOpen(false);
                    }}
                  >
                    {renderOption
                      ? renderOption(item, { selected: isSelected })
                      : getOptionLabel(item)}
                  </CommandItem>
                );
              })
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
