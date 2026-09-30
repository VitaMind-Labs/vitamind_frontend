"use client";

import { useAnimate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * Soft re-settle of a content region when the language flips, so the RTL/LTR swap never reads as a jump.
 * Attach the returned ref to content only — never to an ancestor of fixed-position chrome.
 */
export function useLanguageTransition<T extends HTMLElement>() {
  const { language } = useLanguage();
  const [scope, animate] = useAnimate<T>();
  const reduce = useReducedMotion();
  const previous = useRef(language);

  useEffect(() => {
    if (previous.current === language || !scope.current) return;
    previous.current = language;
    animate(scope.current, reduce ? { opacity: [0.6, 1] } : { opacity: [0.35, 1], y: [6, 0] }, { duration: DURATION.base, ease: EASE_OUT });
  }, [language, animate, reduce, scope]);

  return scope;
}
