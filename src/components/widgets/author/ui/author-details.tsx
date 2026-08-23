import type { AuthorUser, User } from "@/core/domain/entities/user";
import {
  AuthorImage,
  AuthorTitle,
  AuthorBio,
} from "@/components/widgets/author/ui/widget";

export function Widget({ author }: { author: User & AuthorUser }) {
  return (
    <div className="flex gap-12 flex-col lg:flex-row">
      <AuthorImage
        alt={author.name}
        className="aspect-square max-h-75 max-w-75 object-cover"
        src={author.image}
      />
      <div className="">
        <AuthorTitle className="relative">{author.name}</AuthorTitle>
        <AuthorBio>{author.bio}</AuthorBio>
      </div>
    </div>
  );
}
