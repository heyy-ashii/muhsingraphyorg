export const ARTWORK_STATUSES = ["Available", "Private Collection", "Reserved"] as const;
export type ArtworkStatus = (typeof ARTWORK_STATUSES)[number];

export const SCRIPT_STYLES = [
  "Thuluth",
  "Jali Diwani",
  "Diwani",
  "Modern Kufic",
  "Nastaliq",
  "Abstract",
] as const;
export type ScriptStyle = (typeof SCRIPT_STYLES)[number];

export const CATEGORIES = [
  "All",
  "Classical Masters",
  "Contemporary Canvases",
  "Gold Leaf Works",
  "Monumental Scales",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const INQUIRY_STATUSES = ["New", "Responded", "Archived"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const COMMISSION_TYPES = [
  "Private Commission",
  "Monumental Installation",
  "Gold Leaf & Gilding",
  "Corporate / Hospitality",
  "Editorial or Print",
  "Other",
] as const;
export type CommissionType = (typeof COMMISSION_TYPES)[number];

export interface Artwork {
  id: string;
  title: string;
  title_arabic?: string | null;
  script_style: string;
  medium: string;
  dimensions: string;
  year: string;
  status: ArtworkStatus;
  image_url: string;
  /**
   * Additional photographs of the same piece — different portions, angles or
   * detail studies. `image_url` stays the canonical hero/cover; this holds the
   * rest of the gallery. Always includes `image_url` first when read through
   * `galleryOf`, so callers never have to special-case the cover.
   */
  images?: string[] | null;
  in_situ_image_url?: string | null;
  is_featured: boolean;
  display_order: number;
  categories: string[];
  description?: string | null;
  created_at: string;
}

/**
 * Ordered, de-duplicated list of a piece's photographs for the public gallery.
 * The cover (`image_url`) always leads; legacy rows without `images` still work.
 */
export function galleryOf(artwork: Pick<Artwork, "image_url" | "images">): string[] {
  const list = [artwork.image_url, ...(artwork.images ?? [])].filter(Boolean);
  return [...new Set(list)];
}

export interface Inquiry {
  id: string;
  client_name: string;
  client_email: string;
  commission_type: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export type ArtworkInput = Omit<Artwork, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type InquiryInput = Omit<Inquiry, "id" | "created_at" | "status"> & {
  status?: InquiryStatus;
};
