"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useOrder, buildWhatsAppMessage } from "@/lib/order";
import { formatPrice } from "@/data/site";
import { setScrollLocked } from "@/lib/smooth";

/**
 * The order tray. It builds a plain-text order and hands it to WhatsApp.
 * No payment is taken here and nothing is sent to a server.
 */
export function OrderTray() {
  const { lines, isOpen, close, setQty, clear, whatsappUrl, count } = useOrder();
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], textarea");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    setScrollLocked(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      setScrollLocked(false);
      prevFocus?.focus?.();
    };
  }, [isOpen, close]);

  const url = whatsappUrl(note);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildWhatsAppMessage(lines, note));
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    window.setTimeout(() => setCopied("idle"), 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[150]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.button
            type="button"
            aria-label="Close order"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-coal shadow-2xl outline-none"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 id="order-title" className="display text-4xl text-white">
                Your order
              </h2>
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center text-white/70 hover:text-white" aria-label="Close order">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center px-6 text-center">
                <p className="font-semibold text-white">Your order is empty.</p>
                <p className="mt-2 text-sm text-white/55">Add dishes from the menu and they&apos;ll appear here.</p>
                <a href="#menu" onClick={close} className="btn btn-primary mx-auto mt-6">
                  Browse the menu
                </a>
              </div>
            ) : (
              <>
                <ul data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6">
                  {lines.map((l) => {
                    const price = l.variant ? l.item.variants?.find((v) => v.label === l.variant)?.price ?? null : l.item.price;
                    return (
                      <li key={l.key} className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">{l.item.name}</p>
                          <p className="text-sm text-white/50">
                            {l.variant ? `${l.variant} · ` : ""}
                            <span className="text-gold">{formatPrice(price)}</span>
                          </p>
                        </div>
                        <div className="flex items-center" role="group" aria-label={`Quantity for ${l.item.name}`}>
                          <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Remove one" className="grid h-11 w-11 place-items-center text-xl text-white/80 hover:text-white">
                            −
                          </button>
                          <span aria-live="polite" className="w-6 text-center font-bold text-white">
                            {l.qty}
                          </span>
                          <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Add one" className="grid h-11 w-11 place-items-center text-xl text-white/80 hover:text-white">
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                  <li className="py-4">
                    <label htmlFor="order-note" className="text-sm font-semibold text-white/80">
                      Note for the kitchen (optional)
                    </label>
                    <textarea
                      id="order-note"
                      value={note}
                      maxLength={300}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Extra spicy, no onions, pickup time…"
                      className="mt-2 w-full resize-none rounded-[2px] bg-ink p-3 text-sm text-white placeholder:text-white/30 focus:outline-2 focus:outline-gold"
                    />
                  </li>
                </ul>

                <div className="space-y-3 border-t border-white/10 px-6 py-5">
                  <p className="text-xs leading-relaxed text-white/45">
                    {count} item{count === 1 ? "" : "s"}. The restaurant confirms prices, total and timing on WhatsApp —
                    no payment is taken here.
                  </p>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                      Send order on WhatsApp
                    </a>
                  ) : (
                    <div role="status" className="rounded-[2px] border border-gold/40 p-3 text-sm text-white/75">
                      WhatsApp ordering isn&apos;t connected yet. Copy your order and send it to the restaurant directly.
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button type="button" onClick={copy} className="btn btn-ghost flex-1">
                      {copied === "done" ? "Order copied" : copied === "failed" ? "Couldn't copy" : "Copy order"}
                    </button>
                    <button type="button" onClick={clear} className="btn btn-ghost">
                      Clear
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
