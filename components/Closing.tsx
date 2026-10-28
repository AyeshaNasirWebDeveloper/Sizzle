"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionQueries } from "@/lib/gsap";
import { images, restaurant, whatsapp } from "@/data/site";
import { useOrder } from "@/lib/order";
import { FoodImage } from "./FoodImage";
import { Wordmark } from "./Nav";

/** Scene F — final statement with the three heroes drifting at different depths, then the footer. */
export function Closing() {
  const root = useRef<HTMLElement>(null);
  const { open } = useOrder();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${motionQueries.desktop}, ${motionQueries.mobile}`, () => {
        const st = { trigger: "[data-close-stage]", start: "top bottom", end: "bottom top", scrub: 0.8 };
        gsap.fromTo("[data-depth='1']", { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-depth='2']", { yPercent: 55, rotate: -14 }, { yPercent: -45, rotate: 8, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-depth='3']", { yPercent: 80 }, { yPercent: -70, ease: "none", scrollTrigger: st });
        gsap.from("[data-close-line]", {
          clipPath: "inset(0 0 100% 0)",
          yPercent: 30,
          stagger: 0.12,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-close-title]", start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  const hours = restaurant.openingHours;
  const socials = restaurant.socials;

  return (
    <section ref={root} id="hungry" aria-labelledby="close-title" className="relative overflow-hidden bg-ink">
      <div data-close-stage className="grain relative flex min-h-[92svh] items-center justify-center px-[var(--gutter)] py-28 lg:min-h-[110svh] lg:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div data-depth="1" className="absolute top-[4%] left-[-14%] aspect-square w-[66vw] max-w-[560px] opacity-80 sm:w-[52vw] md:top-[6%] md:left-[2%] md:w-[46vw]">
            <FoodImage image={images.heroBurger} sizes="46vw" vignette />
          </div>
          <div data-depth="2" className="absolute top-[24%] right-[-24%] aspect-square w-[62vw] max-w-[520px] overflow-hidden rounded-full opacity-90 sm:w-[50vw] md:top-[30%] md:right-[4%] md:w-[44vw]">
            <FoodImage image={images.pizzaAlt} sizes="44vw" />
          </div>
          <div data-depth="3" className="absolute bottom-[2%] left-[10%] aspect-square w-[58vw] max-w-[460px] opacity-80 sm:w-[44vw] md:bottom-[-4%] md:left-[28%] md:w-[38vw]">
            <FoodImage image={images.broast} sizes="38vw" vignette />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(10,10,10,0.85)_0%,transparent_100%)]" />
        </div>

        <div className="relative z-10 text-center">
          <h2 id="close-title" data-close-title className="display text-[clamp(5.5rem,27vw,20rem)] text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] md:text-[clamp(5.5rem,19vw,20rem)]">
            <span data-close-line className="block">Hungry</span>
            <span data-close-line className="block text-sizzle">yet?</span>
          </h2>
          <div className="mx-auto mt-10 grid max-w-sm grid-cols-2 gap-3 md:flex md:max-w-none md:flex-wrap md:justify-center">
            <button type="button" onClick={open} className="btn btn-primary">
              Start an order
            </button>
            <a href="#menu" className="btn btn-ghost">
              See the menu
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- footer ---------------- */}
      <footer className="relative border-t border-white/10 bg-coal px-[var(--gutter)] pt-14 pb-28 md:pt-16 md:pb-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Wordmark className="text-5xl" />
            <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-white/55">{restaurant.tagline}</p>
          </div>

          <FooterBlock title="Find us">
            <p>{restaurant.address ?? "[Address]"}</p>
            <p>{restaurant.city ?? "[City]"}</p>
            {restaurant.mapUrl ? (
              <a href={restaurant.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-white underline decoration-sizzle underline-offset-4">
                Open in Maps
              </a>
            ) : null}
          </FooterBlock>

          <FooterBlock title="Opening hours">
            {hours.length ? (
              hours.map((h) => (
                <p key={h.days} className="flex justify-between gap-6">
                  <span>{h.days}</span>
                  <span className="text-white">{h.hours}</span>
                </p>
              ))
            ) : (
              <p>[Opening hours]</p>
            )}
          </FooterBlock>

          <FooterBlock title="Contact" className="col-span-2 md:col-span-1">
            {restaurant.phone ? (
              <a href={`tel:${restaurant.phone.replace(/\s/g, "")}`} className="block text-white hover:text-gold">
                {restaurant.phone}
              </a>
            ) : (
              <p>[Phone]</p>
            )}
            <p>{whatsapp.number ? `WhatsApp +${whatsapp.number}` : "[WhatsApp number]"}</p>
            {restaurant.email ? (
              <a href={`mailto:${restaurant.email}`} className="block text-white hover:text-gold">
                {restaurant.email}
              </a>
            ) : (
              <p>[Email]</p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-3">
              {socials.map((s) =>
                s.url ? (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold">
                    {s.label}
                  </a>
                ) : (
                  <span key={s.label} className="text-white/30" title="Link not added yet">
                    {s.label}
                  </span>
                ),
              )}
            </div>
          </FooterBlock>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/40 md:flex-row md:justify-between">
          <p>Independent website concept for {restaurant.name}. Not an official site until approved by the restaurant.</p>
          <p>Food photography is illustrative, via Unsplash.</p>
        </div>
      </footer>
    </section>
  );
}

function FooterBlock({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-bold text-gold">{title}</h3>
      <div className="mt-4 space-y-1.5 text-sm text-white/60">{children}</div>
    </div>
  );
}
