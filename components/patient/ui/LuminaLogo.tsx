"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LUMINA_MARK_SRC } from "@/components/layout/site-header/AgentAvatar";
import { useCalmTrack } from "@/hooks/useCalmTrack";
import { cn } from "@/lib/utils";

/**
 * Lumina's mark — the teal leaves and figure inside a gold ring — on a luminous white disc
 * with a soft gold halo. `presence` adds the calm "here with you" dot; `float` lets it drift
 * gently; `glow` strengthens the halo for hero moments (all motion stops under reduced motion).
 */
export function LuminaLogo({
  size = 48,
  presence = false,
  float = false,
  glow = false,
  className,
}: {
  size?: number;
  presence?: boolean;
  float?: boolean;
  glow?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const calm = useCalmTrack();
  return (
    <motion.span
      aria-hidden
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size } as CSSProperties}
      animate={float && !reduce && !calm ? { y: [0, -8, 0] } : undefined}
      transition={float ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <span className={cn("lm-logo-halo absolute rounded-full", glow ? "inset-[-30%] opacity-100" : "inset-[-14%] opacity-70")} />
      <span className="lm-logo-disc relative flex size-full items-center justify-center rounded-full">
        <Image src={LUMINA_MARK_SRC} alt="" width={Math.min(256, Math.ceil(size * 2))} height={Math.min(256, Math.ceil(size * 2))} className="size-[84%] object-contain" priority={size >= 96} />
      </span>
      {presence && (
        <span className="absolute bottom-[4%] end-[4%] flex size-3.5 items-center justify-center rounded-full bg-white">
          <span className="absolute size-2.5 animate-ping rounded-full bg-sage opacity-50 motion-reduce:hidden" />
          <span className="relative size-2.5 rounded-full bg-sage" />
        </span>
      )}
    </motion.span>
  );
}
