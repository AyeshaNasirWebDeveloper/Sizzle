"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { categories, images } from "@/data/site";
import { FoodImage } from "./FoodImage";

const thumbs = [images.heroBurger, images.broast, images.pizza, images.wrap, images.drinkAlt];

/**
 * Two crossing "tapes" of dish names. They drift on their own and speed up
 * (and lean) with scroll velocity, then settle back.
 */
export function TapeMarquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tracks = gsap.utils.toArray<HTMLElement>("[data-tape-track]");
      const wrap = gsap.utils.wrap(-50, 0);
      const state = tracks.map((el, i) => ({ el, x: i === 0 ? 0 : -25, dir: i === 0 ? -1 : 1 }));
      let boost = 0;
      let skew = 0;

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          boost = gsap.utils.clamp(-14, 14, v / 260);
          skew = gsap.utils.clamp(-8, 8, v / 400);
        },
      });

      const tick = () => {
        boost *= 0.92;
        skew *= 0.9;
        state.forEach((s) => {
          s.x = wrap(s.x + s.dir * (0.035 + Math.abs(boost) * 0.04) * (boost < 0 ? -1 : 1));
          gsap.set(s.el, { xPercent: s.x, skewX: skew * s.dir });
        });
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root },
  );

  const row = (variant: "solid" | "outline") =>
    Array.from({ length: 2 }).flatMap((_, r) =>
      categories.map((c, i) => (
        <span key={`${variant}-${r}-${c.id}`} className="flex shrink-0 items-center gap-[0.35em] pr-[0.35em]">
          <span className={`display ${variant === "outline" ? "outline-type" : "text-white"}`}>{c.name}</span>
          <span className="relative block h-[0.8em] w-[0.8em] shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
            <FoodImage image={thumbs[i % thumbs.length]} sizes="80px" />
          </span>
        </span>
      )),
    );

  return (
    <section ref={root} aria-hidden="true" className="relative overflow-hidden bg-ink py-16 md:py-24">
      <div className="relative -mx-[5vw] -rotate-3 bg-sizzle py-3 shadow-[0_30px_60px_-20px_rgba(215,25,32,0.5)] md:py-4">
        <div data-tape-track className="flex w-max text-[clamp(2.75rem,7vw,6.5rem)] leading-none will-change-transform">
          {row("solid")}
        </div>
      </div>
      <div className="relative -mx-[5vw] -mt-6 rotate-2 border-y border-white/10 bg-coal py-3 md:-mt-10 md:py-4">
        <div data-tape-track className="flex w-max text-[clamp(2.75rem,7vw,6.5rem)] leading-none will-change-transform">
          {row("outline")}
        </div>
      </div>
    </section>
  );
}
