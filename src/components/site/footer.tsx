"use client";

import Link from "next/link";
import { ArrowUp, Lock } from "lucide-react";
import { useSiteContent } from "@/lib/content/context";
import { whatsappPhoneLink } from "@/lib/whatsapp";
import { BrandLockup } from "@/components/ui/brand-lockup";
import { BrandMark } from "@/components/ui/brand-mark";

export function Footer() {
  const { brand, contact, credit, nav } = useSiteContent();

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas-2/50">
      {/* watermark emblem */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <BrandMark
          tone="gold"
          size={620}
          className="translate-y-[6%] opacity-[0.055] blur-[0.4px] sm:opacity-[0.07]"
        />
      </div>

      <div className="shell relative z-10 pt-20">
        <div className="grid grid-cols-1 gap-14 pb-16 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-12">
          <div>
            <BrandLockup size="md" />
            <p className="mt-7 max-w-[38ch] text-pretty text-[14.5px] leading-relaxed text-muted">
              {brand.description}
            </p>
            <div className="gold-rule mt-8 max-w-[280px]" />
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
              {brand.authenticity}
            </p>
          </div>

          <nav aria-label="Gallery">
            <p className="eyebrow">Gallery</p>
            <ul className="mt-6 space-y-3.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline font-display text-lg text-ink transition-colors duration-500 hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Studio</p>
            <address className="mt-6 space-y-3.5 not-italic text-[14px] leading-relaxed text-muted">
              <p>
                {contact.studioLine1}
                <br />
                {contact.city}, {contact.country}
              </p>
              <p>{contact.studioLine2}</p>
              <p>
                <a href={`mailto:${contact.email}`} className="link-underline text-ink">
                  {contact.email}
                </a>
              </p>
              <p>
                <a
                  href={`https://wa.me/${contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink"
                >
                  {contact.whatsappDisplay}
                </a>
              </p>
              <p>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink"
                >
                  {contact.instagramHandle}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="gold-rule" />

        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
            {brand.copyright}
          </p>

          <p className="order-last text-center font-mono text-[9px] tracking-[0.14em] text-muted/80 sm:order-none">
            {credit.label}{" "}
            <a
              href={credit.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-ink/70 transition-colors duration-500 hover:text-gold"
            >
              {credit.name}
            </a>
            <span className="px-1.5 text-muted/50">·</span>
            <a
              href={whatsappPhoneLink(credit.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-ink/70 transition-colors duration-500 hover:text-gold"
            >
              {credit.phoneDisplay}
            </a>
          </p>

          <div className="flex items-center gap-7">
            <button
              type="button"
              onClick={toTop}
              className="group inline-flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink transition-colors duration-500 hover:text-gold"
            >
              Return to top
              <ArrowUp size={12} className="transition-transform duration-500 group-hover:-translate-y-1" />
            </button>

            {/* discreet admin access */}
            <Link
              href="/admin/login"
              aria-label="Atelier login"
              title="Atelier login"
              className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted/70 transition-colors duration-500 hover:text-gold"
            >
              <Lock size={11} className="transition-transform duration-500 group-hover:rotate-[-8deg]" />
              <span className="hidden sm:inline">Atelier Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
