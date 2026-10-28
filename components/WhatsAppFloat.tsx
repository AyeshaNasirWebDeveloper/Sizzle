"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { restaurant, whatsapp, whatsappHref } from "@/data/site";
import { useOrder } from "@/lib/order";
import { onSiteReady } from "@/lib/ready";
import { onWhatsAppPanelRequest } from "@/lib/whatsapp-ui";
import { ChatIcon, ArrowIcon } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Floating WhatsApp contact. Opens a small panel of one-tap starter messages.
 * While no number is configured the starters are disabled and the panel says
 * so, rather than opening a broken wa.me link.
 */
export function WhatsAppFloat() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { count, open: openTray, isOpen: trayOpen } = useOrder();
  const configured = whatsappHref("x") !== null;

  // Appears once the visitor scrolls past the hero (the hero has its own WhatsApp button).
  const [ready, setReady] = useState(false);
  useEffect(() => onSiteReady(() => setReady(true)), []);
  useEffect(() => {
    if (!ready) return;
    const check = () => setShown(window.scrollY > window.innerHeight * 0.6);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [ready]);
  useEffect(
    () =>
      onWhatsAppPanelRequest(() => {
        setShown(true);
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (trayOpen) return null;

  return (
    <div ref={wrap} className="fixed right-4 bottom-4 z-[120] flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id="wa-panel"
            role="dialog"
            aria-label="Message Sizzle Nest on WhatsApp"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.4, ease }}
            style={{ transformOrigin: "bottom right" }}
            className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[2px] bg-coal shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
          >
            <div className="relative overflow-hidden bg-[#128C4A] px-5 py-4">
              <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-white/10" />
              <p className="display text-3xl text-white">{restaurant.name}</p>
              <p className="mt-1 text-sm text-white/85">Pick a message to start the chat.</p>
            </div>

            <ul className="p-2">
              {count > 0 && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openTray();
                    }}
                    className="group flex w-full items-center justify-between gap-3 rounded-[2px] bg-sizzle/15 px-3 py-3 text-left text-sm font-semibold text-white hover:bg-sizzle/25"
                  >
                    Send my order ({count} item{count === 1 ? "" : "s"})
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                </li>
              )}
              {whatsapp.quickMessages.map((m, i) => {
                const href = whatsappHref(m.text);
                return (
                  <motion.li
                    key={m.label}
                    initial={reduce ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease }}
                  >
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 rounded-[2px] px-3 py-3 text-sm text-white/85 hover:bg-white/5 hover:text-white"
                      >
                        {m.label}
                        <ArrowIcon className="h-3.5 w-3.5 text-[#25D366] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ) : (
                      <span className="flex items-center justify-between gap-3 px-3 py-3 text-sm text-white/35">
                        {m.label}
                      </span>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            {!configured && (
              <p role="status" className="border-t border-white/10 px-5 py-3 text-xs leading-relaxed text-white/55">
                WhatsApp chat isn&apos;t connected yet — [WhatsApp number] will be added by the restaurant.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(shown || open) && (
          <motion.button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="wa-panel"
            aria-label={open ? "Close WhatsApp chat options" : "Chat on WhatsApp"}
            onClick={() => setOpen((v) => !v)}
            initial={reduce ? { opacity: 0 } : { scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { scale: 0, rotate: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="group relative flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#25D366] pr-0 pl-[17px] text-ink shadow-[0_12px_40px_-8px_rgba(37,211,102,0.65)] transition-[padding,gap] duration-500 ease-[var(--ease-cinema)] hover:gap-2.5 hover:pr-5 focus-visible:gap-2.5 focus-visible:pr-5"
          >
            {!open && <span aria-hidden="true" className="wa-pulse absolute inset-0 rounded-full" />}
            <span className="relative grid h-[22px] w-[22px] place-items-center">
              {open ? (
                <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden="true">
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2.2" />
                </svg>
              ) : (
                <ChatIcon className="h-[22px] w-[22px]" />
              )}
            </span>
            <span className="relative max-w-0 overflow-hidden text-sm font-bold whitespace-nowrap transition-[max-width] duration-500 ease-[var(--ease-cinema)] group-hover:max-w-40 group-focus-visible:max-w-40">
              {open ? "Close" : "Chat on WhatsApp"}
            </span>
            <span className="w-[17px] shrink-0 transition-[width] duration-500 group-hover:w-0 group-focus-visible:w-0" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
