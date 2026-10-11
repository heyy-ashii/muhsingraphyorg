"use client";

import { useEffect, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import {
  changePassword,
  getAccountProfile,
  saveAccountProfile,
  type AccountProfile,
} from "@/lib/account";
import { formatDate } from "@/lib/utils";
import { Area, Grid, Label, Panel, Text } from "./fields";

const MIN_PASSWORD = 8;

function Flash({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold-deep dark:text-gold">
      <Check size={12} /> {children}
    </p>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="border border-red-500/30 bg-red-500/5 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-red-600 dark:text-red-400"
    >
      {children}
    </p>
  );
}

export function AccountPanel({
  email,
  onProfileSaved,
}: {
  email: string;
  onProfileSaved?: (name: string) => void;
}) {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileFlash, setProfileFlash] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordFlash, setPasswordFlash] = useState(false);

  useEffect(() => {
    let alive = true;
    getAccountProfile()
      .then((p) => {
        if (!alive) return;
        setProfile(p);
        setFullName(p.fullName);
        setTitle(p.title);
        setPhone(p.phone);
        setBio(p.bio);
      })
      .catch((err) => {
        if (alive) setLoadError(err instanceof Error ? err.message : "Could not load your account.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  async function submitProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    try {
      await saveAccountProfile({ fullName, title, phone, bio });
      setProfileFlash(true);
      onProfileSaved?.(fullName.trim());
      setTimeout(() => setProfileFlash(false), 2400);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not save your details.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    if (password.length < MIN_PASSWORD) {
      setPasswordError(`Use at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setPasswordError("The two passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(password);
      setPassword("");
      setConfirm("");
      setPasswordFlash(true);
      setTimeout(() => setPasswordFlash(false), 2400);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Could not change your password.");
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <LoaderCircle size={22} className="animate-spin text-gold" />
      </div>
    );
  }

  const identity = profile?.email ?? email;

  return (
    <div className="mt-8 space-y-5 pb-16">
      {loadError && <ErrorNote>{loadError}</ErrorNote>}

      {/* ── identity summary ─────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-surface px-6 py-5 sm:px-7">
        <div className="min-w-0">
          <p className="eyebrow">Signed in as</p>
          <p className="mt-2 truncate font-display text-[22px] leading-tight text-ink">
            {profile?.fullName || identity}
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">{identity}</p>
        </div>
        {profile?.createdAt && (
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            Curator since {formatDate(profile.createdAt)}
          </p>
        )}
      </div>

      {/* ── personal information ─────────────────────────── */}
      <Panel
        title="Personal information"
        index="—"
        description="Your name, role and contact details. These are stored on your account and shown beside your curator work."
        defaultOpen
      >
        <form onSubmit={submitProfile} className="space-y-6">
          <Grid>
            <Text label="Full name" value={fullName} onChange={setFullName} placeholder="e.g. Muhsin" />
            <Text label="Title / role" value={title} onChange={setTitle} placeholder="e.g. Master Calligrapher" />
            <Text label="Phone" value={phone} onChange={setPhone} placeholder="+91 …" />
          </Grid>
          <Area label="Short biography" value={bio} onChange={setBio} rows={3} placeholder="A sentence about your practice." />

          {profileError && <ErrorNote>{profileError}</ErrorNote>}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={savingProfile}
              className="btn-ink h-11 rounded-full px-7 font-mono text-[10px] uppercase tracking-[0.22em] disabled:opacity-60"
            >
              {savingProfile ? (
                <>
                  <LoaderCircle size={13} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save details</span>
              )}
            </button>
            {profileFlash && <Flash>Details saved</Flash>}
          </div>
        </form>
      </Panel>

      {/* ── password ─────────────────────────────────────── */}
      <Panel
        title="Password"
        index="—"
        description="Set a new password for this curator account. You stay signed in afterwards."
      >
        <form onSubmit={submitPassword} className="space-y-6">
          <Grid>
            <label className="block">
              <Label>New password</Label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`At least ${MIN_PASSWORD} characters`}
                className="field mt-2 h-11 py-0"
              />
            </label>
            <label className="block">
              <Label>Confirm new password</Label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat the password"
                className="field mt-2 h-11 py-0"
              />
            </label>
          </Grid>

          {passwordError && <ErrorNote>{passwordError}</ErrorNote>}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={savingPassword || !password}
              className="btn-ink h-11 rounded-full px-7 font-mono text-[10px] uppercase tracking-[0.22em] disabled:opacity-60"
            >
              {savingPassword ? (
                <>
                  <LoaderCircle size={13} className="animate-spin" />
                  <span>Updating…</span>
                </>
              ) : (
                <span>Update password</span>
              )}
            </button>
            {passwordFlash && <Flash>Password updated</Flash>}
          </div>
        </form>
      </Panel>
    </div>
  );
}
