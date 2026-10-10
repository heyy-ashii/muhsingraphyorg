"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn, pad } from "@/lib/utils";
import { SECTION } from "@/lib/site";
import { SectionHeading } from "./section-heading";

const INSTRUMENTS = [
  {
    n: "I",
    name: "The Qalam",
    arabic: "القلم",
    summary: "Hand-carved reed and bamboo pens, trimmed at precise angles.",
    detail:
      "Each qalam is cut from a single reed harvested in season, then trimmed and slit by hand to hold a fixed width. A nib trimmed at 32° writes Thuluth; a finer angle carries the hairline of Diwani. The pen is shaped for the letter it will write — never the reverse.",
    meta: ["Reed & bamboo", "Hand-cut nib angle", "Re-trimmed between sittings"],
  },
  {
    n: "II",
    name: "The Inks",
    arabic: "الحبر",
    summary: "Hand-ground lampblack soot ink and natural mineral pigments.",
    detail:
      "Lampblack is collected, bound with gum arabic and ground on a stone slab until the ink holds a mirror. Mineral pigments — vermilion, lapis, ochre — are mulled in the studio so the colour reads as a substance rather than a tint.",
    meta: ["Lampblack soot", "Gum arabic binder", "Stone-mulled minerals"],
  },
  {
    n: "III",
    name: "The Paper",
    arabic: "الورق",
    summary: "Traditional glazed Ahar paper and museum-grade Belgian linen.",
    detail:
      "Ahar paper is sized and burnished with an agate stone until the surface is glass-smooth, so the reed never tears. For monumental work the same preparation is carried onto Belgian linen primed to museum specification.",
    meta: ["Ahar sizing", "Agate burnishing", "Belgian linen support"],
  },
  {
    n: "IV",
    name: "The Gilding",
    arabic: "التذهيب",
    summary: "24k Italian gold leaf, hand-applied with organic size.",
    detail:
      "Gold is beaten to a leaf thinner than a breath and laid over organic size with a gilder's tip. The result is not a shine but a depth — it shifts with the hour and refuses to photograph twice the same way.",
    meta: ["24k Italian leaf", "Organic size", "Burnished by hand"],
  },
];

export function Craft() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="craft" className="relative scroll-mt-28 border-y border-line bg-canvas-2/40 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index={SECTION.craft}
          eyebrow="The Sacred Craft & Materials"
          lines={["Four instruments.", "One discipline."]}
          description="Nothing enters a Muhsingraphy canvas that was not chosen, prepared or ground in the atelier."
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {INSTRUMENTS.map((item, i) => {
            const open = openIndex === i;
            return (
              <motion.button
                key={item.name}
                type="button"
                layout
                onClick={() => setOpenIndex(open ? null : i)}
                onMouseEnter={() => setOpenIndex(i)}
                aria-expanded={open}
                className={cn(
                  "group relative flex flex-col justify-between bg-surface p-7 text-left transition-colors duration-700 sm:p-9",
                  open ? "bg-canvas" : "hover:bg-canvas/70",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity duration-700",
                    open ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                  )}
                />

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-[10px] tracking-[0.24em] text-gold">{item.n}</span>
                    <span className="font-arabic text-2xl text-muted/70 transition-colors duration-700 group-hover:text-gold" dir="rtl">
                      {item.arabic}
                    </span>
                  </div>

                  <h3 className="mt-8 font-display text-[clamp(1.7rem,2.6vw,2.3rem)] leading-tight text-ink">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{item.summary}</p>

                  <motion.div
                    initial={false}
                    animate={{
                      height: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                      marginTop: open ? 18 : 0,
                    }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-pretty text-[13.5px] leading-relaxed text-ink-soft">{item.detail}</p>
                  </motion.div>
                </div>

                <div className="mt-9">
                  <ul className="space-y-2 border-t border-line pt-5">
                    {item.meta.map((m) => (
                      <li key={m} className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                        <span aria-hidden className="h-1 w-1 rotate-45 bg-gold" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
