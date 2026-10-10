export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * The gallery is fully browsable before Supabase is provisioned: when the env
 * vars are absent the app falls back to the curated local archive, and the
 * admin portal reports that it is not yet connected instead of throwing.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "artwork-media";
