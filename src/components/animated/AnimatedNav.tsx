"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animatedView } from "@/data/animatedView";
import { Monogram } from "@/components/icons/Monogram";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAnchorNavigation } from "./SmoothScroll";

const SECTION_IDS = animatedView.nav.map((item) => item.id);

export function AnimatedNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(SECTION_IDS[0]);
  const [condensed, setCondensed] = useState(false);

  const progressRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const onAnchorClick = useAnchorNavigation();

  /* Scroll progress + condensed state, both written from one rAF-throttled read
     so the header never forces extra layout during scroll. */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }
      setCondensed(window.scrollY > 24);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.05, 0.25, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  /* Menu is a modal surface: lock the page, trap Tab inside it, and close on
     Escape returning focus to the trigger. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <header className={`av-nav${condensed ? " is-condensed" : ""}`}>
      <div className="av-nav__bar">
        <a
          href="#top"
          className="av-nav__logo"
          aria-label={animatedView.name}
          onClick={(event) => {
            setOpen(false);
            onAnchorClick(event, "#top");
          }}
        >
          <Monogram decorative />
        </a>

        <nav className="av-nav__links" aria-label="Sections">
          {animatedView.nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`av-nav__link${active === item.id ? " is-active" : ""}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={(event) => onAnchorClick(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="av-nav__actions">
          <a
            href={animatedView.journeyHref}
            className="av-nav__classic"
            target="_blank"
            rel="noreferrer noopener"
          >
            Journey
          </a>
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className={`av-nav__toggle${open ? " is-open" : ""}`}
            aria-expanded={open}
            aria-controls="av-nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <span className="av-nav__progress" aria-hidden>
        <span ref={progressRef} className="av-nav__progress-fill" />
      </span>

      <div
        id="av-nav-menu"
        ref={panelRef}
        className={`av-nav__menu${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
      >
        <ol className="av-nav__menu-list">
          {animatedView.nav.map((item, index) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="av-nav__menu-link"
                onClick={(event) => {
                  setOpen(false);
                  onAnchorClick(event, item.href);
                }}
              >
                <span className="av-nav__menu-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
        <a
          href={animatedView.journeyHref}
          className="av-nav__menu-classic"
          target="_blank"
          rel="noreferrer noopener"
        >
          Journey
        </a>
      </div>
    </header>
  );
}
