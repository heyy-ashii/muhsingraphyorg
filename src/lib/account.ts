"use client";

import { getSupabaseBrowserClient } from "./supabase/client";
import { ADMIN_NOT_CONFIGURED } from "./admin";

/** Fields a curator may edit about their own account. */
export interface ProfileInput {
  fullName: string;
  phone: string;
  title: string;
  bio: string;
}

export interface AccountProfile extends ProfileInput {
  id: string;
  email: string;
  createdAt: string | null;
}

/**
 * A missing Supabase client means the app is running without keys; surface the
 * same guidance the rest of the dashboard uses rather than a raw null error.
 */
function client() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error(ADMIN_NOT_CONFIGURED);
  return supabase;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Reads the signed-in curator's identity and editable metadata. */
export async function getAccountProfile(): Promise<AccountProfile> {
  const supabase = client();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error(error?.message ?? "No signed-in curator.");

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: user.id,
    email: user.email ?? "",
    createdAt: user.created_at ?? null,
    fullName: str(meta.full_name),
    phone: str(meta.phone),
    title: str(meta.title),
    bio: str(meta.bio),
  };
}

/**
 * Persists the editable profile fields into `user_metadata`. Returns the
 * refreshed user so the caller can update any display derived from it.
 */
export async function saveAccountProfile(input: ProfileInput) {
  const supabase = client();
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: input.fullName.trim(),
      phone: input.phone.trim(),
      title: input.title.trim(),
      bio: input.bio.trim(),
    },
  });
  if (error) throw new Error(error.message);
  return data.user;
}

/**
 * Changes the curator's password. `updateUser` re-authenticates against the
 * current session cookie, so no existing password is required.
 */
export async function changePassword(password: string) {
  const supabase = client();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}

/** Resolves the preferred display name for the signed-in curator. */
export function displayNameOf(email: string, metadata?: Record<string, unknown> | null): string {
  const meta = metadata ?? {};
  const name = str(meta.full_name) || str(meta.name) || str(meta.title);
  if (name) return name;
  return email.split("@")[0] || email;
}
