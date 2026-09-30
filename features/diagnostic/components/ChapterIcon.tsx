import { Check, Moon, ShieldAlert, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react";
import type { MiraChapter } from "../types";

const ICONS: Record<MiraChapter, LucideIcon> = {
  MORNING: Sunrise,
  MIDDAY: Sun,
  EVENING: Sunset,
  INNER_VOICE: Moon,
  COMPLETE: Check,
  SAFETY: ShieldAlert,
};

/** The day-arc icon for a chapter of the orientation journey (morning → inner voice). */
export function ChapterIcon({ chapter, className }: { chapter: MiraChapter; className?: string }) {
  const Icon = ICONS[chapter] ?? Sunrise;
  return <Icon className={className} aria-hidden />;
}
