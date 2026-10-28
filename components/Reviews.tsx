"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { reviews, showReviewPlaceholders } from "@/data/site";

/**
 * Real reviews only. With none configured, bracketed placeholder cards make it
 * obvious what still needs to be supplied (or the section hides entirely).
 */
export function Reviews() {
  const root = useRef<HTMLElement>(null);
  const isPlaceholder = reviews.length === 0;
  const list = isPlaceholder
    ? Array.from({ length: 3 }, () => ({ quote: "[Customer review — paste a real review here]", name: "[Customer name]", source: "[Google / Instagram]" }))
    : reviews;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-review]", {
          y: 80,
          rotate: (i) => [-4, 3, -2][i % 3],
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-reviews]", start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  if (isPlaceholder && !showReviewPlaceholders) return null;

  return (
    <section ref={root} aria-labelledby="reviews-title" className="relative bg-ink px-[var(--gutter)] py-24 md:py-36">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 id="reviews-title" className="display text-[clamp(4rem,17vw,10rem)] text-white lg:text-[clamp(3.4rem,10vw,10rem)]">
          Word <span className="outline-type">of mouth</span>
        </h2>
        {isPlaceholder && (
          <p className="max-w-[36ch] pb-3 text-sm text-white/45">
            Placeholder cards — real customer reviews will be added here.
          </p>
        )}
      </div>

      <ul
        data-reviews
        data-lenis-prevent-horizontal
        className="no-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pt-2 pb-4 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:p-0"
      >
        {list.map((r, i) => (
          <li
            key={i}
            data-review
            className={`relative flex min-h-[280px] w-[82vw] shrink-0 snap-center flex-col justify-between p-7 sm:w-[46vw] sm:p-8 lg:w-auto ${
              i === 1 ? "bg-sizzle lg:-translate-y-8" : "bg-coal ring-1 ring-white/10"
            }`}
          >
            <span aria-hidden="true" className={`display text-[7rem] leading-[0.6] ${i === 1 ? "text-ink/40" : "text-sizzle"}`}>
              &ldquo;
            </span>
            <blockquote className="mt-4 text-xl leading-snug font-semibold text-white">{r.quote}</blockquote>
            <p className={`mt-8 text-sm ${i === 1 ? "text-white/80" : "text-white/50"}`}>
              {r.name} <span className="mx-1">/</span> {r.source}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
