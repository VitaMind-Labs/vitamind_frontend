"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export function useSectionInView<T extends HTMLElement = HTMLElement>(amount = 0.18) {
  const ref = useRef<T | null>(null);
  const isInView = useInView(ref, { once: true, amount });

  return { ref, isInView };
}
