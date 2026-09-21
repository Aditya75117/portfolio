"use client";

import { useRef } from "react";
import { gsap, MOTION_OK } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Counts up when the metric scrolls into view. The final value is rendered on
 * the server, so it is what search engines, reduced-motion users and anyone
 * without JS see — the tween only replaces it once it is about to run.
 */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const counter = { current: 0 };

      gsap.to(counter, {
        current: value,
        duration: 1.7,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onStart: () => {
          el.textContent = `0${suffix}`;
        },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.current)}${suffix}`;
        },
        onComplete: () => {
          el.textContent = `${value}${suffix}`;
        },
      });
    });

    return () => mm.revert();
  }, [value, suffix]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
