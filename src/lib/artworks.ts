import { SEED_ARTWORKS } from "./seed";
import { createSupabaseContext } from "./supabase/context";
import { isSupabaseConfigured } from "./supabase/config";
import type { Artwork } from "./types";

const byOrder = (a: Artwork, b: Artwork) => a.display_order - b.display_order;

/**
 * Public artwork reads. Falls back to the curated archive when Supabase is not
 * configured, so the gallery is never empty. RLS restricts the anon role to
 * published rows, so no extra filtering is needed here.
 */
export async function getArtworks(): Promise<Artwork[]> {
  if (!isSupabaseConfigured) return [...SEED_ARTWORKS].sort(byOrder);

  try {
    const { data: ctx } = await createSupabaseContext({ auth: "none" });
    if (!ctx) return [...SEED_ARTWORKS].sort(byOrder);

    const { data, error } = await ctx.supabase
      .from("artworks")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data?.length) return [...SEED_ARTWORKS].sort(byOrder);
    return data as Artwork[];
  } catch {
    return [...SEED_ARTWORKS].sort(byOrder);
  }
}

export async function getFeaturedArtwork(): Promise<Artwork | null> {
  const works = await getArtworks();
  return works.find((w) => w.is_featured) ?? works[0] ?? null;
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  if (!isSupabaseConfigured) return SEED_ARTWORKS.find((w) => w.id === id) ?? null;

  try {
    const { data: ctx } = await createSupabaseContext({ auth: "none" });
    if (!ctx) return SEED_ARTWORKS.find((w) => w.id === id) ?? null;

    const { data, error } = await ctx.supabase.from("artworks").select("*").eq("id", id).maybeSingle();
    if (error || !data) return SEED_ARTWORKS.find((w) => w.id === id) ?? null;
    return data as Artwork;
  } catch {
    return SEED_ARTWORKS.find((w) => w.id === id) ?? null;
  }
}
