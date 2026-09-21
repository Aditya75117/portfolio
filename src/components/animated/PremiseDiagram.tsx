"use client";

import { useRef } from "react";
import { gsap, isInViewport, MOTION_OK } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/* Artwork runs the full 480 width of the artboard so the figure's edges line up
   with the heading text above it, and stays deliberately shallow so it fits the
   gap the heading leaves rather than growing the column past the body copy. */

/* Both routes stop at the node's edge rather than running under it, so the
   junction stays a clean meeting point instead of a line with a dot on it. */

/** Design: one continuous curve easing in from the left edge. */
const CURVE = "M 0 28 C 110 28 130 72 230 72";
/** Engineering: the same journey from the right, resolved in right angles. */
const STEPS = "M 480 28 H 396 V 44 H 336 V 58 H 288 V 72 H 250";
/** Everything under the staircase — the measured half — carries the dot field. */
const FIELD = "M 240 72 H 288 V 58 H 336 V 44 H 396 V 28 H 480 V 104 H 240 Z";

const DOTS = Array.from({ length: 10 * 4 }, (_, i) => ({
  cx: 252 + (i % 10) * 24,
  cy: 40 + Math.floor(i / 10) * 18,
}));

const TICKS = [0, 120, 240, 360, 480];

/** The point both routes land on: ring, dot and drop line all hang off it. */
const JUNCTION = { x: 240, y: 72 };

/**
 * Fills the space under the premise heading: two routes to the same point, one
 * drawn freehand and one stepped, meeting at an accented node. Geometry only,
 * so it costs no image bytes and follows the theme vars.
 */
export function PremiseDiagram() {
  const rootRef = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const strokes = gsap.utils.toArray<SVGPathElement>("[data-draw]", root);
      const node = root.querySelectorAll("[data-node]");
      const drop = root.querySelector("[data-drop]");
      const dots = root.querySelectorAll("[data-dot]");
      const labels = root.querySelectorAll("[data-label]");
      const rule = root.querySelector("[data-rule]");
      // Matches the entrance components: already on screen means draw now.
      const trigger = isInViewport(root)
        ? undefined
        : ({ trigger: root, start: "top 85%", once: true } as const);

      gsap.fromTo(
        rule,
        { scaleX: 0, transformOrigin: "0% 50%" },
        { scaleX: 1, duration: 1.1, ease: "power3.out", scrollTrigger: trigger },
      );

      strokes.forEach((stroke) => {
        const length = stroke.getTotalLength();
        gsap.fromTo(
          stroke,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            delay: 0.25,
            ease: "power2.inOut",
            scrollTrigger: trigger,
          },
        );
      });

      gsap.fromTo(
        dots,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.5,
          stagger: { each: 0.01, from: "end" },
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        node,
        { autoAlpha: 0, scale: 0 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          delay: 1.45,
          /* The origin is set while the circles are still at scale 0, and GSAP's
             smoothing would bake that frame's compensation into the matrix as a
             permanent shift of half each circle's box — pulling the dot off the
             ring's centre and both off the junction. */
          svgOrigin: `${JUNCTION.x} ${JUNCTION.y}`,
          smoothOrigin: false,
          ease: "back.out(2)",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        drop,
        { scaleY: 0, transformOrigin: "50% 0%" },
        {
          scaleY: 1,
          duration: 0.5,
          delay: 1.6,
          ease: "power2.out",
          scrollTrigger: trigger,
        },
      );

      gsap.fromTo(
        labels,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          delay: 1.7,
          ease: "power3.out",
          scrollTrigger: trigger,
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <svg
      ref={rootRef}
      className="av-premise__diagram"
      viewBox="0 0 480 132"
      role="img"
      aria-label="A freehand curve and a stepped line arriving from opposite edges and meeting at a single marked point."
      focusable="false"
    >
      <defs>
        <clipPath id="av-premise-field">
          <path d={FIELD} />
        </clipPath>
      </defs>

      <g className="av-premise__dots" clipPath="url(#av-premise-field)">
        {DOTS.map((dot) => (
          <circle key={`${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r="1.5" data-dot />
        ))}
      </g>

      <path className="av-premise__curve" d={CURVE} data-draw />
      <path className="av-premise__steps" d={STEPS} data-draw />

      <line
        className="av-premise__drop"
        x1={JUNCTION.x}
        y1={JUNCTION.y + 11}
        x2={JUNCTION.x}
        y2="100"
        data-drop
      />

      <circle className="av-premise__ring" cx={JUNCTION.x} cy={JUNCTION.y} r="10" data-node />
      <circle className="av-premise__node" cx={JUNCTION.x} cy={JUNCTION.y} r="3.5" data-node />

      <g className="av-premise__ticks">
        {TICKS.map((x) => (
          <line key={x} x1={x} y1="104" x2={x} y2="110" />
        ))}
      </g>
      <line className="av-premise__baseline" x1="0" y1="104" x2="480" y2="104" data-rule />

      <g className="av-premise__legend">
        <text x="0" y="126" textAnchor="start" data-label>
          Design
        </text>
        <text className="is-accent" x="240" y="126" textAnchor="middle" data-label>
          Both
        </text>
        <text x="480" y="126" textAnchor="end" data-label>
          Engineering
        </text>
      </g>
    </svg>
  );
}
