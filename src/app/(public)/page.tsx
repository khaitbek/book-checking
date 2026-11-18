import { Influencers } from "./_components/influencers";
import { getAllInfluencersUseCase } from "@/composition";
import { err, ok } from "neverthrow";
import type { Metadata } from "next";
import { SearchBook } from "@/features/search-book";

export const metadata: Metadata = {
  title: "Book reviews by celebrities, influencers and authors",
  description:
    "Read reviews about books you want to buy from the people you know.",
};

export default async function HomePage() {
  return (
    <>
      <section className="pb-4 pt-6">
        <div className="container mx-auto">
          <SearchBook />
        </div>
      </section>
      <section className="text-left max-h-[65vh] overflow-auto">
        <div className="container mx-auto">
          <Influencers
            promise={(async () => {
              const result = await getAllInfluencersUseCase.execute({
                limit: 1000,
                offset: 0,
                sortBy: "numberOfRecommendations",
              });
              if (result.isErr()) return err(result.error);
              return ok(result.value.data);
            })()}
          />
        </div>
      </section>
    </>
  );
}
