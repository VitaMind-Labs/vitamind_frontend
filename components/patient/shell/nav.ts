import { BookOpen, FileText, HeartPulse, House, Settings, Sparkles, Zap, type LucideIcon } from "lucide-react";

export type PatientNavKey = "home" | "checkin" | "lumina" | "mira" | "spark" | "journal" | "reports" | "settings";

/**
 * The patient screens, in the order they appear. `spark` is only for patients the backend
 * marks `hasSpark` (ADHD track): use `visibleNav()`, never this list directly.
 */
export const PATIENT_NAV: { key: PatientNavKey; href: string; icon: LucideIcon }[] = [
  { key: "home", href: "/dashboard", icon: House },
  { key: "checkin", href: "/dashboard/check-in", icon: HeartPulse },
  { key: "lumina", href: "/dashboard/lumina", icon: Sparkles },
  { key: "spark", href: "/dashboard/spark", icon: Zap },
  { key: "journal", href: "/dashboard/journal", icon: BookOpen },
  { key: "reports", href: "/dashboard/reports", icon: FileText },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
];

/** The navigation for this patient: Spark appears only when the backend says they have it. */
export function visibleNav(hasSpark: boolean) {
  return PATIENT_NAV.filter((item) => item.key !== "spark" || hasSpark);
}

export function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The clean white surface covers every patient screen except Lumina's and Spark's own, which keep
 * their immersive look. It is switched on with `data-surface="clean"` (see "CLEAN SURFACE" in globals.css).
 */
export function isCleanSurface(pathname: string) {
  return !isActive(pathname, "/dashboard/lumina") && !isActive(pathname, "/dashboard/spark");
}
