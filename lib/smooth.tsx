"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth scrolling (Lenis) on every device. Touch screens use Lenis's
 * syncTouch mode (smoothed inertia that stays in sync with the pinned scenes).
 * Reduced-motion users get plain native scrolling.
 * Lenis drives ScrollTrigger from GSAP's ticker so pinned scenes stay in sync.
 */
let instance: Lenis | null = null;

export function setScrollLocked(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (instance) instance.scrollTo(target, { offset: -72, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView();
  }
}

export function SmoothScroll() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* top progress bar — works with or without Lenis */
    const progress = bar.current
      ? gsap.fromTo(
          bar.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: reduce ? true : 0.3 } },
        )
      : null;

    /* in-page links: smooth scroll + keep the hash so deep links still work */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href")!;
      if (hash.length < 2) return;
      const el = document.getElementById(hash.slice(1));
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, "", hash);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      scrollToTarget(el);
    };
    document.addEventListener("click", onClick);

    let tick: ((t: number) => void) | null = null;
    if (!reduce) {
      instance = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        // touch: smoothed momentum scrolling on phones and tablets
        syncTouch: true,
        syncTouchLerp: 0.085,
        touchInertiaExponent: 1.6,
        touchMultiplier: 1.1,
        stopInertiaOnNavigate: true,
      });
      instance.on("scroll", ScrollTrigger.update);
      tick = (t: number) => instance?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis-on");
    }

    return () => {
      document.removeEventListener("click", onClick);
      progress?.scrollTrigger?.kill();
      progress?.kill();
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      document.documentElement.classList.remove("lenis-on");
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[140] h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-ember via-sizzle to-gold"
    />
  );
}
