"use client";

import type { ReactNode } from "react";
import { LuminaOrb } from "@/components/patient/ui/primitives";
import { PatientMobileStrip, PatientRail, PatientTabBar } from "@/components/patient/shell/PatientChrome";
import { LogoLoader } from "@/components/shared/LogoLoader";
import { Button } from "@/components/ui/button";
import { PatientProvider } from "@/hooks/patient/usePatient";
import { usePatientCopy } from "@/hooks/usePatientCopy";

/** Full-screen calm loader shown while the patient's profile loads. */
export function PatientLoading() {
  const copy = usePatientCopy();
  return (
    <div className="lm-canvas flex min-h-dvh items-center justify-center">
      <LogoLoader label={copy.common.loading} />
    </div>
  );
}

function PatientLoadError({ retry }: { retry: () => void }) {
  const copy = usePatientCopy();
  return (
    <div className="lm-canvas flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center" role="alert">
      <LuminaOrb size={56} breathe={false} />
      <p className="max-w-sm text-sm text-muted-foreground">{copy.common.loadError}</p>
      <Button onClick={retry}>{copy.common.retry}</Button>
    </div>
  );
}

/** Auth + onboarding gate for any screen that needs the signed-in patient (dashboard and welcome). */
export function PatientGate({ children }: { children: ReactNode }) {
  return (
    <PatientProvider fallback={<PatientLoading />} errorFallback={(retry) => <PatientLoadError retry={retry} />}>
      {children}
    </PatientProvider>
  );
}

/** The signed-in patient's frame: navigation rail (profile, language, notifications), mobile tab bar and a skip link. */
export function PatientChrome({ children }: { children: ReactNode }) {
  const copy = usePatientCopy();
  return (
    <PatientGate>
      <div className="lm-canvas min-h-dvh text-foreground lg:flex">
        <a
          href="#patient-main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
        >
          {copy.shell.skipToContent}
        </a>
        <PatientRail />
        <div className="min-w-0 flex-1">
          <PatientMobileStrip />
          <main id="patient-main" className="mx-auto w-full max-w-[88rem] px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            {children}
          </main>
        </div>
        <PatientTabBar />
      </div>
    </PatientGate>
  );
}
