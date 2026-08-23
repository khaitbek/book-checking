import {
  authorRepository,
  sessionAdapter,
  userRepository,
} from "@/composition";
import { notFound } from "next/navigation";
import Link from "next/dist/api/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  AuthorActions,
  AuthorBio,
  AuthorImage,
  AuthorTitle,
} from "@/components/widgets/author/ui/widget";
import { AuthorBooks } from "@/features/author-books";
import { EditCover } from "./_components/actions/edit-cover";
import { DeleteAuthor } from "./_components/actions/delete";
import {
  AuthorUser,
  isAdminUser,
  type User,
} from "@/core/domain/entities/user";
import { EditAuthor } from "./_components/actions/edit";

export default async function AuthorDetail({
  params,
}: {
  params: Promise<{ authorId: string }>;
}) {
  const { authorId } = await params;
  const result = await authorRepository.findById(authorId);

  if (result.isErr()) {
    notFound();
  }

  if (!result.value.role.includes("AUTHOR")) {
    notFound();
  }

  const author = result.value;

  return (
    <section className="py-12">
      <div className="container mx-auto space-y-6">
        <Link
          href="/admin/authors"
          className={buttonVariants({ variant: "secondary" })}
        >
          <ArrowLeft className="mr-2 inline-block h-4 w-4" />
          Back to authors
        </Link>
        <div className="flex gap-12">
          <AuthorImage
            alt={author.name}
            className="max-h-100 max-w-100"
            src={author.image}
          />
          <div>
            <AuthorTitle className="relative">{author.name}</AuthorTitle>
            <AuthorBio>{author.bio}</AuthorBio>
          </div>
        </div>
        <Actions author={author} />
        <AuthorBooks author={author} books={author.authoredBooks} />
      </div>
    </section>
  );
}

async function Actions({ author }: { author: User & AuthorUser }) {
  const session = await sessionAdapter.getSession();
  if (session.isErr()) return null;

  return (
    <AuthorActions>
      {isAdminUser(session.value.user) && <DeleteAuthor author={author} />}
      <EditCover author={author} />
      <EditAuthor author={author} />
    </AuthorActions>
  );
}
