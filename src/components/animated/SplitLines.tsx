"use client";

import { Fragment, useRef, type ElementType } from "react";
import { gsap, isInViewport, MOTION_OK, ScrollTrigger } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Splits a single line around `word` so only that word carries the italic serif
 * accent, without needing the copy to embed markup.
 */
function renderLine(line: string, word?: string) {
  if (!word || !line.includes(word)) return line;

  const [before, ...rest] = line.split(word);
  return (
    <Fragment>
      {before}
      <em className="av-accent-em">{word}</em>
      {rest.join(word)}
    </Fragment>
  );
}

/**
 * Oversized headline where each line sits in its own overflow-hidden mask and
 * slides up on entry. Lines are authored as an array rather than being measured
 * at runtime, so the break points are deliberate at every viewport.
 */
export function SplitLines({
  lines,
  as: Tag = "h2",
  className,
  accentLine,
  accentWord,
  delay = 0,
  stagger = 0.09,
  start = "top 85%",
  play = "scroll",
}: {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  accentLine?: number;
  accentWord?: string;
  delay?: number;
  stagger?: number;
  start?: string;
  /** `mount` runs immediately (used by the hero, which is above the fold). */
  play?: "scroll" | "mount";
}) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const inners = el.querySelectorAll("[data-split-inner]");
      gsap.set(inners, { yPercent: 115 });

      const reveal = () =>
        gsap.to(inners, {
          yPercent: 0,
          duration: 1.05,
          delay,
          stagger,
          ease: "power4.out",
        });

      // The lines are masked out until this runs, so anything already on screen
      // reveals now rather than waiting for a scroll that may never come.
      if (play === "mount" || isInViewport(el)) {
        reveal();
        return;
      }

      ScrollTrigger.create({ trigger: el, start, once: true, onEnter: reveal });
    });

    return () => mm.revert();
  }, [delay, stagger, start, play]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span className="av-split__line" key={line}>
          <span
            className={`av-split__inner${accentLine === index ? " av-accent-em" : ""}`}
            data-split-inner
          >
            {renderLine(line, accentWord)}
          </span>
        </span>
      ))}
    </Tag>
  );
}
