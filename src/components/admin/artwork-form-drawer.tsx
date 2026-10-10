"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { ARTWORK_STATUSES, SCRIPT_STYLES, type Artwork, type ArtworkInput, type ArtworkStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { uploadArtworkMedia } from "@/lib/admin";

interface Props {
  open: boolean;
  editing: Artwork | null;
  nextOrder: number;
  onClose: () => void;
  onSubmit: (input: ArtworkInput, id?: string) => Promise<void>;
}

interface Draft {
  title: string;
  title_arabic: string;
  script_style: string;
  medium: string;
  dimensions: string;
  year: string;
  status: ArtworkStatus;
  is_featured: boolean;
  categories: string[];
  description: string;
  image_url: string;
  in_situ_image_url: string;
}

const EMPTY: Draft = {
  title: "",
  title_arabic: "",
  script_style: SCRIPT_STYLES[0],
  medium: "",
  dimensions: "",
  year: String(new Date().getFullYear()),
  status: "Available",
  is_featured: false,
  categories: [],
  description: "",
  image_url: "",
  in_situ_image_url: "",
};

const CATEGORY_OPTIONS = [
  "Classical Masters",
  "Contemporary Canvases",
  "Gold Leaf Works",
  "Monumental Scales",
];

export function ArtworkFormDrawer({ open, editing, nextOrder, onClose, onSubmit }: Props) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<"main" | "situ" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mainRef = useRef<HTMLInputElement>(null);
  const situRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setDraft(
      editing
        ? {
            title: editing.title,
            title_arabic: editing.title_arabic ?? "",
            script_style: editing.script_style,
            medium: editing.medium,
            dimensions: editing.dimensions,
            year: editing.year,
            status: editing.status,
            is_featured: editing.is_featured,
            categories: editing.categories ?? [],
            description: editing.description ?? "",
            image_url: editing.image_url,
            in_situ_image_url: editing.in_situ_image_url ?? "",
          }
        : EMPTY,
    );
  }, [open, editing]);

  async function pickFile(kind: "main" | "situ", file: File | undefined) {
    if (!file) return;
    setUploading(kind);
    setError(null);
    try {
      const url = await uploadArtworkMedia(file, kind === "main" ? "artworks" : "in-situ");
      setDraft((d) => (kind === "main" ? { ...d, image_url: url } : { ...d, in_situ_image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.image_url) {
      setError("A main artwork image is required.");
      return;
    }
    setBusy(true);
    setError(null);

    const payload: ArtworkInput = {
      title: draft.title.trim(),
      title_arabic: draft.title_arabic.trim() || null,
      script_style: draft.script_style,
      medium: draft.medium.trim(),
      dimensions: draft.dimensions.trim(),
      year: draft.year.trim(),
      status: draft.status,
      is_featured: draft.is_featured,
      categories: draft.categories,
      description: draft.description.trim() || null,
      image_url: draft.image_url,
      in_situ_image_url: draft.in_situ_image_url || null,
      display_order: editing?.display_order ?? nextOrder,
    };

    try {
      await onSubmit(payload, editing?.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the artwork.");
    } finally {
      setBusy(false);
    }
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-ink/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={editing ? "Edit artwork" : "Add new artwork"}
            className="fixed right-0 top-0 z-[111] flex h-full w-full max-w-[620px] flex-col border-l border-line bg-canvas shadow-gallery"
          >
            <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
              <div>
                <p className="eyebrow">{editing ? "Edit piece" : "New acquisition"}</p>
                <h2 className="mt-1.5 font-display text-2xl text-ink">
                  {editing ? editing.title : "Add New Artwork"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-gold/60 hover:text-gold"
              >
                <X size={15} />
              </button>
            </header>

            <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
              {/* media */}
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    ["main", "Main artwork *", draft.image_url, mainRef],
                    ["situ", "In-room preview", draft.in_situ_image_url, situRef],
                  ] as const
                ).map(([kind, label, value, ref]) => (
                  <div key={kind}>
                    <span className="eyebrow">{label}</span>
                    <button
                      type="button"
                      onClick={() => ref.current?.click()}
                      className="group relative mt-3 flex aspect-[4/5] w-full items-center justify-center overflow-hidden border border-dashed border-line bg-canvas-2/50 transition-colors hover:border-gold/50"
                    >
                      {value ? (
                        <>
                          <Image src={value} alt="" fill sizes="280px" className="object-cover" />
                          <span className="absolute inset-0 flex items-center justify-center bg-ink/55 font-mono text-[9px] uppercase tracking-[0.2em] text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Replace
                          </span>
                        </>
                      ) : uploading === kind ? (
                        <LoaderCircle size={20} className="animate-spin text-gold" />
                      ) : (
                        <span className="flex flex-col items-center gap-2 text-muted">
                          <ImagePlus size={20} />
                          <span className="font-mono text-[9px] uppercase tracking-[0.18em]">Upload</span>
                        </span>
                      )}
                    </button>
                    <input
                      ref={ref}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => pickFile(kind, e.target.files?.[0])}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-9 grid grid-cols-1 gap-7 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="eyebrow">Title *</span>
                  <input required value={draft.title} onChange={(e) => set("title", e.target.value)} className="field mt-3" />
                </label>

                <label className="block">
                  <span className="eyebrow">Arabic title</span>
                  <input
                    dir="rtl"
                    value={draft.title_arabic}
                    onChange={(e) => set("title_arabic", e.target.value)}
                    className="field mt-3 font-arabic text-lg"
                  />
                </label>

                <label className="block">
                  <span className="eyebrow">Script style</span>
                  <select
                    value={draft.script_style}
                    onChange={(e) => set("script_style", e.target.value)}
                    className="field mt-3 bg-transparent"
                  >
                    {SCRIPT_STYLES.map((s) => (
                      <option key={s} value={s} className="bg-surface text-ink">
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="eyebrow">Medium description *</span>
                  <input
                    required
                    value={draft.medium}
                    onChange={(e) => set("medium", e.target.value)}
                    placeholder="Handmade ink & 24k gold leaf on Belgian linen"
                    className="field mt-3"
                  />
                </label>

                <label className="block">
                  <span className="eyebrow">Dimensions *</span>
                  <input
                    required
                    value={draft.dimensions}
                    onChange={(e) => set("dimensions", e.target.value)}
                    placeholder="90 x 120 cm / 35.4 x 47.2 in"
                    className="field mt-3"
                  />
                </label>

                <label className="block">
                  <span className="eyebrow">Year</span>
                  <input value={draft.year} onChange={(e) => set("year", e.target.value)} className="field mt-3" />
                </label>
              </div>

              <div className="mt-8">
                <span className="eyebrow">Status</span>
                <div className="mt-3 inline-flex rounded-full border border-line p-0.5">
                  {ARTWORK_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("status", s)}
                      className={cn(
                        "rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-400",
                        draft.status === s ? "bg-ink text-canvas" : "text-muted hover:text-ink",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <span className="eyebrow">Categories</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((c) => {
                    const on = draft.categories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          set(
                            "categories",
                            on ? draft.categories.filter((x) => x !== c) : [...draft.categories, c],
                          )
                        }
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-400",
                          on ? "border-gold/60 bg-gold/10 text-gold-deep dark:text-gold" : "border-line text-muted hover:border-gold/35",
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={draft.is_featured}
                  onClick={() => set("is_featured", !draft.is_featured)}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-400",
                    draft.is_featured ? "border-gold/60 bg-gold/25" : "border-line bg-canvas-2",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-[3px] h-4 w-4 rounded-full transition-all duration-400",
                      draft.is_featured ? "left-[22px] bg-gold" : "left-[3px] bg-muted",
                    )}
                  />
                </button>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                  Feature in hero & pavilion
                </span>
              </label>

              <label className="mt-8 block">
                <span className="eyebrow">Curator note</span>
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="field mt-3 resize-none"
                  placeholder="Provenance, intent, materials…"
                />
              </label>

              {error && (
                <p role="alert" className="mt-7 border border-red-500/30 bg-red-500/5 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </form>

            <footer className="flex items-center justify-end gap-3 border-t border-line px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-full px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="btn-ink h-11 rounded-full px-7 font-mono text-[10px] uppercase tracking-[0.2em] disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <LoaderCircle size={13} className="animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>{editing ? "Save changes" : "Publish artwork"}</span>
                )}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
