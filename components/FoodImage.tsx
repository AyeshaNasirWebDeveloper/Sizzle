"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageAsset } from "@/data/site";

type Props = {
  image: ImageAsset;
  sizes: string;
  preload?: boolean;
  /** Load immediately without a preload hint (for images inside the first pinned scene). */
  eager?: boolean;
  className?: string;
  /** Applies the soft radial mask so the photo melts into black. */
  vignette?: boolean;
};

/**
 * Wraps next/image with the shared colour grade, a loading shimmer and a
 * readable error state, so a missing photo never leaves a broken icon.
 */
export function FoodImage({ image, sizes, preload, eager, className = "", vignette }: Props) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {state !== "ready" && (
        <div
          aria-hidden={state === "loading"}
          className={`absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_45%,#2a1a14_0%,#171717_55%,#0a0a0a_100%)] ${vignette ? "food-vignette" : ""}`}
        >
          {state === "loading" ? (
            <span className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
          ) : (
            <span className="px-6 text-center text-sm text-white/50">
              Photo unavailable — {image.alt.toLowerCase()}
            </span>
          )}
        </div>
      )}
      {state !== "error" && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          loading={preload || eager ? "eager" : "lazy"}
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          style={{ objectPosition: image.focus ?? "50% 50%" }}
          className={`food-grade object-cover transition-opacity duration-700 ${
            vignette ? "food-vignette" : ""
          } ${state === "ready" ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}
