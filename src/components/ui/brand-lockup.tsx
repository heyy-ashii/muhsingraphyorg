"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/content/context";
import { BrandMark } from "./brand-mark";

interface BrandLockupProps {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const SIZES = {
  sm: { mark: 28, word: "text-[16px]" },
  md: { mark: 36, word: "text-[19px]" },
  lg: { mark: 48, word: "text-[26px]" },
} as const;

export function BrandLockup({
  href = "/",
  className,
  size = "md",
  showWordmark = true,
}: BrandLockupProps) {
  const { brand } = useSiteContent();
  const s = SIZES[size];
  const title = brand.wordmark || "Muhsingraphy";

  const content = (
    <span className={cn("group inline-flex items-center gap-3", className)}>
      <span className="relative inline-flex shrink-0 items-center justify-center">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-forest/25 opacity-0 blur-md transition-opacity duration-700 group-hover:opacity-100"
        />
        <BrandMark size={s.mark} priority className="relative transition-transform duration-700 group-hover:scale-[1.06]" />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display font-semibold text-ink transition-colors duration-300",
              s.word,
            )}
          >
            {title}
          </span>
          {brand.subtitle && (
            <span className="mt-1 font-sans text-[10px] text-muted">
              {brand.subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label={`${title} — home`} className="outline-none focus-visible:ring-1 focus-visible:ring-forest/60">
      {content}
    </Link>
  );
}
