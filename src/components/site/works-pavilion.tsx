"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Artwork } from "@/lib/types";
import { cn, pad } from "@/lib/utils";
import { useSiteContent } from "@/lib/content/context";
import { SECTION_INDEX } from "@/lib/content/defaults";
import { SectionHeading } from "./section-heading";
import { ArtworkCard } from "./artwork-card";
import { ArtworkModal } from "./artwork-modal";

/**
 * Staggered editorial layout: each piece receives a column span and vertical
 * offset so the pavilion never reads as a uniform product grid.
 */
const LAYOUT = [
  { col: "lg:col-span-7", offset: "lg:mt-0", aspect: "aspect-[4/5]" },
  { col: "lg:col-span-5", offset: "lg:mt-24", aspect: "aspect-[3/4]" },
  { col: "lg:col-span-5", offset: "lg:mt-0", aspect: "aspect-[4/5]" },
  { col: "lg:col-span-7", offset: "lg:mt-16", aspect: "aspect-[16/11]" },
  { col: "lg:col-span-8", offset: "lg:mt-0", aspect: "aspect-[16/10]" },
  { col: "lg:col-span-4", offset: "lg:mt-28", aspect: "aspect-[3/4]" },
];

export function WorksPavilion({ artworks }: { artworks: Artwork[] }) {
  const { works } = useSiteContent();
  const [active, setActive] = useState<string>("All");
  const [selected, setSelected] = useState<Artwork | null>(null);

  const categories = works.categories?.length ? works.categories : ["All"];
  const filtered = useMemo(() => {
    if (active === "All") return artworks;
    return artworks.filter((a) => a.categories?.includes(active));
  }, [artworks, active]);

  return (
    <section id="works" className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index={SECTION_INDEX.works}
          eyebrow={works.eyebrow}
          lines={works.lines}
          description={works.description}
          action={
            <p className="text-sm text-muted">
              {pad(filtered.length, 2)} {filtered.length === 1 ? "piece" : "pieces"} on view
            </p>
          }
        />

        <div className="mt-12 flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={cn(
                  "relative overflow-hidden rounded-full border px-4 py-2 text-sm transition-colors duration-500",
                  isActive
                    ? "border-forest/60 text-forest dark:text-forest"
                    : "border-line text-muted hover:border-forest/35 hover:text-ink",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 bg-forest/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-16 grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((artwork, i) => {
              const l = LAYOUT[i % LAYOUT.length];
              return (
                <motion.div
                  key={artwork.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("sm:col-span-1", l.col, l.offset)}
                >
                  <ArtworkCard artwork={artwork} index={i} aspect={l.aspect} onOpen={setSelected} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-20 text-center font-display text-2xl text-muted">
            No works in this category at present.
          </p>
        )}
      </div>

      <ArtworkModal artwork={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
