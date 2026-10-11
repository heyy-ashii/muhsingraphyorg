"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  CircleUser,
  ExternalLink,
  FileText,
  GripVertical,
  Images,
  Inbox,
  LayoutGrid,
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
import { ARTWORK_STATUSES, INQUIRY_STATUSES, galleryOf } from "@/lib/types";
import type { ArtworkStatus } from "@/lib/types";
import { cn, formatDate, pad } from "@/lib/utils";
import { BrandLockup } from "@/components/ui/brand-lockup";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

type Tab = "overview" | "artworks" | "inquiries" | "content" | "account";

const NAV: { key: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "artworks", label: "Artworks", icon: Images },
  { key: "inquiries", label: "Enquiries", icon: Inbox },
  { key: "content", label: "Site Content", icon: FileText },
  { key: "account", label: "Account", icon: CircleUser },
];

const STATUS_TONE: Record<ArtworkStatus, string> = {
  Available: "border-gold/45 bg-gold/10 text-gold-deep dark:text-gold",
  "Private Collection": "border-line bg-canvas-2 text-muted",
  Reserved: "border-sky-600/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
};

const INQUIRY_TONE: Record<InquiryStatus, string> = {
  New: "border-gold/50 bg-gold/10 text-gold-deep dark:text-gold",
  Responded: "border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Archived: "border-line bg-canvas-2 text-muted",
};

/** Shared pill styles for status chips and controls. */
const pill = "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium";

export function DashboardClient({
  email,
  userMetadata,
}: {
  email: string;
  userMetadata?: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const configured = adminConfigured();

  const [tab, setTab] = useState<Tab>("overview");
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
      featured: artworks.filter((a) => a.is_featured).length,
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

  async function setStatus(artwork: Artwork, status: ArtworkStatus) {
    const previous = artwork.status;
    setArtworks((prev) => prev.map((a) => (a.id === artwork.id ? { ...a, status } : a)));
    try {
      await updateArtwork(artwork.id, { status });
    } catch (err) {
      setArtworks((prev) => prev.map((a) => (a.id === artwork.id ? { ...a, status: previous } : a)));
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

  const openNew = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (a: Artwork) => {
    setEditing(a);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-dvh bg-canvas-2/50">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1480px] flex-col lg:flex-row">
        {/* ── sidebar ─────────────────────────────────────────── */}
        <aside className="flex shrink-0 flex-col gap-6 border-line px-5 py-6 lg:w-[264px] lg:border-r lg:px-6 lg:py-8">
          <Link href="/" className="inline-flex">
            <BrandLockup size="sm" />
          </Link>

          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map(({ key, label, icon: Icon }) => {
              const active = tab === key;
              const count =
                key === "artworks"
                  ? artworks.length
                  : key === "inquiries"
                    ? inquiries.length
                    : undefined;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "group inline-flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-300 lg:w-full",
                    active
                      ? "bg-surface text-ink shadow-whisper"
                      : "text-muted hover:bg-surface/60 hover:text-ink",
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(active ? "text-gold" : "text-muted group-hover:text-gold")}
                  />
                  <span className="whitespace-nowrap">{label}</span>
                  {count !== undefined && count > 0 && (
                    <span
                      className={cn(
                        "ml-auto hidden rounded-full px-2 py-0.5 text-[11px] font-medium lg:inline-block",
                        active ? "bg-gold/15 text-gold-deep dark:text-gold" : "bg-canvas-2 text-muted",
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto hidden border-t border-line pt-5 lg:block">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Appearance
              </span>
              <ThemeToggle />
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-base text-gold-deep dark:text-gold">
                {displayName.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-ink">{displayName}</p>
                <p className="truncate text-[11px] text-muted">{email}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 rounded-lg px-2 py-2 text-[12.5px] text-muted transition-colors hover:bg-surface/60 hover:text-ink"
              >
                <ExternalLink size={14} /> View gallery
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[12.5px] text-muted transition-colors hover:bg-surface/60 hover:text-red-500"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* ── content ─────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-[clamp(1.9rem,3.2vw,2.6rem)] leading-none text-ink">
                {NAV.find((n) => n.key === tab)?.label}
              </h1>
              <p className="mt-2 text-[13px] text-muted">
                {tab === "overview" && "Your atelier at a glance."}
                {tab === "artworks" && "Add, sequence and curate the works in the gallery."}
                {tab === "inquiries" && "Commission requests from collectors."}
                {tab === "content" && "Edit the copy and imagery shown on the public site."}
                {tab === "account" && "Your curator profile and password."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void refresh()}
                aria-label="Refresh"
                title="Refresh"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                <RefreshCw size={15} className={cn(loading && "animate-spin")} />
              </button>
              <button
                type="button"
                onClick={signOut}
                aria-label="Sign out"
                title="Sign out"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-red-500/50 hover:text-red-500 lg:hidden"
              >
                <LogOut size={15} />
              </button>
              <span className="lg:hidden">
                <ThemeToggle />
              </span>
              {tab === "artworks" && (
                <button
                  type="button"
                  onClick={openNew}
                  className="btn-ink h-10 rounded-full px-5 text-[12px] font-medium"
                >
                  <Plus size={14} />
                  <span>Add artwork</span>
                </button>
              )}
            </div>
          </header>

          <AnimatePresence>
            {savedFlash && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[12px] text-gold-deep dark:text-gold"
              >
                <Check size={13} /> Saved
              </motion.p>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-4">
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
              {!configured && (
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                  Add the keys to <code className="font-mono text-[11px]">.env.local</code>, then run{" "}
                  <code className="font-mono text-[11px]">supabase/schema.sql</code> in your project.
                </p>
              )}
            </div>
          )}

          <div className="mt-7">
            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <LoaderCircle size={22} className="animate-spin text-gold" />
              </div>
            ) : tab === "overview" ? (
              <OverviewPanel
                artworks={artworks}
                inquiries={inquiries}
                stats={stats}
                onAdd={openNew}
                onEdit={openEdit}
                onGoTo={setTab}
              />
            ) : tab === "artworks" ? (
              <ArtworksPanel
                artworks={artworks}
                onReorder={persistOrder}
                onEdit={openEdit}
                onDelete={handleDelete}
                onSetStatus={setStatus}
                onToggleFeatured={toggleFeatured}
                onAdd={openNew}
              />
            ) : tab === "inquiries" ? (
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
            ) : tab === "content" ? (
              <ContentEditor initial={content} tableMissing={contentMissing} />
            ) : (
              <AccountPanel email={email} onProfileSaved={(name) => name && setDisplayName(name)} />
            )}
          </div>
        </div>
      </div>

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

/* ── overview ─────────────────────────────────────────────── */

function OverviewPanel({
  artworks,
  inquiries,
  stats,
  onAdd,
  onEdit,
  onGoTo,
}: {
  artworks: Artwork[];
  inquiries: Inquiry[];
  stats: { total: number; available: number; featured: number; newInquiries: number };
  onAdd: () => void;
  onEdit: (a: Artwork) => void;
  onGoTo: (tab: Tab) => void;
}) {
  const cards: { label: string; value: string | number; hint: string; tab?: Tab }[] = [
    { label: "Works in archive", value: stats.total, hint: "Total pieces", tab: "artworks" },
    { label: "Available", value: stats.available, hint: "Open to acquisition" },
    { label: "Featured", value: stats.featured, hint: "In hero & pavilion" },
    {
      label: "New enquiries",
      value: stats.newInquiries,
      hint: "Awaiting reply",
      tab: "inquiries",
    },
  ];

  const recentWorks = [...artworks].sort((a, b) => a.display_order - b.display_order).slice(0, 4);
  const recentInquiries = inquiries.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => c.tab && onGoTo(c.tab)}
            disabled={!c.tab}
            className={cn(
              "rounded-2xl border border-line bg-surface p-5 text-left transition-colors",
              c.tab && "hover:border-gold/40",
            )}
          >
            <p className="font-display text-[38px] leading-none text-ink">{c.value}</p>
            <p className="mt-3 text-[13px] font-medium text-ink">{c.label}</p>
            <p className="mt-0.5 text-[11.5px] text-muted">{c.hint}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 className="text-[13.5px] font-semibold text-ink">Recent works</h2>
            <button
              type="button"
              onClick={() => onGoTo("artworks")}
              className="inline-flex items-center gap-1 text-[12px] text-muted transition-colors hover:text-gold"
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          {recentWorks.length ? (
            <ul className="divide-y divide-line">
              {recentWorks.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onEdit(a)}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-canvas-2/50"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-canvas-2">
                      <Image src={a.image_url} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-ink">
                        {a.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-muted">
                        {a.script_style} · {a.year}
                      </span>
                    </span>
                    <span className={cn(pill, "shrink-0", STATUS_TONE[a.status])}>{a.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-[13px] text-muted">No works yet.</p>
              <button
                type="button"
                onClick={onAdd}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[12px] text-ink transition-colors hover:border-gold/50 hover:text-gold"
              >
                <Plus size={13} /> Add the first artwork
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 className="text-[13.5px] font-semibold text-ink">Latest enquiries</h2>
            <button
              type="button"
              onClick={() => onGoTo("inquiries")}
              className="inline-flex items-center gap-1 text-[12px] text-muted transition-colors hover:text-gold"
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          {recentInquiries.length ? (
            <ul className="divide-y divide-line">
              {recentInquiries.map((inq) => (
                <li key={inq.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-[13.5px] font-medium text-ink">
                      {inq.client_name}
                    </span>
                    <span className={cn(pill, "shrink-0", INQUIRY_TONE[inq.status])}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[11.5px] text-muted">
                    {inq.commission_type} · {formatDate(inq.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-10 text-center text-[13px] text-muted">
              No enquiries recorded yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

/* ── artworks panel ───────────────────────────────────────── */

function ArtworksPanel({
  artworks,
  onReorder,
  onEdit,
  onDelete,
  onSetStatus,
  onToggleFeatured,
  onAdd,
}: {
  artworks: Artwork[];
  onReorder: (next: Artwork[]) => void;
  onEdit: (a: Artwork) => void;
  onDelete: (a: Artwork) => void;
  onSetStatus: (a: Artwork, status: ArtworkStatus) => void;
  onToggleFeatured: (a: Artwork) => void;
  onAdd: () => void;
}) {
  if (!artworks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center">
        <p className="font-display text-2xl text-ink">The archive is empty</p>
        <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted">
          Add the first piece to begin the collection.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="btn-ink mt-6 h-10 rounded-full px-5 text-[12px] font-medium"
        >
          <Plus size={14} /> Add artwork
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-[12px] text-muted">Drag the handles to re-sequence the pavilion.</p>

      <Reorder.Group axis="y" values={artworks} onReorder={onReorder} className="space-y-3">
        {artworks.map((artwork, i) => (
          <Reorder.Item
            key={artwork.id}
            value={artwork}
            className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-3.5 transition-colors hover:border-gold/35 sm:gap-5 sm:p-4"
          >
            <button
              type="button"
              aria-label="Drag to reorder"
              className="hidden cursor-grab touch-none text-muted/60 transition-colors hover:text-gold active:cursor-grabbing sm:block"
            >
              <GripVertical size={16} />
            </button>

            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-canvas-2 sm:h-[68px] sm:w-[68px]">
              <Image src={artwork.image_url} alt="" fill sizes="80px" className="object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-gold">{pad(i + 1, 3)}</span>
                <h3 className="truncate text-[15px] font-medium text-ink">{artwork.title}</h3>
                {artwork.is_featured && <Sparkles size={13} className="shrink-0 text-gold" />}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted">
                <span className="truncate">
                  {artwork.script_style} · {artwork.dimensions} · {artwork.year}
                </span>
                {galleryOf(artwork).length > 1 && (
                  <span className="inline-flex shrink-0 items-center gap-1">
                    <Images size={11} /> {galleryOf(artwork).length} images
                  </span>
                )}
              </div>
            </div>

            <label className="hidden md:block">
              <span className="sr-only">Status for {artwork.title}</span>
              <select
                value={artwork.status}
                onChange={(e) => onSetStatus(artwork, e.target.value as ArtworkStatus)}
                className={cn(
                  "h-8 cursor-pointer rounded-full border bg-transparent px-3 text-[11.5px] font-medium outline-none transition-colors",
                  STATUS_TONE[artwork.status],
                )}
              >
                {ARTWORK_STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-surface text-ink">
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onToggleFeatured(artwork)}
                aria-label="Toggle featured"
                title="Feature in hero & pavilion"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  artwork.is_featured
                    ? "text-gold hover:bg-gold/10"
                    : "text-muted/70 hover:bg-canvas-2 hover:text-gold",
                )}
              >
                <Sparkles size={15} />
              </button>
              <button
                type="button"
                onClick={() => onEdit(artwork)}
                aria-label="Edit artwork"
                title="Edit"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas-2 hover:text-ink"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(artwork)}
                aria-label="Delete artwork"
                title="Delete"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted/70 transition-colors hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash size={15} />
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
      <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center">
        <p className="font-display text-2xl text-ink">No enquiries yet</p>
        <p className="mx-auto mt-2 max-w-sm text-[13px] text-muted">
          Commission requests submitted through the site will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inq) => (
        <article key={inq.id} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[15px] font-medium text-ink">{inq.client_name}</h3>
                <span className={cn(pill, INQUIRY_TONE[inq.status])}>{inq.status}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted">
                <a
                  href={`mailto:${inq.client_email}`}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
                >
                  <Mail size={12} /> {inq.client_email}
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
                    "rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors",
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
                className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted/70 transition-colors hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>

          <p className="mt-4 max-w-[86ch] border-t border-line pt-4 text-[13.5px] leading-relaxed text-ink-soft">
            {inq.message}
          </p>
        </article>
      ))}
    </div>
  );
}
