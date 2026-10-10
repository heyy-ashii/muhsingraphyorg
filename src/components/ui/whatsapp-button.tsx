import { cn } from "@/lib/utils";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn("h-[15px] w-[15px]", className)}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
      className={cn("h-[19px] w-[19px]", className)}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface AcquireButtonProps {
  href: string;
  label?: string;
  className?: string;
  variant?: "outline" | "solid" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const SIZES = {
  sm: "h-9 px-4 text-[10px] tracking-[0.2em]",
  md: "h-11 px-6 text-[11px] tracking-[0.22em]",
  lg: "h-[54px] px-8 text-[12px] tracking-[0.24em]",
} as const;

/**
 * Collector conversion path. Always renders as a real anchor to wa.me so the
 * link is copyable, prefetch-free and works with middle-click / long-press.
 */
export function AcquireButton({
  href,
  label = "Acquire via WhatsApp",
  className,
  variant = "outline",
  size = "md",
  onClick,
}: AcquireButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      data-whatsapp="true"
      className={cn(
        "group/wa inline-flex items-center justify-center gap-2.5 font-mono uppercase transition-all duration-500",
        SIZES[size],
        variant === "outline" && "btn-gold",
        variant === "solid" &&
          "bg-gradient-to-r from-gold-deep to-gold-bright text-white hover:shadow-gilding dark:text-[#0A0A0B]",
        variant === "ghost" &&
          "border border-transparent text-muted hover:border-gold/40 hover:text-gold",
        className,
      )}
    >
      <WhatsAppIcon className="shrink-0 transition-transform duration-500 group-hover/wa:scale-110" />
      <span>{label}</span>
    </a>
  );
}
