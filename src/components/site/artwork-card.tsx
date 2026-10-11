"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Artwork } from "@/lib/types";
import { cn, pad } from "@/lib/utils";
import { useSiteContent } from "@/lib/content/context";
import { StatusBadge } from "@/components/ui/status-badge";
import { AcquireButton } from "@/components/ui/whatsapp-button";
import { artworkWhatsappLink } from "@/lib/whatsapp";

export interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
  className?: string;
  aspect?: string;
  /** Opens the curator lightbox. When omitted the card links to the piece page. */
  onOpen?: (artwork: Artwork) => void;
}

export function ArtworkCard({ artwork, index, className, aspect = "aspect-[4/5]", onOpen }: ArtworkCardProps) {
  const { contact } = useSiteContent();
  const media = (
    <div className={cn("relative overflow-hidden bg-canvas-2", aspect)}>
      <Image
        src={artwork.image_url}
        alt={`${artwork.title} — ${artwork.script_style} calligraphy by Muhsin`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 45vw"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPScxNicgaGVpZ2h0PScyMCc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzIwJyBmaWxsPScjZTZlMGQ2Jy8+PC9zdmc+"
        className="object-cover transition-transform duration-[1400ms] ease-silk group-hover/card:scale-[1.045]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gold-sheen bg-[length:250%_100%] opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover/card:opacity-[0.18]"
      />

      <span className="pointer-events-none absolute left-4 top-4 z-10">
        <StatusBadge status={artwork.status} size="sm" />
      </span>

      <span className="pointer-events-none absolute bottom-4 left-4 z-10 font-mono text-[10px] uppercase tracking-[0.24em] text-white/0 transition-colors duration-700 group-hover/card:text-white/85">
        {artwork.script_style} · {artwork.year}
      </span>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.08 }}
      className={cn("group/card relative", className)}
    >
      {onOpen ? (
        <button
          type="button"
          onClick={() => onOpen(artwork)}
          data-cursor="VIEW PIECE"
          aria-label={`Open details for ${artwork.title}`}
          className="block w-full cursor-pointer text-left outline-none focus-visible:ring-1 focus-visible:ring-gold/60"
        >
          {media}
        </button>
      ) : (
        <Link
          href={`/works/${artwork.id}`}
          data-cursor="VIEW PIECE"
          aria-label={`View ${artwork.title}`}
          className="block outline-none focus-visible:ring-1 focus-visible:ring-gold/60"
        >
          {media}
        </Link>
      )}

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] tracking-[0.22em] text-gold">{pad(index + 1, 3)}</span>
            <h3 className="truncate font-display text-2xl leading-tight text-ink sm:text-[26px]">
              {artwork.title}
            </h3>
          </div>
          <p className="mt-1.5 max-w-[38ch] truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {artwork.dimensions}
          </p>
        </div>
        {artwork.title_arabic && (
          <span className="shrink-0 font-arabic text-lg text-muted/80" dir="rtl">
            {artwork.title_arabic}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <AcquireButton href={artworkWhatsappLink(artwork, undefined, contact.whatsappNumber)} size="sm" />
        <Link
          href={`/works/${artwork.id}`}
          className="btn-gold h-9 items-center px-4 font-mono text-[10px] uppercase tracking-[0.2em]"
        >
          <span>View piece</span>
        </Link>
      </div>
    </motion.article>
  );
}
