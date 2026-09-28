import { TypographyH1 } from "@/components/ui/typography";
import { Influencers } from "./_components/influencers";
import { getAllInfluencersUseCase } from "@/composition";
import { err, ok } from "neverthrow";
import type { Metadata } from "next";
import { SearchBook } from "@/features/search-book";

export const metadata: Metadata = {
  title: "Siz sevgan insonlar qaysi kitoblarni tavsiya qiladi?",
  description:
    "O'zbekiston va dunyodagi eng mashhur insonlar, mualliflar va fikr yetakchilarining tavsiya qilgan kitoblari.",
};

export default async function HomePage() {
  return (
    <>
      <div className="container mx-auto py-4">
        <div className="">
          <TypographyH1>
            Siz sevgan insonlar qaysi kitoblarni tavsiya qiladi?
          </TypographyH1>
          <p>
            Biz sizga O'zbekiston va dunyodagi eng mashhur insonlar, mualliflar
            va fikr yetakchilarining tavsiya qilgan kitoblarini taqdim etamiz.
            Ushbu ma'lumotlar ijtimoiy tarmoq sahifalari, vebsaytlar,
            intervyular va boshqa manbalardan yig'ilgan.
          </p>
        </div>
      </div>
      <section>
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
