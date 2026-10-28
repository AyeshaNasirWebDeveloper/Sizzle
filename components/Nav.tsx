"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useOrder } from "@/lib/order";
import { setScrollLocked } from "@/lib/smooth";
import { openWhatsAppPanel } from "@/lib/whatsapp-ui";
import { ChatIcon } from "./icons";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#how", label: "How to order" },
  { href: "#offers", label: "Offers" },
  { href: "#visit", label: "Visit" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display inline-flex items-baseline gap-[0.18em] leading-none ${className}`}>
      <span className="text-white">Sizzle</span>
      <span className="text-sizzle">Nest</span>
    </span>
  );
}

export function Nav() {
  const { count, open } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    setScrollLocked(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      setScrollLocked(false);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,backdrop-filter] duration-500 ${
        scrolled ? "bg-ink/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="flex h-16 items-center justify-between px-[var(--gutter)] md:h-20">
        <a href="#top" aria-label="Sizzle Nest — back to top" className="text-3xl md:text-4xl">
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group relative py-2 text-sm text-white/80 transition-colors hover:text-white">
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-sizzle transition-transform duration-500 ease-[var(--ease-cinema)] group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openWhatsAppPanel}
            aria-label="Chat on WhatsApp"
            className="hidden h-11 w-11 place-items-center rounded-full text-[#25D366] ring-1 ring-white/15 transition-colors hover:bg-[#25D366] hover:text-ink md:grid"
          >
            <ChatIcon className="h-5 w-5" />
          </button>
          <button type="button" onClick={open} className="btn btn-primary min-h-11 px-4 text-sm">
            Order
            {count > 0 && (
              <span aria-label={`${count} items`} className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs text-ink">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center md:hidden"
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-16 bottom-0 flex flex-col justify-between bg-sizzle px-[var(--gutter)] pt-10 pb-10 md:hidden"
          >
            <ul className="space-y-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={l.href} onClick={() => setMenuOpen(false)} className="display block py-1 text-6xl text-white">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openWhatsAppPanel();
                }}
                className="btn w-full bg-[#25D366] text-ink"
              >
                <ChatIcon className="h-5 w-5" />
                Chat on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  open();
                }}
                className="btn btn-dark w-full"
              >
                Start an order
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
