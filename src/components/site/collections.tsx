"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/content/context";
import { SECTION_INDEX } from "@/lib/content/defaults";
import type { CollectionCategory } from "@/lib/content/schema";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/ui/motion-primitives";

/**
 * Orbiz-style category bands: for each collection, an image on one side and a
 * headline plus a short list of linked options on the other, alternating sides.
 */
export function Collections() {
  const { collections } = useSiteContent();
  const categories = collections.categories ?? [];

  if (!categories.length) return null;

  return (
    <section
      id="collections"
      className="relative scroll-mt-28 border-b border-line py-20 sm:py-28"
    >
      <div className="shell">
        <SectionHeading
          index={SECTION_INDEX.collections}
          eyebrow={collections.eyebrow}
          lines={collections.lines}
          description={collections.description || undefined}
        />

        <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-24">
          {categories.map((category, i) => (
            <CategoryBand key={`${category.title}-${i}`} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryBand({ category }: { category: CollectionCategory }) {
  const imageRight = category.imageSide !== "left";

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(imageRight && "lg:order-2")}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-canvas-2 lg:aspect-[5/4]">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.title}
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
          ) : (
            <span aria-hidden className="absolute inset-0 bg-canvas-2" />
          )}
        </div>
      </Reveal>

      <Reveal className={cn(imageRight && "lg:order-1")}>
        {category.eyebrow && <p className="eyebrow">{category.eyebrow}</p>}
        <h3 className="mt-3 font-display text-3xl leading-[1.12] text-ink sm:text-4xl">
          {category.title}
        </h3>
        {category.body && (
          <p className="mt-4 max-w-[52ch] text-pretty leading-relaxed text-muted">{category.body}</p>
        )}

        {category.items.length > 0 && (
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {category.items.map((item, j) => {
              const inner = (
                <>
                  <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                    {item.title}
                    {item.href && (
                      <ArrowRight
                        size={15}
                        className="text-forest transition-transform duration-300 group-hover/item:translate-x-0.5"
                      />
                    )}
                  </span>
                  {item.description && (
                    <span className="mt-1 block text-sm leading-relaxed text-muted">
                      {item.description}
                    </span>
                  )}
                  {item.meta.length > 0 && (
                    <span className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                      {item.meta.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted"
                        >
                          <span aria-hidden className="h-1 w-1 rounded-full bg-forest" />
                          {m}
                        </span>
                      ))}
                    </span>
                  )}
                </>
              );

              return (
                <li key={`${item.title}-${j}`}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="group/item block py-5 transition-colors duration-300 hover:text-forest"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="py-5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {category.ctaLabel && category.ctaHref && (
          <a href={category.ctaHref} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest">
            <span className="link-underline">{category.ctaLabel}</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        )}
      </Reveal>
    </div>
  );
}
