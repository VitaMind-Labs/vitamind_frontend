"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether a CSS media query matches, kept in sync with the window. The server (and the first client render) answer
 * `false`, so markup that must not flash should be hidden with CSS and only the logic should depend on this.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
