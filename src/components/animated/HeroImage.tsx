"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK } from "./motion";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Hero photograph, wiped in behind a clip mask with the image itself drifting
 * at a slower rate than its frame. The duotone treatment lives in CSS so the
 * photo re-tints with the theme instead of fighting the warm palette.
 */
export function HeroImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const frame = root.querySelector("[data-photo-frame]");
      const image = root.querySelector("[data-photo-image]");

      const intro = gsap.timeline({ delay: 0.45 });
      intro
        .fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out" },
        )
        .fromTo(image, { scale: 1.18 }, { scale: 1, duration: 1.4, ease: "power3.out" }, "<");

      gsap.to(image, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="av-hero__media" ref={rootRef}>
      <figure className="av-hero__frame" data-photo-frame>
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={2398}
          priority
          sizes="(min-width: 991px) 34vw, (min-width: 768px) 60vw, 90vw"
          className="av-hero__photo"
          data-photo-image
        />
        <span className="av-hero__duotone" aria-hidden />
        <figcaption className="av-hero__caption">{caption}</figcaption>
      </figure>
    </div>
  );
}
