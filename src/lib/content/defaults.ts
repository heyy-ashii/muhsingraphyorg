import { SITE } from "@/lib/site";
import { CATEGORIES, COMMISSION_TYPES } from "@/lib/types";
import { SECTION_KEYS, type SiteContent } from "./schema";

/**
 * The full default document. This is the source of truth on first load and the
 * merge base thereafter, so the public site is complete even when the
 * `site_content` row is missing or only partially filled.
 */
export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    wordmark: "MUHSINGRAPHY",
    subtitle: "Atelier of Sacred Script",
    arabicName: SITE.arabicName,
    tagline: SITE.tagline,
    description: SITE.description,
    logoUrl: "/assets/emblem-mark.png",
    logoLightUrl: "/assets/emblem-light.png",
    logoGoldUrl: "/assets/emblem-gold.png",
    faviconUrl: "/assets/emblem-mark.png",
    copyright: "© 2026 MUHSINGRAPHY — ALL RIGHTS RESERVED",
    authenticity: "Archival authenticity · Every original released with a signed certificate",
  },
  contact: {
    whatsappNumber: SITE.whatsappNumber,
    whatsappDisplay: SITE.whatsappDisplay,
    email: SITE.email,
    instagram: SITE.instagram,
    instagramHandle: "@muhsingraphy",
    studioLine1: SITE.studio.line1,
    studioLine2: SITE.studio.line2,
    city: SITE.studio.city,
    country: SITE.studio.country,
  },
  nav: SITE.nav.map((n) => ({ label: n.label, href: n.href })),
  credit: {
    label: "Site by",
    name: "ashique.pilssery",
    instagram: "https://www.instagram.com/ashique.pilssery",
    phone: "919745209528",
    phoneDisplay: "+91 97452 09528",
  },
  visibility: {
    ticker: true,
    works: true,
    atelier: true,
    craft: true,
    process: true,
    collectors: true,
    commissions: true,
  },
  hero: {
    eyebrow: "",
    headline: ["The quiet", "power of a", "single stroke."],
    body: "Expressive calligraphy. Rich surfaces. A conversation between the mark and the space it leaves behind — hand-inked and gilded at the atelier of Muhsin.",
    ctaLabel: "View Selected Works",
    plaqueEyebrow: "Atelier status",
    plaqueTitle: "Studio open for select commissions",
    plaqueNote: "Two slots · MMXXVI season",
    imageUrl: "",
    stats: [
      { label: "Est. practice", value: "MMXIV" },
      { label: "Collectors", value: "Across 14 countries" },
      { label: "Studio", value: SITE.studio.city },
    ],
  },
  ticker: [...SITE.ticker],
  tickerStyle: { speed: "slow", separator: "diamond" },
  works: {
    eyebrow: "Selected Works",
    lines: ["The pavilion.", "Original canvases."],
    description:
      "A rotating selection of originals from the atelier. Every piece is unique — hand-inked, gilded where noted, and released with a certificate of authenticity.",
    categories: [...CATEGORIES],
  },
  atelier: {
    eyebrow: "Atelier Muhsin",
    lines: ["A practice in line,", "space and texture."],
    description:
      "Muhsin works from a private studio in Kannur, writing in the classical disciplines while pushing them into contemporary scale. Each canvas passes through his hands alone — composition, inking, gilding and finishing.",
    imageUrl: "/assets/artwork-01.jpg",
    imageCaption: "Master calligrapher · Kannur, India",
    quote: "A letter is not finished when it is beautiful. It is finished when it is inevitable.",
    quoteAttribution: "Muhsin — studio note, MMXXIV",
    intro:
      "Trained through two decades of classical study across Thuluth, Jali Diwani and Kufic, Muhsin treats calligraphy as an architectural discipline. His canvases hold the movement of a single breath while remaining structurally exact — the tension between rigour and gesture is the whole practice.",
    metrics: [
      { value: 18, suffix: "+", label: "Years of study" },
      { value: 240, suffix: "+", label: "Global collectors" },
      { value: 14, suffix: "", label: "Countries" },
      { value: 60, suffix: "+", label: "Custom installations" },
    ],
    philosophy: [
      {
        title: "The nuqta as measure",
        body: "Every proportion in the atelier is derived from a single diamond dot of the qalam. Nothing is drawn by eye alone.",
      },
      {
        title: "Materials that age well",
        body: "Hand-ground lampblack soot, mineral pigment, Ahar-glazed paper and Belgian linen — chosen for centuries, not seasons.",
      },
      {
        title: "Restraint over ornament",
        body: "The gilding illuminates a stroke; it never competes with it. Negative space is treated as a material.",
      },
    ],
  },
  craft: {
    eyebrow: "The Sacred Craft & Materials",
    lines: ["Four instruments.", "One discipline."],
    description:
      "Nothing enters a Muhsingraphy canvas that was not chosen, prepared or ground in the atelier.",
    instruments: [
      {
        n: "I",
        name: "The Qalam",
        arabic: "القلم",
        summary: "Hand-carved reed and bamboo pens, trimmed at precise angles.",
        detail:
          "Each qalam is cut from a single reed harvested in season, then trimmed and slit by hand to hold a fixed width. A nib trimmed at 32° writes Thuluth; a finer angle carries the hairline of Diwani. The pen is shaped for the letter it will write — never the reverse.",
        meta: ["Reed & bamboo", "Hand-cut nib angle", "Re-trimmed between sittings"],
      },
      {
        n: "II",
        name: "The Inks",
        arabic: "الحبر",
        summary: "Hand-ground lampblack soot ink and natural mineral pigments.",
        detail:
          "Lampblack is collected, bound with gum arabic and ground on a stone slab until the ink holds a mirror. Mineral pigments — vermilion, lapis, ochre — are mulled in the studio so the colour reads as a substance rather than a tint.",
        meta: ["Lampblack soot", "Gum arabic binder", "Stone-mulled minerals"],
      },
      {
        n: "III",
        name: "The Paper",
        arabic: "الورق",
        summary: "Traditional glazed Ahar paper and museum-grade Belgian linen.",
        detail:
          "Ahar paper is sized and burnished with an agate stone until the surface is glass-smooth, so the reed never tears. For monumental work the same preparation is carried onto Belgian linen primed to museum specification.",
        meta: ["Ahar sizing", "Agate burnishing", "Belgian linen support"],
      },
      {
        n: "IV",
        name: "The Gilding",
        arabic: "التذهيب",
        summary: "24k Italian gold leaf, hand-applied with organic size.",
        detail:
          "Gold is beaten to a leaf thinner than a breath and laid over organic size with a gilder's tip. The result is not a shine but a depth — it shifts with the hour and refuses to photograph twice the same way.",
        meta: ["24k Italian leaf", "Organic size", "Burnished by hand"],
      },
    ],
  },
  process: {
    eyebrow: "Discipline & Methodology",
    lines: ["From blank sheet", "to archival canvas."],
    description:
      "Every commission follows the same four movements. Nothing is expedited; the sequence is the craft.",
    steps: [
      {
        n: "I",
        title: "Composition & Nuqta Geometry",
        body: "The composition is set on paper before a single stroke of ink: the nuqta establishes the module, and every letter is measured against it. Ruling lines are drawn in graphite and left visible until the final burnish.",
        meta: ["Graphite ruling", "Nuqta module", "Proportion study"],
      },
      {
        n: "II",
        title: "Rhythmic Inking & Stroke Harmony",
        body: "Ink is laid in a single continuous rhythm — a lifted qalam leaves a scar in the line. Sittings are short and deliberate; a monumental panel can take eleven of them.",
        meta: ["Continuous rhythm", "Lampblack ink", "Multiple sittings"],
      },
      {
        n: "III",
        title: "Gilding & Illumination",
        body: "Gold is laid over organic size with a gilder's tip, then burnished with an agate. Illumination is added only where it clarifies a stroke — never where it merely decorates.",
        meta: ["Organic size", "24k leaf", "Agate burnish"],
      },
      {
        n: "IV",
        title: "Archival Preservation & Framing",
        body: "The finished canvas is sealed, documented and photographed for the archive, then framed to museum specification with UV-filtering glazing and an acid-free mount.",
        meta: ["Archival seal", "Museum framing", "Certificate issued"],
      },
    ],
  },
  collectors: {
    eyebrow: "Collector Endorsements",
    lines: ["Words from", "the collections."],
    description: "",
    endorsements: [
      {
        quote:
          "Muhsin does not decorate a wall — he gives it a centre of gravity. Our clients stand in front of the gilded panel for minutes without speaking.",
        name: "Omar Al-Rashid",
        role: "Curator, Meridian Gallery — Dubai",
      },
      {
        quote:
          "We commissioned a monumental Thuluth piece for a private residence. Three years later it is still the first thing every guest asks about.",
        name: "Helena Ruiz",
        role: "Private Collector — Madrid",
      },
      {
        quote:
          "The precision is architectural and the gesture is entirely human. That combination is extraordinarily rare in contemporary Islamic art.",
        name: "Dr. Amara Okafor",
        role: "Art Historian — London",
      },
      {
        quote:
          "Every stage was documented, every material accounted for. The archival dossier that arrived with the canvas was itself a work of care.",
        name: "Kenji Watanabe",
        role: "Collector — Tokyo",
      },
    ],
  },
  commissions: {
    eyebrow: "Bespoke Commission Desk",
    lines: ["Commission a", "piece of your own."],
    description:
      "Private commissions are accepted in limited number each season. Share the space, the scale and the intention — Muhsin will respond personally with a proposal, timeline and material options.",
    commissionTypes: [...COMMISSION_TYPES],
    successTitle: "Enquiry received",
    successBody:
      "Thank you. Your commission request is now with the atelier. Muhsin replies to every enquiry personally, usually within two working days.",
    directNote:
      "Prefer to speak directly? Message the atelier on WhatsApp for immediate availability, pricing and shipping.",
    shippingNote: "Worldwide insured shipping · Certificate of authenticity",
  },
};

/** Section counter shown beside each eyebrow (001, 002, …). */
export const SECTION_INDEX: Record<string, string> = {
  works: "001",
  atelier: "002",
  craft: "003",
  process: "004",
  collectors: "005",
  commissions: "006",
};

export { SECTION_KEYS };
export type { SiteContent, StoredContent, SectionKey } from "./schema";
