import { cn } from "@/lib/utils";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import { match, P } from "ts-pattern";

interface Props<RouteInferType> {
  imageUrl: string | null;
  href: LinkProps<RouteInferType>["href"];
  as: LinkProps<RouteInferType>["as"];
  classNames?: {
    root?: string;
    title?: string;
  };
  title: string;
  description?: string;
}

export function Root<RouteType>({
  href,
  as,
  imageUrl,
  title,
  description,
  classNames,
}: Props<RouteType>) {
  return (
    <Link
      href={href}
      as={as}
      className={cn("flex flex-row gap-3 items-center", classNames?.root)}
    >
      {match(imageUrl)
        .with(P.string.startsWith("https://"), (source) => (
          <Image
            alt={description || title}
            src={source}
            width={30}
            height={30}
            className="aspect-square rounded-full"
          />
        ))
        .otherwise(() => null)}
      <span
        className={cn(
          "underline text-blue-500 hover:underline text-ellipsis overflow-hidden",
          classNames?.title,
        )}
      >
        {title}
      </span>
    </Link>
  );
}
