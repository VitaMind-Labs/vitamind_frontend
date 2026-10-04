import type { Profile } from "@/lib/api/patient-types";
import { getSessionUser, PROFILE_CACHE_KEY } from "@/lib/api/tokens";

/**
 * The last profile this device loaded, so a reload paints the real app at once and refreshes in the
 * background. It belongs to the signed-in patient only: it is checked against the session's user id,
 * expires after a week, and is removed together with the session tokens (see `clearTokens`).
 */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type Stored = { savedAt: number; profile: Profile };

export function readCachedProfile(): Profile | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return undefined;
    const stored = JSON.parse(raw) as Stored;
    const user = getSessionUser();
    const fresh = Date.now() - stored.savedAt < MAX_AGE_MS;
    // A copy saved before `hasAccess` existed is the old shape: ignore it.
    const current = typeof stored.profile?.hasAccess === "boolean";
    return fresh && current && user && stored.profile.id === user.id ? stored.profile : undefined;
  } catch {
    return undefined;
  }
}

export function writeCachedProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), profile } satisfies Stored));
  } catch {
    /* storage unavailable: the next load simply waits for the network */
  }
}
