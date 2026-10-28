"use client";

/**
 * Tiny signal between the loader and the hero entrance. The loader calls
 * `markSiteReady()` as it lifts; the hero subscribes with `onSiteReady()`.
 * If the hero subscribes after the signal fired, it runs immediately.
 */
const EVENT = "sizzle:ready";

declare global {
  interface Window {
    __sizzleReady?: boolean;
  }
}

export function markSiteReady() {
  if (window.__sizzleReady) return;
  window.__sizzleReady = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onSiteReady(cb: () => void): () => void {
  if (window.__sizzleReady) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  // Safety net: never hold the hero back if the loader is missing.
  const t = window.setTimeout(markSiteReady, 2500);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.clearTimeout(t);
  };
}
