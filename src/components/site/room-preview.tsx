"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * "View in Room" — composites the canvas into a luxury gallery interior.
 * The room is drawn in SVG (no external asset, sharp at any size) and the
 * artwork is placed inside the moulding with a perspective shadow.
 */
export function RoomPreview({
  src,
  alt,
  className,
  frame = "gold",
}: {
  src: string;
  alt: string;
  className?: string;
  frame?: "gold" | "black" | "oak";
}) {
  const moulding =
    frame === "gold" ? "#C8A261" : frame === "oak" ? "#8B6A46" : "#1B1B1D";

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#0d0d0f]", className)}>
      <svg
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efe9df" />
            <stop offset="62%" stopColor="#e2dacd" />
            <stop offset="100%" stopColor="#cfc5b4" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9ab97" />
            <stop offset="100%" stopColor="#8d7f6c" />
          </linearGradient>
          <linearGradient id="lightbeam" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#fff8ea" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fff8ea" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="artshadow" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        <rect width="1200" height="900" fill="url(#wall)" />
        <rect y="660" width="1200" height="240" fill="url(#floor)" />
        <rect y="656" width="1200" height="8" fill="#a2957f" opacity="0.55" />

        {/* window light */}
        <polygon points="820,0 1200,0 1200,640 1040,640" fill="url(#lightbeam)" opacity="0.5" />
        <rect x="836" y="90" width="330" height="470" fill="#f6f1e6" opacity="0.55" />
        <rect x="836" y="90" width="330" height="470" fill="none" stroke="#c4b8a4" strokeWidth="3" opacity="0.7" />
        <line x1="1001" y1="90" x2="1001" y2="560" stroke="#c4b8a4" strokeWidth="3" opacity="0.7" />
        <line x1="836" y1="325" x2="1166" y2="325" stroke="#c4b8a4" strokeWidth="3" opacity="0.7" />

        {/* ambient shadow behind the canvas */}
        <ellipse cx="440" cy="470" rx="330" ry="300" fill="url(#artshadow)" filter="url(#soft)" opacity="0.6" />

        {/* moulding */}
        <rect x="196" y="132" width="500" height="620" fill={moulding} />
        <rect x="204" y="140" width="484" height="604" fill="#f7f4ec" />
        <rect x="228" y="164" width="436" height="556" fill="#efe9dd" />
      </svg>

      {/* the artwork itself, inset into the moulding */}
      <div className="absolute left-[20.6%] top-[19.5%] h-[59.5%] w-[34.5%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
        <Image src={src} alt={alt} fill sizes="40vw" className="object-cover" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 mix-blend-soft-light"
        />
      </div>

      {/* visitor silhouette for scale */}
      <svg
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <g opacity="0.28" fill="#2c2a27">
          <ellipse cx="880" cy="742" rx="30" ry="34" />
          <path d="M844 900c0-58 16-92 36-92s36 34 36 92Z" />
        </g>
      </svg>

      <span className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm">
        Scale reference · {alt}
      </span>
    </div>
  );
}
