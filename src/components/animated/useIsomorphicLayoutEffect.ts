"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * GSAP needs to set its "from" state before the browser paints, otherwise
 * revealed elements flash at their final position. On the server there is no
 * layout pass, so fall back to `useEffect` to avoid React's SSR warning.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
