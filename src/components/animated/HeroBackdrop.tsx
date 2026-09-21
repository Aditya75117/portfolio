"use client";

import { useRef } from "react";
import { MARK_HEIGHT, MARK_WIDTH, MonogramGlyph } from "@/components/icons/Monogram";
import { gsap, MOTION_OK } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

const MARK_W = 186;
const MARK_H = MARK_W * (MARK_HEIGHT / MARK_WIDTH);

/* Grid is centred on the 420-unit artboard so it sits concentric with the rings. */
const GRID_ORIGIN = 210 - (6 * 26) / 2;
const DOTS = Array.from({ length: 7 * 7 }, (_, i) => ({
  cx: GRID_ORIGIN + (i % 7) * 26,
  cy: GRID_ORIGIN + Math.floor(i / 7) * 26,
}));

const TICKS = Array.from({ length: 24 }, (_, i) => i);

/**
 * Ambient instrument-dial artwork sitting behind the whole hero. Pure geometry,
 * so it costs no image bytes, follows the theme through CSS vars, and its
 * layers can be parallaxed independently against the cursor.
 */
export function HeroBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const layers = gsap.utils.toArray<SVGGElement>("[data-depth]", root);

      gsap.set(layers, { autoAlpha: 0, scale: 0.94, transformOrigin: "50% 50%" });
      gsap.to(layers, {
        autoAlpha: 1,
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.2,
      });

      const arc = root.querySelector<SVGPathElement>("[data-arc]");
      if (arc) {
        const length = arc.getTotalLength();
        gsap.fromTo(
          arc,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: 0.55 },
        );
      }

      gsap.to("[data-spin]", {
        rotation: 360,
        duration: 120,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      gsap.to(root, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      // Cursor parallax on fine pointers only — there is nothing to track on
      // touch, and the listener would be pure cost.
      mm.add("(pointer: fine)", () => {
        const setters = layers.map((layer) => ({
          depth: Number(layer.dataset.depth ?? 1),
          x: gsap.quickTo(layer, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(layer, "y", { duration: 0.9, ease: "power3.out" }),
        }));

        function onPointerMove(event: PointerEvent) {
          const dx = event.clientX / window.innerWidth - 0.5;
          const dy = event.clientY / window.innerHeight - 0.5;

          setters.forEach((setter) => {
            setter.x(dx * setter.depth * 34);
            setter.y(dy * setter.depth * 34);
          });
        }

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        return () => window.removeEventListener("pointermove", onPointerMove);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="av-hero__backdrop" ref={rootRef} aria-hidden>
      <svg viewBox="0 0 420 420" className="av-hero__plate" role="presentation" focusable="false">
        <g data-depth="0.4" className="av-hero__grid">
          {DOTS.map((dot) => (
            <circle key={`${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r="1.5" />
          ))}
        </g>

        <g data-depth="0.8">
          <circle className="av-hero__ring" cx="210" cy="210" r="196" />
          <circle className="av-hero__ring" cx="210" cy="210" r="168" />
          <circle className="av-hero__ring" cx="210" cy="210" r="124" />
        </g>

        <g data-depth="1.4" data-spin className="av-hero__ticks">
          {TICKS.map((tick) => (
            <line
              key={tick}
              x1="210"
              y1="14"
              x2="210"
              y2={tick % 6 === 0 ? 34 : 24}
              transform={`rotate(${tick * 15} 210 210)`}
            />
          ))}
        </g>

        <g data-depth="1.1">
          <path data-arc className="av-hero__arc" d="M 210 42 A 168 168 0 0 1 378 210" fill="none" />
        </g>

        <g data-depth="2.2">
          <circle className="av-hero__disc" cx="326" cy="108" r="9" />
        </g>

        <g data-depth="1.8">
          <MonogramGlyph
            className="av-hero__monogram"
            x={210 - MARK_W / 2}
            y={210 - MARK_H / 2}
            width={MARK_W}
            height={MARK_H}
          />
        </g>
      </svg>
    </div>
  );
}
