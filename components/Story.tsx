"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, motionQueries } from "@/lib/gsap";
import { images, restaurant, heroContent } from "@/data/site";
import { FoodImage } from "./FoodImage";
import { SplitChars } from "./SplitChars";
import { useOrder } from "@/lib/order";
import { onSiteReady } from "@/lib/ready";
import { openWhatsAppPanel } from "@/lib/whatsapp-ui";
import { Embers } from "./Embers";
import { SpinBadge } from "./SpinBadge";
import { ChatIcon } from "./icons";

/**
 * Scenes A–C: burger hero → burger-to-broast → broast-to-pizza.
 *
 * Layer order inside the pinned stage (bottom → top):
 *   burger scene · red wipe · broast scene · pizza scene · burger image (lifted)
 * The burger photo is lifted above the wipe so it can travel off-frame while the
 * red rises; it has fully left the frame before the broast mask opens, so the two
 * foods never overlap.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);
  const { open } = useOrder();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      /* ---------- hero entrance (runs once the loader has lifted) ---------- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        intro
          .from(q("[data-hero-line] [data-char]"), { yPercent: 110, duration: 1.1, stagger: 0.035 })
          .from(q("[data-hero-reveal]"), { scale: 1.12, autoAlpha: 0, duration: 1.4 }, 0.1)
          .from(q("[data-hero-ring-in]"), { scale: 0.6, autoAlpha: 0, duration: 1.6 }, 0.15)
          .from(q("[data-hero-copy] > *"), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.45)
          .from(q("[data-hero-meta] > *"), { y: -12, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 0.5)
          .from(q("[data-hero-embers]"), { autoAlpha: 0, duration: 2 }, 0.3)
          .from(q('[data-hero-side="left"]'), { xPercent: -140, rotate: -25, autoAlpha: 0, duration: 1.4 }, 0.35)
          .from(q('[data-hero-side="right"]'), { xPercent: 140, rotate: 25, autoAlpha: 0, duration: 1.4 }, 0.45)
          .from(q("[data-hero-badge]"), { scale: 0, rotate: -120, duration: 1.3, ease: "back.out(1.6)" }, 0.7)
          .from(q("[data-hero-sheen]"), { autoAlpha: 0, duration: 0.6 }, 1.2)
          .from(q("[data-progress]"), { autoAlpha: 0, duration: 0.8 }, 0.8);
        const off = onSiteReady(() => intro.play());
        return () => off();
      });

      /* ---------- desktop pointer parallax on the hero burger ---------- */
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const el = q("[data-hero-parallax]")[0];
        const ring = q("[data-hero-ring-in]")[0];
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" });
        const rxTo = gsap.quickTo(ring, "x", { duration: 1.6, ease: "power3.out" });
        const spot = q("[data-hero-spot]")[0] as HTMLElement | undefined;
        const depth = q("[data-depth-x]").map((n) => {
          const k = parseFloat(n.getAttribute("data-depth-x") || "1");
          return {
            k,
            x: gsap.quickTo(n, "x", { duration: 1.4, ease: "power3.out" }),
            y: gsap.quickTo(n, "y", { duration: 1.4, ease: "power3.out" }),
          };
        });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          xTo(nx * 28);
          yTo(ny * 18);
          rxTo(nx * -14);
          depth.forEach((d) => {
            d.x(nx * 40 * d.k);
            d.y(ny * 30 * Math.abs(d.k));
          });
          if (spot) {
            spot.style.opacity = "1";
            spot.style.setProperty("--mx", `${e.clientX}px`);
            spot.style.setProperty("--my", `${e.clientY}px`);
          }
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });

      /* ---------- the pinned, scrubbed story ---------- */
      const build = (isMobile: boolean) => {
        const wipe = q("[data-wipe]")[0];
        const broast = q('[data-scene="broast"]')[0];
        const pizza = q('[data-scene="pizza"]')[0];

        gsap.set([broast, pizza], { visibility: "visible" });
        gsap.set(wipe, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(broast, { clipPath: "circle(0% at 62% 52%)" });
        gsap.set(pizza, { clipPath: "circle(0% at 50% 55%)" });
        gsap.set(q("[data-broast-img]"), { scale: 1.3 });
        gsap.set(q("[data-pizza-img]"), { scale: 1.45, rotate: -38 });
        gsap.set(q('[data-scene="broast"] [data-char], [data-scene="pizza"] [data-char]'), { yPercent: 110 });
        gsap.set(q("[data-broast-copy] > *, [data-pizza-copy] > *"), { y: 30, autoAlpha: 0 });

        const burgerStage = q("[data-hero-stage]")[0];
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: isMobile ? "+=260%" : "+=520%",
            pin: true,
            scrub: isMobile ? 0.5 : 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const idx = p < 0.3 ? 0 : p < 0.68 ? 1 : 2;
              q("[data-progress-item]").forEach((n, i) => n.toggleAttribute("data-active", i === idx));
            },
          },
        });

        /* A → B : burger steps aside, red floods the frame */
        tl.to(q("[data-hero-line]"), { yPercent: -18, autoAlpha: 0, stagger: 0.05, duration: 0.8 }, 0)
          .to(q("[data-hero-copy]"), { y: -40, autoAlpha: 0, duration: 0.5 }, 0)
          .to(q("[data-hero-ring]"), { scale: 0.4, autoAlpha: 0, duration: 0.7 }, 0)
          .to(q("[data-hero-meta]"), { autoAlpha: 0, duration: 0.4 }, 0)
          .to(q("[data-hero-badge]"), { scale: 0.3, rotate: 180, autoAlpha: 0, duration: 0.6 }, 0)
          .to(q('[data-hero-side="left"]'), { xPercent: -160, rotate: -30, autoAlpha: 0, duration: 0.8 }, 0)
          .to(q('[data-hero-side="right"]'), { xPercent: 160, rotate: 30, autoAlpha: 0, duration: 0.8 }, 0)
          .to(q("[data-hero-embers]"), { autoAlpha: 0, duration: 0.6 }, 0.3)
          .to(
            q("[data-hero-burger]"),
            {
              scale: isMobile ? 0.55 : 0.48,
              x: isMobile ? "-18vw" : "-34vw",
              y: isMobile ? "-8vh" : "6vh",
              rotate: isMobile ? 0 : -9,
              duration: 1,
              ease: "power2.inOut",
            },
            0.1,
          )
          // over red, let the photo's black backdrop drop out so only the food shows
          .set(burgerStage, { mixBlendMode: "lighten" }, 0.55)
          .to(wipe, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power2.inOut" }, 0.55)
          .to(
            q("[data-hero-burger]"),
            { x: isMobile ? "-90vw" : "-75vw", autoAlpha: 0, duration: 0.6, ease: "power2.in" },
            1.15,
          )

          /* broast opens through a circular mask while the frame is red */
          .to(broast, { clipPath: "circle(85% at 62% 52%)", duration: 1, ease: "power2.inOut" }, 1.6)
          .to(q("[data-broast-img]"), { scale: 1, duration: 1.4, ease: "power2.out" }, 1.6)
          .to(q('[data-scene="broast"] [data-char]'), { yPercent: 0, stagger: 0.04, duration: 0.6, ease: "expo.out" }, 1.95)
          .to(wipe, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "power2.inOut" }, 2.2)
          .to(q("[data-broast-copy] > *"), { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }, 2.35)

          /* hold on broast */
          .to({}, { duration: 0.9 }, 2.9)

          /* B → C : broast drifts back, pizza spins up through a lens */
          .to(q("[data-broast-img]"), { scale: 0.86, x: window.innerWidth >= 1024 ? "-6vw" : 0, duration: 1, ease: "power2.in" }, 3.8)
          .to(q('[data-scene="broast"] h2'), { yPercent: -14, autoAlpha: 0, duration: 0.6 }, 3.8)
          .to(q("[data-broast-copy]"), { y: -30, autoAlpha: 0, duration: 0.5 }, 3.8)
          .to(pizza, { clipPath: "circle(110% at 50% 55%)", duration: 1.2, ease: "power3.inOut" }, 4.15)
          .to(q("[data-pizza-img]"), { scale: 1, rotate: 0, duration: 1.6, ease: "power2.out" }, 4.15)
          .to(q('[data-scene="pizza"] [data-char]'), { yPercent: 0, stagger: 0.04, duration: 0.6, ease: "expo.out" }, 4.65)
          .to(q("[data-pizza-copy] > *"), { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }, 4.9)

          /* gentle parallax drift through the final hold */
          .to(q("[data-pizza-img]"), { rotate: 12, duration: 1 }, 5.5)
          .to(q('[data-scene="pizza"] h2'), { xPercent: -3, duration: 1 }, 5.5);

        return () => tl.scrollTrigger?.kill();
      };

      mm.add(motionQueries.desktop, () => build(false));
      mm.add(motionQueries.mobile, () => build(true));

      // Fonts change the height of the giant type; recalc once they load.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <section ref={root} className="story bg-ink" data-cinematic="true" aria-label="Signature dishes">
      {/* ================= Scene A · burger =================
          The name is set like a bun: "Sizzle" sits behind the burger,
          "Nest" sits in front of it, so the food is literally inside the name. */}
      <div data-scene="burger" className="story-scene grain flex flex-col bg-ink pt-20 md:pt-24">
        {/* ambient light: heat glow + cursor spotlight */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_52%,#2a0f0f_0%,transparent_70%)]" />
          <div className="heat-blob heat-blob-a" />
          <div className="heat-blob heat-blob-b" />
          <div data-hero-spot className="hero-spot absolute inset-0 opacity-0 transition-opacity duration-700" />
        </div>

        <h1 className="sr-only">Sizzle Nest — {restaurant.tagline}</h1>

        {/* top meta rail */}
        <div data-hero-meta className="relative z-[37] flex items-center justify-center px-[var(--gutter)] text-[11px] text-white/55 md:justify-between md:text-xs">
          <span className="flex items-center gap-2.5 rounded-full bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/10 md:bg-transparent md:p-0 md:ring-0">
            <span className="h-1.5 w-1.5 rounded-full bg-sizzle shadow-[0_0_12px_2px_rgba(215,25,32,0.8)]" />
            {heroContent.kicker}
          </span>
          <span className="hidden md:inline">Order in a few taps on WhatsApp</span>
        </div>

        <div aria-hidden="true" data-hero-line className="display relative z-0 text-center text-[length:var(--hero-type)] text-white md:mt-1">
          <span className="relative inline-block">
            <SplitChars text="Sizzle" />
            {/* light sweep, layered over the letters as plain text so it can be clipped */}
            <span data-hero-sheen className="hero-sheen absolute inset-0 whitespace-nowrap">
              Sizzle
            </span>
          </span>
        </div>

        {/* embers rise behind the food and in front of the back type */}
        <div data-hero-embers aria-hidden="true" className="pointer-events-none absolute inset-0 z-[34]">
          <Embers />
        </div>

        {/* floating sides */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[33]">
          <div data-hero-side="left" className="absolute top-[56%] left-[-5%] aspect-square w-[30vw] sm:top-[54%] sm:left-[2%] sm:w-[22vw] lg:top-[52%] lg:left-[6%] lg:w-[min(17vw,240px)]">
            <div data-depth-x="-1.6" className="h-full w-full">
              <div className="side-float h-full w-full">
                <FoodImage image={images.fries} sizes="(max-width: 640px) 30vw, 17vw" vignette eager />
              </div>
            </div>
          </div>
          <div data-hero-side="right" className="absolute top-[19%] left-[5%] aspect-square w-[19vw] sm:top-[22%] sm:right-[5%] sm:left-auto sm:w-[16vw] lg:top-[24%] lg:right-[7%] lg:w-[min(14vw,200px)]">
            <div data-depth-x="1.8" className="h-full w-full">
              <div className="side-float side-float-late h-full w-full overflow-hidden rounded-full">
                <FoodImage image={images.drinkAlt} sizes="(max-width: 640px) 20vw, 14vw" eager />
              </div>
            </div>
          </div>
        </div>

        {/* burger, centred between the two lines */}
        <div data-hero-stage className="pointer-events-none absolute inset-0 z-[35] grid place-items-center">
          <div data-hero-ring aria-hidden="true" className="absolute aspect-square w-[min(84vw,58svh)]">
            <div data-hero-ring-in className="ring-dash h-full w-full rounded-full border border-gold/30" />
          </div>
          <div data-hero-burger className="relative aspect-square w-[min(96vw,66svh)] will-change-transform">
            {/* steam */}
            <div aria-hidden="true" className="absolute inset-x-[30%] -top-[6%] z-10 flex h-[28%] justify-between">
              <span className="steam" />
              <span className="steam steam-2" />
              <span className="steam steam-3" />
            </div>
            <div data-hero-parallax className="absolute inset-0">
              <div className="hero-float h-full w-full">
                <div data-hero-reveal className="h-full w-full">
                  <FoodImage image={images.heroBurger} sizes="(max-width: 768px) 96vw, 66vh" preload vignette />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div aria-hidden="true" data-hero-line className="display relative z-[36] text-center text-[length:var(--hero-type)] text-sizzle drop-shadow-[0_20px_60px_rgba(215,25,32,0.35)]">
          <SplitChars text="Nest" />
        </div>

        {/* rotating order badge */}
        <div data-hero-badge className="absolute top-[28%] right-[var(--gutter)] z-[38] w-[84px] sm:top-auto sm:right-[10%] sm:bottom-[30%] sm:w-28 lg:right-[16%] lg:w-36">
          <SpinBadge text={heroContent.badge} label="Start an order" onClick={open} className="w-full" />
        </div>

        {/* intro + CTAs */}
        <div
          data-hero-copy
          className="relative z-[37] mt-5 flex flex-col gap-4 px-[var(--gutter)] pb-6 text-center sm:pb-8 md:mt-4 md:flex-row md:items-end md:justify-between md:text-left lg:grid lg:grid-cols-[1fr_auto_1fr] lg:pb-10"
        >
          <p className="mx-auto max-w-[34ch] text-[0.92rem] leading-relaxed text-white/75 md:mx-0 md:text-base">
            {restaurant.tagline} Pick what you&apos;re craving and send the order on WhatsApp.
          </p>
          <div aria-hidden="true" className="hidden flex-col items-center gap-2 text-xs text-white/50 lg:flex">
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-white/15">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-sizzle" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-end">
            <a href="#menu" className="btn btn-primary px-4 sm:px-6">See the menu</a>
            <button type="button" onClick={openWhatsAppPanel} className="btn btn-ghost px-4 sm:px-6">
              <ChatIcon className="h-[18px] w-[18px] shrink-0 text-[#25D366]" />
              <span className="sm:hidden">WhatsApp</span>
              <span className="hidden sm:inline">Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* red wipe between burger and broast */}
      <div data-wipe aria-hidden="true" className="story-wipe absolute inset-0 z-30 bg-sizzle">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_60%_50%,#e8262d_0%,#a3121a_100%)]" />
      </div>

      {/* ================= Scene B · broast ================= */}
      <div data-scene="broast" className="story-scene grain z-40 bg-ink">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_62%_52%,#2b1a0c_0%,transparent_72%)]" />

        <div className="relative grid h-full grid-rows-[minmax(0,1fr)_auto] px-[var(--gutter)] pt-20 pb-8 sm:pb-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-1 lg:items-center lg:gap-4 lg:pt-20 lg:pb-10">
          <div className="relative z-10 order-2 -mt-[12svh] lg:order-1 lg:mt-0">
            <h2 className="display text-[clamp(4.5rem,21vw,13rem)] text-white lg:text-[clamp(4.5rem,12.5vw,13rem)]">
              <SplitChars text="Broast" />
            </h2>
            <div data-broast-copy className="mt-4 max-w-[38ch] space-y-5 sm:text-lg lg:mt-5 lg:max-w-[34ch] lg:text-base">
              <span className="block h-px w-16 bg-gold" />
              <p className="text-white/75">
                Golden crust that cracks when you bite in, juicy all the way through. Served with fries, a soft bun
                and garlic dip.
              </p>
              <a href="#menu-broast" className="btn btn-primary">See broast meals</a>
            </div>
          </div>
          <div className="relative order-1 min-h-[46svh] lg:order-2 lg:h-[78svh] lg:min-h-0">
            <div data-broast-img className="absolute inset-0 will-change-transform">
              <FoodImage image={images.broast} sizes="(max-width: 1024px) 100vw, 60vw" vignette eager />
            </div>
          </div>
        </div>
      </div>

      {/* ================= Scene C · pizza ================= */}
      <div data-scene="pizza" className="story-scene grain z-50 bg-coal">

        <div className="relative grid h-full grid-rows-[minmax(0,1fr)_auto] gap-6 px-[var(--gutter)] pt-24 pb-8 sm:pb-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:grid-rows-1 lg:items-center lg:gap-4 lg:pt-20 lg:pb-10">
          <div className="relative m-auto aspect-square w-[min(80vw,44svh)] sm:w-[min(68vw,46svh)] lg:w-[min(46vw,76svh)]">
            <div data-pizza-img className="absolute inset-0 overflow-hidden rounded-full will-change-transform shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
              <FoodImage image={images.pizza} sizes="(max-width: 1024px) 80vw, 46vw" eager />
            </div>
            <div aria-hidden="true" className="absolute -inset-3 rounded-full border border-gold/25 sm:-inset-5 lg:-inset-8" />
          </div>
          <div className="relative z-10">
            <h2 className="display text-[clamp(4.5rem,21vw,13rem)] text-white lg:text-[clamp(4.5rem,12.5vw,13rem)]">
              <SplitChars text="Pizza" />
            </h2>
            <div data-pizza-copy className="mt-4 max-w-[38ch] space-y-5 sm:text-lg lg:mt-5 lg:max-w-[34ch] lg:text-base">
              <span className="block h-px w-16 bg-gold" />
              <p className="text-white/75">
                Blistered crust, molten cheese and toppings stacked to the edge. Sliced and boxed while it&apos;s
                still bubbling.
              </p>
              <a href="#menu-pizza" className="btn btn-primary">See pizzas</a>
            </div>
          </div>
        </div>
      </div>

      {/* scene progress — a real sequence, so it is numbered by dish */}
      <nav
        data-progress
        aria-label="Story progress"
        className="pointer-events-none absolute top-1/2 right-[var(--gutter)] z-[60] hidden -translate-y-1/2 flex-col gap-3 text-right motion-safe:lg:flex"
      >
        {["Burger", "Broast", "Pizza"].map((label, i) => (
          <span
            key={label}
            data-progress-item
            {...(i === 0 ? { "data-active": "" } : {})}
            className="group flex items-center justify-end gap-3 text-xs text-white/35 transition-colors duration-500 data-[active]:text-white"
          >
            {label}
            <span className="h-px w-5 bg-current transition-all duration-500 group-data-[active]:w-10 group-data-[active]:bg-gold" />
          </span>
        ))}
      </nav>
    </section>
  );
}
