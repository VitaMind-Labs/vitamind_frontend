"use client";

/**
 * Patient session tokens. Keys are unchanged from the original AuthScreen so
 * existing signed-in visitors stay signed in.
 */
const ACCESS_KEY = "vitamind_token";
const REFRESH_KEY = "vitamind_refresh_token";
const USER_KEY = "vitamind_user";
/** The last loaded profile (see lib/patient/profile-cache.ts); it never outlives the session. */
export const PROFILE_CACHE_KEY = "vitamind_profile_cache";

export type SessionUser = { id: string; nickname: string; tier?: string };

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  user?: SessionUser;
};

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return read(ACCESS_KEY);
}

export function getRefreshToken() {
  return read(REFRESH_KEY);
}

export function getSessionUser(): SessionUser | null {
  const raw = read(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
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

function isLive(token: string | null) {
  if (!token) return false;
  const exp = jwtExpiry(token);
  return exp === undefined || (exp !== null && exp > Date.now());
}

/**
 * A usable patient session on this browser: the access token is still valid, or it expired
 * but the refresh token can renew it. A stale leftover token does not count as signed in.
 */
export function hasValidSession() {
  const access = getAccessToken();
  if (!access) return false;
  return isLive(access) || isLive(getRefreshToken());
}

export function saveTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACCESS_KEY, tokens.access_token);
    window.localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
    if (tokens.user) window.localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
  } catch {
    /* storage unavailable — the session simply won't persist */
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {
    /* ignore */
  }
}
