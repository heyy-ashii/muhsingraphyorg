import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { BrandMark } from "./brand-mark";

interface BrandLockupProps {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const SIZES = {
  sm: { mark: 30, word: "text-[15px] tracking-[0.34em]" },
  md: { mark: 40, word: "text-[18px] tracking-[0.38em]" },
  lg: { mark: 56, word: "text-[24px] tracking-[0.42em]" },
} as const;

export function BrandLockup({
  href = "/",
  className,
  size = "md",
  showWordmark = true,
}: BrandLockupProps) {
  const s = SIZES[size];

  const content = (
    <span className={cn("group inline-flex items-center gap-3", className)}>
      <span className="relative inline-flex shrink-0 items-center justify-center">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-gold/25 opacity-0 blur-md transition-opacity duration-700 group-hover:opacity-100"
        />
        <BrandMark size={s.mark} priority className="relative transition-transform duration-700 group-hover:scale-[1.06]" />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "relative overflow-hidden font-display uppercase text-ink transition-colors duration-500",
              s.word,
            )}
          >
            <span className="relative z-10">{SITE.wordmark}</span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gold-sheen bg-[length:220%_100%] opacity-0 transition-all duration-[1100ms] ease-silk group-hover:translate-x-0 group-hover:opacity-100"
            />
          </span>
          <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.3em] text-muted">
            Atelier of Sacred Script
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label={`${SITE.wordmark} — home`} className="outline-none focus-visible:ring-1 focus-visible:ring-gold/60">
      {content}
    </Link>
  );
}
