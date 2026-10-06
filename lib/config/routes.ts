/** Public routes referenced across headers, CTAs and funnels — one place to rename a URL. */
export const ROUTES = {
  home: "/",
  orientation: "/orientation",
  mira: "/mira",
  lumina: "/lumina",
  tracks: "/tracks",
  trust: "/trust",
  support: "/support",
  signIn: "/auth/signin",
  signUp: "/auth/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
} as const;

export type AgentEntry = "mira" | "lumina";

/**
 * Where an agent's button leads. Both agents are members-only: a signed-in patient goes straight in (Mira's
 * orientation, which sends an account that already finished to the dashboard; Lumina's dashboard), anyone else
 * is asked to sign up (Mira) or sign in (Lumina) first, with a `from` hint so the form can say why.
 */
export function agentEntryHref(agent: AgentEntry, signedIn: boolean) {
  if (agent === "mira") {
    return signedIn ? ROUTES.orientation : `${ROUTES.signUp}?from=orientation&redirect=${encodeURIComponent(ROUTES.orientation)}`;
  }
  return signedIn ? ROUTES.dashboard : `${ROUTES.signIn}?from=lumina&redirect=${encodeURIComponent(ROUTES.dashboard)}`;
}
