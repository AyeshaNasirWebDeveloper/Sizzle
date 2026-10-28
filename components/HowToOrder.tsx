"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { orderSteps, menuItems, restaurant } from "@/data/site";
import { buildWhatsAppMessage, useOrder } from "@/lib/order";
import { openWhatsAppPanel } from "@/lib/whatsapp-ui";
import { ChatIcon } from "./icons";

// An example order, written exactly the way the real order tray writes it.
const sample = buildWhatsAppMessage(
  [
    { key: "a", item: menuItems.find((m) => m.id === "b3")!, variant: null, qty: 2 },
    { key: "b", item: menuItems.find((m) => m.id === "c2")!, variant: null, qty: 1 },
  ],
  "Extra garlic dip",
);

/** The three ordering steps, with a phone showing what the WhatsApp message looks like. */
export function HowToOrder() {
  const root = useRef<HTMLElement>(null);
  const { open } = useOrder();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-step-line]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
        );
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 72%" } });
          tl.from(el.querySelector("[data-step-num]"), { scale: 0, rotate: -90, duration: 0.8, ease: "back.out(2)" }).from(
            el.querySelectorAll("[data-step-text]"),
            { x: 30, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: "expo.out" },
            0.1,
          );
        });
        const phone = gsap.timeline({ scrollTrigger: { trigger: "[data-phone]", start: "top 70%" } });
        phone
          .from("[data-phone]", { y: 120, rotate: 8, autoAlpha: 0, duration: 1.2, ease: "expo.out" })
          .from("[data-bubble]", { y: 20, scale: 0.9, autoAlpha: 0, transformOrigin: "100% 100%", duration: 0.6, ease: "back.out(1.6)" }, 0.6)
          .from("[data-typing]", { autoAlpha: 0, duration: 0.4 }, 1.3);
        gsap.to("[data-phone]", {
          y: -60,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="how" aria-labelledby="how-title" className="relative overflow-hidden bg-ink px-[var(--gutter)] py-24 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 right-[-10%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(37,211,102,0.12)_0%,transparent_65%)]" />

      <div className="relative grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
        <div>
          <h2 id="how-title" className="display text-[clamp(4rem,15vw,10rem)] text-white lg:text-[clamp(4rem,10vw,10rem)]">
            Order in <span className="text-sizzle">three</span> taps
          </h2>

          <ol data-steps className="relative mt-14 space-y-12">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[27px] w-px bg-white/10">
              <span data-step-line className="block h-full w-full origin-top bg-sizzle" />
            </span>
            {orderSteps.map((s, i) => (
              <li key={s.title} data-step className="relative grid grid-cols-[56px_1fr] gap-6">
                <span
                  data-step-num
                  className="display relative z-10 grid h-14 w-14 place-items-center rounded-full bg-sizzle text-3xl text-white shadow-[0_0_0_8px_#0a0a0a]"
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h3 data-step-text className="text-2xl font-bold text-white md:text-3xl">
                    {s.title}
                  </h3>
                  <p data-step-text className="mt-2 max-w-[44ch] leading-relaxed text-white/60">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap gap-3">
            <button type="button" onClick={open} className="btn btn-primary">
              Start an order
            </button>
            <button type="button" onClick={openWhatsAppPanel} className="btn btn-ghost">
              <ChatIcon className="h-[18px] w-[18px] text-[#25D366]" />
              Ask a question
            </button>
          </div>
        </div>

        {/* phone mock-up showing the message format */}
        <div className="relative mx-auto w-full max-w-[340px]">
          <div
            data-phone
            className="relative rounded-[44px] bg-[#1d1d1d] p-3 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.95),inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          >
            <div className="overflow-hidden rounded-[34px] bg-[#0b141a]">
              <div className="flex items-center gap-3 bg-[#1f2c34] px-4 pt-8 pb-3">
                <span className="display grid h-9 w-9 place-items-center rounded-full bg-sizzle text-lg text-white">SN</span>
                <div>
                  <p className="text-sm font-semibold text-white">{restaurant.name}</p>
                  <p className="text-[11px] text-white/50">WhatsApp</p>
                </div>
              </div>
              <div className="min-h-[380px] space-y-3 bg-[radial-gradient(circle_at_30%_20%,#13202a_0%,#0b141a_70%)] px-3 py-5">
                <p className="mx-auto w-fit rounded-md bg-[#1f2c34] px-2 py-1 text-[10px] text-white/50">Example message</p>
                <div data-bubble className="ml-auto max-w-[88%] rounded-lg rounded-tr-none bg-[#005c4b] px-3 py-2 text-[12.5px] leading-snug whitespace-pre-line text-white">
                  {sample}
                  <span className="mt-1 block text-right text-[10px] text-white/55">✓✓</span>
                </div>
                <div data-typing className="typing flex w-fit gap-1 rounded-lg rounded-tl-none bg-[#1f2c34] px-3 py-3" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-white/40">Illustration of the message your order creates.</p>
        </div>
      </div>
    </section>
  );
}
