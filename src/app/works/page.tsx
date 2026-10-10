import type { Metadata } from "next";
import { getArtworks } from "@/lib/artworks";
import { SITE } from "@/lib/site";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WorksIndex } from "@/components/site/works-index";
import { Reveal, SplitWords } from "@/components/ui/motion-primitives";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Selected Works",
  description:
    "The complete archive of original calligraphic canvases from the atelier of Muhsin — Thuluth, Jali Diwani, Kufic and contemporary script, hand-inked and gilded.",
  alternates: { canonical: `${SITE.url}/works` },
};

export default async function WorksPage() {
  const artworks = await getArtworks();

  return (
    <>
      <Navbar />
      <main id="main" className="pt-36 sm:pt-44">
        <header className="shell">
          <Reveal>
            <p className="eyebrow">The Archive</p>
          </Reveal>
          <h1 className="mt-5 font-display text-display-lg text-ink">
            <SplitWords text="Selected Works" />
          </h1>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-[52ch] text-pretty text-[16px] leading-relaxed text-muted">
              Every piece below is an original, signed and documented at the atelier. Availability
              is updated as works enter private collections.
            </p>
          </Reveal>
          <div className="gold-rule mt-12" />
        </header>

        <section className="shell py-16 sm:py-20">
          <WorksIndex artworks={artworks} />
        </section>
      </main>
      <Footer />
    </>
  );
}
