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
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-32 sm:pt-40 lg:pb-24"
    >
      {/* drifting background calligraphic strokes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 1200 800"
          className="absolute -left-[12%] top-[6%] h-[70%] w-[70%] text-gold/[0.07] animate-drift"
          fill="none"
        >
          <path
            d="M40 620C180 520 240 300 420 250c150-42 250 60 340 20 90-40 120-160 260-170"
            stroke="currentColor"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path d="M300 640c90-120 60-300 210-340 130-34 220 40 300 10" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        </svg>
        <svg
          viewBox="0 0 1200 800"
          className="absolute -right-[16%] bottom-[-8%] h-[62%] w-[62%] text-ink/[0.045] dark:text-gold/[0.05] animate-drift [animation-delay:-8s]"
          fill="none"
        >
          <path
            d="M1100 120C980 260 900 420 720 470 560 515 470 430 360 470 250 510 200 640 60 680"
            stroke="currentColor"
            strokeWidth="30"
            strokeLinecap="round"
          />
        </svg>
      </div>

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
                <span className="h-px w-8 bg-gold/50" />
              </>
            ) : null}
            <StatusBadge status="Available" size="sm" />
          </motion.div>

          <h1 className="mt-7 font-display text-display-xl text-ink">
            <SplitLines lines={heroLines} lineClassName="italic" delay={0} />
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
              className="btn-ink h-[54px] rounded-full px-8 font-mono text-[11px] uppercase tracking-[0.24em]"
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
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted">{stat.label}</p>
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
                  className="absolute -inset-6 rounded-sm bg-gold/12 blur-3xl"
                />
                <div className="relative aspect-[4/5] overflow-hidden border border-line bg-canvas-2 shadow-gallery">
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
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/70">
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
                <div className="glass absolute -bottom-8 -left-6 hidden w-[248px] rounded-sm p-5 sm:block">
                  <p className="eyebrow">{hero.plaqueEyebrow}</p>
                  <p className="mt-2 font-display text-[22px] leading-tight text-ink">
                    {hero.plaqueTitle}
                  </p>
                  <div className="gold-rule my-3" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
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
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted">Scroll</span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="block h-8 w-px bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
