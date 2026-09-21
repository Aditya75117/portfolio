"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, isInViewport, MOTION_OK, ScrollTrigger } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Scroll-triggered entrance for a single block. Markup renders in its final
 * state; the "from" values are only applied inside the matchMedia block, so
 * reduced-motion and no-JS visitors see the finished layout immediately.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 26,
  start = "top 88%",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.set(el, { autoAlpha: 0, y });

      const reveal = () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
        });

      if (isInViewport(el)) {
        reveal();
        return;
      }

      ScrollTrigger.create({ trigger: el, start, once: true, onEnter: reveal });
    });

    return () => mm.revert();
  }, [delay, y, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
