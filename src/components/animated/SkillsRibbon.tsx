"use client";

import { Fragment, useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

const BASE_SPEED = 1;

/**
 * Full-bleed kinetic ribbon. The track holds two identical copies and travels
 * exactly one copy width, so the loop is seamless; scroll velocity pushes the
 * timeScale, which is what makes it feel attached to the page rather than
 * decorative.
 */
export function SkillsRibbon({ items }: { items: readonly string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const track = root.querySelector<HTMLElement>("[data-ribbon-track]");
      if (!track) return;

      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 32,
        ease: "none",
        repeat: -1,
      });

      let settle: ReturnType<typeof setTimeout>;

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 320);
          gsap.to(tween, {
            timeScale: BASE_SPEED + boost,
            duration: 0.35,
            overwrite: true,
          });

          clearTimeout(settle);
          settle = setTimeout(() => {
            gsap.to(tween, { timeScale: BASE_SPEED, duration: 0.9, overwrite: true });
          }, 180);
        },
      });

      return () => {
        clearTimeout(settle);
        trigger.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="av-ribbon" ref={rootRef} aria-hidden>
      <div className="av-ribbon__track" data-ribbon-track>
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {items.map((item) => (
              <span className="av-ribbon__item" key={`${copy}-${item}`}>
                {item}
                <span className="av-ribbon__bullet" />
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
