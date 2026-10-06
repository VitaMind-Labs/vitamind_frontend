/**
 * The consent a patient gives when creating an account: what is processed and why, which version of the
 * text they accepted and when. Mira does not open without it. It is kept per account on this device until
 * the API stores it with the account (the access rule itself is enforced by the backend, not here).
 */
export const CONSENT_VERSION = "2026-10";
export const CONSENT_PURPOSE = "orientation-and-follow-up";

export type ConsentRecord = { version: string; purpose: string; acceptedAt: string };

const key = (userId: string) => `vitamind_consent:${userId}`;

export function recordConsent(userId: string): ConsentRecord {
  const record: ConsentRecord = { version: CONSENT_VERSION, purpose: CONSENT_PURPOSE, acceptedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(key(userId), JSON.stringify(record));
  } catch {
    /* storage unavailable: the account still exists, the record is simply not kept on this device */
  }
  return record;
}

export function readConsent(userId: string): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(key(userId));
    return raw ? (JSON.parse(raw) as ConsentRecord) : null;
  } catch {
    return null;
  }
}

export function withdrawConsent(userId: string) {
  try {
    window.localStorage.removeItem(key(userId));
  } catch {
    /* nothing stored */
  }
}
