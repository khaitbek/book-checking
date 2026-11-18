import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Edit, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

export function AuthorRoot({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("group relative flex flex-col gap-3", className)}
      {...props}
    />
  );
}

export function AuthorImage({
  className,
  src,
  alt,
  ...props
}: ComponentPropsWithoutRef<typeof Image>) {
  return (
    <div
      className={cn(
        "w-full flex flex-col shadow-lg transition-all hover:shadow-xl",
        className,
      )}
    >
      <div className="w-full relative aspect-3/4 overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={alt || "Book cover"}
            fill
            className="h-full w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
            {...props}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-20" />
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthorContent({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-start w-full gap-1 pt-1",
        className,
      )}
      {...props}
    />
  );
}

export function AuthorTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <TypographyH3
      className={cn(
        "line-clamp-1 text-xl font-semibold leading-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function AuthorBio({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "mt-1 text-base font-normal text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function AuthorActions({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex items-center gap-3 text-foreground", className)}
      {...props}
    />
  );
}

// visible only for authorized users
export function AuthorEditButton({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button variant="outline" size="icon-lg" className={className} {...props}>
      <Edit className="h-4 w-4" />
      <span className="sr-only">Edit</span>
    </Button>
  );
}

// visible only for authorized users
export function AuthorDeleteButton({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="icon-lg"
      className={cn(
        "hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
      {...props}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </Button>
  );
}
