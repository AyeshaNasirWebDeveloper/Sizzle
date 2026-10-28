"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, motionQueries } from "@/lib/gsap";
import { signaturePicks, menuItems, categories, formatPrice } from "@/data/site";
import { useOrder } from "@/lib/order";
import { FoodImage } from "./FoodImage";

/**
 * Every screen size: the section pins and the row of dishes slides sideways
 * as you scroll down. Reduced motion: a native swipeable rail with snap points.
 */
export function Signature() {
  const root = useRef<HTMLElement>(null);
  const picks = signaturePicks
    .map((p) => ({ ...p, item: menuItems.find((m) => m.id === p.itemId) }))
    .filter((p): p is typeof p & { item: NonNullable<typeof p.item> } => !!p.item && p.item.available);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${motionQueries.desktop}, ${motionQueries.mobile}`, () => {
        const track = root.current!.querySelector<HTMLElement>("[data-sig-track]")!;
        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: window.innerWidth < 768 ? 0.5 : 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // each photo drifts inside its frame as the row moves
        gsap.utils.toArray<HTMLElement>("[data-sig-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
        gsap.to("[data-sig-bar]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="signature" aria-labelledby="sig-title" className="relative overflow-hidden bg-coal">
      <div className="flex min-h-svh flex-col justify-center pt-20 pb-8 lg:py-0">
        <div
          data-sig-track
          data-lenis-prevent-horizontal
          className="no-scrollbar flex items-stretch gap-4 px-[var(--gutter)] will-change-transform sm:gap-6 lg:gap-8 motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto"
        >
          {/* intro panel */}
          <div className="flex w-[min(80vw,52svh)] shrink-0 snap-start flex-col justify-end sm:w-[min(56vw,52svh)] lg:w-[34vw]">
            <span className="mb-5 flex items-center gap-3 text-xs text-white/50 lg:hidden">
              <span className="relative block h-px w-10 overflow-hidden bg-white/20">
                <span className="swipe-cue absolute inset-y-0 left-0 w-1/2 bg-sizzle" />
              </span>
              Keep scrolling
            </span>
            <h2 id="sig-title" className="display text-[clamp(4.5rem,18vw,10rem)] text-white sm:text-[clamp(4.5rem,11.5vw,8rem)] lg:text-[clamp(4rem,9vw,10rem)]">
              Signature <span className="block text-sizzle">picks</span>
            </h2>
            <p className="mt-6 max-w-[34ch] text-white/60">
              The dishes we&apos;d point you to first. Add one straight to your order, or keep scrolling.
            </p>
          </div>

          {picks.map((p) => (
            <SigCard key={p.itemId} pick={p} />
          ))}

          {/* end panel */}
          <div className="flex w-[min(70vw,44svh)] shrink-0 snap-start flex-col items-start justify-center gap-6 pr-[var(--gutter)] sm:w-[min(44vw,44svh)] lg:w-[28vw]">
            <p className="display text-[clamp(3rem,6vw,6rem)] text-white/90">Still deciding?</p>
            <a href="#menu" className="btn btn-primary">
              See the full menu
            </a>
          </div>
        </div>

        <div className="mx-[var(--gutter)] mt-8 h-px bg-white/10 motion-reduce:hidden lg:mt-10">
          <div data-sig-bar className="h-full origin-left scale-x-0 bg-sizzle" />
        </div>
      </div>
    </section>
  );
}

function SigCard({ pick }: { pick: { item: (typeof menuItems)[number]; image: (typeof signaturePicks)[number]["image"] } }) {
  const { add } = useOrder();
  const [added, setAdded] = useState(false);
  const { item } = pick;
  const cat = categories.find((c) => c.id === item.category);
  const firstVariant = item.variants?.[0];

  return (
    <article className="group relative flex w-[min(80vw,50svh)] shrink-0 snap-start flex-col sm:w-[min(48vw,48svh)] lg:w-[min(26vw,54svh)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink">
        <div data-sig-img className="absolute -inset-x-[14%] inset-y-0 transition-transform duration-[1.2s] ease-[var(--ease-cinema)] group-hover:scale-105">
          <FoodImage image={pick.image} sizes="(max-width: 768px) 80vw, 30vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {cat?.name}
        </span>
        <div className="absolute inset-x-5 bottom-5">
          <h3 className="display text-[clamp(2.4rem,9vw,3.6rem)] text-white sm:text-[clamp(2.6rem,5vw,3.6rem)] lg:text-[clamp(2.4rem,3.4vw,3.6rem)]">{item.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/65">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
        <span className="font-semibold text-gold">
          {firstVariant ? `${firstVariant.label} ${formatPrice(firstVariant.price)}` : formatPrice(item.price)}
        </span>
        <button
          type="button"
          onClick={() => {
            add(item.id, firstVariant?.label ?? null);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1400);
          }}
          aria-label={`Add ${item.name}${firstVariant ? `, ${firstVariant.label},` : ""} to order`}
          className="btn btn-primary min-h-11 px-4 text-sm"
        >
          {added ? "Added" : "Add to order"}
        </button>
      </div>
    </article>
  );
}
