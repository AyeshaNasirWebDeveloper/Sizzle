"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { categories, menuItems, formatPrice, type CategoryId, type MenuItem } from "@/data/site";
import { useOrder } from "@/lib/order";
import { FoodImage } from "./FoodImage";

const ease = [0.22, 1, 0.36, 1] as const;

export function Menu() {
  const [active, setActive] = useState<CategoryId>(categories[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  // Deep links such as #menu-broast (used by the story CTAs) pick the category.
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#menu-(\w+)$/);
      if (m && categories.some((c) => c.id === m[1])) setActive(m[1] as CategoryId);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const onTabKey = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const idx = categories.findIndex((c) => c.id === active);
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % categories.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + categories.length) % categories.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = categories.length - 1;
    else return;
    e.preventDefault();
    setActive(categories[next].id);
    tabRefs.current[next]?.focus();
  }, [active]);

  const category = categories.find((c) => c.id === active)!;
  const items = menuItems.filter((m) => m.category === active && m.available);

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-ink py-24 md:py-36">
      {categories.map((c) => (
        <span key={c.id} id={`menu-${c.id}`} className="absolute top-0" aria-hidden="true" />
      ))}

      <div className="px-[var(--gutter)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="menu-title" className="display text-[clamp(4.5rem,14vw,14rem)] text-white">
            The menu
          </h2>
          <p className="max-w-[38ch] pb-3 text-sm leading-relaxed text-white/55">
            Tap a dish to add it to your order, then send everything in one WhatsApp message. Prices marked [Price]
            are still being confirmed.
          </p>
        </div>
        <div className="mt-8 h-px bg-white/10" />
      </div>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 px-[var(--gutter)] md:mt-16 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-16">
        {/* category navigation: a rail on phones, a stacked index on desktop */}
        <div className="sticky top-16 z-20 -mx-[var(--gutter)] min-w-0 bg-ink/90 px-[var(--gutter)] py-3 backdrop-blur md:top-28 md:mx-0 md:self-start md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div
            role="tablist"
            aria-label="Menu categories"
            aria-orientation="vertical"
            onKeyDown={onTabKey}
            data-lenis-prevent-horizontal
            className="no-scrollbar flex gap-2 overflow-x-auto overscroll-x-contain md:flex-col md:gap-0 md:overflow-visible"
          >
            {categories.map((c, i) => {
              const selected = c.id === active;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${c.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(c.id)}
                  className={`group relative shrink-0 text-left transition-colors duration-300 max-md:min-h-11 max-md:rounded-[2px] max-md:px-4 max-md:text-sm max-md:font-bold ${
                    selected ? "max-md:bg-sizzle max-md:text-white" : "max-md:bg-coal max-md:text-white/70"
                  }`}
                >
                  <span className="md:hidden">{c.name}</span>
                  <span
                    className={`display hidden py-1 text-[clamp(3rem,6vw,6.5rem)] transition-[color,transform] duration-500 ease-[var(--ease-cinema)] md:block ${
                      selected ? "translate-x-4 text-white" : "text-white/20 group-hover:translate-x-2 group-hover:text-white/50"
                    }`}
                  >
                    {c.name}
                  </span>
                  {selected && (
                    <motion.span
                      layoutId="menu-marker"
                      transition={{ duration: reduce ? 0 : 0.5, ease }}
                      className="absolute top-1/2 left-0 hidden h-[60%] w-[3px] -translate-y-1/2 bg-sizzle md:block"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* active category */}
        <div id={`panel-${category.id}`} role="tabpanel" aria-labelledby={`tab-${category.id}`} className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={category.id}
              initial={reduce ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <motion.div
                initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.8, ease }}
                className="relative aspect-[16/9] overflow-hidden md:aspect-[21/9]"
              >
                <motion.div
                  initial={reduce ? false : { scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease }}
                  className="absolute inset-0"
                >
                  <FoodImage image={category.image} sizes="(max-width: 768px) 100vw, 66vw" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <p className="absolute bottom-4 left-4 max-w-[30ch] text-lg font-semibold text-white md:bottom-6 md:left-6 md:text-2xl">
                  {category.intro}
                </p>
              </motion.div>

              {items.length === 0 ? (
                <div className="mt-10 border border-white/10 p-8 text-white/70">
                  <p className="font-semibold text-white">Nothing in {category.name.toLowerCase()} right now.</p>
                  <p className="mt-2 text-sm">Pick another category to keep browsing.</p>
                </div>
              ) : (
                <ul className="mt-4">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={reduce ? false : { y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease }}
                    >
                      <MenuRow item={item} />
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const { add } = useOrder();
  const [flash, setFlash] = useState<string | null>(null);

  const addLine = (variant: string | null) => {
    add(item.id, variant);
    setFlash(variant ?? "base");
    window.setTimeout(() => setFlash(null), 1200);
  };

  return (
    <div className="group grid gap-4 border-b border-white/10 py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-xl font-bold text-white transition-transform duration-500 ease-[var(--ease-cinema)] md:text-2xl md:group-hover:translate-x-1">
            {item.name}
          </h3>
          {item.tags?.map((t) => (
            <span key={t} className="text-xs font-semibold text-sizzle">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-white/55">{item.description}</p>
      </div>

      {item.variants?.length ? (
        <div className="flex flex-wrap gap-2">
          {item.variants.map((v) => (
            <button
              key={v.label}
              type="button"
              onClick={() => addLine(v.label)}
              aria-label={`Add ${item.name}, ${v.label}, to order`}
              className="flex min-h-11 items-center gap-2 rounded-[2px] px-3 text-sm text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] transition-colors hover:bg-white hover:text-ink"
            >
              <span className="font-bold">{v.label}</span>
              <span className="text-gold">{flash === v.label ? "Added" : formatPrice(v.price)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-6 md:justify-end">
          <span className="font-semibold text-gold">{formatPrice(item.price)}</span>
          <button
            type="button"
            onClick={() => addLine(null)}
            aria-label={`Add ${item.name} to order`}
            className="btn btn-ghost min-h-11 px-4 text-sm"
          >
            {flash ? "Added" : "Add"}
          </button>
        </div>
      )}
    </div>
  );
}
