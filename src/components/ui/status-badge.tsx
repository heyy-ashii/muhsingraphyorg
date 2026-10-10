import { cn } from "@/lib/utils";
import type { ArtworkStatus } from "@/lib/types";

const TONE: Record<string, { label: string; className: string; dot: string }> = {
  Available: {
    label: "Available for Acquisition",
    className: "border-gold/45 bg-gold/10 text-gold-deep dark:text-gold",
    dot: "bg-gold",
  },
  Reserved: {
    label: "Reserved",
    className: "border-amber-600/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  "Private Collection": {
    label: "In Private Collection",
    className: "border-line bg-canvas-2/70 text-muted",
    dot: "bg-muted",
  },
};

export function StatusBadge({
  status,
  className,
  size = "md",
}: {
  status: ArtworkStatus | string;
  className?: string;
  size?: "sm" | "md";
}) {
  const tone = TONE[status] ?? TONE["Private Collection"];
  const available = status === "Available";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-mono uppercase backdrop-blur-md",
        size === "sm" ? "px-2.5 py-1 text-[9px] tracking-[0.18em]" : "px-3.5 py-1.5 text-[10px] tracking-[0.22em]",
        tone.className,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {available && (
          <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-70 animate-pulse-ring", tone.dot)} />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", tone.dot)} />
      </span>
      {tone.label}
    </span>
  );
}
