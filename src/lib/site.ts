export const SITE = {
  name: "Muhsingraphy",
  wordmark: "MUHSINGRAPHY",
  arabicName: "محسن",
  tagline: "Modern Sacred Script & Contemporary Gallery",
  description:
    "The atelier of master calligrapher Muhsin — hand-inked script, 24k gold leaf and archival canvases for private collectors and cultural institutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://muhsingraphy.com",
  instagram: "https://www.instagram.com/muhsingraphy",
  whatsappNumber: "919847139131",
  whatsappDisplay: "+91 98471 39131",
  email: "hello@muhsingraphy.com",
  studio: {
    city: "Kannur, Kerala",
    country: "India",
    line1: "The Atelier — Kannur",
    line2: "By appointment only",
  },
  nav: [
    { label: "Works", href: "#works" },
    { label: "Collections", href: "#collections" },
    { label: "Atelier & Craft", href: "#atelier" },
    { label: "Process", href: "#process" },
    { label: "Private Commissions", href: "#commissions" },
  ],
  ticker: [
    "THULUTH",
    "JALI DIWANI",
    "CONTEMPORARY SCRIPT",
    "SACRED GEOMETRY",
    "24K GOLD LEAF",
    "ARCHIVAL CANVASES",
  ],
} as const;

export const SECTION = {
  works: "001",
  atelier: "002",
  craft: "003",
  process: "004",
  collectors: "005",
  commissions: "006",
} as const;
