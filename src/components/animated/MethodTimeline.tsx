"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Draws the spine of the method section as the reader moves through it. The
 * fill is a scaled element rather than an SVG dash animation so the scrubbed
 * property stays on the compositor.
 */
export function MethodTimeline({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const fill = root.querySelector<HTMLElement>("[data-spine-fill]");
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);

      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 65%",
              end: "bottom 75%",
              scrub: 0.4,
            },
          },
        );
      }

      steps.forEach((step) => {
        gsap.set(step, { autoAlpha: 0, y: 34 });
        gsap.to(step, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 82%", once: true },
        });

        ScrollTrigger.create({
          trigger: step,
          start: "top 70%",
          end: "bottom 70%",
          toggleClass: { targets: step, className: "is-reached" },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="av-method__track" ref={rootRef}>
      <div className="av-method__spine" aria-hidden>
        <span className="av-method__spine-fill" data-spine-fill />
      </div>
      <ol className="av-method__steps">{children}</ol>
    </div>
  );
}
