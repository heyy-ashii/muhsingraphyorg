import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "@/components/admin/login-form";
import { BrandLockup } from "@/components/ui/brand-lockup";

export const metadata: Metadata = {
  title: "Atelier Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.07] blur-[150px]" />
      </div>

      <div className="mb-10">
        <BrandLockup size="sm" />
      </div>

      <LoginForm next={next ?? "/admin/dashboard"} />

      {!isSupabaseConfigured && (
        <p className="mt-8 max-w-[420px] border border-amber-500/30 bg-amber-500/5 px-5 py-4 text-center font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-amber-700 dark:text-amber-400">
          Supabase is not connected. Set NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY, then run supabase/schema.sql.
        </p>
      )}

      <Link
        href="/"
        className="link-underline mt-10 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted transition-colors duration-500 hover:text-gold"
      >
        <ArrowLeft size={11} />
        Return to the gallery
      </Link>
    </main>
  );
}
