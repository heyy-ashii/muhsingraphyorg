"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Artwork } from "@/lib/types";
import { cn, pad } from "@/lib/utils";
import { useSiteContent } from "@/lib/content/context";
import { ArtworkCard } from "./artwork-card";
import { ArtworkModal } from "./artwork-modal";
import { MagneticCursor } from "./magnetic-cursor";

const LAYOUT = [
  { col: "lg:col-span-7", offset: "lg:mt-0", aspect: "aspect-[4/5]" },
  { col: "lg:col-span-5", offset: "lg:mt-24", aspect: "aspect-[3/4]" },
  { col: "lg:col-span-5", offset: "lg:mt-0", aspect: "aspect-[4/5]" },
  { col: "lg:col-span-7", offset: "lg:mt-16", aspect: "aspect-[16/11]" },
  { col: "lg:col-span-8", offset: "lg:mt-0", aspect: "aspect-[16/10]" },
  { col: "lg:col-span-4", offset: "lg:mt-28", aspect: "aspect-[3/4]" },
];

export function WorksIndex({ artworks }: { artworks: Artwork[] }) {
  const { works } = useSiteContent();
  const [active, setActive] = useState<string>("All");
  const [selected, setSelected] = useState<Artwork | null>(null);

  const categories = works.categories?.length ? works.categories : ["All"];
  const filtered = useMemo(
    () => (active === "All" ? artworks : artworks.filter((a) => a.categories?.includes(active))),
    [artworks, active],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "relative overflow-hidden rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-500",
                isActive
                  ? "border-gold/60 text-gold-deep dark:text-gold"
                  : "border-line text-muted hover:border-gold/35 hover:text-ink",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="index-category-pill"
                  className="absolute inset-0 bg-gold/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          {pad(filtered.length, 2)} {filtered.length === 1 ? "piece" : "pieces"}
        </span>
      </div>

      <motion.div
        layout
        className="mt-14 grid grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-10"
      >
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

      <MagneticCursor />
      <ArtworkModal artwork={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
