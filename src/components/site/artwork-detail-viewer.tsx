"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RoomPreview } from "./room-preview";

const LENS = 260;
const ZOOM = 3;

/** The full-bleed stage on a piece's own page: lens + view-in-room toggle. */
export function ArtworkDetailViewer({ artwork }: { artwork: Artwork }) {
  const [view, setView] = useState<"artwork" | "room">("artwork");
  const [lensOn, setLensOn] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, bx: 50, by: 50 });
  const stageRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      bx: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      by: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
    });
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-line p-0.5">
          {(["artwork", "room"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setView(mode);
                setLensOn(false);
              }}
              className={cn(
                "rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-500",
                view === mode ? "bg-ink text-canvas" : "text-muted hover:text-ink",
              )}
            >
              {mode === "artwork" ? "Artwork View" : "View in Room"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLensOn((v) => !v)}
          disabled={view === "room"}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-gold/60 hover:text-gold",
            view === "room" && "cursor-not-allowed opacity-35 hover:border-line hover:text-ink",
          )}
        >
          {lensOn ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
          {lensOn ? "Lens on" : "Zoom lens"}
        </button>
      </div>

      <div
        ref={stageRef}
        onMouseMove={onMove}
        onMouseEnter={() => view === "artwork" && setLensOn(true)}
        onMouseLeave={() => setLensOn(false)}
        className={cn(
          "relative mt-6 aspect-[4/5] overflow-hidden border border-line bg-[#0b0b0d] sm:aspect-[16/13]",
          view === "artwork" && lensOn && "cursor-none",
        )}
      >
        <AnimatePresence mode="wait">
          {view === "artwork" ? (
            <motion.div
              key="art"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={artwork.image_url}
                alt={`${artwork.title} — ${artwork.script_style} calligraphy by Muhsin`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              key="room"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {artwork.in_situ_image_url ? (
                <Image
                  src={artwork.in_situ_image_url}
                  alt={`${artwork.title} installed in a collector's interior`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <RoomPreview src={artwork.image_url} alt={artwork.title} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {lensOn && view === "artwork" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute z-20 hidden overflow-hidden rounded-full border border-gold/60 shadow-gilding md:block"
              style={{
                width: LENS,
                height: LENS,
                left: pos.x - LENS / 2,
                top: pos.y - LENS / 2,
                backgroundImage: `url(${artwork.image_url})`,
                backgroundSize: `${ZOOM * 100}%`,
                backgroundPosition: `${pos.bx}% ${pos.by}%`,
                backgroundRepeat: "no-repeat",
              }}
            >
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/80">
                {ZOOM.toFixed(1)}× lens
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
