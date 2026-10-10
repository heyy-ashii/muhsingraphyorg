import { cn } from "@/lib/utils";
import { SplitLines } from "@/components/ui/motion-primitives";

export function SectionHeading({
  index,
  eyebrow,
  lines,
  description,
  align = "left",
  className,
  action,
}: {
  index: string;
  eyebrow: string;
  lines: string[];
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        centered && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        <div className={cn("flex items-center gap-4", centered && "justify-center")}>
          <span className="font-mono text-[10px] tracking-[0.28em] text-gold">{index}</span>
          <span className="h-px w-10 bg-gold/45" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
        <h2 className="mt-5 font-display text-display-md text-ink">
          <SplitLines lines={lines} />
        </h2>
        {description && (
          <p className={cn("mt-5 max-w-[54ch] text-pretty text-[15.5px] leading-relaxed text-muted", centered && "mx-auto")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className={cn("shrink-0", centered && "mt-2")}>{action}</div>}
    </div>
  );
}
