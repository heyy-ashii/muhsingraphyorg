"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSiteContent } from "@/lib/content/context";
import { visibleNav } from "@/lib/content/merge";
import { cn } from "@/lib/utils";
import { buildGeneralMessage, whatsappLink } from "@/lib/whatsapp";
import { BrandLockup } from "@/components/ui/brand-lockup";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const content = useSiteContent();
  const { contact } = content;
  const nav = visibleNav(content);
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 8));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const enquiryHref = whatsappLink(
    buildGeneralMessage("a calligraphy piece"),
    contact.whatsappNumber,
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] border-b border-line bg-canvas/95 backdrop-blur-md transition-shadow duration-300",
          condensed && "shadow-whisper",
        )}
      >
        <div className="shell flex items-center gap-6 py-3.5">
          <BrandLockup size="sm" />

          <ul className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="link-underline text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-forest"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a
              href={enquiryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold hidden h-10 px-5 text-sm sm:inline-flex"
            >
              <span>Enquire</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-forest/50 hover:text-forest lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[75] bg-canvas lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-16 pt-24">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                    className="border-b border-line"
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-5 text-2xl font-semibold text-ink"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href={enquiryHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn-gold mt-8 h-12 px-6 text-base"
              >
                <span>Enquire via WhatsApp</span>
              </a>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
                <span className="text-sm text-muted">Appearance</span>
                <ThemeToggle />
              </div>
              <p className="mt-auto pt-6 text-sm text-muted">
                {contact.whatsappDisplay} · {contact.city}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
