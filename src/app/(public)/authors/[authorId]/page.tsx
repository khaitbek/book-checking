import { authorRepository } from "@/composition";
import type { AuthorUser, User } from "@/core/domain/entities/user";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import { Widget as AuthorDetails } from "@/components/widgets/author/ui/author-details";
import { AuthorBooks } from "@/features/author-books";

const getAuthor = cache((id: User["id"]) => authorRepository.findById(id));

type Props = {
  params: Promise<{
    authorId: User["id"];
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { authorId } = await params;
  const result = await getAuthor(authorId);
  if (result.isErr()) return {};

  const author = result.value as User & AuthorUser;

  const description =
    author.bio ||
    `Explore books written by ${author.name} and see why they are recommended by top influencers.`;

  return {
    title: author.name,
    description,
    openGraph: {
      title: author.name,
      description,
      images: author.image
        ? [
            {
              url: author.image,
              alt: author.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: author.name,
      description,
      images: author.image ? [author.image] : undefined,
    },
  };
}

export default async function ({ params }: Props) {
  const { authorId } = await params;
  const result = await getAuthor(authorId);
  if (result.isErr()) redirect("/");

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <AuthorDetails author={result.value} />
        <AuthorBooks author={result.value} books={result.value.authoredBooks} />
      </div>
    </section>
  );
}
