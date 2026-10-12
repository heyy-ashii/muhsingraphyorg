"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/content/context";
import { SECTION_INDEX } from "@/lib/content/defaults";
import { SectionHeading } from "./section-heading";

export function Collectors() {
  const { collectors } = useSiteContent();
  const endorsements = collectors.endorsements ?? [];
  const [showAll, setShowAll] = useState(false);

  if (!endorsements.length) return null;

  const hasMore = endorsements.length > 3;
  const visible = showAll ? endorsements : endorsements.slice(0, 3);

  return (
    <section
      id="collectors"
      className="relative scroll-mt-28 overflow-hidden border-y border-line bg-canvas-2 py-20 sm:py-28"
    >
      <div className="shell">
        <SectionHeading
          index={SECTION_INDEX.collectors}
          eyebrow={collectors.eyebrow}
          lines={collectors.lines}
          description={collectors.description || undefined}
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {visible.map((item, i) => (
            <motion.figure
              key={`${item.name}-${i}`}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.08 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-7 transition-shadow duration-300 hover:shadow-whisper sm:p-9"
            >
              <div className="flex items-center gap-1 text-coral" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((n) => (
                  <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <blockquote className="relative z-10 mt-4">
                <p className="text-pretty text-lg leading-relaxed text-ink">
                  {item.quote}
                </p>
              </blockquote>
              <figcaption className="relative z-10 mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-lime">
                  {item.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {hasMore && !showAll && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="btn-ink h-11 px-6 text-sm"
            >
              <span>Show more</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
