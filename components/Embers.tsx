"use client";

import { useEffect, useRef } from "react";

type Ember = { x: number; y: number; r: number; vy: number; vx: number; life: number; max: number; hue: number; phase: number };

/**
 * Sparks rising off the grill. A single 2D canvas, capped DPR, paused when
 * off-screen or the tab is hidden, and skipped entirely for reduced motion.
 */
export function Embers({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const embers: Ember[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (initial = false): Ember => {
      const max = 240 + Math.random() * 260;
      return {
        // concentrated around the centre, where the food sits
        x: w * (0.5 + (Math.random() - 0.5) * (Math.random() < 0.7 ? 0.55 : 1)),
        y: initial ? Math.random() * h : h * (0.75 + Math.random() * 0.3),
        r: 0.6 + Math.random() * 1.9,
        vy: 0.35 + Math.random() * 0.9,
        vx: (Math.random() - 0.5) * 0.25,
        life: initial ? Math.random() * max : 0,
        max,
        hue: 8 + Math.random() * 34, // red → amber
        phase: Math.random() * Math.PI * 2,
      };
    };

    const count = () => (w < 768 ? 34 : 80);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      while (embers.length < count()) embers.push(spawn());
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life += 1;
        e.y -= e.vy;
        e.x += e.vx + Math.sin(e.life * 0.03 + e.phase) * 0.35;
        const t = e.life / e.max;
        if (t >= 1 || e.y < -10) {
          embers[i] = spawn();
          continue;
        }
        const flicker = 0.65 + Math.sin(e.life * 0.25 + e.phase) * 0.35;
        const alpha = Math.sin(Math.PI * t) * flicker;
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        g.addColorStop(0, `hsla(${e.hue + 15}, 100%, 70%, ${alpha})`);
        g.addColorStop(0.35, `hsla(${e.hue}, 100%, 55%, ${alpha * 0.5})`);
        g.addColorStop(1, `hsla(${e.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    for (let i = 0; i < count(); i++) embers.push(spawn(true));
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none h-full w-full ${className}`} />;
}
