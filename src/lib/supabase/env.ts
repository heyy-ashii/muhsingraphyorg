import "server-only";
import type { SupabaseEnv } from "@supabase/server";

/**
 * Bridges the app's environment into the `Partial<SupabaseEnv>` shape that
 * `@supabase/server`'s core primitives expect. This module is guarded by
 * `server-only`, so the service-role key can never be pulled into a client
 * bundle — that is the whole reason these reads live here rather than in
 * `config.ts`.
 *
 * Naming: the classic `NEXT_PUBLIC_*` names win (that is what the browser uses),
 * falling back to the unprefixed publishable/secret names documented by
 * `@supabase/server` for non-Next runtimes.
 *
 * JWKS is intentionally omitted: `@supabase/server` derives
 * `{url}/auth/v1/.well-known/jwks.json` automatically, or honours
 * `SUPABASE_JWKS` / `SUPABASE_JWKS_URL` when those are set.
 */
export function resolveSupabaseEnv(): Partial<SupabaseEnv> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    "";
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? "";

  return {
    url: url || undefined,
    publishableKeys: publishableKey ? { default: publishableKey } : {},
    secretKeys: secretKey ? { default: secretKey } : {},
  };
}

