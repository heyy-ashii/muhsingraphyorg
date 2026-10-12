"use client";

import { useSiteContent } from "@/lib/content/context";
import { cn } from "@/lib/utils";
import type { TickerSeparator, TickerSpeed } from "@/lib/content/schema";

const SPEED_CLASS: Record<TickerSpeed, string> = {
  slow: "animate-marquee-slow",
  medium: "animate-marquee",
  fast: "animate-marquee-fast",
};

function Separator({ kind }: { kind: TickerSeparator }) {
  if (kind === "none") return <span aria-hidden className="mx-6 inline-block" />;

  if (kind === "dot") {
    return (
      <span aria-hidden className="mx-8 inline-flex shrink-0 items-center">
        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
      </span>
    );
  }

  if (kind === "bar") {
    return <span aria-hidden className="mx-8 inline-block h-4 w-px shrink-0 bg-forest/70" />;
  }

  return (
    <span aria-hidden className="mx-8 inline-flex shrink-0 items-center">
      <svg width="9" height="9" viewBox="0 0 10 10" className="text-forest">
        <path d="M5 0l5 5-5 5-5-5z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Ticker() {
  const { ticker, tickerStyle } = useSiteContent();
  const items = ticker?.length ? ticker : [];
  const loop = [...items, ...items, ...items];
  const separator = tickerStyle?.separator ?? "diamond";
  const speed = tickerStyle?.speed ?? "slow";

  if (!loop.length) return null;

  return (
    <section
      aria-label="Disciplines and materials"
      className="relative border-y border-line bg-forest py-4 text-lime"
    >
      <div className="edge-fade overflow-hidden">
        <div className={cn("flex w-max items-center will-change-transform", SPEED_CLASS[speed])}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {loop.map((item, i) => (
                <span key={`${copy}-${item}-${i}`} className="flex shrink-0 items-center">
                  <span className="whitespace-nowrap font-display text-[clamp(1.1rem,2.4vw,1.9rem)] tracking-wide text-ink-soft">
                    {item}
                  </span>
                  <Separator kind={separator} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

