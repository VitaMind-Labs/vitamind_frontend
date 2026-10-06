import { apiUrl } from "./config";
import { ApiError, api } from "./client";

/**
 * Password reset. The visitor is signed out on purpose, so none of these calls carries a session, refreshes one
 * or touches the patient provider: they are plain public POSTs. The backend owns every rule.
 */
const AUDIENCE = "patient";

export const passwordResetApi = {
  /** Resolves the same way for any address: the API never says whether an account exists. */
  forgot: (email: string) => api.post<{ message: string }>("/auth/forgot-password", { email, audience: AUDIENCE }, { auth: false }),

  reset: (token: string, password: string, confirmPassword: string) =>
    api.post<{ message: string }>("/auth/reset-password", { token, password, confirmPassword, audience: AUDIENCE }, { auth: false }),
};

/** Server-side check used by the reset page before it renders: true when the link can still be used. */
export async function isResetLinkUsable(token: string): Promise<boolean> {
  try {
    const response = await fetch(apiUrl("/auth/verify-reset-token"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, audience: AUDIENCE }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    return response.ok;
  } catch {
    // The API is unreachable: let the form show, the submit reports the outage instead of a false "expired".
    return true;
  }
}

/** Which kind of failure an ApiError from the calls above is. */
export function resetFailure(error: unknown): "invalid_link" | "rate_limited" | "validation" | "unavailable" {
  if (!(error instanceof ApiError)) return "unavailable";
  if (error.status === 429) return "rate_limited";
  if (error.status === 400) return /invalid or has expired/i.test(error.message) ? "invalid_link" : "validation";
  return "unavailable";
}
