"use client";

import { useSiteContent } from "@/lib/content/context";

function Diamond() {
  return (
    <span aria-hidden className="mx-8 inline-flex shrink-0 items-center">
      <svg width="9" height="9" viewBox="0 0 10 10" className="text-gold">
        <path d="M5 0l5 5-5 5-5-5z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Ticker() {
  const { ticker } = useSiteContent();
  const items = ticker?.length ? ticker : [];
  const loop = [...items, ...items, ...items];

  if (!loop.length) return null;

  return (
    <section
      aria-label="Disciplines and materials"
      className="relative border-y border-line bg-canvas-2/40 py-6 sm:py-7"
    >
      <div className="edge-fade overflow-hidden">
        <div className="flex w-max animate-marquee-slow items-center will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {loop.map((item, i) => (
                <span key={`${copy}-${item}-${i}`} className="flex shrink-0 items-center">
                  <span className="whitespace-nowrap font-display text-[clamp(1.1rem,2.4vw,1.9rem)] uppercase tracking-[0.18em] text-ink-soft">
                    {item}
                  </span>
                  <Diamond />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
