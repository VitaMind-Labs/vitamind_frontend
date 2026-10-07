/**
 * The consent a patient gives when creating an account: what is processed and why. The version of the text they
 * accepted travels with the sign-up request and is stored by the API with the account (`patient_consents`);
 * Mira does not open without it (403 ORIENTATION_CONSENT_REQUIRED). Nothing is kept in the browser.
 * Bump the version here AND in the API (`ORIENTATION_CONSENT_VERSION`) when the consent text changes.
 */
export const CONSENT_VERSION = "2026-10";
export const CONSENT_PURPOSE = "orientation-and-follow-up";
