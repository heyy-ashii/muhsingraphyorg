"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SECTION, SITE } from "@/lib/site";
import { SectionHeading } from "./section-heading";
import { Counter, Reveal } from "@/components/ui/motion-primitives";

const METRICS = [
  { to: 18, suffix: "+", label: "Years of study" },
  { to: 240, suffix: "+", label: "Global collectors" },
  { to: 14, suffix: "", label: "Countries" },
  { to: 60, suffix: "+", label: "Custom installations" },
];

const PHILOSOPHY = [
  {
    title: "The nuqta as measure",
    body: "Every proportion in the atelier is derived from a single diamond dot of the qalam. Nothing is drawn by eye alone.",
  },
  {
    title: "Materials that age well",
    body: "Hand-ground lampblack soot, mineral pigment, Ahar-glazed paper and Belgian linen — chosen for centuries, not seasons.",
  },
  {
    title: "Restraint over ornament",
    body: "The gilding illuminates a stroke; it never competes with it. Negative space is treated as a material.",
  },
];

export function Atelier() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="atelier" className="relative scroll-mt-28 overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-1/4 h-[520px] w-[520px] rounded-full bg-gold/[0.06] blur-[130px]" />
      </div>

      <div className="shell">
        <SectionHeading
          index={SECTION.atelier}
          eyebrow="Atelier Muhsin"
          lines={["A practice in line,", "space and texture."]}
          description="Muhsin works from a private studio in Fort Kochi, writing in the classical disciplines while pushing them into contemporary scale. Each canvas passes through his hands alone — composition, inking, gilding and finishing."
        />

        <div ref={ref} className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* studio portrait */}
          <motion.div style={{ y: imageY }} className="relative">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden border border-line bg-canvas-2 shadow-gallery">
                <Image
                  src="/assets/artwork-01.jpg"
                  alt="Muhsin at the atelier, working a calligraphic composition"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover grayscale-[0.85] contrast-[1.12] transition-all duration-1000 hover:grayscale-0 hover:contrast-100"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121212]/70 via-[#121212]/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-arabic text-3xl text-white/90" dir="rtl">
                    {SITE.arabicName}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/70">
                    Master calligrapher · Fort Kochi, India
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-6">
              <blockquote className="border-l border-gold/40 pl-5">
                <p className="font-display text-[22px] italic leading-snug text-ink">
                  &ldquo;A letter is not finished when it is beautiful. It is finished when it is
                  inevitable.&rdquo;
                </p>
                <footer className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
                  Muhsin — studio note, MMXXIV
                </footer>
              </blockquote>
            </Reveal>
          </motion.div>

          {/* philosophy + metrics */}
          <div>
            <Reveal>
              <p className="text-pretty text-[17px] leading-relaxed text-ink-soft">
                Trained through two decades of classical study across Thuluth, Jali Diwani and
                Kufic, Muhsin treats calligraphy as an architectural discipline. His canvases
                hold the movement of a single breath while remaining structurally exact — the
                tension between rigour and gesture is the whole practice.
              </p>
            </Reveal>

            <div className="mt-12 divide-y divide-line border-y border-line">
              {PHILOSOPHY.map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i}>
                  <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[180px_1fr] sm:gap-8">
                    <h3 className="font-display text-[21px] leading-tight text-ink">{item.title}</h3>
                    <p className="text-pretty text-[14.5px] leading-relaxed text-muted">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {METRICS.map((m, i) => (
                <Reveal key={m.label} delay={0.06 * i}>
                  <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-ink">
                    <Counter to={m.to} suffix={m.suffix} />
                  </p>
                  <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
                    {m.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
