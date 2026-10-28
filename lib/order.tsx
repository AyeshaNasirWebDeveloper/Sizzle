"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { menuItems, whatsapp, formatPrice, whatsappHref, type MenuItem } from "@/data/site";

export type OrderLine = { key: string; item: MenuItem; variant: string | null; qty: number };

type OrderContextValue = {
  lines: OrderLine[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (itemId: string, variant?: string | null) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  /** wa.me URL, or null when no WhatsApp number is configured. */
  whatsappUrl: (note?: string) => string | null;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function buildWhatsAppMessage(lines: OrderLine[], note?: string): string {
  const body = lines.map((l) => {
    const price = l.variant
      ? l.item.variants?.find((v) => v.label === l.variant)?.price ?? null
      : l.item.price;
    const priceText = price === null ? "" : ` — ${formatPrice(price)} each`;
    return `• ${l.qty} × ${l.item.name}${l.variant ? ` (${l.variant})` : ""}${priceText}`;
  });
  return [whatsapp.greeting, "", ...body, ...(note?.trim() ? ["", `Note: ${note.trim()}`] : []), "", whatsapp.closing].join("\n");
}

export function whatsappLink(message: string): string | null {
  return whatsappHref(message);
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((itemId: string, variant: string | null = null) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item || !item.available) return;
    const key = `${itemId}:${variant ?? ""}`;
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + 1, 20) } : l));
      return [...prev, { key, item, variant, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 20) } : l)),
    );
  }, []);

  const value = useMemo<OrderContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQty,
      clear: () => setLines([]),
      whatsappUrl: (note) => whatsappLink(buildWhatsAppMessage(lines, note)),
    }),
    [lines, isOpen, add, setQty],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside <OrderProvider>");
  return ctx;
}
