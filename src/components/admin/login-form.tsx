"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({ next = "/admin/dashboard" }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setBusy(false);
      setError("Supabase is not configured. Add your project keys to continue.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setBusy(false);
      setError("Those credentials were not recognised.");
      return;
    }

    router.replace(next.startsWith("/admin") ? next : "/admin/dashboard");
    router.refresh();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={onSubmit}
      className="w-full max-w-[420px] border border-line bg-surface p-8 shadow-whisper sm:p-10"
    >
      <span className="eyebrow">Private access</span>
      <h1 className="mt-4 font-display text-[clamp(2rem,4vw,2.8rem)] leading-tight text-ink">
        Atelier Login
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-muted">
        Curator credentials only. Collector accounts are never required to acquire work.
      </p>

      <div className="mt-9 space-y-8">
        <label className="block">
          <span className="eyebrow">Email</span>
          <span className="mt-3 flex items-center gap-3 border-b border-line pb-2 transition-colors focus-within:border-gold">
            <Mail size={14} className="text-muted" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-muted/60"
              placeholder="curator@muhsingraphy.com"
            />
          </span>
        </label>

        <label className="block">
          <span className="eyebrow">Password</span>
          <span className="mt-3 flex items-center gap-3 border-b border-line pb-2 transition-colors focus-within:border-gold">
            <Lock size={14} className="text-muted" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-muted/60"
              placeholder="••••••••••"
            />
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-7 border border-red-500/30 bg-red-500/5 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn-ink mt-9 h-[52px] w-full rounded-full font-mono text-[11px] uppercase tracking-[0.24em] disabled:opacity-60"
      >
        {busy ? (
          <>
            <LoaderCircle size={14} className="animate-spin" />
            <span>Authenticating…</span>
          </>
        ) : (
          <span>Enter the Atelier</span>
        )}
      </button>
    </motion.form>
  );
}
