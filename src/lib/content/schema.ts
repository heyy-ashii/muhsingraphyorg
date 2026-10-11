/**
 * Editable content model for the public site.
 *
 * Everything a curator may change lives in one JSON document (`SiteContent`),
 * persisted in the `site_content` table under the fixed row `default`. Only the
 * navbar and the footer's legal/studio block are intentionally not editable.
 *
 * Every field is optional in the *stored* shape because defaults are merged in
 * on read: a partial or legacy document still renders a complete site.
 */

export const SECTION_KEYS = [
  "ticker",
  "works",
  "atelier",
  "craft",
  "process",
  "collectors",
  "commissions",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export interface NavItem {
  label: string;
  href: string;
}

export interface HeroCopy {
  eyebrow: string;
  headline: string[];
  body: string;
  ctaLabel: string;
  plaqueEyebrow: string;
  plaqueTitle: string;
  plaqueNote: string;
  imageUrl: string;
  stats: { label: string; value: string }[];
}

export interface SectionHeadingCopy {
  eyebrow: string;
  lines: string[];
  description: string;
}

export interface WorksSection extends SectionHeadingCopy {
  categories: string[];
}

export interface AtelierSection extends SectionHeadingCopy {
  imageUrl: string;
  imageCaption: string;
  quote: string;
  quoteAttribution: string;
  intro: string;
  metrics: { value: number; suffix: string; label: string }[];
  philosophy: { title: string; body: string }[];
}

export interface CraftSection extends SectionHeadingCopy {
  instruments: {
    n: string;
    name: string;
    arabic: string;
    summary: string;
    detail: string;
    meta: string[];
  }[];
}

export interface ProcessSection extends SectionHeadingCopy {
  steps: { n: string; title: string; body: string; meta: string[] }[];
}

export interface CollectorsSection extends SectionHeadingCopy {
  endorsements: { quote: string; name: string; role: string }[];
}

export interface CommissionsSection extends SectionHeadingCopy {
  commissionTypes: string[];
  successTitle: string;
  successBody: string;
  directNote: string;
  shippingNote: string;
}

export interface BrandCopy {
  wordmark: string;
  subtitle: string;
  arabicName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  logoLightUrl: string;
  logoGoldUrl: string;
  faviconUrl: string;
  copyright: string;
  authenticity: string;
}

export interface ContactCopy {
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  instagram: string;
  instagramHandle: string;
  studioLine1: string;
  studioLine2: string;
  city: string;
  country: string;
}

/** Attribution for the site's builder, shown in the footer. */
export interface CreditCopy {
  label: string;
  name: string;
  instagram: string;
  phone: string;
  phoneDisplay: string;
}

export const TICKER_SPEEDS = ["slow", "medium", "fast"] as const;
export type TickerSpeed = (typeof TICKER_SPEEDS)[number];

export const TICKER_SEPARATORS = ["diamond", "dot", "bar", "none"] as const;
export type TickerSeparator = (typeof TICKER_SEPARATORS)[number];

/** Presentation of the moving calligraphic bar. */
export interface TickerStyle {
  speed: TickerSpeed;
  separator: TickerSeparator;
}

export interface SiteContent {
  brand: BrandCopy;
  contact: ContactCopy;
  credit: CreditCopy;
  nav: NavItem[];
  visibility: Record<SectionKey, boolean>;
  hero: HeroCopy;
  ticker: string[];
  tickerStyle: TickerStyle;
  works: WorksSection;
  atelier: AtelierSection;
  craft: CraftSection;
  process: ProcessSection;
  collectors: CollectorsSection;
  commissions: CommissionsSection;
}

/** A stored document is sparse; merging with defaults yields a complete one. */
export type StoredContent = Partial<{
  [K in keyof SiteContent]: SiteContent[K] extends object ? Partial<SiteContent[K]> : SiteContent[K];
}>;
