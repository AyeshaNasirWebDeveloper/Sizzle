"use client";

import { useId } from "react";

type Props = {
  text: string;
  onClick?: () => void;
  label: string;
  className?: string;
};

/** Circular rotating text badge with a centre action. */
export function SpinBadge({ text, onClick, label, className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group relative grid aspect-square place-items-center rounded-full ${className}`}
    >
      <svg viewBox="0 0 200 200" aria-hidden="true" className="badge-spin absolute inset-0 h-full w-full">
        <defs>
          <path id={`c-${id}`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="rgba(10,10,10,0.55)" stroke="rgba(201,162,75,0.35)" />
        <text fill="#fff" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 21, letterSpacing: 3.2, textTransform: "uppercase" }}>
          <textPath href={`#c-${id}`} textLength="486" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <span className="relative grid h-[42%] w-[42%] place-items-center rounded-full bg-sizzle text-white transition-transform duration-500 ease-[var(--ease-cinema)] group-hover:scale-110">
        <svg viewBox="0 0 16 16" className="h-[38%] w-[38%] transition-transform duration-500 group-hover:rotate-45" aria-hidden="true">
          <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </span>
    </button>
  );
}
