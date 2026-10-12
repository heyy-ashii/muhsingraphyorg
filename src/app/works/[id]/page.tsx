import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { galleryOf } from "@/lib/types";
import { getArtworkById, getArtworks } from "@/lib/artworks";
import { SITE } from "@/lib/site";
import { getSiteContent } from "@/lib/content/load";
import { artworkWhatsappLink } from "@/lib/whatsapp";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StatusBadge } from "@/components/ui/status-badge";
import { AcquireButton } from "@/components/ui/whatsapp-button";
import { Reveal } from "@/components/ui/motion-primitives";
import { ArtworkDetailViewer } from "@/components/site/artwork-detail-viewer";
import { ArtworkCard } from "@/components/site/artwork-card";

export const revalidate = 60;

export async function generateStaticParams() {
  const works = await getArtworks();
  return works.map((w) => ({ id: w.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtworkById(id);
  if (!artwork) return { title: "Work not found" };

  const url = `${SITE.url}/works/${artwork.id}`;
  return {
    title: artwork.title,
    description:
      artwork.description ??
      `${artwork.title} — ${artwork.script_style} calligraphy, ${artwork.medium}, ${artwork.dimensions}.`,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${artwork.title} · Muhsingraphy`,
      description: `${artwork.script_style} · ${artwork.medium} · ${artwork.dimensions}`,
      url,
      images: galleryOf(artwork).map((src) => ({ url: src, alt: artwork.title })),
    },
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [artwork, all, content] = await Promise.all([getArtworkById(id), getArtworks(), getSiteContent()]);
  if (!artwork) notFound();

  const related = all.filter((a) => a.id !== artwork.id).slice(0, 3);
  const waHref = artworkWhatsappLink(artwork, undefined, content.contact.whatsappNumber);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    artist: { "@type": "Person", name: "Muhsin", url: SITE.url },
    artform: artwork.script_style,
    artMedium: artwork.medium,
    dateCreated: artwork.year,
    image: galleryOf(artwork),
    description: artwork.description ?? undefined,
    ...(artwork.status === "Available"
      ? { offers: { "@type": "Offer", availability: "https://schema.org/InStock", url: `${SITE.url}/works/${artwork.id}` } }
      : {}),
  };

  const specs: [string, string][] = [
    ["Script discipline", artwork.script_style],
    ["Ink formulation", artwork.medium],
    ["Surface & material", artwork.dimensions],
    ["Year of completion", artwork.year],
    ["Reference", `#${artwork.id}`],
    ["Availability", artwork.status],
  ];

  return (
    <>
      <Navbar />
      <main id="main" className="pt-24 sm:pt-28">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="shell">
          <Link
            href="/works"
            className="link-underline inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-forest"
          >
            <ArrowLeft size={11} />
            Back to the archive
          </Link>

          <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal>
              <ArtworkDetailViewer artwork={artwork} />
            </Reveal>

            <div className="lg:pt-4">
              <Reveal>
                <StatusBadge status={artwork.status} />
                <h1 className="mt-6 font-display text-display-md text-ink">{artwork.title}</h1>
                {artwork.title_arabic && (
                  <p dir="rtl" className="mt-3 font-arabic text-3xl text-forest">
                    {artwork.title_arabic}
                  </p>
                )}
                <p className="mt-6 text-pretty text-base leading-relaxed text-ink-soft">
                  {artwork.description ??
                    "A singular composition from the atelier — hand-inked, gilded and prepared for archival display."}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <dl className="mt-9 divide-y divide-line border-y border-line">
                  {specs.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[130px_1fr] gap-4 py-4">
                      <dt className="text-sm text-muted">{label}</dt>
                      <dd className="text-sm font-medium leading-relaxed text-ink-soft">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="mt-9 space-y-4">
                  <AcquireButton href={waHref} size="lg" variant="solid" className="w-full rounded-full" />
                  <p className="text-center text-xs text-muted">
                                          Opens WhatsApp · {content.contact.whatsappDisplay} · No account required
                  </p>
                  <div className="gold-rule" />
                  <p className="text-sm leading-relaxed text-muted">
                    Accompanied by a signed certificate of authenticity and an archival provenance
                    dossier. Insured worldwide shipping arranged with the atelier.
                  </p>
                  <a
                    href={`${SITE.url}#commissions`}
                    className="link-underline inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-forest"
                  >
                    Commission a related piece
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="shell mt-24 border-t border-line pt-16">
            <p className="eyebrow">Continue through the gallery</p>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a, i) => (
                <ArtworkCard key={a.id} artwork={a} index={i} aspect="aspect-[4/5]" />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
