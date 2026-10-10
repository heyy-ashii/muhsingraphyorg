"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A single floating cursor disc that appears while hovering any
 * [data-cursor] surface and snaps to that element's centre — the "magnetic"
 * feel without hijacking the native pointer.
 */
export function MagneticCursor() {
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 30, mass: 0.55 });
  const sy = useSpring(y, { stiffness: 320, damping: 30, mass: 0.55 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      if (!el) {
        if (targetRef.current) {
          targetRef.current = null;
          setLabel(null);
        }
        return;
      }
      if (targetRef.current !== el) {
        targetRef.current = el;
        setLabel(el.dataset.cursor || "View");
      }
      const r = el.getBoundingClientRect();
      // Drift slightly toward the pointer but stay anchored to the piece centre.
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      x.set(cx + (e.clientX - cx) * 0.22);
      y.set(cy + (e.clientY - cy) * 0.22);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {label && (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.55 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: sx, y: sy }}
          className="pointer-events-none fixed left-0 top-0 z-[95] hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <span className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/60 bg-canvas/70 backdrop-blur-md">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold-deep dark:text-gold">
              {label}
            </span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
