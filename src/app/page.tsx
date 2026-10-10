import { getArtworks, getFeaturedArtwork } from "@/lib/artworks";
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
  const [artworks, featured] = await Promise.all([getArtworks(), getFeaturedArtwork()]);

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero artwork={featured} />
        <Ticker />
        <WorksPavilion artworks={artworks} />
        <Atelier />
        <Craft />
        <Process />
        <Collectors />
        <CommissionDesk />
      </main>
      <Footer />
    </>
  );
}
