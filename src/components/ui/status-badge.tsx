import { cn } from "@/lib/utils";
import type { ArtworkStatus } from "@/lib/types";

const TONE: Record<string, { label: string; className: string; dot: string }> = {
  Available: {
    label: "Available",
    className: "border-forest/30 bg-forest/10 text-forest",
    dot: "bg-forest",
  },
  Reserved: {
    label: "Reserved",
    className: "border-coral/30 bg-coral/10 text-coral",
    dot: "bg-coral",
  },
  "Private Collection": {
    label: "Private collection",
    className: "border-line bg-canvas-2 text-muted",
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
        "inline-flex items-center gap-2 rounded-full border font-sans font-medium",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs",
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
