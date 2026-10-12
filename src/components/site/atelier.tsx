"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSiteContent } from "@/lib/content/context";
import { SECTION_INDEX } from "@/lib/content/defaults";
import { SectionHeading } from "./section-heading";
import { Counter, Reveal } from "@/components/ui/motion-primitives";

export function Atelier() {
  const { atelier, brand } = useSiteContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="atelier" className="relative scroll-mt-28 overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      </div>

      <div className="shell">
        <SectionHeading
          index={SECTION_INDEX.atelier}
          eyebrow={atelier.eyebrow}
          lines={atelier.lines}
          description={atelier.description}
        />

        <div ref={ref} className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* studio portrait */}
          <motion.div style={{ y: imageY }} className="relative">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-canvas-2">
                <Image
                  src={atelier.imageUrl || "/assets/artwork-01.jpg"}
                  alt="Muhsin at the atelier, working a calligraphic composition"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121212]/70 via-[#121212]/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-arabic text-3xl text-white/90" dir="rtl">
                    {brand.arabicName}
                  </p>
                  <p className="mt-2 font-sans text-[9px] tracking-wide text-white/70">
                    {atelier.imageCaption}
                  </p>
                </div>
              </div>
            </Reveal>

            {atelier.quote && (
              <Reveal delay={0.15} className="mt-6">
                <blockquote className="border-l-2 border-forest pl-5">
                  <p className="font-display text-xl leading-snug text-ink">
                    &ldquo;{atelier.quote}&rdquo;
                  </p>
                  <footer className="mt-3 text-xs text-muted">
                    {atelier.quoteAttribution}
                  </footer>
                </blockquote>
              </Reveal>
            )}
          </motion.div>

          {/* philosophy + metrics */}
          <div>
            {atelier.intro && (
              <Reveal>
                <p className="text-pretty text-lg leading-relaxed text-ink-soft">{atelier.intro}</p>
              </Reveal>
            )}

            {atelier.philosophy?.length > 0 && (
              <div className="mt-12 divide-y divide-line border-y border-line">
                {atelier.philosophy.map((item, i) => (
                  <Reveal key={`${item.title}-${i}`} delay={0.08 * i}>
                    <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[180px_1fr] sm:gap-8">
                      <h3 className="font-display text-lg font-semibold leading-tight text-ink">{item.title}</h3>
                      <p className="text-pretty text-sm leading-relaxed text-muted">{item.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {atelier.metrics?.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
                {atelier.metrics.map((m, i) => (
                  <Reveal key={`${m.label}-${i}`} delay={0.06 * i}>
                    <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-ink">
                      <Counter to={m.value} suffix={m.suffix} />
                    </p>
                    <p className="mt-3 text-xs text-muted">
                      {m.label}
                    </p>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
