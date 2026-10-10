import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  createAdminClient,
  createContextClient,
  verifyCredentials,
} from "@supabase/server/core";
import type { AuthModeWithKey, SupabaseContext } from "@supabase/server";
import { resolveSupabaseEnv } from "./env";

export type AuthMode = AuthModeWithKey | AuthModeWithKey[];

export type SupabaseContextResult =
  | { data: SupabaseContext; error: null }
  | { data: null; error: { message: string; status: number; code?: string } };

function toError(err: unknown): { message: string; status: number; code?: string } {
  if (err && typeof err === "object") {
    const e = err as { message?: string; status?: number; code?: string };
    return {
      message: e.message ?? "Authentication failed",
      status: typeof e.status === "number" ? e.status : 401,
      code: e.code,
    };
  }
  return { message: "Authentication failed", status: 401 };
}

/**
 * Composes `@supabase/ssr` (cookie session lifecycle) with `@supabase/server`
 * (JWT verification + RLS-scoped and service-role clients).
 *
 * `@supabase/ssr`'s middleware refreshes the access-token cookie on every
 * `/admin` request, so `getSession()` here always yields a fresh JWT; that token
 * is then verified against JWKS by `verifyCredentials`, and the resulting claims
 * drive `createContextClient`.
 *
 * `auth: 'user'` (default) requires a signed-in curator. `auth: 'none'` returns
 * an anonymous, RLS-scoped client for public writes such as enquiries.
 */
export async function createSupabaseContext(
  options: { auth?: AuthMode } = { auth: "user" },
): Promise<SupabaseContextResult> {
  const env = resolveSupabaseEnv();

  if (!env.url || !env.publishableKeys?.default) {
    return {
      data: null,
      error: {
        message: "Missing SUPABASE_URL or publishable key.",
        status: 500,
        code: "not_configured",
      },
    };
  }

  const cookieStore = await cookies();
  const ssrClient = createServerClient(env.url, env.publishableKeys.default, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; middleware handles refresh.
        }
      },
    },
  });

  const {
    data: { session },
  } = await ssrClient.auth.getSession();
  const token = session?.access_token ?? null;

  const { data: auth, error } = await verifyCredentials(
    { token, apikey: null },
    { auth: options.auth ?? "user", env },
  );

  if (error || !auth) return { data: null, error: toError(error) };

  const context: SupabaseContext = {
    supabase: createContextClient({ auth: { token: auth.token }, env }),
    // Service-role client is only constructible when a secret key is present.
    supabaseAdmin: (env.secretKeys?.default ? createAdminClient({ env }) : null) as SupabaseContext["supabaseAdmin"],
    userClaims: auth.userClaims ?? null,
    jwtClaims: auth.jwtClaims ?? null,
    authMode: auth.authMode,
  };

  return { data: context, error: null };
}
