"use client";

import Link from "next/link";
import { ArrowUp, Lock } from "lucide-react";
import { useSiteContent } from "@/lib/content/context";
import { visibleNav } from "@/lib/content/merge";
import { whatsappPhoneLink } from "@/lib/whatsapp";
import { BrandLockup } from "@/components/ui/brand-lockup";

export function Footer() {
  const content = useSiteContent();
  const { brand, contact, credit } = content;
  const nav = visibleNav(content);

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas-2">
      <div className="shell relative z-10 pt-16">
        <div className="grid grid-cols-1 gap-14 pb-16 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-12">
          <div>
            <BrandLockup size="md" />
            <p className="mt-5 max-w-[38ch] text-pretty text-sm leading-relaxed text-muted">
              {brand.description}
            </p>
            <div className="gold-rule mt-8 max-w-[280px]" />
            <p className="mt-5 text-xs text-muted">
              {brand.authenticity}
            </p>
          </div>

          <nav aria-label="Gallery">
            <p className="eyebrow">Gallery</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-[15px] text-ink-soft transition-colors duration-300 hover:text-forest"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Studio</p>
            <address className="mt-5 space-y-2.5 text-sm leading-relaxed text-muted">
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
          <p className="text-xs text-muted">
            {brand.copyright}
          </p>

          <p className="order-last text-center text-xs text-muted sm:order-none">
            {credit.label}{" "}
            <a
              href={credit.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-ink-soft transition-colors duration-300 hover:text-forest"
            >
              {credit.name}
            </a>
            <span className="px-1.5 text-muted/50">·</span>
            <a
              href={whatsappPhoneLink(credit.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-ink-soft transition-colors duration-300 hover:text-forest"
            >
              {credit.phoneDisplay}
            </a>
          </p>

          <div className="flex items-center gap-7">
            <button
              type="button"
              onClick={toTop}
              className="group inline-flex items-center gap-2 text-xs font-medium text-ink transition-colors duration-300 hover:text-forest"
            >
              Return to top
              <ArrowUp size={12} className="transition-transform duration-500 group-hover:-translate-y-1" />
            </button>

            {/* discreet admin access */}
            <Link
              href="/admin/login"
              aria-label="Atelier login"
              title="Atelier login"
              className="group inline-flex items-center gap-2 text-xs text-muted transition-colors duration-300 hover:text-forest"
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
