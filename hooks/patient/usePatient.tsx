"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";
import { profileApi } from "@/lib/api/patient";
import type { Profile } from "@/lib/api/patient-types";
import { clearTokens, getAccessToken } from "@/lib/api/tokens";
import { ROUTES } from "@/lib/config/routes";
import { hasSeenWelcome } from "@/lib/patient/onboarding";
import { readCachedProfile, writeCachedProfile } from "@/lib/patient/profile-cache";
import { LiveUpdates } from "@/components/patient/shell/LiveUpdates";
import { clearPatientCache, seedPatientData, usePatientResource } from "@/hooks/usePatientResource";

type PatientContextValue = {
  profile: Profile;
  /** The name to greet with: the preferred name from onboarding, else the nickname. */
  name: string;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const PatientContext = createContext<PatientContextValue | null>(null);

export const WELCOME_ROUTE = "/welcome";
const TRACK_KEY = "vitamind_track";

type Gate = "checking" | "ready" | "error";

// The last profile this device loaded is put in the cache before the first screen renders, so a reload
// paints the real app at once and refreshes in the background. (Server renders have no storage: they
// show the skeleton, and the cache is read on the client only.)
if (typeof window !== "undefined" && getAccessToken()) {
  const cached = readCachedProfile();
  if (cached) seedPatientData("profile", cached);
}

const noSubscribe = () => () => {};
const readToken = () => Boolean(getAccessToken());

/**
 * Gate for everything behind sign-in: no token → sign-in; a patient who has not had
 * their first Lumina conversation → the welcome. The real shell shows at once (skeletons where
 * the patient's own data goes) and children render as soon as the profile is known - instantly
 * from the cached copy, then refreshed in the background - so no screen ever flashes another
 * patient's data or an anonymous state.
 */
export function PatientProvider({
  children,
  pending,
  errorFallback,
}: {
  children: ReactNode;
  /** Shown while the profile is still on its way (and while a redirect to the welcome is under way). */
  pending: ReactNode;
  errorFallback: (retry: () => void, error: Error | null) => ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // null on the server and during hydration; the real answer straight after, with no extra effect.
  const hasToken = useSyncExternalStore<boolean | null>(noSubscribe, readToken, () => null);
  const [signingOut, setSigningOut] = useState(false);
  const profileResource = usePatientResource<Profile>(hasToken ? "profile" : null, () => profileApi.get(), { staleMs: 60_000 });
  const { data: profile, error, refresh } = profileResource;

  // Remember the last known profile for the next reload.
  useEffect(() => {
    if (profile) writeCachedProfile(profile);
  }, [profile]);

  // The app tints itself to the patient's track (see "PATIENT TRACK THEMES" in globals.css). The
  // last track is remembered so the palette is right from the first paint of the next visit.
  const track = profile?.track;
  useEffect(() => {
    const root = document.documentElement;
    const apply = (value: string | null) => (value ? (root.dataset.track = value) : delete root.dataset.track);
    if (track) {
      apply(track);
      try {
        window.localStorage.setItem(TRACK_KEY, track);
      } catch {
        /* the palette simply is not remembered */
      }
    } else {
      try {
        apply(window.localStorage.getItem(TRACK_KEY));
      } catch {
        /* default palette */
      }
    }
    return () => {
      delete root.dataset.track;
    };
  }, [track]);

  const unauthorized = hasToken === false || (error instanceof ApiError && error.isUnauthorized);

  useEffect(() => {
    if (!unauthorized || signingOut) return;
    clearTokens();
    clearPatientCache();
    router.replace(`${ROUTES.signIn}?redirect=${encodeURIComponent(pathname || ROUTES.dashboard)}`);
  }, [unauthorized, signingOut, router, pathname]);

  // Only the first arrival is forced through the welcome; afterwards the patient may
  // leave the first conversation and finish it later from Lumina.
  const needsWelcome = Boolean(profile && !profile.hasCompletedOnboarding && profile.hasLuminaAccess && !hasSeenWelcome(profile.id));
  const onWelcomeFlow = pathname === WELCOME_ROUTE;

  useEffect(() => {
    if (needsWelcome && !onWelcomeFlow) router.replace(WELCOME_ROUTE);
  }, [needsWelcome, onWelcomeFlow, router]);

  const signOut = useCallback(async () => {
    // The live stream closes first: nothing keeps listening for a patient who is leaving.
    setSigningOut(true);
    await authApi.logout().catch(() => undefined);
    clearPatientCache();
    router.replace(ROUTES.signIn);
  }, [router]);

  const refreshProfile = useCallback(() => refresh(), [refresh]);

  const value = useMemo<PatientContextValue | null>(
    () => (profile ? { profile, name: profile.preferredName || profile.nickname, refreshProfile, signOut } : null),
    [profile, refreshProfile, signOut],
  );

  const gate: Gate = unauthorized || hasToken === null || (!profile && !error) ? "checking" : profile ? "ready" : "error";

  if (gate === "checking") return <>{pending}</>;
  if (gate === "error" || !value) return <>{errorFallback(() => void refresh(), error)}</>;
  if (needsWelcome && !onWelcomeFlow) return <>{pending}</>;
  return (
    <PatientContext.Provider value={value}>
      {!signingOut && <LiveUpdates />}
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) throw new Error("usePatient must be used within a PatientProvider");
  return context;
}
