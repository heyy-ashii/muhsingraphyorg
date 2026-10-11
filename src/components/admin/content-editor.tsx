"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  Gem,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  Link2,
  LoaderCircle,
  MessageSquare,
  Palette,
  Quote,
  Save,
  Sparkles,
  Type,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { SiteContent, SectionKey } from "@/lib/content/schema";
import { saveSiteContent } from "@/lib/admin";
import { cn } from "@/lib/utils";
import {
  Area,
  Card,
  Grid,
  ImageField,
  Label,
  Panel,
  Segmented,
  StringList,
  Text,
  Toggle,
} from "./fields";

/** Immutable deep-clone patch helper for the editor's draft state. */
function edit<T>(obj: T, fn: (draft: T) => void): T {
  const copy = structuredClone(obj);
  fn(copy);
  return copy;
}

/* ── grouped navigation ─────────────────────────────────────── */

type GroupKey = "brand" | "home" | "sections" | "contact" | "ticker";

const GROUPS: { key: GroupKey; label: string; icon: LucideIcon; hint: string }[] = [
  { key: "brand", label: "Brand & identity", icon: Palette, hint: "Wordmark, logo emblem, tagline and favicon." },
  { key: "home", label: "Home & hero", icon: ImageIcon, hint: "Exhibition opening headline, image and stats." },
  { key: "sections", label: "Page sections", icon: LayoutGrid, hint: "Headings, descriptions and content for each section." },
  { key: "contact", label: "Contact & credit", icon: Link2, hint: "WhatsApp, email, Instagram, studio and site credit." },
  { key: "ticker", label: "Moving banner", icon: MessageSquare, hint: "Marquee words, speed, separator and visibility." },
];

const SECTION_META: { key: SectionKey; title: string; index: string; hint: string; icon: LucideIcon }[] = [
  { key: "works", title: "Selected Works pavilion", index: "001", hint: "Heading, description and filter chips.", icon: LayoutGrid },
  { key: "atelier", title: "About the artist", index: "002", hint: "Portrait, philosophy, quote and metrics.", icon: UserRound },
  { key: "craft", title: "Sacred Craft & Materials", index: "003", hint: "The four instruments.", icon: Gem },
  { key: "process", title: "Discipline & Methodology", index: "004", hint: "The four-step breakdown.", icon: Sparkles },
  { key: "collectors", title: "Collector endorsements", index: "005", hint: "Quotes from patrons.", icon: Quote },
  { key: "commissions", title: "Bespoke Commission Desk", index: "006", hint: "Form heading and direct channels.", icon: Building2 },
];

export function ContentEditor({
  initial,
  tableMissing,
}: {
  initial: SiteContent;
  tableMissing: boolean;
}) {
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [group, setGroup] = useState<GroupKey>("brand");

  // Honour a deep link (e.g. /admin/dashboard#ticker) without breaking hydration.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#ticker") setGroup("ticker");
  }, []);

  function apply(next: SiteContent) {
    setDraft(next);
    setDirty(true);
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await saveSiteContent(draft);
      setFlash(true);
      setDirty(false);
      setTimeout(() => setFlash(false), 2400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  const activeGroup = GROUPS.find((g) => g.key === group) ?? GROUPS[0];

  return (
    <div className="pb-28">
      {tableMissing && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-gold/40 bg-gold/5 px-5 py-4">
          <Info size={18} className="mt-0.5 shrink-0 text-gold-deep dark:text-gold" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-deep dark:text-gold">
              One-time setup required
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              The <code className="font-mono text-[12px]">site_content</code> table does not exist yet, so edits
              cannot be saved. Open the Supabase SQL Editor, paste the{" "}
              <code className="font-mono text-[12px]">site_content</code> block from{" "}
              <code className="font-mono text-[12px]">supabase/schema.sql</code> and run it. Everything below will
              then save normally.
            </p>
          </div>
        </div>
      )}

      {/* ── group switcher ─────────────────────────────────── */}
      <nav
        aria-label="Content areas"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar"
      >
        {GROUPS.map((g) => {
          const active = g.key === group;
          const Icon = g.icon;
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => setGroup(g.key)}
              aria-current={active}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300",
                active
                  ? "border-gold/60 bg-gold/15 text-ink"
                  : "border-line bg-surface text-muted hover:border-gold/40 hover:text-ink",
              )}
            >
              <Icon size={13} className={active ? "text-gold-deep dark:text-gold" : ""} />
              {g.label}
            </button>
          );
        })}
      </nav>

      {/* ── active group ───────────────────────────────────── */}
      <div key={group} className="mt-6 space-y-5">
        <div className="flex items-center gap-2 text-[12.5px] text-muted">
          <activeGroup.icon size={14} className="text-gold-deep dark:text-gold" />
          <span>{activeGroup.hint}</span>
        </div>

        {group === "brand" && <BrandGroup draft={draft} apply={apply} />}
        {group === "home" && <HomeGroup draft={draft} apply={apply} />}
        {group === "sections" && <SectionsGroup draft={draft} apply={apply} />}
        {group === "contact" && <ContactGroup draft={draft} apply={apply} />}
        {group === "ticker" && <TickerGroup draft={draft} apply={apply} />}
      </div>

      {/* ── sticky save bar ────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            {error ? <span className="text-red-500">{error}</span> : dirty ? "Unsaved changes" : "All changes saved"}
          </p>
          <div className="flex items-center gap-3">
            {flash && (
              <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-gold-deep dark:text-gold">
                <Check size={12} /> Published
              </span>
            )}
            <button
              type="button"
              onClick={() => void save()}
              disabled={busy || !dirty}
              className="btn-ink h-11 rounded-full px-6 font-mono text-[9px] uppercase tracking-[0.22em] disabled:opacity-50"
            >
              {busy ? <LoaderCircle size={13} className="animate-spin" /> : <Save size={13} />}
              <span>Save &amp; publish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── groups ─────────────────────────────────────────────────── */

type Apply = (next: SiteContent) => void;

function BrandGroup({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  return (
    <>
      <Card icon={<Type size={16} />} title="Wordmark & naming" description="How the atelier is named across the site.">
        <Grid>
          <Text label="Wordmark" value={draft.brand.wordmark} onChange={(v) => apply(edit(draft, (d) => void (d.brand.wordmark = v)))} />
          <Text label="Sub-label under wordmark" value={draft.brand.subtitle} onChange={(v) => apply(edit(draft, (d) => void (d.brand.subtitle = v)))} />
          <Text label="Arabic name" value={draft.brand.arabicName} onChange={(v) => apply(edit(draft, (d) => void (d.brand.arabicName = v)))} />
          <Text label="Tagline" value={draft.brand.tagline} onChange={(v) => apply(edit(draft, (d) => void (d.brand.tagline = v)))} />
        </Grid>
        <Area label="Meta description" hint="Used for search engines and link previews." value={draft.brand.description} onChange={(v) => apply(edit(draft, (d) => void (d.brand.description = v)))} />
        <Grid>
          <Text label="Footer copyright" value={draft.brand.copyright} onChange={(v) => apply(edit(draft, (d) => void (d.brand.copyright = v)))} />
          <Text label="Footer authenticity line" value={draft.brand.authenticity} onChange={(v) => apply(edit(draft, (d) => void (d.brand.authenticity = v)))} />
        </Grid>
      </Card>

      <Card icon={<ImageIcon size={16} />} title="Logos & favicon" description="Upload each treatment; paste a URL instead if the file is hosted elsewhere.">
        <div className="grid gap-6 lg:grid-cols-2">
          <ImageField label="Logo — ink (header)" value={draft.brand.logoUrl} folder="brand" aspect="aspect-square" onChange={(v) => apply(edit(draft, (d) => void (d.brand.logoUrl = v)))} />
          <ImageField label="Logo — light (on dark)" value={draft.brand.logoLightUrl} folder="brand" aspect="aspect-square" onChange={(v) => apply(edit(draft, (d) => void (d.brand.logoLightUrl = v)))} />
          <ImageField label="Logo — gold (watermark)" value={draft.brand.logoGoldUrl} folder="brand" aspect="aspect-square" onChange={(v) => apply(edit(draft, (d) => void (d.brand.logoGoldUrl = v)))} />
          <ImageField label="Favicon" value={draft.brand.faviconUrl} folder="brand" aspect="aspect-square" onChange={(v) => apply(edit(draft, (d) => void (d.brand.faviconUrl = v)))} />
        </div>
      </Card>
    </>
  );
}

function HomeGroup({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  return (
    <>
      <Card icon={<ImageIcon size={16} />} title="Exhibition opening" description="The first thing a visitor sees — headline, copy and featured image.">
        <Grid>
          <Text label="Eyebrow" value={draft.hero.eyebrow} onChange={(v) => apply(edit(draft, (d) => void (d.hero.eyebrow = v)))} />
          <StringList label="Headline lines" items={draft.hero.headline} onChange={(v) => apply(edit(draft, (d) => void (d.hero.headline = v)))} placeholder="One line of the headline" />
        </Grid>
        <Area label="Body copy" value={draft.hero.body} onChange={(v) => apply(edit(draft, (d) => void (d.hero.body = v)))} />
        <Grid>
          <Text label="Primary button label" value={draft.hero.ctaLabel} onChange={(v) => apply(edit(draft, (d) => void (d.hero.ctaLabel = v)))} />
          <Text label="Plaque eyebrow" value={draft.hero.plaqueEyebrow} onChange={(v) => apply(edit(draft, (d) => void (d.hero.plaqueEyebrow = v)))} />
          <Text label="Plaque title" value={draft.hero.plaqueTitle} onChange={(v) => apply(edit(draft, (d) => void (d.hero.plaqueTitle = v)))} />
          <Text label="Plaque note" value={draft.hero.plaqueNote} onChange={(v) => apply(edit(draft, (d) => void (d.hero.plaqueNote = v)))} />
        </Grid>
        <ImageField label="Hero image (leave empty to use the featured artwork)" value={draft.hero.imageUrl} folder="hero" aspect="aspect-[4/5]" onChange={(v) => apply(edit(draft, (d) => void (d.hero.imageUrl = v)))} />
      </Card>

      <Card icon={<Sparkles size={16} />} title="Quick stats" description="The three figures shown beneath the opening statement.">
        <RepeaterStats draft={draft} apply={apply} />
      </Card>

      <Card icon={<LayoutGrid size={16} />} title="Section visibility" description="Hide any section from the public site. The navbar and footer always stay.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_META.map(({ key, title }) => (
            <Toggle
              key={key}
              label={title}
              checked={draft.visibility[key] ?? true}
              onChange={(v) => apply(edit(draft, (d) => void (d.visibility[key] = v)))}
            />
          ))}
        </div>
        <p className="text-[12.5px] leading-relaxed text-muted">
          The moving banner has its own show/hide control in the “Moving banner” tab.
        </p>
      </Card>
    </>
  );
}

function SectionsGroup({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  return (
    <>
      {SECTION_META.map(({ key, title, index, hint, icon }) => (
        <Panel key={key} index={index} title={title} description={hint}>
          <HeadingFields draft={draft} apply={apply} section={key as Exclude<SectionKey, "ticker">} />
          {key === "works" && (
            <StringList label="Filter categories" items={draft.works.categories} onChange={(v) => apply(edit(draft, (d) => void (d.works.categories = v)))} placeholder="Category name" />
          )}
          {key === "atelier" && <AtelierFields draft={draft} apply={apply} />}
          {key === "craft" && <CraftFields draft={draft} apply={apply} />}
          {key === "process" && <ProcessFields draft={draft} apply={apply} />}
          {key === "collectors" && <CollectorsFields draft={draft} apply={apply} />}
          {key === "commissions" && <CommissionsFields draft={draft} apply={apply} />}
        </Panel>
      ))}
    </>
  );
}

function ContactGroup({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  return (
    <>
      <Card icon={<MessageSquare size={16} />} title="Direct channels" description="Where collectors reach the atelier. WhatsApp opens pre-filled acquisition messages.">
        <Grid>
          <Text label="WhatsApp number (digits only)" value={draft.contact.whatsappNumber} onChange={(v) => apply(edit(draft, (d) => void (d.contact.whatsappNumber = v.replace(/[^0-9]/g, ""))))} />
          <Text label="WhatsApp display" value={draft.contact.whatsappDisplay} onChange={(v) => apply(edit(draft, (d) => void (d.contact.whatsappDisplay = v)))} />
          <Text label="Email" value={draft.contact.email} onChange={(v) => apply(edit(draft, (d) => void (d.contact.email = v)))} />
          <Text label="Instagram URL" value={draft.contact.instagram} onChange={(v) => apply(edit(draft, (d) => void (d.contact.instagram = v)))} />
          <Text label="Instagram handle" value={draft.contact.instagramHandle} onChange={(v) => apply(edit(draft, (d) => void (d.contact.instagramHandle = v)))} />
        </Grid>
      </Card>

      <Card icon={<Building2 size={16} />} title="Studio" description="Address lines shown in the footer and commission desk.">
        <Grid>
          <Text label="Studio line 1" value={draft.contact.studioLine1} onChange={(v) => apply(edit(draft, (d) => void (d.contact.studioLine1 = v)))} />
          <Text label="Studio line 2" value={draft.contact.studioLine2} onChange={(v) => apply(edit(draft, (d) => void (d.contact.studioLine2 = v)))} />
          <Text label="City" value={draft.contact.city} onChange={(v) => apply(edit(draft, (d) => void (d.contact.city = v)))} />
          <Text label="Country" value={draft.contact.country} onChange={(v) => apply(edit(draft, (d) => void (d.contact.country = v)))} />
        </Grid>
      </Card>

      <Card icon={<Link2 size={16} />} title="Site credit" description="Attribution line for the site's builder, shown in the footer.">
        <Grid>
          <Text label="Credit label" value={draft.credit.label} onChange={(v) => apply(edit(draft, (d) => void (d.credit.label = v)))} />
          <Text label="Credit name" value={draft.credit.name} onChange={(v) => apply(edit(draft, (d) => void (d.credit.name = v)))} />
          <Text label="Credit Instagram URL" value={draft.credit.instagram} onChange={(v) => apply(edit(draft, (d) => void (d.credit.instagram = v)))} />
          <Text label="Credit phone (digits only)" value={draft.credit.phone} onChange={(v) => apply(edit(draft, (d) => void (d.credit.phone = v.replace(/[^0-9]/g, ""))))} />
          <Text label="Credit phone display" value={draft.credit.phoneDisplay} onChange={(v) => apply(edit(draft, (d) => void (d.credit.phoneDisplay = v)))} />
        </Grid>
      </Card>
    </>
  );
}

function TickerGroup({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  return (
    <Card
      icon={<MessageSquare size={16} />}
      title="Moving banner"
      description="The scrolling bar under the hero. Edit its words, speed and separator, or hide it from the home page."
    >
      <Toggle
        label="Show the moving banner"
        hint="Turn off to remove the banner from the home page. Your words and styling are kept."
        checked={draft.visibility.ticker ?? true}
        onChange={(v) => apply(edit(draft, (d) => void (d.visibility.ticker = v)))}
      />
      <StringList label="Words" items={draft.ticker} onChange={(v) => apply(edit(draft, (d) => void (d.ticker = v)))} placeholder="e.g. THULUTH" />
      <Grid>
        <Segmented
          label="Speed"
          hint="How fast the words travel."
          value={draft.tickerStyle.speed}
          options={[
            { value: "slow", label: "Slow" },
            { value: "medium", label: "Medium" },
            { value: "fast", label: "Fast" },
          ]}
          onChange={(v) => apply(edit(draft, (d) => void (d.tickerStyle.speed = v)))}
        />
        <Segmented
          label="Separator"
          hint="Mark placed between each word."
          value={draft.tickerStyle.separator}
          options={[
            { value: "diamond", label: "Diamond" },
            { value: "dot", label: "Dot" },
            { value: "bar", label: "Bar" },
            { value: "none", label: "None" },
          ]}
          onChange={(v) => apply(edit(draft, (d) => void (d.tickerStyle.separator = v)))}
        />
      </Grid>
      <TickerPreview
        words={draft.ticker}
        speed={draft.tickerStyle.speed}
        separator={draft.tickerStyle.separator}
        visible={draft.visibility.ticker ?? true}
      />
    </Card>
  );
}

/* ── section-specific editors ───────────────────────────────── */

function HeadingFields({
  draft,
  apply,
  section,
}: {
  draft: SiteContent;
  apply: Apply;
  section: Exclude<SectionKey, "ticker">;
}) {
  const s = draft[section] as { eyebrow: string; lines: string[]; description: string };
  return (
    <>
      <Grid>
        <Text label="Eyebrow" value={s.eyebrow} onChange={(v) => apply(edit(draft, (d) => void ((d[section] as typeof s).eyebrow = v)))} />
      </Grid>
      <StringList label="Heading lines" items={s.lines} onChange={(v) => apply(edit(draft, (d) => void ((d[section] as typeof s).lines = v)))} placeholder="Heading line" />
      <Area label="Description" value={s.description} onChange={(v) => apply(edit(draft, (d) => void ((d[section] as typeof s).description = v)))} rows={3} />
    </>
  );
}

function RepeaterStats({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  return (
    <div className="space-y-4">
      {draft.hero.stats.map((stat, i) => (
        <div key={i} className="rounded-xl border border-line bg-canvas-2/40 p-4">
          <Grid>
            <Text label="Label" value={stat.label} onChange={(v) => apply(edit(draft, (d) => void (d.hero.stats[i].label = v)))} />
            <Text label="Value" value={stat.value} onChange={(v) => apply(edit(draft, (d) => void (d.hero.stats[i].value = v)))} />
          </Grid>
          <RemoveButton label="Remove stat" onClick={() => apply(edit(draft, (d) => void d.hero.stats.splice(i, 1)))} />
        </div>
      ))}
      <AddButton label="Add stat" onClick={() => apply(edit(draft, (d) => void d.hero.stats.push({ label: "Label", value: "Value" })))} />
    </div>
  );
}

function AtelierFields({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  const a = draft.atelier;
  return (
    <>
      <Grid>
        <Text label="Image caption" value={a.imageCaption} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.imageCaption = v)))} />
        <Text label="Quote attribution" value={a.quoteAttribution} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.quoteAttribution = v)))} />
      </Grid>
      <Area label="Pull quote" value={a.quote} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.quote = v)))} rows={2} />
      <Area label="Intro paragraph" value={a.intro} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.intro = v)))} />
      <ImageField label="Studio portrait" value={a.imageUrl} folder="atelier" aspect="aspect-[4/5]" onChange={(v) => apply(edit(draft, (d) => void (d.atelier.imageUrl = v)))} />

      <SubGroup title="Metrics">
        <div className="space-y-3">
          {a.metrics.map((m, i) => (
            <div key={i} className="rounded-xl border border-line bg-canvas-2/40 p-4">
              <div className="grid gap-3 sm:grid-cols-[110px_110px_1fr]">
                <Text label="Value" value={String(m.value)} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.metrics[i].value = Number(v.replace(/[^0-9]/g, "")) || 0)))} />
                <Text label="Suffix" value={m.suffix} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.metrics[i].suffix = v)))} />
                <Text label="Label" value={m.label} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.metrics[i].label = v)))} />
              </div>
              <RemoveButton label="Remove metric" onClick={() => apply(edit(draft, (d) => void d.atelier.metrics.splice(i, 1)))} />
            </div>
          ))}
          <AddButton label="Add metric" onClick={() => apply(edit(draft, (d) => void d.atelier.metrics.push({ value: 0, suffix: "+", label: "New metric" })))} />
        </div>
      </SubGroup>

      <SubGroup title="Philosophy">
        <div className="space-y-3">
          {a.philosophy.map((p, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-line bg-canvas-2/40 p-4">
              <Text label="Title" value={p.title} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.philosophy[i].title = v)))} />
              <Area label="Body" value={p.body} rows={2} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.philosophy[i].body = v)))} />
              <RemoveButton label="Remove principle" onClick={() => apply(edit(draft, (d) => void d.atelier.philosophy.splice(i, 1)))} />
            </div>
          ))}
          <AddButton label="Add principle" onClick={() => apply(edit(draft, (d) => void d.atelier.philosophy.push({ title: "New principle", body: "" })))} />
        </div>
      </SubGroup>
    </>
  );
}

function CraftFields({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  const items = draft.craft.instruments;
  return (
    <SubGroup title="Instruments">
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="space-y-4 rounded-xl border border-line bg-canvas-2/40 p-4">
            <Grid>
              <Text label="Numeral (I, II…)" value={item.n} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].n = v)))} />
              <Text label="Name" value={item.name} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].name = v)))} />
              <Text label="Arabic" value={item.arabic} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].arabic = v)))} />
            </Grid>
            <Area label="Summary" value={item.summary} rows={2} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].summary = v)))} />
            <Area label="Detail" value={item.detail} rows={3} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].detail = v)))} />
            <StringList label="Meta tags" items={item.meta} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].meta = v)))} />
            <RemoveButton label="Remove instrument" onClick={() => apply(edit(draft, (d) => void d.craft.instruments.splice(i, 1)))} />
          </div>
        ))}
        <AddButton label="Add instrument" onClick={() => apply(edit(draft, (d) => void d.craft.instruments.push({ n: "", name: "New instrument", arabic: "", summary: "", detail: "", meta: [] })))} />
      </div>
    </SubGroup>
  );
}

function ProcessFields({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  const steps = draft.process.steps;
  return (
    <SubGroup title="Steps">
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="space-y-4 rounded-xl border border-line bg-canvas-2/40 p-4">
            <Grid>
              <Text label="Numeral (I, II…)" value={step.n} onChange={(v) => apply(edit(draft, (d) => void (d.process.steps[i].n = v)))} />
              <Text label="Title" value={step.title} onChange={(v) => apply(edit(draft, (d) => void (d.process.steps[i].title = v)))} />
            </Grid>
            <Area label="Body" value={step.body} rows={3} onChange={(v) => apply(edit(draft, (d) => void (d.process.steps[i].body = v)))} />
            <StringList label="Meta tags" items={step.meta} onChange={(v) => apply(edit(draft, (d) => void (d.process.steps[i].meta = v)))} />
            <RemoveButton label="Remove step" onClick={() => apply(edit(draft, (d) => void d.process.steps.splice(i, 1)))} />
          </div>
        ))}
        <AddButton label="Add step" onClick={() => apply(edit(draft, (d) => void d.process.steps.push({ n: "", title: "New step", body: "", meta: [] })))} />
      </div>
    </SubGroup>
  );
}

function CollectorsFields({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  const items = draft.collectors.endorsements;
  return (
    <SubGroup title="Endorsements">
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="space-y-4 rounded-xl border border-line bg-canvas-2/40 p-4">
            <Area label="Quote" value={item.quote} rows={3} onChange={(v) => apply(edit(draft, (d) => void (d.collectors.endorsements[i].quote = v)))} />
            <Grid>
              <Text label="Name" value={item.name} onChange={(v) => apply(edit(draft, (d) => void (d.collectors.endorsements[i].name = v)))} />
              <Text label="Role" value={item.role} onChange={(v) => apply(edit(draft, (d) => void (d.collectors.endorsements[i].role = v)))} />
            </Grid>
            <RemoveButton label="Remove endorsement" onClick={() => apply(edit(draft, (d) => void d.collectors.endorsements.splice(i, 1)))} />
          </div>
        ))}
        <AddButton label="Add endorsement" onClick={() => apply(edit(draft, (d) => void d.collectors.endorsements.push({ quote: "", name: "New collector", role: "" })))} />
      </div>
    </SubGroup>
  );
}

function CommissionsFields({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  const c = draft.commissions;
  return (
    <>
      <StringList label="Commission types (form dropdown)" items={c.commissionTypes} onChange={(v) => apply(edit(draft, (d) => void (d.commissions.commissionTypes = v)))} />
      <Grid>
        <Text label="Success title" value={c.successTitle} onChange={(v) => apply(edit(draft, (d) => void (d.commissions.successTitle = v)))} />
        <Text label="Shipping note" value={c.shippingNote} onChange={(v) => apply(edit(draft, (d) => void (d.commissions.shippingNote = v)))} />
      </Grid>
      <Area label="Success body" value={c.successBody} rows={2} onChange={(v) => apply(edit(draft, (d) => void (d.commissions.successBody = v)))} />
      <Area label="Direct-line note" value={c.directNote} rows={2} onChange={(v) => apply(edit(draft, (d) => void (d.commissions.directNote = v)))} />
    </>
  );
}

/* ── small shared bits ──────────────────────────────────────── */

function SubGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border-t border-line pt-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{title}</p>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold/50 hover:text-gold"
    >
      + {label}
    </button>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="mt-3 inline-flex h-9 items-center rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
    >
      {label}
    </button>
  );
}

/* ── live ticker preview ────────────────────────────────────── */

/** Live, non-interactive preview of the ticker bar shown on the home page. */
function TickerPreview({
  words,
  speed,
  separator,
  visible = true,
}: {
  words: string[];
  speed: "slow" | "medium" | "fast";
  separator: "diamond" | "dot" | "bar" | "none";
  visible?: boolean;
}) {
  const SPEED: Record<string, string> = {
    slow: "animate-marquee-slow",
    medium: "animate-marquee",
    fast: "animate-marquee-fast",
  };
  const items = words?.length ? words : [];
  const loop = [...items, ...items, ...items];

  const Mark = () => {
    if (separator === "none") return <span className="mx-6 inline-block" />;
    if (separator === "dot") return <span className="mx-8 inline-block h-1.5 w-1.5 rounded-full bg-gold" />;
    if (separator === "bar") return <span className="mx-8 inline-block h-4 w-px bg-gold/70" />;
    return (
      <span className="mx-8 inline-block">
        <svg width="9" height="9" viewBox="0 0 10 10" className="text-gold">
          <path d="M5 0l5 5-5 5-5-5z" fill="currentColor" />
        </svg>
      </span>
    );
  };

  return (
    <div>
      <Label>Preview</Label>
      <div className="relative mt-2 overflow-hidden rounded-xl border border-line bg-canvas-2/40 py-5">
        {loop.length ? (
          <div className={cn("flex w-max items-center", SPEED[speed])}>
            {loop.map((w, i) => (
              <span key={`${w}-${i}`} className="flex shrink-0 items-center">
                <span className="whitespace-nowrap font-display text-[clamp(1rem,2.2vw,1.6rem)] uppercase tracking-[0.18em] text-ink-soft">
                  {w}
                </span>
                <Mark />
              </span>
            ))}
          </div>
        ) : (
          <p className="px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            No words — add some above.
          </p>
        )}
        {!visible && (
          <span className="absolute inset-0 flex items-center justify-center bg-canvas/70 backdrop-blur-[2px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Hidden from the home page
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
