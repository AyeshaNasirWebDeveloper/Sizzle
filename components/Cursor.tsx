"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Desktop-only follower ring. It never replaces the system cursor, so
 * precision and accessibility are unaffected. Hidden on touch devices
 * and for reduced motion.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)");
    if (!ok.matches || !ring.current) return;
    const el = ring.current;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let hovering = false;

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const interactive = !!(e.target as Element | null)?.closest?.("a, button, [role='tab']");
      if (interactive !== hovering) {
        hovering = interactive;
        gsap.to(el, { scale: interactive ? 1.8 : 1, backgroundColor: interactive ? "rgba(215,25,32,0.18)" : "rgba(215,25,32,0)", duration: 0.35 });
      }
    };
    const show = () => gsap.to(el, { autoAlpha: 1, duration: 0.3 });
    const hide = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerenter", show);
    document.addEventListener("pointerleave", hide);
    show();
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerenter", show);
      document.removeEventListener("pointerleave", hide);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[300] -mt-4 -ml-4 hidden h-8 w-8 rounded-full border border-sizzle opacity-0 md:block"
    />
  );
}
