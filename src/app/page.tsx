import { getArtworks, getFeaturedArtwork } from "@/lib/artworks";
import { getSiteContent } from "@/lib/content/load";
import { isSectionVisible } from "@/lib/content/merge";
import type { SectionKey } from "@/lib/content/schema";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Ticker } from "@/components/site/ticker";
import { WorksPavilion } from "@/components/site/works-pavilion";
import { Collections } from "@/components/site/collections";
import { Atelier } from "@/components/site/atelier";
import { Craft } from "@/components/site/craft";
import { Process } from "@/components/site/process";
import { Collectors } from "@/components/site/collectors";
import { CommissionDesk } from "@/components/site/commission-desk";
import { Footer } from "@/components/site/footer";

export const revalidate = 60;

export default async function HomePage() {
  const [artworks, featured, content] = await Promise.all([
    getArtworks(),
    getFeaturedArtwork(),
    getSiteContent(),
  ]);

  const visible = (key: SectionKey) => isSectionVisible(content, key);

  return (
    <>
      <Navbar />
      <main id="main">
        {/* Section order mirrors orbiz.in: hero -> work -> ways to acquire
            (category bands) -> testimonials -> how it works -> credentials ->
            story -> marquee -> enquiry. */}
        <Hero artwork={featured} />
        {visible("works") && <WorksPavilion artworks={artworks} />}
        {visible("collections") && <Collections />}
        {visible("collectors") && <Collectors />}
        {visible("process") && <Process />}
        {visible("craft") && <Craft />}
        {visible("atelier") && <Atelier />}
        {visible("ticker") && <Ticker />}
        {visible("commissions") && <CommissionDesk />}
      </main>
      <Footer />
    </>
  );
}
