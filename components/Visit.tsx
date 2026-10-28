"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { restaurant, whatsapp } from "@/data/site";
import { openWhatsAppPanel } from "@/lib/whatsapp-ui";
import { ChatIcon, PhoneIcon, PinIcon, ArrowIcon } from "./icons";

/** Location, hours and every way to get in touch. All details come from data/site.ts. */
export function Visit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-visit-row]", {
          y: 40,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-visit-info]", start: "top 75%" },
        });
        gsap.from("[data-map]", {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-map]", start: "top 80%" },
        });
        gsap.from("[data-map-pin]", {
          y: -80,
          autoAlpha: 0,
          duration: 1,
          ease: "bounce.out",
          delay: 0.9,
          scrollTrigger: { trigger: "[data-map]", start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  const phone = restaurant.phone;

  return (
    <section ref={root} id="visit" aria-labelledby="visit-title" className="relative bg-ink px-[var(--gutter)] py-24 md:py-36">
      <h2 id="visit-title" className="display text-[clamp(4rem,15vw,10rem)] text-white lg:text-[clamp(4rem,10vw,10rem)]">
        Come <span className="text-sizzle">hungry</span>
      </h2>

      <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
        <div data-visit-info className="flex flex-col">
          <dl className="divide-y divide-white/10 border-y border-white/10">
            <div data-visit-row className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
              <dt className="text-sm font-bold text-gold">Address</dt>
              <dd className="text-lg text-white">
                {restaurant.address ?? "[Address]"}
                <span className="block text-white/55">{restaurant.city ?? "[City]"}</span>
              </dd>
            </div>
            <div data-visit-row className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
              <dt className="text-sm font-bold text-gold">Opening hours</dt>
              <dd className="text-lg text-white">
                {restaurant.openingHours.length ? (
                  restaurant.openingHours.map((h) => (
                    <span key={h.days} className="flex justify-between gap-6">
                      <span className="text-white/70">{h.days}</span>
                      <span>{h.hours}</span>
                    </span>
                  ))
                ) : (
                  "[Opening hours]"
                )}
              </dd>
            </div>
            <div data-visit-row className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
              <dt className="text-sm font-bold text-gold">Contact</dt>
              <dd className="space-y-1 text-lg text-white">
                <span className="block">{phone ?? "[Phone]"}</span>
                <span className="block text-white/55">{whatsapp.number ? `WhatsApp +${whatsapp.number}` : "[WhatsApp number]"}</span>
              </dd>
            </div>
          </dl>

          <div data-visit-row className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={openWhatsAppPanel} className="btn bg-[#25D366] text-ink">
              <ChatIcon className="h-5 w-5" />
              Chat on WhatsApp
            </button>
            {phone ? (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="btn btn-ghost">
                <PhoneIcon />
                Call
              </a>
            ) : (
              <button type="button" disabled className="btn btn-ghost" title="Phone number not added yet">
                <PhoneIcon />
                Call
              </button>
            )}
            {restaurant.mapUrl ? (
              <a href={restaurant.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <PinIcon />
                Get directions
              </a>
            ) : null}
          </div>
        </div>

        {/* stylised map card — replace with a real map embed or link via restaurant.mapUrl */}
        <div data-map className="map-grid relative min-h-[320px] overflow-hidden ring-1 ring-white/10 sm:min-h-[420px] lg:min-h-0">
          <svg aria-hidden="true" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <path d="M-20 340 C 120 300, 200 380, 330 300 S 520 180, 640 220" stroke="rgba(255,255,255,0.12)" strokeWidth="18" fill="none" />
            <path d="M180 -20 C 220 120, 160 260, 260 520" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
            <path d="M420 -20 L 380 520" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
            <path d="M-20 140 L 640 120" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          </svg>
          <div data-map-pin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <span className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-sizzle/60 pin-ping" />
            <span className="relative grid h-14 w-14 place-items-center rounded-full rounded-br-none bg-sizzle text-white shadow-[0_10px_30px_rgba(215,25,32,0.6)] [transform:rotate(45deg)]">
              <span className="display -rotate-45 text-xl">SN</span>
            </span>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 bg-ink/85 px-4 py-3 backdrop-blur">
            <p className="text-sm text-white/70">{restaurant.address ?? "[Map location]"}</p>
            {restaurant.mapUrl && (
              <a href={restaurant.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-white hover:text-gold">
                Open in Maps <ArrowIcon className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
