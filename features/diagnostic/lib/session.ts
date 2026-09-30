const STORAGE_KEY = "vitamind-diagnostic-session-id";
const CLAIM_KEY_PREFIX = "vitamind-mira-claim:";

function safeGet(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

/** Latest Mira session of this browser — the one signup attaches to the new account. */
export function storeDiagnosticSessionId(sessionId: string) {
  safeSet(STORAGE_KEY, sessionId);
}

export function getStoredDiagnosticSessionId() {
  return safeGet(STORAGE_KEY);
}

/**
 * One-time `claim_token` returned by POST /api/v1/mira/session. The backend needs it
 * (or the same client fingerprint + IP) to attach the anonymous session at signup.
 */
export function storeDiagnosticClaimToken(sessionId: string, claimToken: string) {
  safeSet(`${CLAIM_KEY_PREFIX}${sessionId}`, claimToken);
}

export function getDiagnosticClaimToken(sessionId: string) {
  return safeGet(`${CLAIM_KEY_PREFIX}${sessionId}`);
}

/** Forget the session once it belongs to an account (the token is single-use). */
export function clearDiagnosticClaim(sessionId: string) {
  safeSet(`${CLAIM_KEY_PREFIX}${sessionId}`, null);
  if (getStoredDiagnosticSessionId() === sessionId) safeSet(STORAGE_KEY, null);
}
