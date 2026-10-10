"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.25,
      lerp: 0.085,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.5 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
