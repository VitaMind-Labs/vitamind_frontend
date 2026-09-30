import type { PlanId } from "@/lib/config/plans";

/**
 * Conversion funnel entry: signup → subscription (optionally pre-selecting a plan) → dashboard.
 * The orientation session id travels with the visitor so the backend links it to the new account.
 */
export function buildSignupHref(sessionId: string, planId?: PlanId) {
  const redirect = planId ? `/subscription?plan=${planId}` : "/subscription";
  return `/auth/signup?sessionId=${encodeURIComponent(sessionId)}&redirect=${encodeURIComponent(redirect)}`;
}
