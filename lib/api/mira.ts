import { apiUrl, FINGERPRINT_HEADER } from "./config";

/**
 * Mira — `/api/v1/mira/*` (MiraController). SERVER-SIDE ONLY: used by the
 * same-origin route `app/api/mira/route.ts`, which forwards the browser's
 * anti-abuse identity (fingerprint header + client IP) to Nest.
 */

export type ProxyResult = {
  payload: unknown;
  status: number;
};

export type MiraIdentity = { fingerprint?: string | null; clientIp?: string | null; authorization?: string | null };

async function forward(path: string, init: RequestInit & MiraIdentity = {}): Promise<ProxyResult> {
  const { fingerprint, clientIp, authorization, headers, ...rest } = init;
  const mergedHeaders: Record<string, string> = { ...(headers as Record<string, string> | undefined) };
  if (fingerprint) mergedHeaders[FINGERPRINT_HEADER] = fingerprint;
  if (clientIp) mergedHeaders["x-forwarded-for"] = clientIp;
  if (authorization) mergedHeaders.Authorization = authorization;

  try {
    const response = await fetch(apiUrl(`/mira${path}`), { ...rest, headers: mergedHeaders, cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    return { payload, status: response.status };
  } catch {
    // Nest itself is down: answer like a gateway instead of crashing the route.
    return { payload: { error: "The SynQ API is unreachable." }, status: 502 };
  }
}

const json = (body: unknown): RequestInit => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const session = (sessionId: string) => `/session/${encodeURIComponent(sessionId)}`;

export const miraApi = {
  health: () => forward("/health", { method: "GET" }),
  attempts: (identity: MiraIdentity = {}) => forward("/attempts", { method: "GET", ...identity }),
  start: (language: string, identity: MiraIdentity = {}) =>
    forward("/session", { method: "POST", ...json({ language }), ...identity }),
  get: (sessionId: string, identity: MiraIdentity = {}) => forward(session(sessionId), { method: "GET", ...identity }),
  history: (sessionId: string, identity: MiraIdentity = {}) =>
    forward(`${session(sessionId)}/history`, { method: "GET", ...identity }),
  message: (sessionId: string, text: string, language: string, identity: MiraIdentity = {}) =>
    forward(`${session(sessionId)}/message`, { method: "POST", ...json({ text, language }), ...identity }),
  finalize: (sessionId: string, identity: MiraIdentity = {}) =>
    forward(`${session(sessionId)}/finalize`, { method: "POST", ...identity }),
  remove: (sessionId: string, identity: MiraIdentity = {}) =>
    forward(session(sessionId), { method: "DELETE", ...identity }),
};
