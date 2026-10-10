/**
 * Client-safe Supabase configuration.
 *
 * Only `NEXT_PUBLIC_*` values live here, because Next inlines those into the
 * browser bundle. The service-role key is read exclusively in `env.ts`, which is
 * guarded by `server-only`.
 *
 * Two naming conventions are accepted so the app works with both the classic
 * `NEXT_PUBLIC_*` keys and the newer publishable-key naming used by
 * `@supabase/server`. The `NEXT_PUBLIC_` value wins for the browser because only
 * that prefix is inlined; `env.ts` applies the same order on the server.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

/**
 * The gallery is fully browsable before Supabase is provisioned: when the env
 * vars are absent the app falls back to the curated local archive, and the
 * admin portal reports that it is not yet connected instead of throwing.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

export const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "artwork-media";
