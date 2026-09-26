"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(options?: { includeTouch?: boolean }) {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth < MOBILE_BREAKPOINT || Boolean(options?.includeTouch && "ontouchstart" in window);
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const update = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT || Boolean(options?.includeTouch && "ontouchstart" in window));
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, [options?.includeTouch]);

  return isMobile;
}
