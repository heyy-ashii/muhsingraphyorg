"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { galleryOf } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RoomPreview } from "./room-preview";

const LENS = 260;
const ZOOM = 3;

/**
 * The full-bleed stage on a piece's own page. Shows every photograph in the
 * gallery — the cover plus the close-ups of different portions and angles —
 * with a thumbnail strip, keyboard arrows, a zoom lens and a view-in-room mode.
 */
export function ArtworkDetailViewer({ artwork }: { artwork: Artwork }) {
  const images = galleryOf(artwork);
  const [view, setView] = useState<"artwork" | "room">("artwork");
  const [index, setIndex] = useState(0);
  const [lensOn, setLensOn] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, bx: 50, by: 50 });
  const stageRef = useRef<HTMLDivElement>(null);

  const current = images[Math.min(index, images.length - 1)];
  const many = images.length > 1;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + images.length) % images.length);
      setLensOn(false);
    },
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

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
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              <Image
                src={current}
                alt={`${artwork.title} — ${artwork.script_style} calligraphy by Muhsin (view ${index + 1})`}
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

        {/* gallery navigation */}
        {many && view === "artwork" && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/85 backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-gold"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/85 backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-gold"
            >
              <ChevronRight size={18} />
            </button>
            <span className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm">
              {index + 1} / {images.length}
            </span>
          </>
        )}

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
                backgroundImage: `url(${current})`,
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

      {many && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => {
                setIndex(i);
                setView("artwork");
                setLensOn(false);
              }}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-square overflow-hidden border transition-colors duration-300",
                i === index ? "border-gold" : "border-line hover:border-gold/50",
              )}
            >
              <Image src={src} alt="" fill sizes="140px" className="object-cover" />
              {i === index && <span aria-hidden className="absolute inset-0 ring-1 ring-inset ring-gold/70" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
