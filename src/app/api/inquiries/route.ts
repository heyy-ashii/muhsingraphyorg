import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseContext } from "@/lib/supabase/context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_INQUIRIES } from "@/lib/seed";
import { COMMISSION_TYPES } from "@/lib/types";

const InquirySchema = z.object({
  client_name: z.string().trim().min(2, "Please share your name.").max(120),
  client_email: z.string().trim().email("Please enter a valid email address.").max(160),
  commission_type: z.enum(COMMISSION_TYPES),
  message: z.string().trim().min(10, "A little more detail helps the atelier respond.").max(4000),
});

/**
 * Rate limiting for the public enquiry endpoint. In-memory is sufficient for a
 * single-region deploy; a distributed store can be swapped in without changing
 * the handler contract.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again shortly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = InquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please review the form." },
      { status: 422 },
    );
  }

  const record = { ...parsed.data, status: "New" as const };

  if (!isSupabaseConfigured) {
    // Preview mode: accept and log so the experience is complete end-to-end.
    SEED_INQUIRIES.push({ ...record, id: `local-${Date.now()}`, created_at: new Date().toISOString() });
    console.info("[inquiries] Supabase not configured — enquiry accepted in preview mode.");
    return NextResponse.json({ ok: true, mode: "preview" }, { status: 202 });
  }

  try {
    // Collectors are anonymous: `auth: 'none'` yields an RLS-scoped client whose
    // insert is permitted by the "inquiries public insert" policy.
    const { data: ctx, error } = await createSupabaseContext({ auth: "none" });
    if (error || !ctx) throw new Error(error?.message ?? "client unavailable");

    const { error: insertError } = await ctx.supabase.from("inquiries").insert(record);
    if (insertError) {
      console.error("[inquiries] insert failed", insertError.message);
      return NextResponse.json({ error: "We could not record your enquiry. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[inquiries] unexpected error", err);
    return NextResponse.json({ error: "We could not record your enquiry. Please try again." }, { status: 500 });
  }
}
