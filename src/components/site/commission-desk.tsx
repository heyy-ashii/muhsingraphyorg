"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { SECTION, SITE } from "@/lib/site";
import { COMMISSION_TYPES } from "@/lib/types";
import { buildGeneralMessage, whatsappLink } from "@/lib/whatsapp";
import { SectionHeading } from "./section-heading";
import { AcquireButton, InstagramIcon, WhatsAppIcon } from "@/components/ui/whatsapp-button";
import { Reveal } from "@/components/ui/motion-primitives";

type State = "idle" | "sending" | "sent" | "error";

export function CommissionDesk() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    setError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: String(fd.get("client_name") ?? "").trim(),
          client_email: String(fd.get("client_email") ?? "").trim(),
          commission_type: String(fd.get("commission_type") ?? ""),
          message: String(fd.get("message") ?? "").trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "We could not record your enquiry.");
      setState("sent");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="commissions" className="relative scroll-mt-28 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index={SECTION.commissions}
          eyebrow="Bespoke Commission Desk"
          lines={["Commission a", "piece of your own."]}
          description="Private commissions are accepted in limited number each season. Share the space, the scale and the intention — Muhsin will respond personally with a proposal, timeline and material options."
        />

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* ── form ─────────────────────────────────────────── */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {state === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[440px] flex-col items-center justify-center border border-gold/35 bg-surface p-10 text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold">
                    <Check size={22} />
                  </span>
                  <h3 className="mt-6 font-display text-3xl text-ink">Enquiry received</h3>
                  <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-muted">
                    Thank you. Your commission request is now with the atelier. Muhsin replies to
                    every enquiry personally, usually within two working days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setState("idle")}
                    className="link-underline mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-ink"
                  >
                    Submit another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  className="space-y-9 border border-line bg-surface p-7 sm:p-10"
                >
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <label className="block">
                      <span className="eyebrow">Your name *</span>
                      <input
                        name="client_name"
                        required
                        maxLength={120}
                        autoComplete="name"
                        placeholder="e.g. Helena Ruiz"
                        className="field mt-3"
                      />
                    </label>
                    <label className="block">
                      <span className="eyebrow">Email *</span>
                      <input
                        name="client_email"
                        type="email"
                        required
                        maxLength={160}
                        autoComplete="email"
                        placeholder="you@studio.com"
                        className="field mt-3"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="eyebrow">Nature of commission</span>
                    <select name="commission_type" defaultValue={COMMISSION_TYPES[0]} className="field mt-3 bg-transparent">
                      {COMMISSION_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-surface text-ink">
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="eyebrow">The brief *</span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      maxLength={4000}
                      placeholder="Space, scale, script preference, timeline, and anything else that matters…"
                      className="field mt-3 resize-none"
                    />
                  </label>

                  {error && (
                    <p role="alert" className="border border-red-500/30 bg-red-500/5 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-5 pt-1">
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="btn-ink h-[54px] min-w-[210px] rounded-full px-8 font-mono text-[11px] uppercase tracking-[0.24em] disabled:opacity-60"
                    >
                      {state === "sending" ? (
                        <>
                          <LoaderCircle size={14} className="animate-spin" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <span>Submit Enquiry</span>
                      )}
                    </button>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                      Held in confidence · No account required
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── direct channels ──────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="relative overflow-hidden border border-gold/30 bg-surface p-7 sm:p-9">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl"
                />
                <p className="eyebrow">Direct line</p>
                <p className="mt-4 font-display text-[clamp(2rem,3.6vw,2.8rem)] leading-none text-ink">
                  {SITE.whatsappDisplay}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  Prefer to speak directly? Message the atelier on WhatsApp for immediate
                  availability, pricing and shipping.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <AcquireButton
                    href={whatsappLink(buildGeneralMessage("a private commission"))}
                    label="Chat on WhatsApp"
                    size="md"
                    variant="solid"
                    className="rounded-full"
                  />
                  <a
                    href={`mailto:${SITE.email}`}
                    className="btn-gold h-11 rounded-full px-6 font-mono text-[11px] uppercase tracking-[0.22em]"
                  >
                    <span>Email the atelier</span>
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border border-line bg-surface p-7 transition-colors duration-700 hover:border-gold/40 sm:p-9"
              >
                <span className="flex items-center gap-5">
                  <InstagramIcon className="text-gold" />
                  <span>
                    <span className="block font-display text-2xl text-ink">@muhsingraphy</span>
                    <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      Studio journal & works in progress
                    </span>
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  className="text-muted transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold"
                />
              </a>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="border border-line bg-surface p-7 sm:p-9">
                <p className="eyebrow">Studio & representation</p>
                <dl className="mt-5 space-y-4 text-[14px] leading-relaxed text-ink-soft">
                  <div className="flex justify-between gap-6 border-b border-line pb-3">
                    <dt className="text-muted">Atelier</dt>
                    <dd className="text-right">{SITE.studio.line1}</dd>
                  </div>
                  <div className="flex justify-between gap-6 border-b border-line pb-3">
                    <dt className="text-muted">Visits</dt>
                    <dd className="text-right">{SITE.studio.line2}</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted">Enquiries</dt>
                    <dd className="text-right">{SITE.email}</dd>
                  </div>
                </dl>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <WhatsAppIcon className="text-gold" />
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    Worldwide insured shipping · Certificate of authenticity
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
