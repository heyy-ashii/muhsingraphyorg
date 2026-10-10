"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/site/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Night mode"}
      className={cn(
        "group relative inline-flex h-9 w-[62px] shrink-0 items-center rounded-full border border-gold/30 px-1 transition-colors duration-500",
        "bg-canvas-2/60 hover:border-gold/60",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60",
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] text-gold/70">✦</span>
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted/70">☾</span>
      </span>

      <motion.span
        layout
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className={cn(
          "relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-whisper",
          isDark ? "ml-auto bg-gradient-to-br from-gold-bright to-gold-deep" : "mr-auto bg-ink text-canvas",
        )}
      >
        <motion.span
          key={theme}
          initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                fill="#0A0A0B"
                stroke="#0A0A0B"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="4.4" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.3 5.3l1.9 1.9M16.8 16.8l1.9 1.9M18.7 5.3l-1.9 1.9M7.2 16.8l-1.9 1.9" />
              </g>
            </svg>
          )}
        </motion.span>
      </motion.span>
    </button>
  );
}
