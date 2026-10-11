"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, X } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { AcquireButton } from "@/components/ui/whatsapp-button";
import { RoomPreview } from "./room-preview";
import { buildArtworkMessage, whatsappLink } from "@/lib/whatsapp";
import { useSiteContent } from "@/lib/content/context";

const LENS = 208;
const ZOOM = 2.6;

type ViewMode = "artwork" | "room";

export function ArtworkModal({
  artwork,
  onClose,
}: {
  artwork: Artwork | null;
  onClose: () => void;
}) {
  const [view, setView] = useState<ViewMode>("artwork");
  const [lensOn, setLensOn] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, bx: 50, by: 50 });
  const stageRef = useRef<HTMLDivElement>(null);
  const { contact } = useSiteContent();

  useEffect(() => {
    if (!artwork) return;
    setView("artwork");
    setLensOn(false);
  }, [artwork]);

  useEffect(() => {
    if (!artwork) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [artwork, onClose]);

  const onStageMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setPos({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      bx: Math.min(100, Math.max(0, px * 100)),
      by: Math.min(100, Math.max(0, py * 100)),
    });
  }, []);

  const message = artwork ? buildArtworkMessage(artwork) : "";
  const waHref = whatsappLink(message, contact.whatsappNumber);

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key="curator-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${artwork.title} — curator view`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-stretch justify-center bg-[#07070a]/92 backdrop-blur-2xl"
          data-lenis-prevent
        >
          <motion.div
            initial={{ y: 42, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative m-0 flex h-full w-full max-w-[1720px] flex-col overflow-y-auto bg-canvas no-scrollbar lg:m-6 lg:h-[calc(100%-3rem)] lg:flex-row lg:overflow-hidden lg:rounded-[3px]"
          >
            {/* ── Stage ─────────────────────────────────────────── */}
            <div className="relative flex flex-1 flex-col bg-[#0b0b0d] lg:min-w-0">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
                <div className="inline-flex rounded-full border border-white/15 p-0.5">
                  {(["artwork", "room"] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setView(mode);
                        setLensOn(false);
                      }}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-500",
                        view === mode ? "bg-white text-[#0b0b0d]" : "text-white/60 hover:text-white",
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
                    "inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 transition-colors duration-500 hover:border-gold/60 hover:text-gold",
                    view === "room" && "cursor-not-allowed opacity-35 hover:border-white/15 hover:text-white/70",
                  )}
                >
                  {lensOn ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                  {lensOn ? "Lens on" : "Zoom lens"}
                </button>
              </div>

              <div
                ref={stageRef}
                onMouseMove={onStageMove}
                onMouseEnter={() => view === "artwork" && setLensOn(true)}
                onMouseLeave={() => setLensOn(false)}
                className={cn(
                  "relative flex flex-1 items-center justify-center overflow-hidden p-6 sm:p-10",
                  view === "artwork" && lensOn && "cursor-none",
                )}
              >
                <AnimatePresence mode="wait">
                  {view === "artwork" ? (
                    <motion.div
                      key="artwork"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="relative h-full max-h-[74vh] w-full"
                    >
                      <Image
                        src={artwork.image_url}
                        alt={`${artwork.title} — ${artwork.script_style} calligraphy by Muhsin`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 62vw"
                        priority
                        className="object-contain"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="room"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="relative h-full max-h-[74vh] w-full overflow-hidden rounded-sm"
                    >
                      {artwork.in_situ_image_url ? (
                        <Image
                          src={artwork.in_situ_image_url}
                          alt={`${artwork.title} installed in a collector's interior`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 62vw"
                          className="object-cover"
                        />
                      ) : (
                        <RoomPreview src={artwork.image_url} alt={artwork.title} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* magnifier */}
                <AnimatePresence>
                  {lensOn && view === "artwork" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
                      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/25" />
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-white/80">
                        {ZOOM.toFixed(1)}× lens
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <span className="pointer-events-none absolute bottom-4 right-5 font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
                  {view === "artwork" ? "Hover to inspect stroke & gilding" : "Conceptual interior preview"}
                </span>
              </div>
            </div>

            {/* ── Curator dossier ───────────────────────────────── */}
            <aside className="flex w-full shrink-0 flex-col justify-between border-t border-line bg-canvas px-6 py-8 sm:px-10 lg:w-[440px] lg:border-l lg:border-t-0 lg:py-12 xl:w-[500px]">
              <div>
                <div className="flex items-start justify-between gap-6">
                  <span className="eyebrow">Ref #{artwork.id}</span>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-500 hover:border-gold/60 hover:text-gold"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="mt-6">
                  <StatusBadge status={artwork.status} />
                </div>

                <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.02] text-ink">
                  {artwork.title}
                </h2>
                {artwork.title_arabic && (
                  <p dir="rtl" className="mt-2 font-arabic text-2xl text-gold">
                    {artwork.title_arabic}
                  </p>
                )}

                <p className="mt-5 max-w-[46ch] text-pretty text-[15px] leading-relaxed text-ink-soft">
                  {artwork.description ??
                    "A singular composition from the atelier — hand-inked, gilded and prepared for archival display."}
                </p>

                <dl className="mt-8 divide-y divide-line border-y border-line">
                  {[
                    ["Script discipline", artwork.script_style],
                    ["Ink formulation", artwork.medium],
                    ["Surface & material", artwork.dimensions],
                    ["Year of completion", artwork.year],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[130px_1fr] gap-4 py-4">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{label}</dt>
                      <dd className="text-[13.5px] leading-relaxed text-ink-soft">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-10 space-y-4">
                <AcquireButton href={waHref} size="lg" variant="solid" className="w-full rounded-full" />
                <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                  Opens WhatsApp · {contact.whatsappDisplay} · No account required
                </p>
                <div className="gold-rule" />
                <p className="text-center text-[11px] leading-relaxed text-muted">
                  Certificate of authenticity and archival framing arranged at the atelier.
                  Worldwide insured shipping.
                </p>
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
