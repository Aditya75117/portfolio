"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "./motion";

type ScrollTo = (target: string | HTMLElement) => void;

type SetScrollLocked = (locked: boolean) => void;

const SmoothScrollContext = createContext<ScrollTo | null>(null);
const ScrollLockContext = createContext<SetScrollLocked | null>(null);

/**
 * Drives Lenis from the GSAP ticker so smoothing and ScrollTrigger share one
 * rAF loop. Reduced-motion visitors keep native scrolling entirely — Lenis is
 * never constructed for them.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  // Trigger positions are measured against fallback font metrics on first
  // paint; without this the whole page's start points stay off by however much
  // the display serif reflows the headlines when it swaps in.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => window.removeEventListener("load", refresh);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
      // Touch devices keep their native momentum; overriding it feels worse
      // than the smoothing gains.
      syncTouch: false,
    });

    lenisRef.current = lenis;
    document.documentElement.classList.add("av-smooth");

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("av-smooth");
    };
  }, []);

  const scrollTo = useCallback<ScrollTo>((target) => {
    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el, { offset: -12 });
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, []);

  // `overflow: hidden` on the body does not reach Lenis — it drives scrolling
  // itself from wheel/touch events — so overlays have to pause it explicitly.
  const setScrollLocked = useCallback<SetScrollLocked>((locked) => {
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, []);

  return (
    <SmoothScrollContext.Provider value={scrollTo}>
      <ScrollLockContext.Provider value={setScrollLocked}>{children}</ScrollLockContext.Provider>
    </SmoothScrollContext.Provider>
  );
}

export function useScrollLock() {
  return useContext(ScrollLockContext);
}

/**
 * Returns a handler for in-page anchors that keeps the URL hash (and therefore
 * back/forward and copy-link behaviour) while routing the actual movement
 * through Lenis. Focus is moved to the target so keyboard users land there too.
 */
export function useAnchorNavigation() {
  const scrollTo = useContext(SmoothScrollContext);

  return useMemo(
    () => (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;

      const el = document.querySelector<HTMLElement>(href);
      if (!el) return;

      event.preventDefault();
      history.pushState(null, "", href);

      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });

      if (scrollTo) scrollTo(el);
      else el.scrollIntoView({ block: "start" });
    },
    [scrollTo],
  );
}
