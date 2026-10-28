"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { manifesto, images } from "@/data/site";
import { FoodImage } from "./FoodImage";

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const words = manifesto.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-manifesto-text]", start: "top 78%", end: "bottom 45%", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          "[data-manifesto-img]",
          { clipPath: "circle(0% at 50% 50%)", rotate: -20 },
          {
            clipPath: "circle(50% at 50% 50%)",
            rotate: 0,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 55%", scrub: 0.8 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Our kitchen" className="relative bg-ink px-[var(--gutter)] py-24 md:py-40">
      <div className="mx-auto grid max-w-[1500px] items-center gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] md:gap-20">
        <div data-manifesto-img className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full md:w-full">
          <FoodImage image={images.saucePour} sizes="(max-width: 768px) 160px, 25vw" />
        </div>
        <p data-manifesto-text className="text-[clamp(1.75rem,3.6vw,3.6rem)] leading-[1.12] font-bold tracking-[-0.02em] text-white">
          {words.map((w, i) => (
            <span key={i} data-word className="inline">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
