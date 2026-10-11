"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useSiteContent } from "@/lib/content/context";
import { SECTION_INDEX } from "@/lib/content/defaults";
import { SectionHeading } from "./section-heading";

export function Process() {
  const { process: proc } = useSiteContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });
  const glowY = useTransform(scaleY, (v) => `${v * 100}%`);
  const steps = proc.steps ?? [];

  if (!steps.length) return null;

  return (
    <section id="process" className="relative scroll-mt-28 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index={SECTION_INDEX.process}
          eyebrow={proc.eyebrow}
          lines={proc.lines}
          description={proc.description}
        />

        <div ref={ref} className="relative mt-20">
          {/* animated progress rail */}
          <div aria-hidden className="absolute left-[15px] top-2 hidden h-[calc(100%-2rem)] w-px bg-line sm:block lg:left-[calc(28%+15px)]">
            <motion.span
              style={{ scaleY, transformOrigin: "top" }}
              className="absolute inset-x-0 top-0 h-full w-px bg-gradient-to-b from-gold-bright via-gold to-gold-deep"
            />
            <motion.span
              style={{ top: glowY }}
              className="absolute -left-[3px] h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-gold shadow-[0_0_18px_4px_rgba(200,162,97,0.55)]"
            />
          </div>

          <ol className="space-y-16 sm:space-y-24">
            {steps.map((step, i) => (
              <motion.li
                key={`${step.n}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-14% 0px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid grid-cols-1 gap-6 sm:grid-cols-[30px_1fr] sm:gap-10 lg:grid-cols-[28%_30px_1fr] lg:gap-0"
              >
                {/* left meta (desktop) */}
                <div className="hidden pr-10 text-right lg:block">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                    Step {step.n}
                  </p>
                  <p className="mt-2 font-display text-4xl text-line">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </div>

                {/* node */}
                <div className="hidden justify-center sm:flex">
                  <span className="mt-1.5 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-gold/45 bg-canvas">
                    <span className="h-[7px] w-[7px] rotate-45 bg-gold" />
                  </span>
                </div>

                {/* content */}
                <div className="lg:pl-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold lg:hidden">
                    Step {step.n}
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(1.8rem,3.4vw,2.9rem)] leading-tight text-ink lg:mt-0">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[62ch] text-pretty text-[15.5px] leading-relaxed text-muted">
                    {step.body}
                  </p>
                  {step.meta?.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                      {step.meta.map((m, mi) => (
                        <li key={`${m}-${mi}`} className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                          <span aria-hidden className="h-px w-5 bg-gold/60" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
