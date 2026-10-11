"use client";

import { getSupabaseBrowserClient } from "./supabase/client";
import { MEDIA_BUCKET, isSupabaseConfigured } from "./supabase/config";
import { coerceContent } from "./content/merge";
import type { SiteContent } from "./content/schema";
import type { Artwork, ArtworkInput, Inquiry, InquiryStatus } from "./types";

export const ADMIN_NOT_CONFIGURED =
  "Supabase is not connected. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

function client() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error(ADMIN_NOT_CONFIGURED);
  return supabase;
}

/* ── Artworks ─────────────────────────────────────────────── */

export async function listArtworks(): Promise<Artwork[]> {
  const { data, error } = await client()
    .from("artworks")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Artwork[];
}

export async function createArtwork(input: ArtworkInput): Promise<Artwork> {
  const { data, error } = await client().from("artworks").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Artwork;
}

export async function updateArtwork(id: string, patch: Partial<ArtworkInput>): Promise<Artwork> {
  const { data, error } = await client().from("artworks").update(patch).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data as Artwork;
}

export async function deleteArtwork(id: string): Promise<void> {
  const { error } = await client().from("artworks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Persists a new ordering in a single round-trip. */
export async function reorderArtworks(ordered: Artwork[]): Promise<void> {
  const supabase = client();
  await Promise.all(
    ordered.map((artwork, index) =>
      supabase.from("artworks").update({ display_order: index + 1 }).eq("id", artwork.id),
    ),
  );
}

/* ── Inquiries ────────────────────────────────────────────── */

export async function listInquiries(): Promise<Inquiry[]> {
  const { data, error } = await client()
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Inquiry[];
}

export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  const { error } = await client().from("inquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteInquiry(id: string): Promise<void> {
  const { error } = await client().from("inquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Site content ─────────────────────────────────────────── */

/**
 * Loads the editable site document for the admin editor.
 *
 * Returns `null` when the `site_content` table has not been created yet, so the
 * dashboard can explain the one-time SQL step instead of showing a raw error.
 */
export async function loadSiteContent(): Promise<SiteContent | null> {
  const { data, error } = await client()
    .from("site_content")
    .select("content")
    .eq("id", "default")
    .maybeSingle();
  if (error) {
    if (/does not exist|schema cache|relation/i.test(error.message)) return null;
    throw new Error(error.message);
  }
  return coerceContent(data);
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  const { error } = await client()
    .from("site_content")
    .upsert({ id: "default", content, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) {
    if (/does not exist|schema cache|relation/i.test(error.message)) {
      throw new Error(
        "The `site_content` table is missing. Run the site_content block from supabase/schema.sql in the Supabase SQL Editor, then retry.",
      );
    }
    throw new Error(error.message);
  }
}

/* ── Storage ──────────────────────────────────────────────── */

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function uploadArtworkMedia(
  file: File,
  folder: "artworks" | "in-situ" | "brand" | "hero" | "atelier" = "artworks",
) {
  if (!ALLOWED.includes(file.type)) {
    throw new Error(`${file.name}: only JPEG, PNG, WebP or AVIF images are accepted.`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`${file.name}: images must be under 12 MB.`);
  }

  const supabase = client();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const path = `${folder}/${Date.now()}-${safe || "piece"}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function adminConfigured() {
  return isSupabaseConfigured;
}
