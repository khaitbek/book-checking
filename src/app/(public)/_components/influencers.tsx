import { Grid } from "@/components/widgets/influencer/ui/grid";
import type { InfluencerWithRecommendationCount } from "@/core/domain/entities/influencer";
import type { Result } from "neverthrow";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { match } from "ts-pattern";
import { Influencer } from "@/components/widgets/influencer";
import { EntityLink } from "@/components/widgets/entity-link";

export function Influencers({
  promise,
}: {
  promise: Promise<Result<InfluencerWithRecommendationCount[], string>>;
}) {
  const result = use(promise);

  if (result.isErr()) {
    return "Error...";
  }

  const influencers = result.value;

  return (
    <>
      {match(influencers)
        .with([], () => <p className="text-neutral-400">No data available</p>)
        .otherwise(() => (
          <Grid>
            {influencers.map((influencer) => (
              <Influencer.Root className="flex flex-col" key={influencer.id}>
                <Image
                  className="h-full w-full object-cover rounded-lg"
                  width={300}
                  height={300}
                  src={influencer.image}
                  alt={influencer.name}
                />
                <Influencer.Content>
                  <EntityLink
                    href={`/influencers/${influencer.id}`}
                    as={`/influencers/${influencer.id}`}
                    imageUrl={null}
                    title={influencer.name}
                  />
                  <p className="mb-2">
                    {influencer.numberOfRecommendations} recommendations
                  </p>
                </Influencer.Content>
              </Influencer.Root>
            ))}
          </Grid>
        ))}
    </>
  );
}
