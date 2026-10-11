"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  GripVertical,
  LoaderCircle,
  LogOut,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash,
} from "lucide-react";
import type { Artwork, ArtworkInput, Inquiry, InquiryStatus } from "@/lib/types";
import { ARTWORK_STATUSES, INQUIRY_STATUSES } from "@/lib/types";
import { cn, formatDate, pad } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { BrandLockup } from "@/components/ui/brand-lockup";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ADMIN_NOT_CONFIGURED,
  adminConfigured,
  createArtwork,
  deleteArtwork,
  deleteInquiry,
  listArtworks,
  listInquiries,
  loadSiteContent,
  reorderArtworks,
  setInquiryStatus,
  updateArtwork,
} from "@/lib/admin";
import type { SiteContent } from "@/lib/content/schema";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { displayNameOf } from "@/lib/account";
import { ContentEditor } from "./content-editor";
import { AccountPanel } from "./account-panel";
import { ArtworkFormDrawer } from "./artwork-form-drawer";

type Tab = "artworks" | "inquiries" | "content" | "account";

const INQUIRY_TONE: Record<InquiryStatus, string> = {
  New: "border-gold/50 bg-gold/10 text-gold-deep dark:text-gold",
  Responded: "border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Archived: "border-line bg-canvas-2 text-muted",
};

export function DashboardClient({
  email,
  userMetadata,
}: {
  email: string;
  userMetadata?: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const configured = adminConfigured();

  const [tab, setTab] = useState<Tab>("artworks");
  const [displayName, setDisplayName] = useState(() => displayNameOf(email, userMetadata));
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [contentMissing, setContentMissing] = useState(false);

  const refresh = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      setError(ADMIN_NOT_CONFIGURED);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [works, inqs] = await Promise.all([listArtworks(), listInquiries()]);
      setArtworks(works);
      setInquiries(inqs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the atelier data.");
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!configured) return;
    loadSiteContent()
      .then((result) => {
        if (result) setContent(result);
        else setContentMissing(true);
      })
      .catch(() => setContentMissing(true));
  }, [configured]);

  const nextOrder = useMemo(
    () => (artworks.length ? Math.max(...artworks.map((a) => a.display_order)) + 1 : 1),
    [artworks],
  );

  const stats = useMemo(
    () => ({
      total: artworks.length,
      available: artworks.filter((a) => a.status === "Available").length,
      newInquiries: inquiries.filter((i) => i.status === "New").length,
    }),
    [artworks, inquiries],
  );

  async function signOut() {
    await getSupabaseBrowserClient()?.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  async function handleSubmit(input: ArtworkInput, id?: string) {
    if (id) {
      const updated = await updateArtwork(id, input);
      setArtworks((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } else {
      const created = await createArtwork(input);
      setArtworks((prev) => [...prev, created].sort((a, b) => a.display_order - b.display_order));
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2200);
  }

  async function handleDelete(artwork: Artwork) {
    if (!window.confirm(`Remove “${artwork.title}” from the archive? This cannot be undone.`)) return;
    try {
      await deleteArtwork(artwork.id);
      setArtworks((prev) => prev.filter((a) => a.id !== artwork.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  async function cycleStatus(artwork: Artwork) {
    const idx = ARTWORK_STATUSES.indexOf(artwork.status);
    const next = ARTWORK_STATUSES[(idx + 1) % ARTWORK_STATUSES.length];
    setArtworks((prev) => prev.map((a) => (a.id === artwork.id ? { ...a, status: next } : a)));
    try {
      await updateArtwork(artwork.id, { status: next });
    } catch (err) {
      setArtworks((prev) => prev.map((a) => (a.id === artwork.id ? artwork : a)));
      setError(err instanceof Error ? err.message : "Status update failed.");
    }
  }

  async function toggleFeatured(artwork: Artwork) {
    const next = !artwork.is_featured;
    setArtworks((prev) => prev.map((a) => (a.id === artwork.id ? { ...a, is_featured: next } : a)));
    try {
      await updateArtwork(artwork.id, { is_featured: next });
    } catch {
      setArtworks((prev) => prev.map((a) => (a.id === artwork.id ? artwork : a)));
    }
  }

  async function persistOrder(next: Artwork[]) {
    setArtworks(next);
    try {
      await reorderArtworks(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reorder failed.");
      void refresh();
    }
  }

  return (
    <div className="min-h-dvh bg-canvas-2/40">
      {/* ── top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-6">
            <BrandLockup size="sm" />
            <span className="hidden h-6 w-px bg-line sm:block" />
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-muted sm:block">
              Curator Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="hidden h-10 items-center gap-2 rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-muted transition-colors hover:border-gold/50 hover:text-gold sm:inline-flex"
            >
              View gallery
              <ArrowUpRight size={12} />
            </Link>
            <span className="hidden max-w-[190px] truncate font-mono text-[9px] uppercase tracking-[0.16em] text-muted lg:block">
              {displayName}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-gold/50 hover:text-gold"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 sm:py-14">
        {/* ── hero row ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Atelier operations</p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-none text-ink">
              The Archive
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              <RefreshCw size={12} className={cn(loading && "animate-spin")} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setDrawerOpen(true);
              }}
              className="btn-ink h-11 rounded-full px-6 font-mono text-[9px] uppercase tracking-[0.22em]"
            >
              <Plus size={13} />
              <span>Add New Artwork</span>
            </button>
          </div>
        </div>

        {/* ── stats ─────────────────────────────────────────── */}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line lg:grid-cols-4">
          {[
            ["Works in archive", stats.total],
            ["Available now", stats.available],
            ["New enquiries", stats.newInquiries],
            ["Studio", SITE.studio.city],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-surface px-6 py-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{label}</p>
              <p className="mt-3 font-display text-[clamp(1.8rem,3vw,2.4rem)] leading-none text-ink">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── tabs ──────────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center gap-1 border-b border-line">
          {(
            [
              ["artworks", `Artworks (${artworks.length})`],
              ["inquiries", `Commission Inquiries (${inquiries.length})`],
              ["content", "Site Content"],
              ["account", "Account"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "relative px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-400",
                tab === key ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {label}
              {tab === key && (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-x-0 -bottom-px h-px bg-gold"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {savedFlash && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold-deep dark:text-gold"
            >
              <Check size={12} /> Archive updated
            </motion.p>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-6 border border-red-500/30 bg-red-500/5 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-red-600 dark:text-red-400">
              {error}
            </p>
            {!configured && (
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                Add the keys to <code className="font-mono text-[11px]">.env.local</code>, then run{" "}
                <code className="font-mono text-[11px]">supabase/schema.sql</code> in your project.
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <LoaderCircle size={22} className="animate-spin text-gold" />
          </div>
        ) : tab === "artworks" ? (
          <ArtworksPanel
            artworks={artworks}
            onReorder={persistOrder}
            onEdit={(a) => {
              setEditing(a);
              setDrawerOpen(true);
            }}
            onDelete={handleDelete}
            onCycleStatus={cycleStatus}
            onToggleFeatured={toggleFeatured}
          />
        ) : (
          <InquiriesPanel
            inquiries={inquiries}
            onStatus={async (id, status) => {
              setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
              try {
                await setInquiryStatus(id, status);
              } catch {
                void refresh();
              }
            }}
            onDelete={async (id) => {
              if (!window.confirm("Delete this enquiry permanently?")) return;
              setInquiries((prev) => prev.filter((i) => i.id !== id));
              try {
                await deleteInquiry(id);
              } catch {
                void refresh();
              }
            }}
          />
        )}

        {tab === "content" && (
          <div className="mt-8">
            <ContentEditor initial={content} tableMissing={contentMissing} />
          </div>
        )}

        {tab === "account" && (
          <AccountPanel email={email} onProfileSaved={(name) => name && setDisplayName(name)} />
        )}
      </main>

      <ArtworkFormDrawer
        open={drawerOpen}
        editing={editing}
        nextOrder={nextOrder}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/* ── artworks panel ───────────────────────────────────────── */

function ArtworksPanel({
  artworks,
  onReorder,
  onEdit,
  onDelete,
  onCycleStatus,
  onToggleFeatured,
}: {
  artworks: Artwork[];
  onReorder: (next: Artwork[]) => void;
  onEdit: (a: Artwork) => void;
  onDelete: (a: Artwork) => void;
  onCycleStatus: (a: Artwork) => void;
  onToggleFeatured: (a: Artwork) => void;
}) {
  if (!artworks.length) {
    return (
      <p className="mt-16 text-center font-display text-2xl text-muted">
        No works yet. Add the first piece to the archive.
      </p>
    );
  }

  return (
    <div className="mt-8">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
        Drag the handles to re-sequence the pavilion
      </p>

      <Reorder.Group
        axis="y"
        values={artworks}
        onReorder={onReorder}
        className="mt-5 space-y-2"
      >
        {artworks.map((artwork, i) => (
          <Reorder.Item
            key={artwork.id}
            value={artwork}
            className="group grid grid-cols-[auto_64px_1fr_auto] items-center gap-4 border border-line bg-surface px-4 py-3.5 sm:grid-cols-[auto_72px_1.6fr_1fr_auto] sm:gap-6"
          >
            <button
              type="button"
              aria-label="Drag to reorder"
              className="cursor-grab touch-none text-muted transition-colors hover:text-gold active:cursor-grabbing"
            >
              <GripVertical size={16} />
            </button>

            <div className="relative h-16 w-16 overflow-hidden bg-canvas-2 sm:h-[72px] sm:w-[72px]">
              <Image src={artwork.image_url} alt="" fill sizes="80px" className="object-cover" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[9px] tracking-[0.2em] text-gold">{pad(i + 1, 3)}</span>
                <h3 className="truncate font-display text-xl text-ink">{artwork.title}</h3>
                {artwork.is_featured && <Sparkles size={12} className="shrink-0 text-gold" />}
              </div>
              <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                {artwork.script_style} · {artwork.dimensions} · {artwork.year}
              </p>
            </div>

            <div className="hidden sm:block">
              <button
                type="button"
                onClick={() => onCycleStatus(artwork)}
                title="Click to cycle status"
                className={cn(
                  "rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-400",
                  artwork.status === "Available"
                    ? "border-gold/50 bg-gold/10 text-gold-deep dark:text-gold"
                    : "border-line bg-canvas-2 text-muted",
                )}
              >
                {artwork.status}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onToggleFeatured(artwork)}
                aria-label="Toggle featured"
                title="Toggle featured"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                  artwork.is_featured
                    ? "border-gold/50 text-gold"
                    : "border-line text-muted hover:border-gold/40 hover:text-gold",
                )}
              >
                <Sparkles size={13} />
              </button>
              <button
                type="button"
                onClick={() => onEdit(artwork)}
                aria-label="Edit artwork"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold/40 hover:text-gold"
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(artwork)}
                aria-label="Delete artwork"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
              >
                <Trash size={13} />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

/* ── inquiries panel ──────────────────────────────────────── */

function InquiriesPanel({
  inquiries,
  onStatus,
  onDelete,
}: {
  inquiries: Inquiry[];
  onStatus: (id: string, status: InquiryStatus) => void;
  onDelete: (id: string) => void;
}) {
  if (!inquiries.length) {
    return (
      <p className="mt-16 text-center font-display text-2xl text-muted">
        No commission enquiries recorded yet.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {inquiries.map((inq) => (
        <article key={inq.id} className="border border-line bg-surface p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-2xl text-ink">{inq.client_name}</h3>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em]",
                    INQUIRY_TONE[inq.status],
                  )}
                >
                  {inq.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                <a href={`mailto:${inq.client_email}`} className="link-underline inline-flex items-center gap-1.5 hover:text-gold">
                  <Mail size={10} /> {inq.client_email}
                </a>
                <span>{inq.commission_type}</span>
                <span>{formatDate(inq.created_at)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {INQUIRY_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatus(inq.id, s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-400",
                    inq.status === s
                      ? "border-gold/50 bg-gold/10 text-gold-deep dark:text-gold"
                      : "border-line text-muted hover:border-gold/35 hover:text-ink",
                  )}
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onDelete(inq.id)}
                aria-label="Delete enquiry"
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
              >
                <Trash size={13} />
              </button>
            </div>
          </div>

          <p className="mt-5 max-w-[86ch] border-t border-line pt-5 text-pretty text-[14.5px] leading-relaxed text-ink-soft">
            {inq.message}
          </p>
        </article>
      ))}
    </div>
  );
}
