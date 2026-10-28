"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqs } from "@/data/site";
import { openWhatsAppPanel } from "@/lib/whatsapp-ui";
import { ChatIcon } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="faq-title" className="relative bg-coal px-[var(--gutter)] py-24 md:py-36">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-title" className="display text-[clamp(4rem,15vw,10rem)] text-white lg:text-[clamp(4rem,9vw,9rem)]">
            Good <span className="text-sizzle">questions</span>
          </h2>
          <p className="mt-6 max-w-[34ch] text-white/60">Can&apos;t find what you need? Message the kitchen directly.</p>
          <button type="button" onClick={openWhatsAppPanel} className="btn btn-ghost mt-6">
            <ChatIcon className="h-[18px] w-[18px] text-[#25D366]" />
            Ask on WhatsApp
          </button>
        </div>

        <ul className="border-t border-white/10">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <li key={f.q} className="border-b border-white/10">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
                  >
                    <span className={`text-xl font-bold transition-colors md:text-2xl ${isOpen ? "text-white" : "text-white/75 group-hover:text-white"}`}>
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                        isOpen ? "bg-sizzle" : "ring-1 ring-white/20 group-hover:ring-white/50"
                      }`}
                    >
                      <span className="absolute h-0.5 w-4 bg-white" />
                      <span className={`absolute h-4 w-0.5 bg-white transition-transform duration-500 ${isOpen ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.5, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] pb-7 leading-relaxed text-white/60">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
