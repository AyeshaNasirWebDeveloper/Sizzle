"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { kitchenSteps } from "@/data/site";
import { FoodImage } from "./FoodImage";

const LARGE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const SMALL = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

/**
 * Large screens: a sticky photo frame on the left; as each text block on the
 * right reaches the middle of the screen, its photo wipes up over the last one.
 * Phones / tablets: each step is a full-bleed photo card with the title set
 * over the bottom of the photo; photos zoom gently as they scroll through.
 */
export function Kitchen() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(LARGE, () => {
        const frames = gsap.utils.toArray<HTMLElement>("[data-kitchen-frame]");
        const blocks = gsap.utils.toArray<HTMLElement>("[data-kitchen-block]");
        frames.forEach((frame, i) => {
          if (i === 0) return;
          const img = frame.querySelector("[data-kitchen-img]");
          const st = { trigger: blocks[i], start: "top 85%", end: "top 35%", scrub: 0.7 };
          gsap.fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st });
          gsap.fromTo(img, { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: st });
        });
        blocks.forEach((b) => {
          gsap.fromTo(
            b.querySelectorAll("[data-kitchen-reveal]"),
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: b, start: "top 70%" } },
          );
          gsap.to(b.querySelector("[data-kitchen-title]"), {
            opacity: 0.15,
            ease: "none",
            scrollTrigger: { trigger: b, start: "bottom 70%", end: "bottom 30%", scrub: true },
          });
        });
      });
      mm.add(SMALL, () => {
        gsap.utils.toArray<HTMLElement>("[data-kitchen-block]").forEach((b) => {
          const card = b.querySelector("[data-kitchen-card]");
          const img = b.querySelector("[data-kitchen-card-img]");
          gsap.from(card, {
            clipPath: "inset(12% 8% 12% 8% round 6px)",
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: b, start: "top 82%" },
          });
          gsap.fromTo(img, { scale: 1.25, yPercent: -6 }, {
            scale: 1.05,
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          });
          gsap.from(b.querySelectorAll("[data-kitchen-reveal]"), {
            y: 36,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: b, start: "top 60%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="kitchen-title" className="relative bg-ink pb-10 lg:pb-0">
      <div className="px-[var(--gutter)] pb-8 lg:pb-0">
        <h2 id="kitchen-title" className="display text-[clamp(4rem,18vw,11rem)] text-white lg:text-[clamp(4rem,11vw,11rem)]">
          From the <span className="text-sizzle">fire</span>
        </h2>
      </div>

      <div className="grid gap-0 px-[var(--gutter)] lg:motion-safe:grid-cols-2 lg:motion-safe:gap-16">
        {/* sticky frame (large screens with motion only) */}
        <div className="hidden lg:motion-safe:block">
          <div className="sticky top-0 flex h-svh items-center">
            <div className="relative aspect-[4/5] max-h-[78svh] w-full overflow-hidden">
              {kitchenSteps.map((step, i) => (
                <div key={step.title} data-kitchen-frame className="absolute inset-0" style={{ zIndex: i }}>
                  <div data-kitchen-img className="h-full w-full">
                    <FoodImage image={step.image} sizes="50vw" />
                  </div>
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 z-10 ring-1 ring-white/10 ring-inset" />
            </div>
          </div>
        </div>

        {/* steps */}
        <div className="grid gap-12 sm:gap-16 lg:motion-safe:block">
          {kitchenSteps.map((step, i) => (
            <article
              key={step.title}
              data-kitchen-block
              className="flex flex-col justify-center lg:motion-safe:min-h-svh"
            >
              {/* photo card — phones, tablets and reduced motion */}
              <div
                data-kitchen-card
                className="relative aspect-[4/5] overflow-hidden rounded-[6px] sm:aspect-[16/11] lg:max-w-3xl lg:motion-safe:hidden"
              >
                <div data-kitchen-card-img className="absolute inset-0">
                  <FoodImage image={step.image} sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span className="display absolute top-4 right-5 text-[5rem] leading-none text-white/15 sm:text-[7rem]">
                  {["Grill", "Fryer", "Oven"][i] ?? ""}
                </span>
              </div>

              <h3
                data-kitchen-title
                className="display relative z-10 -mt-[0.95em] px-4 text-[clamp(3rem,13vw,7rem)] text-white sm:px-6 lg:px-0 lg:text-[clamp(3.2rem,6.5vw,7rem)] lg:motion-safe:mt-0"
              >
                <span data-kitchen-reveal className="block">
                  {step.title}
                </span>
              </h3>
              <span data-kitchen-reveal className="mt-5 ml-4 block h-px w-20 bg-gold sm:ml-6 lg:mt-6 lg:ml-0" />
              <p data-kitchen-reveal className="mt-5 max-w-[42ch] px-4 text-base leading-relaxed text-white/70 sm:px-6 sm:text-lg lg:mt-6 lg:px-0">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
