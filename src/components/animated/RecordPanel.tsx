"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import type { RecordEntry } from "@/data/animatedView";
import { gsap, isInViewport, MOTION_OK, ScrollTrigger } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

const TRACK = [0, 1, 2, 3, 4, 5, 6];
const CELL = 29;
const CELL_STEP = 37;
const CELL_INSET = 24.5;
/** Filled in the markup only so the lattice reads as composed before the loop
    takes over — the loop drains them early rather than leaving them lit. */
const SEED_CELLS = new Set(["0-0", "4-1", "6-3", "2-4", "5-6", "1-5"]);
/** Sized to sit just inside the 300-unit viewBox after the ripple's peak, so
    the orbit reads around the logo plate without the wave leaving the box at
    the top, bottom or sides. Inner rings keep the same spacing ratio. */
const CENTER = 150;
const RINGS = [52, 90, 126];
const ORBIT_RADIUS = 126;
const ORBIT_SLOW_RADIUS = 90;
/** Three ripples on one cycle, launched a third of a cycle apart, so the dot
    always trails a wave rather than firing in bursts. Peak is held under the
    leftover inset (150 − 126) so a wave at 12 / 3 / 9 o'clock stays on-canvas. */
const WAVES = [0, 1, 2];
const WAVE_CYCLE = 2.7;
const WAVE_FROM = 5;
const WAVE_TO = 20;
const RULES = [290, 232, 268, 186, 290, 244, 198];
const RULE_X = 10;
const RULE_DRAW = 1.4;
const RULE_DRAIN = 1.55;

/** Shuffle that never opens on `avoid`, so a repeated pass does not light the
    same rule twice in a row. */
function shuffleRules(count: number, avoid: number) {
  const order = gsap.utils.shuffle([...Array(count).keys()]);
  if (order[0] === avoid && count > 1) {
    const swap = order.findIndex((index) => index !== avoid);
    if (swap > 0) [order[0], order[swap]] = [order[swap], order[0]];
  }
  return order;
}

/** Walks the stack in random order, always setting the next rule before the
    previous one is cleared, so the plate never sits with every accent drained. */
function playRuleHandoff(rules: SVGLineElement[]) {
  const count = rules.length;
  const spans = rules.map((rule) => Number(rule.getAttribute("x2")) - Number(rule.getAttribute("x1")));
  const sequence: number[] = [];
  let avoid = -1;

  for (let pass = 0; pass < 3; pass++) {
    const order = shuffleRules(count, avoid);
    sequence.push(...order);
    avoid = order[order.length - 1];
  }

  const first = sequence[0];
  rules.forEach((rule, index) => {
    gsap.set(rule, { attr: { "stroke-dashoffset": index === first ? 0 : spans[index] } });
  });

  const master = gsap.timeline({ repeat: -1 });

  const handoff = (incoming: number, outgoing: number) => {
    if (incoming === outgoing) return;

    master.fromTo(
      rules[incoming],
      { attr: { "stroke-dashoffset": spans[incoming] } },
      { attr: { "stroke-dashoffset": 0 }, duration: RULE_DRAW, ease: "power2.out" },
    );
    // Drain starts only after the incoming rule has been set, so one accent is
    // always fully drawn through the swap.
    master.to(rules[outgoing], {
      attr: { "stroke-dashoffset": -spans[outgoing] },
      duration: RULE_DRAIN,
      ease: "power2.in",
      delay: gsap.utils.random(0.25, 0.8),
    });
    master.set(rules[outgoing], { attr: { "stroke-dashoffset": spans[outgoing] } });
    master.to({}, { duration: gsap.utils.random(0.2, 0.7) });
  };

  for (let index = 1; index < sequence.length; index++) {
    handoff(sequence[index], sequence[index - 1]);
  }

  // Land back on the seed so the next repeat does not open on an empty stack.
  if (sequence[sequence.length - 1] !== first) {
    handoff(first, sequence[sequence.length - 1]);
  }

  return master;
}

function GridMotif({ accent }: { accent: string }) {
  return (
    <g>
      {TRACK.map((row) =>
        TRACK.map((column) => {
          const key = `${column}-${row}`;
          const seeded = SEED_CELLS.has(key);

          // Every cell carries the gradient from the start so the loop only has
          // to move fill-opacity; the depth fade rides on the stroke so a cell
          // reaches full strength wherever it sits in the lattice.
          return (
            <rect
              key={key}
              className="av-record__motif-cell"
              x={CELL_INSET + column * CELL_STEP}
              y={CELL_INSET + row * CELL_STEP}
              width={CELL}
              height={CELL}
              rx="5"
              fill={`url(#${accent})`}
              fillOpacity={seeded ? 0.85 : 0}
              strokeOpacity={0.95 - (column + row) * 0.04}
              data-cell
              data-seed={seeded ? "" : undefined}
            />
          );
        }),
      )}
    </g>
  );
}

function OrbitMotif({ accent }: { accent: string }) {
  return (
    <g>
      {RINGS.map((radius) => (
        <circle
          key={radius}
          className="av-record__motif-ring"
          cx={CENTER}
          cy={CENTER}
          r={radius}
        />
      ))}

      <circle
        className="av-record__motif-ring--dashed"
        cx={CENTER}
        cy={CENTER}
        r={ORBIT_SLOW_RADIUS}
      />

      {/* One lit arc of the outer ring: the dash pattern sums past its circumference
          (~679) so only the first segment ever draws. */}
      <circle
        className="av-record__motif-ring--lit"
        cx={CENTER}
        cy={CENTER}
        r={ORBIT_RADIUS}
        stroke={`url(#${accent})`}
        strokeDasharray="120 700"
        transform={`rotate(-125 ${CENTER} ${CENTER})`}
      />

      <g data-orbit>
        {WAVES.map((phase) => (
          <circle
            key={phase}
            className="av-record__motif-wave"
            cx={CENTER}
            cy={CENTER - ORBIT_RADIUS}
            r={WAVE_FROM}
            data-orbit-wave
          />
        ))}
        <circle
          className="av-record__motif-halo"
          cx={CENTER}
          cy={CENTER - ORBIT_RADIUS}
          r="10"
          data-orbit-halo
        />
        <circle
          className="av-record__motif-dot"
          cx={CENTER}
          cy={CENTER - ORBIT_RADIUS}
          r="4.4"
          data-orbit-dot
        />
      </g>

      <g data-orbit-slow>
        <circle
          className="av-record__motif-dot--soft"
          cx={CENTER}
          cy={CENTER - ORBIT_SLOW_RADIUS}
          r="2.8"
          data-orbit-dot
        />
      </g>
    </g>
  );
}

function RuleMotif({ accent }: { accent: string }) {
  return (
    <g>
      {RULES.map((length, index) => {
        const y = 26 + index * 41;
        const span = length - RULE_X;

        return (
          <g key={y}>
            <line
              className="av-record__motif-rule"
              x1={RULE_X}
              y1={y}
              x2={length}
              y2={y}
              opacity={0.9 - index * 0.06}
              data-rule
            />
            {/* Offset by its own length so the overlay is undrawn until the loop
                wipes it in — with no JS the base rule is all that shows. */}
            <line
              className="av-record__motif-rule--lit"
              x1={RULE_X}
              y1={y}
              x2={length}
              y2={y}
              stroke={`url(#${accent})`}
              strokeDasharray={span}
              strokeDashoffset={span}
              data-rule-lit
            />
          </g>
        );
      })}

      {RULES.map((length, index) => (
        <circle
          key={`cap-${length}-${index}`}
          className="av-record__motif-cap"
          cx={length}
          cy={26 + index * 41}
          r="2.5"
          data-cap
        />
      ))}
    </g>
  );
}

/** Abstract plate behind each role — geometry only, so the logo stays the only image. */
function Motif({ motif }: { motif: "grid" | "orbit" | "rule" }) {
  // Gradients are referenced by id, and three panels share this markup.
  const uid = useId().replace(/:/g, "");
  const warm = `motif-warm-${uid}`;
  const accent = `motif-accent-${uid}`;

  return (
    <svg className="av-record__motif" viewBox="0 0 300 300" aria-hidden focusable="false">
      <defs>
        <radialGradient id={warm} gradientUnits="userSpaceOnUse" cx="150" cy="150" r="168">
          <stop offset="0" className="av-record__stop--warm" />
          <stop offset="1" className="av-record__stop--clear" />
        </radialGradient>
        <linearGradient id={accent} gradientUnits="userSpaceOnUse" x1="20" y1="20" x2="280" y2="280">
          <stop offset="0" className="av-record__stop--a" />
          <stop offset="1" className="av-record__stop--b" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="300" height="300" fill={`url(#${warm})`} />

      {motif === "orbit" ? (
        <OrbitMotif accent={accent} />
      ) : motif === "rule" ? (
        <RuleMotif accent={accent} />
      ) : (
        <GridMotif accent={accent} />
      )}
    </svg>
  );
}

export function RecordPanel({ entry, index }: { entry: RecordEntry; index: number }) {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const text = root.querySelectorAll("[data-panel-text] > *");
      const art = root.querySelector("[data-panel-art]");
      const year = root.querySelector("[data-panel-year]");

      gsap.set(text, { autoAlpha: 0, y: 30 });
      gsap.set(art, { autoAlpha: 0, scale: 0.95 });

      const enter = () => {
        gsap.to(text, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
        });

        gsap.to(art, { autoAlpha: 1, scale: 1, duration: 1.1, ease: "power3.out" });
      };

      // The panel is hidden until this runs, so never leave it waiting on a
      // scroll position it has already passed.
      if (isInViewport(root)) enter();
      else ScrollTrigger.create({ trigger: root, start: "top 72%", once: true, onEnter: enter });

      // Opposed drift gives the panel depth without pinning the page. Damped to
      // sit in the same rhythm as the year behind it.
      gsap.to(art, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      });

      // The year drifts across the whole panel rather than tracking scroll 1:1,
      // and the scrub lag damps the wheel's stepping into a continuous glide.
      gsap.fromTo(
        year,
        { yPercent: -16 },
        {
          yPercent: 16,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
        },
      );

      // Every idle loop in the motif is collected so it can be parked while the
      // panel is off screen.
      const loops: gsap.core.Animation[] = [];

      // svgOrigin, not transformOrigin: the dots must spin around the ring
      // centre in viewBox units rather than around their own tiny bounding box.
      const orbit = root.querySelector("[data-orbit]");
      const orbitSlow = root.querySelector("[data-orbit-slow]");

      if (orbit) {
        loops.push(
          gsap.to(orbit, {
            rotation: 360,
            duration: 26,
            ease: "none",
            repeat: -1,
            svgOrigin: "150 150",
          }),
        );
      }

      if (orbitSlow) {
        loops.push(
          gsap.to(orbitSlow, {
            rotation: -360,
            duration: 38,
            ease: "none",
            repeat: -1,
            svgOrigin: "150 150",
          }),
        );
      }

      // Ripples ride the orbit group, so they only need to grow — the rotation
      // above carries them around the ring. Radius is animated as an attribute
      // rather than a scale so the parent rotation stays untouched.
      const waves = gsap.utils.toArray<SVGCircleElement>(root.querySelectorAll("[data-orbit-wave]"));

      waves.forEach((wave, order) => {
        loops.push(
          gsap.fromTo(
            wave,
            { attr: { r: WAVE_FROM }, opacity: 0.5 },
            {
              attr: { r: WAVE_TO },
              opacity: 0,
              duration: WAVE_CYCLE,
              ease: "sine.out",
              repeat: -1,
              delay: (order * WAVE_CYCLE) / waves.length,
            },
          ),
        );
      });

      // The dots breathe on a slower beat than the ripples so the two never
      // read as one pulse.
      const orbitDots = root.querySelectorAll("[data-orbit-dot]");
      const orbitHalo = root.querySelector("[data-orbit-halo]");

      if (orbitDots.length) {
        loops.push(
          gsap.to(orbitDots, {
            attr: { r: (_i: number, el: Element) => Number(el.getAttribute("r")) * 1.22 },
            duration: 1.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }),
        );
      }

      if (orbitHalo) {
        loops.push(
          gsap.to(orbitHalo, {
            attr: { r: 13 },
            opacity: 0.07,
            duration: 1.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }),
        );
      }

      // Grid: each cell runs its own fill-and-drain on a randomly phased cycle,
      // so the lattice reads as a continuous shimmer rather than a shared beat.
      const cells = gsap.utils.toArray<SVGRectElement>(root.querySelectorAll("[data-cell]"));

      if (cells.length) {
        const mesh = gsap.timeline();
        const randomCycle = gsap.utils.random(13, 26, true);
        const randomPeak = gsap.utils.random(0.62, 0.95, true);

        cells.forEach((cell) => {
          const cycle = randomCycle();

          const cellLoop = gsap.timeline({
            repeat: -1,
            repeatDelay: cycle,
            // Phase is spread across a whole cycle so fills and drains are always
            // overlapping somewhere — the lattice never lands on a shared beat.
            delay: cell.hasAttribute("data-seed")
              ? gsap.utils.random(0.4, 2.5)
              : gsap.utils.random(0, cycle),
          });

          cellLoop
            .to(cell, { fillOpacity: randomPeak(), duration: 1.3, ease: "sine.inOut" })
            .to(cell, { fillOpacity: 0, duration: 1.6, ease: "sine.inOut" });

          mesh.add(cellLoop, 0);
        });

        loops.push(mesh);
      }

      // Rule: a coordinated handoff lights a random next rule, then drains the
      // one that was up — never all at once, and never on a shared beat.
      const litRules = gsap.utils.toArray<SVGLineElement>(root.querySelectorAll("[data-rule-lit]"));
      const rules = root.querySelectorAll("[data-rule]");
      const caps = root.querySelectorAll("[data-cap]");

      if (litRules.length) loops.push(playRuleHandoff(litRules));

      // Damped so the lattice never drops far enough to lose a rule — the
      // hairline stays legible whether or not it is currently lit.
      if (rules.length) {
        loops.push(
          gsap.to(rules, {
            opacity: (_i: number, el: Element) => Number(el.getAttribute("opacity") ?? 1) * 0.6,
            duration: 1.9,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.18, from: "start" },
          }),
        );
      }

      if (caps.length) {
        loops.push(
          gsap.to(caps, {
            attr: { r: 4.2 },
            opacity: 0.9,
            duration: 1.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.16, from: "end" },
          }),
        );
      }

      // Three panels of endless motion is work the browser shouldn't do for
      // artwork nobody is looking at.
      if (!isInViewport(root)) loops.forEach((loop) => loop.pause());

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) =>
          loops.forEach((loop) => (self.isActive ? loop.resume() : loop.pause())),
      });
    });

    return () => mm.revert();
  }, []);

  const flipped = index % 2 === 1;

  return (
    <article
      ref={rootRef}
      className={`av-record__panel${flipped ? " is-flipped" : ""}`}
      aria-labelledby={`record-${entry.id}`}
    >
      <span className="av-record__year" data-panel-year aria-hidden>
        {entry.year}
      </span>

      <div className="av-record__art" data-panel-art>
        <Motif motif={entry.art.motif} />
        <div className="av-record__plate">
          {entry.art.kind === "logo" ? (
            <Image
              src={entry.art.src}
              alt={`${entry.company} logo`}
              width={entry.art.width}
              height={entry.art.height}
              className="av-record__logo"
              sizes="(min-width: 1024px) 30vw, 70vw"
            />
          ) : (
            <span className="av-record__wordmark">{entry.art.label}</span>
          )}
        </div>
      </div>

      <div className="av-record__text" data-panel-text>
        <p className="av-mono av-record__period">{entry.period}</p>
        <h3 className="av-record__company" id={`record-${entry.id}`}>
          {entry.company}
        </h3>
        <p className="av-record__role">{entry.title}</p>
        <p className="av-record__summary">{entry.summary}</p>
        <ul className="av-record__stack">
          {entry.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
