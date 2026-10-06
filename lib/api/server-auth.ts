import { apiUrl } from "./config";

/**
 * Server-side check for same-origin route handlers that reach a paid or sensitive service (voice, Mira):
 * the bearer token must belong to a patient the Nest API accepts. The frontend decides nothing about access
 * on its own; this just refuses to spend the server's keys for someone the API would turn away.
 */
export async function isSignedInPatient(request: Request): Promise<boolean> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  try {
    const response = await fetch(apiUrl("/me"), { headers: { Authorization: authorization }, cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}
