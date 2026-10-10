import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  className?: string;
  tone?: "ink" | "light" | "gold";
  priority?: boolean;
}

const TONE_SRC = {
  ink: "/assets/emblem-mark.png",
  light: "/assets/emblem-light.png",
  gold: "/assets/emblem-gold.png",
} as const;

export function BrandMark({ size = 40, className, tone = "ink", priority }: BrandMarkProps) {
  return (
    <Image
      src={TONE_SRC[tone]}
      alt="محسن — Muhsin calligraphy emblem"
      width={size}
      height={size}
      priority={priority}
      className={cn("select-none object-contain", className)}
    />
  );
}
