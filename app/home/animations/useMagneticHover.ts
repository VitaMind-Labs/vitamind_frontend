"use client";

import { useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useRef } from "react";

export function useMagneticHover<T extends HTMLElement = HTMLElement>(strength = 14) {
  const ref = useRef<T | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMouseMove = (event: ReactMouseEvent<T>) => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    x.set(relativeX * strength);
    y.set(relativeY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    ref,
    magneticX: springX,
    magneticY: springY,
    magneticHandlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
