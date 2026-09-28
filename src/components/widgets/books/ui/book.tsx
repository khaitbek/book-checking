import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import type { Book } from "@/core/domain/entities/book";
import { cn } from "@/lib/utils";
import { Edit, Image as ImageIcon, Trash2 } from "lucide-react";
import type { RouteType } from "next/dist/lib/load-custom-routes";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export function BookRoot({
  className,
  bookId,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  bookId: Book["id"];
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3",
        className,
      )}
      {...props}
    />
  );
}

export function BookCover({
  className,
  src,
  alt,
  recommendationCount = 0,
  ...props
}: ComponentPropsWithoutRef<typeof Image> & {
  recommendationCount: number;
}) {
  return (
    <div
      className={cn(
        "w-full flex flex-col bg-white shadow-lg transition-all hover:shadow-xl",
        className,
      )}
    >
      <div className="w-full relative aspect-3/4 bg-neutral-100 overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={alt || "Book cover"}
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            {...props}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-20" />
          </div>
        )}
      </div>
      <div className="py-2.5 text-center text-[15px] font-medium text-[#2b659b] bg-white border-t border-neutral-100 flex justify-center items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
        <span>{recommendationCount} tavsiyalar</span>
      </div>
    </div>
  );
}

export function BookContent({
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

export function BookTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <TypographyH3
      className={cn("line-clamp-1 text-xl font-medium text-[#2b659b]", className)}
      {...props}
    />
  );
}

export function BookAuthor({
  className,
  ...props
}: Omit<LinkProps<RouteType>, "href"> & {
  author: Pick<Book["author"], "name" | "id">;
}) {
  return (
    <Link
      className={cn("text-[17px] text-[#2b659b]/80", className)}
      {...props}
      href={`/authors/${props.author.id}`}
    >
      {props.author.name}
    </Link>
  );
}

export function BookDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground/80",
        className,
      )}
      {...props}
    />
  );
}

export function BookActions({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mt-auto flex items-center gap-2 pt-4", className)}
      {...props}
    />
  );
}

// visible only for authorized users
export function BookEditButton({
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
export function BookDeleteButton({
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
