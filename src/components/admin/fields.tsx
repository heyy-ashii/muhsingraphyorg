"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { uploadArtworkMedia } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { GripVertical, ImagePlus, LoaderCircle, Plus, Trash, X } from "lucide-react";

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
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
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
      className="flex w-full items-center justify-between gap-4 border border-line bg-surface px-4 py-3.5 text-left transition-colors hover:border-gold/40"
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
  folder?: "brand" | "hero" | "atelier" | "artworks" | "in-situ";
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
        <div className={cn("relative w-40 shrink-0 overflow-hidden border border-line bg-canvas-2", aspect)}>
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

/* ── collapsible panel ───────────────────────────────────────── */

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
    <section className="border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
      >
        <span className="flex items-baseline gap-4">
          {index && <span className="font-mono text-[10px] tracking-[0.24em] text-gold">{index}</span>}
          <span>
            <span className="block font-display text-[22px] leading-tight text-ink">{title}</span>
            {description && <span className="mt-1 block text-[12.5px] text-muted">{description}</span>}
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
      {open && <div className="space-y-6 border-t border-line px-5 py-6 sm:px-7">{children}</div>}
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
    <div className="border border-line bg-surface px-4 py-3.5">
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
                "border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300",
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

/** Exposed so the editor can warn when the browser client is unavailable. */
export function storageReady() {
  return Boolean(getSupabaseBrowserClient());
}
