import type { Artwork, Inquiry } from "./types";

/**
 * The curated archive shipped with the build. It is used verbatim until
 * Supabase is connected, and as the mirror of `supabase/seed.sql`.
 * `display_order` drives the staggered pavilion layout.
 */
export const SEED_ARTWORKS: Artwork[] = [
  {
    id: "mhg-0001",
    title: "The Unseen Light",
    title_arabic: "النور الخفي",
    script_style: "Thuluth",
    medium: "Handmade lampblack ink & 24k gold leaf on Belgian linen",
    dimensions: "120 x 90 cm / 47.2 x 35.4 in",
    year: "2024",
    status: "Available",
    image_url: "/assets/artwork-01.jpg",
    in_situ_image_url: null,
    is_featured: true,
    display_order: 1,
    categories: ["Classical Masters", "Gold Leaf Works"],
    description:
      "A single monumental Thuluth line suspended in a field of silence. The gold is laid by hand across three sittings, each pass catching the light at a different hour.",
    created_at: "2024-02-11T09:00:00.000Z",
  },
  {
    id: "mhg-0002",
    title: "Breath of the Reed",
    title_arabic: "نفس القلم",
    script_style: "Jali Diwani",
    medium: "Hand-ground soot ink on traditional Ahar glazed paper",
    dimensions: "100 x 70 cm / 39.4 x 27.6 in",
    year: "2023",
    status: "Private Collection",
    image_url: "/assets/artwork-01.jpg",
    in_situ_image_url: null,
    is_featured: true,
    display_order: 2,
    categories: ["Classical Masters", "Contemporary Canvases"],
    description:
      "Jali Diwani at its most fluid — a continuous breath carried across the page without a single lift of the qalam.",
    created_at: "2023-11-02T09:00:00.000Z",
  },
  {
    id: "mhg-0003",
    title: "Sacred Geometry No. VII",
    title_arabic: "الهندسة المقدسة",
    script_style: "Modern Kufic",
    medium: "Mineral pigment & 24k gold leaf on museum-grade Belgian linen",
    dimensions: "150 x 150 cm / 59.1 x 59.1 in",
    year: "2024",
    status: "Available",
    image_url: "/assets/artwork-01.jpg",
    in_situ_image_url: null,
    is_featured: false,
    display_order: 3,
    categories: ["Contemporary Canvases", "Gold Leaf Works", "Monumental Scales"],
    description:
      "Angular Kufic folded into a nine-point medallion. A study in proportion drawn entirely from the nuqta as the unit of measure.",
    created_at: "2024-05-19T09:00:00.000Z",
  },
  {
    id: "mhg-0004",
    title: "Stillness in Vermilion",
    title_arabic: "سكون",
    script_style: "Abstract",
    medium: "Natural vermilion mineral pigment on glazed Ahar paper",
    dimensions: "80 x 60 cm / 31.5 x 23.6 in",
    year: "2025",
    status: "Reserved",
    image_url: "/assets/artwork-01.jpg",
    in_situ_image_url: null,
    is_featured: false,
    display_order: 4,
    categories: ["Contemporary Canvases"],
    description:
      "Where the letter dissolves and only the gesture remains. The vermilion is ground in the studio from raw mineral.",
    created_at: "2025-01-08T09:00:00.000Z",
  },
  {
    id: "mhg-0005",
    title: "The Gilded Verse",
    title_arabic: "الآية المذهبة",
    script_style: "Thuluth",
    medium: "Lampblack ink, hand-applied 24k Italian gold leaf on Belgian linen",
    dimensions: "180 x 120 cm / 70.9 x 47.2 in",
    year: "2025",
    status: "Available",
    image_url: "/assets/artwork-01.jpg",
    in_situ_image_url: null,
    is_featured: true,
    display_order: 5,
    categories: ["Classical Masters", "Gold Leaf Works", "Monumental Scales"],
    description:
      "The atelier's largest gilded commission to date — eleven sittings of ink, four of gilding, one of quiet.",
    created_at: "2025-03-22T09:00:00.000Z",
  },
  {
    id: "mhg-0006",
    title: "Nightfall Calligraphy",
    title_arabic: "الليل",
    script_style: "Nastaliq",
    medium: "Handmade soot ink on toned Ahar paper, 24k gold accents",
    dimensions: "70 x 100 cm / 27.6 x 39.4 in",
    year: "2022",
    status: "Private Collection",
    image_url: "/assets/artwork-01.jpg",
    in_situ_image_url: null,
    is_featured: false,
    display_order: 6,
    categories: ["Classical Masters"],
    description:
      "Nastaliq descending like dusk. Held in a private collection in Dubai.",
    created_at: "2022-09-30T09:00:00.000Z",
  },
];

export const SEED_INQUIRIES: Inquiry[] = [
  {
    id: "inq-0001",
    client_name: "Helena Ruiz",
    client_email: "helena.ruiz@atelier-madrid.es",
    commission_type: "Private Commission",
    message:
      "We are furnishing a private residence in Madrid and would like to discuss a monumental Thuluth panel for the stairwell.",
    status: "New",
    created_at: "2026-08-02T11:20:00.000Z",
  },
  {
    id: "inq-0002",
    client_name: "Omar Al-Rashid",
    client_email: "o.alrashid@meridian-gallery.ae",
    commission_type: "Corporate / Hospitality",
    message:
      "Meridian Gallery is curating a group exhibition of contemporary Islamic art. We would like to represent three gilded works.",
    status: "Responded",
    created_at: "2026-07-18T08:45:00.000Z",
  },
  {
    id: "inq-0003",
    client_name: "Yuki Tanaka",
    client_email: "y.tanaka@kyoto-print.jp",
    commission_type: "Editorial or Print",
    message:
      "Requesting permission and high-resolution files for a limited letterpress edition of your Kufic compositions.",
    status: "Archived",
    created_at: "2026-05-30T14:05:00.000Z",
  },
];
