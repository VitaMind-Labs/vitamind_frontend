import { BookHeart, BookOpen, FileText, HeartPulse, House, Settings, Zap, type LucideIcon } from "lucide-react";

import { showsReads, type HomeTrack } from "@/lib/patient/content";

export type PatientNavKey = "home" | "checkin" | "journal" | "spark" | "library" | "reports" | "settings";

/** The patient screens, in the order they appear. */
export const PATIENT_NAV: { key: PatientNavKey; href: string; icon: LucideIcon }[] = [
  { key: "home", href: "/dashboard", icon: House },
  { key: "checkin", href: "/dashboard/check-in", icon: HeartPulse },
  { key: "journal", href: "/dashboard/journal", icon: BookOpen },
  { key: "spark", href: "/dashboard/spark", icon: Zap },
  { key: "library", href: "/dashboard/library", icon: BookHeart },
  { key: "reports", href: "/dashboard/reports", icon: FileText },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
];

export function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The screens for a track: the library is there for bipolar, schizophrenia and psychosis; Spark, the task
 * assistant, takes its place for ADHD. Neither shows before the track is known.
 */
export function navFor(track: HomeTrack | undefined) {
  return PATIENT_NAV.filter((item) => {
    if (item.key === "library") return track !== undefined && showsReads(track);
    if (item.key === "spark") return track === "ADHD";
    return true;
  });
}
