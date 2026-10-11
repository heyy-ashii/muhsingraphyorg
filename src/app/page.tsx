import { getArtworks, getFeaturedArtwork } from "@/lib/artworks";
import { getSiteContent } from "@/lib/content/load";
import { isSectionVisible } from "@/lib/content/merge";
import type { SectionKey } from "@/lib/content/schema";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Ticker } from "@/components/site/ticker";
import { WorksPavilion } from "@/components/site/works-pavilion";
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
        <Hero artwork={featured} />
        {visible("ticker") && <Ticker />}
        {visible("works") && <WorksPavilion artworks={artworks} />}
        {visible("atelier") && <Atelier />}
        {visible("craft") && <Craft />}
        {visible("process") && <Process />}
        {visible("collectors") && <Collectors />}
        {visible("commissions") && <CommissionDesk />}
      </main>
      <Footer />
    </>
  );
}
