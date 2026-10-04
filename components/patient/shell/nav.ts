import { BookHeart, BookOpen, FileText, HeartPulse, House, Settings, type LucideIcon } from "lucide-react";

import { showsReads, type HomeTrack } from "@/lib/patient/content";

export type PatientNavKey = "home" | "checkin" | "journal" | "library" | "reports" | "settings";

/** The patient screens, in the order they appear. */
export const PATIENT_NAV: { key: PatientNavKey; href: string; icon: LucideIcon }[] = [
  { key: "home", href: "/dashboard", icon: House },
  { key: "checkin", href: "/dashboard/check-in", icon: HeartPulse },
  { key: "journal", href: "/dashboard/journal", icon: BookOpen },
  { key: "library", href: "/dashboard/library", icon: BookHeart },
  { key: "reports", href: "/dashboard/reports", icon: FileText },
  { key: "settings", href: "/dashboard/settings", icon: Settings },
];

export function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/** The screens for a track: the library is there for bipolar, schizophrenia and psychosis — not for ADHD (or before the track is known). */
export function navFor(track: HomeTrack | undefined) {
  return PATIENT_NAV.filter((item) => item.key !== "library" || (track !== undefined && showsReads(track)));
}
