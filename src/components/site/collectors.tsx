"use client";

import { motion } from "framer-motion";
import { SECTION } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const ENDORSEMENTS = [
  {
    quote:
      "Muhsin does not decorate a wall — he gives it a centre of gravity. Our clients stand in front of the gilded panel for minutes without speaking.",
    name: "Omar Al-Rashid",
    role: "Curator, Meridian Gallery — Dubai",
  },
  {
    quote:
      "We commissioned a monumental Thuluth piece for a private residence. Three years later it is still the first thing every guest asks about.",
    name: "Helena Ruiz",
    role: "Private Collector — Madrid",
  },
  {
    quote:
      "The precision is architectural and the gesture is entirely human. That combination is extraordinarily rare in contemporary Islamic art.",
    name: "Dr. Amara Okafor",
    role: "Art Historian — London",
  },
  {
    quote:
      "Every stage was documented, every material accounted for. The archival dossier that arrived with the canvas was itself a work of care.",
    name: "Kenji Watanabe",
    role: "Collector — Tokyo",
  },
];

export function Collectors() {
  return (
    <section
      id="collectors"
      className="relative scroll-mt-28 overflow-hidden border-y border-line bg-canvas-2/40 py-24 sm:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gold/[0.05] blur-[140px]" />
      </div>

      <div className="shell">
        <SectionHeading
          index={SECTION.collectors}
          eyebrow="Collector Endorsements"
          lines={["Words from", "the collections."]}
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {ENDORSEMENTS.map((item, i) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 }}
              className={cn(
                "group relative flex flex-col justify-between bg-surface p-8 transition-colors duration-700 hover:bg-canvas sm:p-11",
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-6 top-4 font-display text-[7rem] leading-none text-gold/12 transition-colors duration-700 group-hover:text-gold/25"
              >
                &rdquo;
              </span>
              <blockquote className="relative z-10">
                <p className="text-pretty font-display text-[clamp(1.25rem,2.1vw,1.7rem)] italic leading-[1.42] text-ink">
                  {item.quote}
                </p>
              </blockquote>
              <figcaption className="relative z-10 mt-8 flex items-center gap-4 border-t border-line pt-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-sm text-gold">
                  {item.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                    {item.name}
                  </span>
                  <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
