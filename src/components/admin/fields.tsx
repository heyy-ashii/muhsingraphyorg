"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { uploadArtworkMedia } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, GripVertical, ImagePlus, LoaderCircle, Plus, Trash, X } from "lucide-react";

/* ── text inputs ─────────────────────────────────────────────── */

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{children}</span>
  );
}

export function Text({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field mt-2 h-11 py-0"
      />
    </label>
  );
}

export function Area({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {hint && <span className="mt-1 block text-[12px] leading-snug text-muted">{hint}</span>}
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field mt-2 resize-y leading-relaxed"
      />
    </label>
  );
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3.5 text-left transition-colors hover:border-gold/40"
    >
      <span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink">{label}</span>
        {hint && <span className="mt-1 block text-[12px] leading-snug text-muted">{hint}</span>}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300",
          checked ? "border-gold/60 bg-gold/30" : "border-line bg-canvas-2",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-300",
            checked ? "left-[26px] bg-gold" : "left-1 bg-muted/50",
          )}
        />
      </span>
    </button>
  );
}

/* ── image field with upload ─────────────────────────────────── */

export function ImageField({
  label,
  value,
  onChange,
  folder = "brand",
  aspect = "aspect-[16/9]",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder?: "brand" | "hero" | "atelier" | "artworks" | "in-situ" | "collections";
  aspect?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(file: File) {
    setBusy(true);
    setError(null);
    try {
      const url = await uploadArtworkMedia(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex gap-4">
        <div className={cn("relative w-40 shrink-0 overflow-hidden rounded-xl border border-line bg-canvas-2", aspect)}>
          {value ? (
            <Image src={value} alt="" fill sizes="160px" className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-muted/60">
              None
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL or upload →"
            className="field h-11 py-0 text-[12px]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-50"
            >
              {busy ? <LoaderCircle size={12} className="animate-spin" /> : <ImagePlus size={12} />}
              {busy ? "Uploading" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-red-500/40 hover:text-red-500"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
          {error && <p className="text-[11px] text-red-500">{error}</p>}
          <input
            ref={ref}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void pick(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── string list editor ──────────────────────────────────────── */

export function StringList({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const list = items ?? [];
  const set = (i: number, v: string) => onChange(list.map((x, xi) => (xi === i ? v : x)));
  const remove = (i: number) => onChange(list.filter((_, xi) => xi !== i));
  const add = () => onChange([...list, ""]);

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical size={14} className="shrink-0 text-muted/40" />
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => set(i, e.target.value)}
              className="field h-10 py-0 text-[13px]"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
            >
              <Trash size={13} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold/50 hover:text-gold"
        >
          <Plus size={12} /> Add item
        </button>
      </div>
    </div>
  );
}

/* ── collapsible group card ──────────────────────────────────── */

/**
 * The core building block of the dashboard's card language: a rounded surface
 * with an optional leading icon, a title, a one-line description and free-form
 * children. `Card` is always open; `Panel` is the collapsible variant used by
 * the Site Content editor.
 */
export function Card({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface", className)}>
      <header className="flex items-start gap-3 border-b border-line px-5 py-4 sm:px-6">
        {icon && (
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-deep dark:text-gold">
            {icon}
          </span>
        )}
        <span className="min-w-0">
          <h3 className="font-display text-[19px] leading-tight text-ink">{title}</h3>
          {description && <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{description}</p>}
        </span>
      </header>
      <div className="space-y-6 px-5 py-6 sm:px-6">{children}</div>
    </section>
  );
}

/** Collapsible variant of `Card`, used for the densely nested Site Content groups. */
export function Panel({
  title,
  index,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  index?: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-canvas-2/40 sm:px-6"
      >
        <span className="flex items-baseline gap-4">
          {index && <span className="font-mono text-[10px] tracking-[0.24em] text-gold">{index}</span>}
          <span className="min-w-0">
            <span className="block font-display text-[20px] leading-tight text-ink">{title}</span>
            {description && <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">{description}</span>}
          </span>
        </span>
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-transform duration-300",
            open && "rotate-180",
          )}
        >
          ▾
        </span>
      </button>
      {open && <div className="space-y-6 border-t border-line px-5 py-6 sm:px-6">{children}</div>}
    </section>
  );
}

/** Two-column responsive field grid. */
export function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      className={cn(
        "grid gap-5",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}

/** Storage bucket hint used by the image controls. */
export const BUCKET = MEDIA_BUCKET;

/* ── segmented choice ────────────────────────────────────────── */

export function Segmented<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3.5">
      <Label>{label}</Label>
      {hint && <p className="mt-1 text-[12px] leading-snug text-muted">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300",
                active
                  ? "border-gold/60 bg-gold/15 text-ink"
                  : "border-line text-muted hover:border-gold/40 hover:text-ink",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── multi-image gallery editor ──────────────────────────────── */

/**
 * Uploads and orders the photographs that make up a single piece. The first
 * image is the cover shown in the pavilion and cards; the rest appear in the
 * public gallery as portions/angles. Reorder with the arrows, remove with the
 * trash button, and drop in more with the upload control.
 */
export function MediaGallery({
  label,
  hint,
  images,
  onChange,
  folder = "artworks",
  max = 12,
}: {
  label: string;
  hint?: string;
  images: string[];
  onChange: (next: string[]) => void;
  folder?: "artworks" | "in-situ" | "brand" | "hero" | "atelier";
  max?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const list = images ?? [];

  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const room = Math.max(0, max - list.length);
      const chosen = Array.from(files).slice(0, room);
      const urls = await Promise.all(chosen.map((f) => uploadArtworkMedia(f, folder)));
      onChange([...list, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <Label>{label}</Label>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
          {list.length} / {max}
        </span>
      </div>
      {hint && <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{hint}</p>}

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {list.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-canvas-2">
            <Image src={src} alt="" fill sizes="140px" className="object-cover" unoptimized />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-gold/90 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-ink">
                Cover
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-ink/70 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move earlier"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white/85 transition-colors hover:text-gold disabled:opacity-25"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => onChange(list.filter((_, xi) => xi !== i))}
                aria-label="Remove image"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white/85 transition-colors hover:text-red-400"
              >
                <Trash size={12} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
                aria-label="Move later"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white/85 transition-colors hover:text-gold disabled:opacity-25"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}

        {list.length < max && (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={busy}
            className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-line text-muted transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-50"
          >
            {busy ? <LoaderCircle size={18} className="animate-spin text-gold" /> : <ImagePlus size={18} />}
            <span className="font-mono text-[8px] uppercase tracking-[0.16em]">
              {busy ? "Uploading" : "Add"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(e) => {
          void pick(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

/** Exposed so the editor can warn when the browser client is unavailable. */
export function storageReady() {
  return Boolean(getSupabaseBrowserClient());
}
