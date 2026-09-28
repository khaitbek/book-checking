import type { InfluencerUser, User } from "@/core/domain/entities/user";
import Image from "next/image";
import { TypographyH2 } from "@/components/ui/typography";
import { BookRecommendation } from "../../book-recommendation";
import { match, P } from "ts-pattern";
import { findRecommendationsByInfluencer } from "@/composition";

export async function InfluencerRankedBooksWidget({
  influencer,
}: {
  influencer: User & InfluencerUser;
}) {
  const result = await findRecommendationsByInfluencer.execute(influencer.id);

  if (result.isErr()) return "Failed to get influencer recommendations";

  const recommendations = result.value;

  return (
    <div className="flex flex-col gap-12 w-full">
      <TypographyH2>
        <span className="underline mr-2">{influencer.name}</span>
        tavsiya qilgan kitoblar!
      </TypographyH2>

      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-64 md:w-80 shrink-0">
          {match(influencer.image)
            .with(P.string.startsWith("https://"), (imageUrl) => (
              <Image
                src={imageUrl}
                alt={influencer.name}
                width={320}
                height={320}
                className="w-full h-auto object-cover bg-neutral-100 shadow-sm"
              />
            ))
            .otherwise(() => (
              <div className="w-full aspect-square bg-neutral-200 flex items-center justify-center">
                Rasm mavjud emas
              </div>
            ))}
        </div>

        <p className="text-xl">{influencer.bio}</p>
      </div>

      {/* Books List Section */}
      <div className="flex flex-col gap-16 mt-8">
        {recommendations.map(({ recommendation, book }) => (
          <BookRecommendation
            key={recommendation.id}
            // @ts-expect-error
            author={influencer}
            book={book}
            recommendation={recommendation}
          />
        ))}
      </div>
    </div>
  );
}
