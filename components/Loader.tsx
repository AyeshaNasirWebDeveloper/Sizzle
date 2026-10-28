"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markSiteReady } from "@/lib/ready";

/**
 * A short curtain: wordmark draws in, red bar sweeps, curtain lifts.
 * Total ≤ ~1.3s, skipped entirely for reduced motion and repeat visits
 * within the same tab session. It never blocks interaction — the page
 * underneath is already rendered and scrollable.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let seen = false;
      try {
        seen = sessionStorage.getItem("sn-loaded") === "1";
        sessionStorage.setItem("sn-loaded", "1");
      } catch {
        /* storage unavailable — show the loader */
      }

      const finish = () => {
        setDone(true);
        markSiteReady();
      };

      if (reduce || seen) {
        finish();
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });
      tl.from("[data-loader-char]", { yPercent: 110, stagger: 0.04, duration: 0.6, ease: "expo.out" })
        .fromTo("[data-loader-bar]", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 0.15)
        .add(() => markSiteReady(), 0.8)
        .to(root.current, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 0.75);
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[200] grid place-items-center bg-ink motion-reduce:hidden"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="display flex overflow-hidden text-6xl text-white md:text-8xl">
          {Array.from("Sizzle Nest").map((c, i) => (
            <span key={i} data-loader-char className="inline-block">
              {c === " " ? " " : c}
            </span>
          ))}
        </div>
        <span data-loader-bar className="block h-1 w-40 origin-left bg-sizzle" />
      </div>
    </div>
  );
}
