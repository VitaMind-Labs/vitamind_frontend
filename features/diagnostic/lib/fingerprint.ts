/**
 * Stable per-browser client fingerprint for Mira anti-abuse.
 *
 * This is a soft signal (a persisted random id): clearing site data resets it, which is
 * acceptable for the stated goal — preventing casual database bloat from abandoned/fake
 * sessions. The server pairs it with the request IP and stores only HMAC(fingerprint:ip),
 * never the raw value (see backend MiraService.computeClientKeyHash).
 */
import { FINGERPRINT_HEADER } from "@/lib/api/config";
import { getAccessToken } from "@/lib/api/tokens";

export { FINGERPRINT_HEADER };

const FINGERPRINT_KEY = "vitamind-client-fp";

export function getClientFingerprint(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let fingerprint = window.localStorage.getItem(FINGERPRINT_KEY);
    if (!fingerprint) {
      fingerprint =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `fp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(FINGERPRINT_KEY, fingerprint);
    }
    return fingerprint;
  } catch {
    return null;
  }
}

/**
 * Identity headers for every Mira call, ready to spread into a fetch init: the anonymous
 * fingerprint, plus the patient's bearer token when signed in. With the token, the session is
 * the patient's own and the device attempt limit (a bound on anonymous use) does not apply.
 * A stale token is harmless: the API falls back to treating the caller as anonymous.
 */
export function fingerprintHeaders(): Record<string, string> {
  const fingerprint = getClientFingerprint();
  const token = getAccessToken();
  return {
    ...(fingerprint ? { [FINGERPRINT_HEADER]: fingerprint } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
