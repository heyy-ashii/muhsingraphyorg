"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  once = true,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const lineVariants: Variants = {
  hidden: { opacity: 0, y: "115%", rotate: 2.5 },
  show: (i: number) => ({
    opacity: 1,
    y: "0%",
    rotate: 0,
    transition: { duration: 1.15, ease: EASE, delay: 0.08 * i },
  }),
};

/** Line-by-line editorial reveal. Each string renders on its own masked line. */
export function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  animateOnView = true,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  animateOnView?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            custom={i + delay}
            variants={lineVariants}
            initial="hidden"
            animate={animateOnView ? (inView ? "show" : "hidden") : "show"}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Word-level stagger for short display statements. */
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.06 }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Counter({
  to,
  suffix = "",
  className,
  duration = 2,
}: {
  to: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

/** Slow ambient tilt driven by pointer position — used on the hero piece. */
export function AmbientTilt({
  children,
  className,
  intensity = 12,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.7 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      className={cn("[transform-style:preserve-3d]", className)}
    >
      {children}
    </motion.div>
  );
}
