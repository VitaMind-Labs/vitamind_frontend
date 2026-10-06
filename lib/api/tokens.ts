"use client";

/**
 * Patient session, split the safe way:
 * - the short-lived ACCESS token lives only in this module's memory: no storage, nothing for an injected
 *   script to read at rest, gone on reload;
 * - the long-lived REFRESH token lives in an HttpOnly cookie that JavaScript cannot see at all
 *   (see `app/api/session/[action]/route.ts`). On load, `ensureSession` trades it for a fresh access token.
 * Only the non-secret `{ id, nickname }` of the user is kept in localStorage (the profile cache and greetings
 * need it before the first network answer).
 */
const USER_KEY = "vitamind_user";
/** The last loaded profile (see lib/patient/profile-cache.ts); it never outlives the session. */
export const PROFILE_CACHE_KEY = "vitamind_profile_cache";
/** Keys of the old localStorage sessions: removed on first load, so no token is left lying in storage. */
const LEGACY_KEYS = ["vitamind_token", "vitamind_refresh_token"];

export type SessionUser = { id: string; nickname: string; tier?: string };

/** What the session routes hand to the browser: the refresh token is never part of it. */
export type AuthTokens = {
  access_token: string;
  user?: SessionUser;
};

/** `null` until the first answer from the session route (a reload has no access token yet), then signed in or out. */
export type SessionState = boolean | null;

let accessToken: string | null = null;
let state: SessionState = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: SessionState) {
  if (state === next) return;
  state = next;
  emit();
}

if (typeof window !== "undefined") {
  try {
    LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* storage unavailable: nothing to clean */
  }
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAccessToken() {
  return accessToken;
}

export function getSessionState(): SessionState {
  return state;
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

/** `exp` of a JWT in ms; `undefined` when it has none, `null` when the token cannot be read. */
function jwtExpiry(token: string): number | undefined | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const payload = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : undefined;
  } catch {
    return null;
  }
}

/** A signed-in session whose access token has not run out (an expired one is renewed on the next call). */
export function hasValidSession() {
  if (!accessToken || state !== true) return false;
  const exp = jwtExpiry(accessToken);
  return exp === undefined || (exp !== null && exp > Date.now());
}

export function isAuthenticated() {
  return state === true;
}

export function saveTokens(tokens: AuthTokens) {
  accessToken = tokens.access_token;
  if (tokens.user && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
    } catch {
      /* storage unavailable — greetings fall back to the profile */
    }
  }
  if (state === true) emit();
  else setState(true);
}

/** Forget the session in this tab. (The cookie itself is cleared by the server: logout, or a failed refresh.) */
export function clearTokens() {
  accessToken = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.removeItem(PROFILE_CACHE_KEY);
    } catch {
      /* ignore */
    }
  }
  if (state === false) emit();
  else setState(false);
}

/** Marks a reload that found no usable session (no cookie, or the network was down) without touching the cookie. */
export function markSignedOut() {
  accessToken = null;
  setState(false);
}
