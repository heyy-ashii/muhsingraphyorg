import { cache } from "react";
import { createSupabaseContext } from "@/lib/supabase/context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { coerceContent } from "./merge";
import { DEFAULT_CONTENT } from "./defaults";
import type { SiteContent } from "./schema";

/**
 * Loads the editable site document for a public render.
 *
 * Always resolves: a missing table, an absent row or an unconfigured project all
 * fall back to `DEFAULT_CONTENT`, so the gallery renders even before the
 * `site_content` table has been created. Wrapped in `cache` so the layout, the
 * page and any nested server component share a single fetch per request.
 */
export const getSiteContent = cache(async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return coerceContent(DEFAULT_CONTENT);

  try {
    const { data: ctx } = await createSupabaseContext({ auth: "none" });
    if (!ctx) return coerceContent(DEFAULT_CONTENT);

    const { data, error } = await ctx.supabase
      .from("site_content")
      .select("content")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) return coerceContent(DEFAULT_CONTENT);
    return coerceContent(data);
  } catch {
    return coerceContent(DEFAULT_CONTENT);
  }
});
