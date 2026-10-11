"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/content/context";
import type { BrandCopy } from "@/lib/content/schema";

interface BrandMarkProps {
  size?: number;
  className?: string;
  tone?: "ink" | "light" | "gold";
  priority?: boolean;
  /** Overrides the content-driven source, e.g. for the studio portrait slot. */
  src?: string;
}

function toneSrc(brand: BrandCopy, tone: NonNullable<BrandMarkProps["tone"]>) {
  if (tone === "gold") return brand.logoGoldUrl;
  if (tone === "light") return brand.logoLightUrl;
  return brand.logoUrl;
}

export function BrandMark({ size = 40, className, tone = "ink", priority, src }: BrandMarkProps) {
  const { brand } = useSiteContent();
  return (
    <Image
      src={src || toneSrc(brand, tone) || "/assets/emblem-mark.png"}
      alt="محسن — Muhsin calligraphy emblem"
      width={size}
      height={size}
      priority={priority}
      className={cn("select-none object-contain", className)}
    />
  );
}
