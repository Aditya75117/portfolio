"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Every scroll-driven effect on this route is registered inside a
 * `gsap.matchMedia()` keyed on this query, so a reduced-motion visitor simply
 * never gets the animation and the markup stays in its authored state.
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Whether an element is on screen right now. Entrance effects hide their target
 * before animating it in, so anything already visible when the effect runs — a
 * deep link, a restored scroll position, a hot reload — has to reveal itself
 * immediately instead of waiting on a ScrollTrigger that has already been
 * passed.
 */
export function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export { gsap, ScrollTrigger };
