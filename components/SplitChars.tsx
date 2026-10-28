import type { ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  charClassName?: string;
};

/**
 * Splits text into per-character spans for staggered animation while keeping
 * the full word readable to assistive tech via aria-label.
 */
export function SplitChars({ text, as: Tag = "span", className = "", charClassName = "" }: Props) {
  return (
    <Tag className={`whitespace-nowrap ${className}`} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
          <span data-char className={`inline-block will-change-transform ${charClassName}`}>
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </Tag>
  );
}
