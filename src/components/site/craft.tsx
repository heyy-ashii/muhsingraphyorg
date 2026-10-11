"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/content/context";
import { SECTION_INDEX } from "@/lib/content/defaults";
import { SectionHeading } from "./section-heading";

export function Craft() {
  const { craft } = useSiteContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const instruments = craft.instruments ?? [];

  if (!instruments.length) return null;

  return (
    <section id="craft" className="relative scroll-mt-28 border-y border-line bg-canvas-2/40 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index={SECTION_INDEX.craft}
          eyebrow={craft.eyebrow}
          lines={craft.lines}
          description={craft.description}
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {instruments.map((item, i) => {
            const open = openIndex === i;
            return (
              <motion.button
                key={`${item.name}-${i}`}
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

                {item.meta?.length > 0 && (
                  <div className="mt-9">
                    <ul className="space-y-2 border-t border-line pt-5">
                      {item.meta.map((m, mi) => (
                        <li key={`${m}-${mi}`} className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                          <span aria-hidden className="h-1 w-1 rotate-45 bg-gold" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
