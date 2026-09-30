"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { HEADER_HEIGHT } from "@/components/layout/site-header";
import { LogoSpinner } from "@/components/shared/LogoLoader";
import { OrientationBackdrop } from "./OrientationBackdrop";

const BAR = "animate-pulse rounded-full bg-white/80 motion-reduce:animate-none";

/**
 * Suspense / route-loading state for /orientation: the real layout in outline, so the
 * page settles into place instead of flashing from a spinner to a full interface.
 */
export function OrientationSkeleton() {
  const { dictionary, direction } = useLanguage();

  return (
    <div dir={direction} className="relative flex h-dvh flex-col overflow-hidden" role="status" aria-live="polite">
      <OrientationBackdrop />
      <div className={`relative border-b border-white/70 ${HEADER_HEIGHT}`} />

      <div className="relative mx-auto grid min-h-0 w-full max-w-chat flex-1 gap-5 px-4 pb-3 pt-3 sm:px-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-6 lg:px-8 lg:pb-6 lg:pt-5 xl:grid-cols-[21.5rem_minmax(0,1fr)]">
        <div className="orientation-glass hidden flex-col gap-4 p-6 lg:flex">
          <span className={`${BAR} h-3 w-40`} />
          <span className={`${BAR} h-8 w-56`} />
          <span className={`${BAR} h-8 w-40`} />
          <span className={`${BAR} mt-2 h-3 w-full`} />
          <span className={`${BAR} h-3 w-4/5`} />
          <div className="orientation-tile mt-4 h-28" />
          <div className="orientation-tile h-24" />
        </div>

        <div className="orientation-glass flex min-h-0 flex-col p-5 sm:p-8">
          <div className="flex items-center gap-4">
            <LogoSpinner size={48} />
            <span className="text-sm text-ink-muted">{dictionary.diagnostic.preparing}</span>
          </div>
          <div className="ms-16 mt-4 max-w-xl space-y-2.5">
            <span className={`${BAR} block h-3 w-full`} />
            <span className={`${BAR} block h-3 w-11/12`} />
            <span className={`${BAR} block h-3 w-2/3`} />
          </div>
          <div className="mt-auto h-16 rounded-full border border-white bg-white/70 shadow-soft" />
        </div>
      </div>
    </div>
  );
}
