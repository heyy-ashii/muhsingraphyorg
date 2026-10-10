"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SECTION } from "@/lib/site";
import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    n: "I",
    title: "Composition & Nuqta Geometry",
    body: "The composition is set on paper before a single stroke of ink: the nuqta establishes the module, and every letter is measured against it. Ruling lines are drawn in graphite and left visible until the final burnish.",
    meta: ["Graphite ruling", "Nuqta module", "Proportion study"],
  },
  {
    n: "II",
    title: "Rhythmic Inking & Stroke Harmony",
    body: "Ink is laid in a single continuous rhythm — a lifted qalam leaves a scar in the line. Sittings are short and deliberate; a monumental panel can take eleven of them.",
    meta: ["Continuous rhythm", "Lampblack ink", "Multiple sittings"],
  },
  {
    n: "III",
    title: "Gilding & Illumination",
    body: "Gold is laid over organic size with a gilder's tip, then burnished with an agate. Illumination is added only where it clarifies a stroke — never where it merely decorates.",
    meta: ["Organic size", "24k leaf", "Agate burnish"],
  },
  {
    n: "IV",
    title: "Archival Preservation & Framing",
    body: "The finished canvas is sealed, documented and photographed for the archive, then framed to museum specification with UV-filtering glazing and an acid-free mount.",
    meta: ["Archival seal", "Museum framing", "Certificate issued"],
  },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });
  const glowY = useTransform(scaleY, (v) => `${v * 100}%`);

  return (
    <section id="process" className="relative scroll-mt-28 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index={SECTION.process}
          eyebrow="Discipline & Methodology"
          lines={["From blank sheet", "to archival canvas."]}
          description="Every commission follows the same four movements. Nothing is expedited; the sequence is the craft."
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
            {STEPS.map((step, i) => (
              <motion.li
                key={step.n}
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
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                    {step.meta.map((m) => (
                      <li key={m} className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                        <span aria-hidden className="h-px w-5 bg-gold/60" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
