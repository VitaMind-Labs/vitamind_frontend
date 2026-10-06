"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CircleHelp } from "lucide-react";
import { TourOverlay } from "@/components/patient/tour/TourOverlay";
import { usePatient } from "@/hooks/patient/usePatient";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { ROUTES } from "@/lib/config/routes";
import { hasSeenTour, markTourSeen, resolveTourSteps, type TourStep } from "@/lib/patient/tour";
import { cn } from "@/lib/utils";

const TourContext = createContext<{ start: () => void } | null>(null);

/** Cards fade in on a stagger that ends near 1.7s; the tour opens just after, and retries while targets are still mounting. */
const FIRST_VISIT_DELAY_MS = 1900;
const RETRY_MS = 700;
const MAX_TRIES = 5;
const MIN_STEPS = 3;

/**
 * Owns the home tour: opens it once on a patient's first visit to the home screen and again whenever they ask
 * (`useTour().start`, from any screen). Steps are resolved when it opens, from the patient's track and what is on screen.
 */
export function TourProvider({ children }: { children: ReactNode }) {
  const { profile } = usePatient();
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === ROUTES.dashboard;
  const [steps, setSteps] = useState<TourStep[] | null>(null);
  const [requested, setRequested] = useState(false);
  const { id: patientId, track } = profile;

  // Opens when enough of the screen is there to be worth touring; keeps looking for a moment otherwise.
  const openWhenReady = useCallback(
    (delay: number) => {
      let tries = 0;
      let timer = window.setTimeout(function attempt() {
        const resolved = resolveTourSteps(track);
        if (resolved.length >= MIN_STEPS) {
          setSteps(resolved);
          setRequested(false);
        } else if (++tries < MAX_TRIES) {
          timer = window.setTimeout(attempt, RETRY_MS);
        } else {
          setRequested(false);
        }
      }, delay);
      return () => window.clearTimeout(timer);
    },
    [track],
  );

  // First visit.
  useEffect(() => {
    if (!onHome || steps || requested || hasSeenTour(patientId)) return;
    return openWhenReady(FIRST_VISIT_DELAY_MS);
  }, [onHome, steps, requested, patientId, openWhenReady]);

  // Asked for again (possibly from another screen: the tour is about home, so go there first).
  useEffect(() => {
    if (!requested || !onHome) return;
    return openWhenReady(450);
  }, [requested, onHome, openWhenReady]);

  // Leaving home ends the tour without counting it as seen.
  useEffect(() => {
    if (!onHome) setSteps(null);
  }, [onHome]);

  const start = useCallback(() => {
    setRequested(true);
    if (!onHome) router.push(ROUTES.dashboard);
  }, [onHome, router]);

  const close = useCallback(() => {
    markTourSeen(patientId);
    setSteps(null);
  }, [patientId]);

  const value = useMemo(() => ({ start }), [start]);

  return (
    <TourContext.Provider value={value}>
      {children}
      {steps && <TourOverlay steps={steps} onClose={close} />}
    </TourContext.Provider>
  );
}

export function useTour() {
  return useContext(TourContext);
}

/** "Take the tour again". Styled by the caller (`className`), so the rail and the page can each use their own look. */
export function TourReplayButton({ className }: { className?: string }) {
  const tour = useTour();
  const copy = usePatientCopy();
  if (!tour) return null;
  return (
    <button type="button" onClick={tour.start} className={cn(className)}>
      <CircleHelp className="size-[1.125rem] shrink-0" aria-hidden />
      {copy.tour.replay}
    </button>
  );
}
