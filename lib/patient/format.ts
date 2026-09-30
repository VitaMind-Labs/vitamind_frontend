import type { Lang } from "@/lib/i18n/config";

const locale = (language: Lang) => (language === "ar" ? "ar" : "en");

/** The patient's local calendar day as YYYY-MM-DD (what the backend expects for daily records). */
export function localDay(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** A YYYY-MM-DD day parsed as a local date (no timezone shift). */
export function parseDay(day: string): Date {
  const [y, m, d] = day.slice(0, 10).split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function formatDay(day: string | Date, language: Lang, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  const date = typeof day === "string" ? (day.length <= 10 ? parseDay(day) : new Date(day)) : day;
  return new Intl.DateTimeFormat(locale(language), options).format(date);
}

export function formatRange(from: string, to: string, language: Lang) {
  return `${formatDay(from, language)} – ${formatDay(to, language)}`;
}

export function formatTime(value: string | Date, language: Lang) {
  return new Intl.DateTimeFormat(locale(language), { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export function formatNumber(value: number, language: Lang, digits = 1) {
  return new Intl.NumberFormat(locale(language), { maximumFractionDigits: digits }).format(value);
}

/** Which day (1–7) of a 7-day period starting on `start` (YYYY-MM-DD) it is today. */
export function dayOfPeriod(start: string): number {
  const elapsed = Math.floor((Date.now() - parseDay(start).getTime()) / 86_400_000);
  return Math.max(1, Math.min(7, elapsed + 1));
}

/** A copy of `date` moved by whole local days. */
export function addDaysLocal(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export type DayPart = "morning" | "afternoon" | "evening" | "night";

export function dayPart(date: Date = new Date()): DayPart {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

/** Consecutive days with a record, ending today (or yesterday while today is still open). */
export function currentStreak(days: string[], today: Date = new Date()): number {
  const set = new Set(days.map((d) => d.slice(0, 10)));
  const cursor = new Date(today);
  if (!set.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(localDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
