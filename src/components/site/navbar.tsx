"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSiteContent } from "@/lib/content/context";
import { visibleNav } from "@/lib/content/merge";
import { cn } from "@/lib/utils";
import { BrandLockup } from "@/components/ui/brand-lockup";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const content = useSiteContent();
  const { contact } = content;
  const nav = visibleNav(content);
  // Hiding sections leaves the nav with a few links; a full-width pill then
  // floats them in a lot of empty space. Below the full set, size the pill to
  // its contents and centre it instead.
  const compact = nav.length < 4;
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3 sm:px-5 sm:pt-5">
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className={cn(
            "pointer-events-auto flex w-full max-w-[1180px] items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-700 ease-silk sm:px-6",
            "glass shadow-whisper",
            condensed ? "py-2" : "py-3",
            // When sections are hidden the pill hugs its content so the few
            // remaining links don't float in a wide, empty bar.
            compact && "lg:w-auto lg:gap-10 lg:px-7",
          )}
        >
          <BrandLockup size="sm" />

          <ul className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="link-underline font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft transition-colors duration-500 hover:text-gold"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors duration-500 hover:border-gold/50 hover:text-gold lg:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[75] bg-canvas/96 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-center px-8 pb-24">
              <ul className="space-y-2">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line/70"
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-5 font-display text-3xl text-ink"
                    >
                      {item.label}
                      <span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(3, "0")}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.7 }}
                className="mt-12"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                  {contact.whatsappDisplay} · {contact.city}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
