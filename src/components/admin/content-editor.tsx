"use client";

import { useState } from "react";
import { Check, LoaderCircle, Save } from "lucide-react";
import type { SiteContent, SectionKey } from "@/lib/content/schema";
import { saveSiteContent } from "@/lib/admin";
import { cn } from "@/lib/utils";
import {
  Area,
  Grid,
  ImageField,
  Label,
  Panel,
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

const SECTION_META: { key: SectionKey; title: string; index: string; hint: string }[] = [
  { key: "ticker", title: "Calligraphic ticker", index: "—", hint: "Marquee words separated by gold diamonds." },
  { key: "works", title: "Selected Works pavilion", index: "001", hint: "Heading, description and filter chips." },
  { key: "atelier", title: "About the artist", index: "002", hint: "Portrait, philosophy, quote and metrics." },
  { key: "craft", title: "Sacred Craft & Materials", index: "003", hint: "The four instruments." },
  { key: "process", title: "Discipline & Methodology", index: "004", hint: "The four-step breakdown." },
  { key: "collectors", title: "Collector endorsements", index: "005", hint: "Quotes from patrons." },
  { key: "commissions", title: "Bespoke Commission Desk", index: "006", hint: "Form heading and direct channels." },
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

  const setSection = (key: SectionKey, patch: Record<string, unknown>) =>
    apply(edit(draft, (d) => Object.assign(d[key] as object, patch)));

  return (
    <div className="pb-32">
      {tableMissing && (
        <div className="mb-8 border border-gold/40 bg-gold/5 px-5 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-deep dark:text-gold">
            One-time setup required
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            The <code className="font-mono text-[12px]">site_content</code> table does not exist yet, so
            edits cannot be saved. Open the Supabase SQL Editor, paste the{" "}
            <code className="font-mono text-[12px]">site_content</code> block from{" "}
            <code className="font-mono text-[12px]">supabase/schema.sql</code> and run it. Everything
            below will then save normally.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {/* ── Brand & identity ─────────────────────────────── */}
        <Panel title="Brand & identity" index="—" description="Wordmark, logo emblem, tagline and favicon." defaultOpen>
          <Grid>
            <Text label="Wordmark" value={draft.brand.wordmark} onChange={(v) => apply(edit(draft, (d) => void (d.brand.wordmark = v)))} />
            <Text label="Sub-label under wordmark" value={draft.brand.subtitle} onChange={(v) => apply(edit(draft, (d) => void (d.brand.subtitle = v)))} />
            <Text label="Arabic name" value={draft.brand.arabicName} onChange={(v) => apply(edit(draft, (d) => void (d.brand.arabicName = v)))} />
            <Text label="Tagline" value={draft.brand.tagline} onChange={(v) => apply(edit(draft, (d) => void (d.brand.tagline = v)))} />
          </Grid>
          <Area label="Meta description" value={draft.brand.description} onChange={(v) => apply(edit(draft, (d) => void (d.brand.description = v)))} />
          <Grid>
            <Text label="Footer copyright" value={draft.brand.copyright} onChange={(v) => apply(edit(draft, (d) => void (d.brand.copyright = v)))} />
            <Text label="Footer authenticity line" value={draft.brand.authenticity} onChange={(v) => apply(edit(draft, (d) => void (d.brand.authenticity = v)))} />
          </Grid>
          <div className="grid gap-6 lg:grid-cols-2">
            <ImageField label="Logo — ink (header)" value={draft.brand.logoUrl} folder="brand" aspect="aspect-square" onChange={(v) => apply(edit(draft, (d) => void (d.brand.logoUrl = v)))} />
            <ImageField label="Logo — light (on dark)" value={draft.brand.logoLightUrl} folder="brand" aspect="aspect-square" onChange={(v) => apply(edit(draft, (d) => void (d.brand.logoLightUrl = v)))} />
            <ImageField label="Logo — gold (watermark)" value={draft.brand.logoGoldUrl} folder="brand" aspect="aspect-square" onChange={(v) => apply(edit(draft, (d) => void (d.brand.logoGoldUrl = v)))} />
            <ImageField label="Favicon" value={draft.brand.faviconUrl} folder="brand" aspect="aspect-square" onChange={(v) => apply(edit(draft, (d) => void (d.brand.faviconUrl = v)))} />
          </div>
        </Panel>

        {/* ── Contact & studio ─────────────────────────────── */}
        <Panel title="Contact & studio" description="WhatsApp, email, Instagram and studio details.">
          <Grid>
            <Text label="WhatsApp number (digits only)" value={draft.contact.whatsappNumber} onChange={(v) => apply(edit(draft, (d) => void (d.contact.whatsappNumber = v.replace(/[^0-9]/g, ""))))} />
            <Text label="WhatsApp display" value={draft.contact.whatsappDisplay} onChange={(v) => apply(edit(draft, (d) => void (d.contact.whatsappDisplay = v)))} />
            <Text label="Email" value={draft.contact.email} onChange={(v) => apply(edit(draft, (d) => void (d.contact.email = v)))} />
            <Text label="Instagram URL" value={draft.contact.instagram} onChange={(v) => apply(edit(draft, (d) => void (d.contact.instagram = v)))} />
            <Text label="Instagram handle" value={draft.contact.instagramHandle} onChange={(v) => apply(edit(draft, (d) => void (d.contact.instagramHandle = v)))} />
            <Text label="Studio line 1" value={draft.contact.studioLine1} onChange={(v) => apply(edit(draft, (d) => void (d.contact.studioLine1 = v)))} />
            <Text label="Studio line 2" value={draft.contact.studioLine2} onChange={(v) => apply(edit(draft, (d) => void (d.contact.studioLine2 = v)))} />
            <Text label="City" value={draft.contact.city} onChange={(v) => apply(edit(draft, (d) => void (d.contact.city = v)))} />
            <Text label="Country" value={draft.contact.country} onChange={(v) => apply(edit(draft, (d) => void (d.contact.country = v)))} />
          </Grid>
        </Panel>

        {/* ── Section visibility ───────────────────────────── */}
        <Panel title="Section visibility" description="Hide any section from the public site. The navbar and footer stay.">
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
        </Panel>

        {/* ── Hero ─────────────────────────────────────────── */}
        <Panel title="Exhibition opening (Hero)" description="Headline, copy, featured image and quick stats.">
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
          <RepeaterStats draft={draft} apply={apply} />
        </Panel>

        {/* ── Section headings + repeaters ─────────────────── */}
        {SECTION_META.filter((s) => s.key !== "ticker").map(({ key, title, index, hint }) => (
          <Panel key={key} title={title} index={index} description={hint}>
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

        {/* ── Ticker ───────────────────────────────────────── */}
        <Panel title="Calligraphic ticker" index="—" description="Marquee words separated by gold diamonds.">
          <StringList label="Words" items={draft.ticker} onChange={(v) => apply(edit(draft, (d) => void (d.ticker = v)))} placeholder="e.g. THULUTH" />
        </Panel>
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
              <span>Save & publish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── section-specific editors ───────────────────────────────── */

type Apply = (next: SiteContent) => void;

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
      <Label>Quick stats</Label>
      {draft.hero.stats.map((stat, i) => (
        <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Text label="Label" value={stat.label} onChange={(v) => apply(edit(draft, (d) => void (d.hero.stats[i].label = v)))} />
          <Text label="Value" value={stat.value} onChange={(v) => apply(edit(draft, (d) => void (d.hero.stats[i].value = v)))} />
          <button
            type="button"
            onClick={() => apply(edit(draft, (d) => void d.hero.stats.splice(i, 1)))}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-line px-4 text-muted transition-colors hover:border-red-500/50 hover:text-red-500"
            aria-label="Remove stat"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => apply(edit(draft, (d) => void d.hero.stats.push({ label: "Label", value: "Value" })))}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold/50 hover:text-gold"
      >
        + Add stat
      </button>
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

      <Label>Metrics</Label>
      <div className="space-y-3">
        {a.metrics.map((m, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-[110px_110px_1fr_auto]">
            <Text label="Value" value={String(m.value)} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.metrics[i].value = Number(v.replace(/[^0-9]/g, "")) || 0)))} />
            <Text label="Suffix" value={m.suffix} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.metrics[i].suffix = v)))} />
            <Text label="Label" value={m.label} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.metrics[i].label = v)))} />
            <button type="button" onClick={() => apply(edit(draft, (d) => void d.atelier.metrics.splice(i, 1)))} className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-line px-4 text-muted transition-colors hover:border-red-500/50 hover:text-red-500" aria-label="Remove metric">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => apply(edit(draft, (d) => void d.atelier.metrics.push({ value: 0, suffix: "+", label: "New metric" })))} className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold/50 hover:text-gold">+ Add metric</button>
      </div>

      <Label>Philosophy</Label>
      <div className="space-y-4">
        {a.philosophy.map((p, i) => (
          <div key={i} className="space-y-3 border border-line p-4">
            <Text label="Title" value={p.title} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.philosophy[i].title = v)))} />
            <Area label="Body" value={p.body} rows={2} onChange={(v) => apply(edit(draft, (d) => void (d.atelier.philosophy[i].body = v)))} />
            <button type="button" onClick={() => apply(edit(draft, (d) => void d.atelier.philosophy.splice(i, 1)))} className="inline-flex h-9 items-center rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-red-500/50 hover:text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => apply(edit(draft, (d) => void d.atelier.philosophy.push({ title: "New principle", body: "" })))} className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold/50 hover:text-gold">+ Add principle</button>
      </div>
    </>
  );
}

function CraftFields({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  const items = draft.craft.instruments;
  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={i} className="space-y-3 border border-line p-4">
          <Grid>
            <Text label="Numeral (I, II…)" value={item.n} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].n = v)))} />
            <Text label="Name" value={item.name} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].name = v)))} />
            <Text label="Arabic" value={item.arabic} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].arabic = v)))} />
          </Grid>
          <Area label="Summary" value={item.summary} rows={2} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].summary = v)))} />
          <Area label="Detail" value={item.detail} rows={3} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].detail = v)))} />
          <StringList label="Meta tags" items={item.meta} onChange={(v) => apply(edit(draft, (d) => void (d.craft.instruments[i].meta = v)))} />
          <button type="button" onClick={() => apply(edit(draft, (d) => void d.craft.instruments.splice(i, 1)))} className="inline-flex h-9 items-center rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-red-500/50 hover:text-red-500">Remove instrument</button>
        </div>
      ))}
      <button type="button" onClick={() => apply(edit(draft, (d) => void d.craft.instruments.push({ n: "", name: "New instrument", arabic: "", summary: "", detail: "", meta: [] })))} className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold/50 hover:text-gold">+ Add instrument</button>
    </div>
  );
}

function ProcessFields({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  const steps = draft.process.steps;
  return (
    <div className="space-y-5">
      {steps.map((step, i) => (
        <div key={i} className="space-y-3 border border-line p-4">
          <Grid>
            <Text label="Numeral (I, II…)" value={step.n} onChange={(v) => apply(edit(draft, (d) => void (d.process.steps[i].n = v)))} />
            <Text label="Title" value={step.title} onChange={(v) => apply(edit(draft, (d) => void (d.process.steps[i].title = v)))} />
          </Grid>
          <Area label="Body" value={step.body} rows={3} onChange={(v) => apply(edit(draft, (d) => void (d.process.steps[i].body = v)))} />
          <StringList label="Meta tags" items={step.meta} onChange={(v) => apply(edit(draft, (d) => void (d.process.steps[i].meta = v)))} />
          <button type="button" onClick={() => apply(edit(draft, (d) => void d.process.steps.splice(i, 1)))} className="inline-flex h-9 items-center rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-red-500/50 hover:text-red-500">Remove step</button>
        </div>
      ))}
      <button type="button" onClick={() => apply(edit(draft, (d) => void d.process.steps.push({ n: "", title: "New step", body: "", meta: [] })))} className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold/50 hover:text-gold">+ Add step</button>
    </div>
  );
}

function CollectorsFields({ draft, apply }: { draft: SiteContent; apply: Apply }) {
  const items = draft.collectors.endorsements;
  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={i} className="space-y-3 border border-line p-4">
          <Area label="Quote" value={item.quote} rows={3} onChange={(v) => apply(edit(draft, (d) => void (d.collectors.endorsements[i].quote = v)))} />
          <Grid>
            <Text label="Name" value={item.name} onChange={(v) => apply(edit(draft, (d) => void (d.collectors.endorsements[i].name = v)))} />
            <Text label="Role" value={item.role} onChange={(v) => apply(edit(draft, (d) => void (d.collectors.endorsements[i].role = v)))} />
          </Grid>
          <button type="button" onClick={() => apply(edit(draft, (d) => void d.collectors.endorsements.splice(i, 1)))} className="inline-flex h-9 items-center rounded-full border border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-red-500/50 hover:text-red-500">Remove endorsement</button>
        </div>
      ))}
      <button type="button" onClick={() => apply(edit(draft, (d) => void d.collectors.endorsements.push({ quote: "", name: "New collector", role: "" })))} className="inline-flex h-9 items-center gap-2 rounded-full border border-dashed border-line px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold/50 hover:text-gold">+ Add endorsement</button>
    </div>
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
