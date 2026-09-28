import { Grid } from "@/components/widgets/influencer/ui/grid";
import type { InfluencerWithRecommendationCount } from "@/core/domain/entities/influencer";
import type { Result } from "neverthrow";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { match } from "ts-pattern";
import { Influencer } from "@/components/widgets/influencer";

export function Influencers({
  promise,
}: {
  promise: Promise<Result<(InfluencerWithRecommendationCount)[], string>>;
}) {
  const result = use(promise);

  if (result.isErr()) {
    console.log(result.error);
    return "Error...";
  }

  const influencers = result.value;

  return (
    <>
      {match(influencers)
        .with([], () => (
          <p className="text-neutral-400">Ma'lumotlar mavjud emas.</p>
        ))
        .otherwise(() => (
          <Grid>
            {influencers.map((influencer) => (
              <Influencer.Root className="flex flex-col" key={influencer.id}>
                <Image
                  className="h-full w-full object-cover"
                  width={300}
                  height={300}
                  src={influencer.image}
                  alt={influencer.name}
                />
                <Influencer.Content>
                  <Link href={`/influencers/${influencer.id}`}>
                    <Influencer.Title className="text-[#2b659b] font-medium text-[22px]">
                      {influencer.name}
                    </Influencer.Title>
                  </Link>
                  <p className="mb-2">{influencer.numberOfRecommendations} tavsiyalar</p>
                  <div className="flex flex-wrap gap-2">
                    {influencer.industry ? (
                      influencer.industry.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#e9f0f8] text-[#2b659b]/80 text-xs px-2 py-1.5 rounded-sm"
                        >
                          {tag.trim().toLowerCase()}
                        </span>
                      ))
                    ) : (
                      <span className="bg-[#e9f0f8] text-[#2b659b]/80 text-xs px-2 py-1.5 rounded-sm">
                        influencer
                      </span>
                    )}
                  </div>
                </Influencer.Content>
              </Influencer.Root>
            ))}
          </Grid>
        ))}
    </>
  );
}
