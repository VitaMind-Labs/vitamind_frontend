"use client";

import { Icon } from "@iconify/react";
import type { MoodLevel } from "@/lib/patient/moods";
import { cn } from "@/lib/utils";

/**
 * A mood face as a real, full-colour emoji image (Noto Emoji): the same on every phone and browser,
 * never a flat icon. While the image loads — or if it cannot — the system emoji stands in, so nothing is ever empty.
 */
export function MoodEmoji({ level, className }: { level: Pick<MoodLevel, "icon" | "emoji">; className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex shrink-0 items-center justify-center leading-none", className)}>
      <Icon icon={level.icon} width="1em" height="1em" fallback={<span>{level.emoji}</span>} className="size-[1em]" />
    </span>
  );
}
