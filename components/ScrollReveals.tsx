"use client";

import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Shared entrance for section headings and intro copy, on every screen size:
 * headings rise out of a mask, then supporting text fades up. Sections with
 * their own heading choreography (story, offers, closing, signature, kitchen)
 * opt out by not matching the selector.
 */
const HEADINGS =
  "#manifesto-skip, #menu-title, #how-title, #reviews-title, #gallery-title, #faq-title, #visit-title";

export function ScrollReveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(HEADINGS).forEach((h) => {
        gsap.fromTo(
          h,
          { clipPath: "inset(0% 0% 100% 0%)", yPercent: 30 },
          {
            clipPath: "inset(0% 0% -10% 0%)",
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: h, start: "top 88%" },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-fade-up]").forEach((el) => {
        gsap.from(el, {
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    });
  });
  return null;
}
