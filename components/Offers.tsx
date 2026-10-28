"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, motionQueries } from "@/lib/gsap";
import { offers, isOfferActive, categories, type Offer } from "@/data/site";
import { useOrder } from "@/lib/order";
import { openWhatsAppPanel } from "@/lib/whatsapp-ui";
import { ChatIcon } from "./icons";

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/**
 * Scene E. Offers are filtered on the client against today's date, so a
 * statically built page never keeps showing an expired deal.
 */
export function Offers() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Offer[] | null>(null);
  const { open } = useOrder();

  useEffect(() => {
    setActive(offers.filter((o) => isOfferActive(o)));
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${motionQueries.desktop}, ${motionQueries.mobile}`, () => {
        // the red slab tilts into place as it enters
        gsap.fromTo(
          "[data-offer-slab]",
          { clipPath: "polygon(0 18%, 100% 0, 100% 100%, 0 100%)" },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 25%", scrub: 0.6 },
          },
        );
        gsap.from("[data-offer-title] [data-word]", {
          yPercent: 100,
          stagger: 0.08,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-offer-title]", start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="offers" aria-labelledby="offers-title" className="relative overflow-hidden bg-ink">
      <div data-offer-slab className="relative bg-sizzle">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_80%_20%,#ef2d34_0%,transparent_60%)]" />

        {/* dish marquee */}
        <div aria-hidden="true" className="relative overflow-hidden border-b border-black/20 py-4">
          <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
            {Array.from({ length: 2 }).flatMap((_, r) =>
              Array.from({ length: 3 }).flatMap((__, k) =>
                categories.map((c) => (
                  <span key={`${r}-${k}-${c.id}`} className="display text-4xl text-ink md:text-5xl">
                    {c.name}
                    <span className="ml-10 inline-block h-2 w-2 -translate-y-2 rounded-full bg-white align-middle" />
                  </span>
                )),
              ),
            )}
          </div>
        </div>

        <div className="relative grid gap-12 px-[var(--gutter)] py-20 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:py-32">
          <div>
            <h2 id="offers-title" data-offer-title className="display text-[clamp(4.5rem,13vw,13rem)] text-white">
              {["Deals", "worth", "the", "trip"].map((w) => (
                <span key={w} className="mr-[0.18em] inline-block overflow-hidden align-bottom">
                  <span data-word className="inline-block">
                    {w}
                  </span>
                </span>
              ))}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={open} className="btn btn-dark">
                Start an order
              </button>
              <button type="button" onClick={openWhatsAppPanel} className="btn btn-ghost">
                <ChatIcon className="h-[18px] w-[18px]" />
                Ask about deals
              </button>
            </div>
          </div>

          <div aria-live="polite" className="self-end">
            {active === null ? (
              <div className="space-y-3" aria-label="Loading offers">
                <div className="h-6 w-2/3 animate-pulse bg-black/20" />
                <div className="h-4 w-full animate-pulse bg-black/15" />
                <div className="h-4 w-4/5 animate-pulse bg-black/15" />
              </div>
            ) : active.length === 0 ? (
              <div className="bg-ink p-7 md:p-9">
                <p className="text-xl font-bold text-white">No offers are running right now.</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Current deals will appear here as soon as they start. Meanwhile, the full menu is open for orders.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {active.map((o) => (
                  <li key={o.id} className="bg-ink p-7 md:p-9">
                    <p className="text-2xl font-bold text-white">{o.title}</p>
                    <p className="mt-2 text-white/75">{o.description}</p>
                    <p className="mt-5 text-sm font-semibold text-gold">
                      {fmt(o.validFrom!)} to {fmt(o.validTo!)}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/50">{o.terms}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
