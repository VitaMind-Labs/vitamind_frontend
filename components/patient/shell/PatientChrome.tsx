"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { NotificationBell } from "@/components/patient/shell/NotificationBell";
import { isActive, PATIENT_NAV, visibleNav, type PatientNavKey } from "@/components/patient/shell/nav";
import { usePatient } from "@/hooks/patient/usePatient";
import { useCalmTrack } from "@/hooks/useCalmTrack";
import { profileApi } from "@/lib/api/patient";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Desktop rail: the dark teal navigation with Lumina's "you're not alone" card. */
export function PatientRail() {
  const pathname = usePathname();
  const copy = usePatientCopy();
  const { signOut, profile } = usePatient();
  const [signingOut, setSigningOut] = useState(false);
  // Spark shows only for the patients the backend flags (ADHD track); the API refuses everyone else regardless.
  const main = visibleNav(profile.hasSpark).filter((item) => item.key !== "settings");
  const settings = PATIENT_NAV.find((item) => item.key === "settings")!;

  return (
    <aside className="lm-rail sticky top-4 m-4 me-0 hidden h-[calc(100dvh-2rem)] w-64 shrink-0 self-start lg:flex lg:flex-col">
      <div className="px-5 pb-3 pt-6">
        <span className="inline-flex rounded-2xl bg-white/90 px-3 py-1.5 shadow-sm">
          <BrandLogo size="sm" href={null} />
        </span>
      </div>

      <RailProfile />

      <nav aria-label={copy.shell.navLabel} className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {main.map(({ key, href, icon: Icon }) => (
          <Link key={key} href={href} aria-current={isActive(pathname, href) ? "page" : undefined} className="lm-nav-link">
            <Icon className="size-[1.125rem] shrink-0" aria-hidden />
            {copy.shell.nav[key]}
          </Link>
        ))}
      </nav>

      <div className="space-y-3 px-3 pb-4">
        <div className="space-y-1 border-t border-white/10 pt-3">
          <Link href={settings.href} aria-current={isActive(pathname, settings.href) ? "page" : undefined} className="lm-nav-link">
            <settings.icon className="size-[1.125rem] shrink-0" aria-hidden />
            {copy.shell.nav.settings}
          </Link>
          <button
            type="button"
            disabled={signingOut}
            onClick={() => {
              setSigningOut(true);
              void signOut();
            }}
            className="lm-nav-link w-full disabled:opacity-60"
          >
            <LogOut className="size-[1.125rem] shrink-0 rtl:-scale-x-100" aria-hidden />
            {copy.shell.signOut}
          </button>
        </div>
      </div>
    </aside>
  );
}

/** Language switch and notifications, shared by the desktop rail and the small-screen strip. */
function PatientUtilities({ side }: { side: "rail" | "strip" }) {
  const { refreshProfile } = usePatient();
  // Lumina answers in the patient's profile language, so the switch updates it too.
  return (
    <>
      <LanguageSwitcher onChange={(language) => void profileApi.update({ language: language === "ar" ? "AR" : "EN" }).then(refreshProfile, () => undefined)} />
      <NotificationBell placement={side} />
    </>
  );
}

/** Rail header: the patient's avatar and name (a shortcut to settings), with language and notifications beneath. */
function RailProfile() {
  const { name } = usePatient();
  const copy = usePatientCopy();
  const initial = (name.trim()[0] ?? "V").toUpperCase();

  return (
    <div className="mx-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-sm">
      <Link
        href="/dashboard/settings"
        aria-label={copy.shell.nav.settings}
        className="flex items-center gap-3 rounded-xl p-1 transition-colors hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
      >
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-teal-700 text-base font-semibold text-white shadow-brand ring-2 ring-white/25">
          {initial}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold leading-tight text-white" dir="auto">{name}</span>
          <span className="mt-0.5 block text-xs text-white/60">{copy.shell.nav.settings}</span>
        </span>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
        <PatientUtilities side="rail" />
      </div>
    </div>
  );
}

/**
 * Small screens have no rail, so the same brand, language switch and notifications sit in a slim
 * strip at the top of the page. It scrolls away with the content: there is no fixed header.
 */
export function PatientMobileStrip() {
  const { name } = usePatient();
  const copy = usePatientCopy();
  const initial = (name.trim()[0] ?? "V").toUpperCase();

  return (
    <div className="lm-topbar flex items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-6 lg:hidden">
      <BrandLogo size="md" href={null} />
      <div className="flex items-center gap-2.5">
        <PatientUtilities side="strip" />
        <Link
          href="/dashboard/settings"
          aria-label={copy.shell.nav.settings}
          className="inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-800 text-sm font-semibold text-white shadow-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          {initial}
        </Link>
      </div>
    </div>
  );
}

/** Small-screen tab bar: the five daily screens with Lumina raised in the middle. */
export function PatientTabBar() {
  const pathname = usePathname();
  const copy = usePatientCopy();
  const { profile } = usePatient();
  // Schizophrenia / psychosis tracks: the active pill fades in place instead of sliding between tabs.
  const calm = useCalmTrack();
  const tabs = (profile.hasSpark
    ? ["home", "checkin", "lumina", "spark", "journal", "reports"]
    : ["home", "checkin", "lumina", "journal", "reports"]) as ReadonlyArray<Exclude<PatientNavKey, "settings">>;

  return (
    <nav
      aria-label={copy.shell.navLabel}
      className={cn(
        "lm-glass lm-tabbar fixed inset-x-3 bottom-3 z-40 grid items-end rounded-[1.75rem] px-1.5 pb-1.5 pt-1.5 lg:hidden",
        tabs.length === 6 ? "grid-cols-6" : "grid-cols-5",
      )}
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      {tabs.map((key) => {
        const item = PATIENT_NAV.find((entry) => entry.key === key)!;
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        const center = key === "lumina";
        return (
          <Link
            key={key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[0.625rem] font-medium leading-tight",
              active ? "text-teal-800" : "text-ink-muted",
              center && "-mt-5",
            )}
          >
            {active && !center && (
              calm ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="absolute inset-0 rounded-2xl bg-teal-100/80" aria-hidden />
              ) : (
                <motion.span layoutId="tab-pill" transition={SPRING_SOFT} className="absolute inset-0 rounded-2xl bg-teal-100/80" aria-hidden />
              )
            )}
            <span
              className={cn(
                "relative flex items-center justify-center",
                center && "size-12 rounded-full bg-gradient-to-br from-teal-300 to-teal-700 text-white shadow-brand ring-4 ring-white/70",
              )}
            >
              <Icon className={center ? "size-5" : "size-[1.15rem]"} aria-hidden />
            </span>
            <span className="relative max-w-full truncate px-0.5">{copy.shell.nav[key]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
