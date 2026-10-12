"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Artwork } from "@/lib/types";
import { useSiteContent } from "@/lib/content/context";
import { AmbientTilt, SplitLines } from "@/components/ui/motion-primitives";
import { StatusBadge } from "@/components/ui/status-badge";
import { AcquireButton } from "@/components/ui/whatsapp-button";
import { artworkWhatsappLink } from "@/lib/whatsapp";

export function Hero({ artwork }: { artwork: Artwork | null }) {
  const { hero, brand } = useSiteContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const pieceY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const pieceScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  const heroImage = hero.imageUrl || artwork?.image_url || "/assets/artwork-01.jpg";
  const heroLines = hero.headline?.length ? hero.headline : ["The quiet", "power of a", "single stroke."];

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden pb-16 pt-24 sm:pt-28 lg:pb-20"
    >
      <div className="shell relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div style={{ y: copyY }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            {hero.eyebrow ? (
              <>
                <span className="eyebrow">{hero.eyebrow}</span>
                <span className="h-px w-8 bg-forest/50" />
              </>
            ) : null}
            <StatusBadge status="Available" size="sm" />
          </motion.div>

          <h1 className="mt-6 font-display text-display-xl text-ink">
            <SplitLines lines={heroLines} lineClassName="" delay={0} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[46ch] text-pretty text-[16px] leading-relaxed text-ink-soft sm:text-[17px]"
          >
            {hero.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.02, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="#works"
              className="btn-ink h-[52px] rounded-full px-7 text-[15px]"
            >
              <span>{hero.ctaLabel}</span>
            </Link>
            {artwork && (
              <AcquireButton
                href={artworkWhatsappLink(artwork)}
                label="Acquire via WhatsApp"
                size="lg"
                className="rounded-full"
              />
            )}
          </motion.div>

          {hero.stats?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-line pt-6"
            >
              {hero.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-sans text-xs text-muted">{stat.label}</p>
                  <p className="mt-1 font-display text-lg text-ink">{stat.value}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ── Hero piece with ambient tilt ─────────────────────── */}
        <motion.div style={{ y: pieceY, scale: pieceScale }} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <AmbientTilt intensity={9} className="relative">
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute -inset-6 rounded-3xl bg-forest/10 blur-3xl"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-canvas-2">
                  <Image
                    src={heroImage}
                    alt={artwork ? `${artwork.title} — calligraphy by Muhsin` : "Calligraphy by Muhsin"}
                    fill
                    priority
                    sizes="(max-width: 1024px) 92vw, 46vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <div>
                      <p className="font-sans text-[9px] tracking-wide text-white/70">
                        Featured · {artwork?.script_style ?? "Thuluth"}
                      </p>
                      <p className="mt-1 font-display text-xl text-white">
                        {artwork?.title ?? "The Unseen Light"}
                      </p>
                    </div>
                    <span className="font-arabic text-2xl text-white/80" dir="rtl">
                      {brand.arabicName}
                    </span>
                  </div>
                </div>

                {/* floating plaque */}
                <div className="glass absolute -bottom-8 -left-6 hidden w-[248px] rounded-2xl p-5 sm:block">
                  <p className="eyebrow">{hero.plaqueEyebrow}</p>
                  <p className="mt-2 font-display text-[22px] leading-tight text-ink">
                    {hero.plaqueTitle}
                  </p>
                  <div className="gold-rule my-3" />
                  <p className="font-sans text-xs text-muted">
                    {hero.plaqueNote}
                  </p>
                </div>
              </div>
            </AmbientTilt>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="shell mt-20 hidden items-center gap-3 sm:flex"
      >
        <span className="font-sans text-xs text-muted">Scroll</span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="block h-8 w-px bg-gradient-to-b from-forest to-transparent"
        />
      </motion.div>
    </section>
  );
}
