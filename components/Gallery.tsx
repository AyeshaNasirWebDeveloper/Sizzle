"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionQueries } from "@/lib/gsap";
import { gallery, restaurant } from "@/data/site";
import { FoodImage } from "./FoodImage";

// Mosaic slots (desktop 12-col grid). Speeds give each tile its own parallax depth.
const slots = [
  { cls: "md:col-span-5 md:row-span-2 aspect-[4/5] md:aspect-auto", speed: -8 },
  { cls: "md:col-span-4 aspect-square", speed: 10 },
  { cls: "md:col-span-3 aspect-[3/4]", speed: -14 },
  { cls: "md:col-span-3 aspect-square", speed: 16 },
  { cls: "md:col-span-4 aspect-[4/3]", speed: -6 },
  { cls: "md:col-span-7 aspect-[16/9]", speed: 12 },
  { cls: "md:col-span-5 aspect-[4/3]", speed: -10 },
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const insta = restaurant.socials.find((s) => s.label === "Instagram");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${motionQueries.desktop}, ${motionQueries.mobile}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((tile, i) => {
          gsap.from(tile, {
            clipPath: "inset(18% 18% 18% 18%)",
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: tile, start: "top 88%" },
          });
          gsap.fromTo(
            tile.querySelector("[data-tile-img]"),
            { yPercent: -slots[i % slots.length].speed / 2, scale: 1.25 },
            {
              yPercent: slots[i % slots.length].speed / 2,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
        gsap.fromTo(
          "[data-gallery-word]",
          { xPercent: 8 },
          { xPercent: -18, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="gallery-title" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div aria-hidden="true" data-gallery-word className="display pointer-events-none absolute top-6 left-0 text-[30vw] whitespace-nowrap text-white/[0.03]">
        Fresh off the pass
      </div>

      <div className="relative flex flex-col gap-6 px-[var(--gutter)] md:flex-row md:items-end md:justify-between">
        <h2 id="gallery-title" className="display text-[clamp(4rem,15vw,10rem)] text-white lg:text-[clamp(4rem,10vw,10rem)]">
          Hot <span className="text-sizzle">shots</span>
        </h2>
        {insta?.url ? (
          <a href={insta.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mb-3">
            Follow on Instagram
          </a>
        ) : (
          <p className="mb-3 text-sm text-white/45">Instagram: [handle]</p>
        )}
      </div>

      <ul className="relative mt-12 grid grid-cols-2 gap-3 px-[var(--gutter)] md:auto-rows-[minmax(0,1fr)] md:grid-cols-12 md:gap-5">
        {gallery.map((img, i) => (
          <li
            key={img.src}
            data-tile
            className={`group relative overflow-hidden bg-coal ${slots[i % slots.length].cls} ${i === 0 ? "col-span-2" : ""}`}
          >
            <div data-tile-img className="absolute inset-0">
              <FoodImage image={img} sizes="(max-width: 768px) 50vw, 40vw" className="transition-transform duration-[1.4s] ease-[var(--ease-cinema)] group-hover:scale-110" />
            </div>
            <div className="absolute inset-0 bg-sizzle/0 mix-blend-multiply transition-colors duration-500 group-hover:bg-sizzle/25" />
          </li>
        ))}
      </ul>
    </section>
  );
}
