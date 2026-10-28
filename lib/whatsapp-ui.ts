"use client";

/** Lets any button on the page open the floating WhatsApp panel. */
const EVENT = "sizzle:whatsapp";

export function openWhatsAppPanel() {
  window.dispatchEvent(new Event(EVENT));
}

export function onWhatsAppPanelRequest(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
