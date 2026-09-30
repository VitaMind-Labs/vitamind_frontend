import { apiUrl } from "./config";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens, type AuthTokens } from "./tokens";

/**
 * Browser API client for the patient app. Calls the Nest API directly under
 * /api/v1, attaches the patient bearer token, refreshes it once on 401, and maps
 * failures to ApiError. Mira is the exception: it goes through the same-origin
 * `/api/mira` route so the anti-abuse identity is forwarded (see lib/api/mira.ts).
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isConflict() {
    return this.status === 409;
  }
}

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export function toQueryString(query?: QueryParams): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

const DEFAULT_MESSAGES: Record<number, string> = {
  400: "The request was rejected. Check the values and try again.",
  401: "Your session expired. Please sign in again.",
  403: "You are not allowed to perform this action.",
  404: "This record no longer exists.",
  409: "This action is no longer possible.",
  429: "Too many requests. Please wait a moment and retry.",
  502: "The VitaMind API is unreachable.",
};

export function messageFrom(payload: unknown, status: number): string {
  if (payload && typeof payload === "object") {
    const { message, error } = payload as { message?: unknown; error?: unknown };
    if (Array.isArray(message) && message.length) return message.join(", ");
    if (typeof message === "string" && message.trim()) return message;
    if (typeof error === "string" && error.trim()) return error;
  }
  return DEFAULT_MESSAGES[status] ?? `Request failed (HTTP ${status}).`;
}

/** Accept both raw payloads and the optional `{ success, data }` envelope. */
function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "success" in payload && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

async function readJson(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined;
  if (!(res.headers.get("content-type") || "").includes("application/json")) return null;
  return res.json().catch(() => null);
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
  method?: Method;
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Attach the patient bearer token (default true). */
  auth?: boolean;
};

let refreshing: Promise<boolean> | null = null;

/** One shared refresh at a time; on failure the session is cleared. */
function refreshSession(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(false);
  refreshing ??= (async () => {
    try {
      const res = await fetch(apiUrl("/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("refresh failed");
      saveTokens(unwrap<AuthTokens>(await readJson(res)));
      return true;
    } catch {
      clearTokens();
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

async function send(path: string, options: RequestOptions, retry: boolean): Promise<Response> {
  const headers: Record<string, string> = { ...options.headers };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const token = options.auth === false ? null : getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${apiUrl(path)}${toQueryString(options.query)}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
      cache: "no-store",
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error;
    throw new ApiError("Network error — check your connection and retry.", 0);
  }

  if (res.status === 401 && retry && token && (await refreshSession())) {
    return send(path, options, false);
  }
  return res;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await send(path, options, true);
  const payload = await readJson(res);
  if (!res.ok) {
    const code = payload && typeof payload === "object" ? (payload as { code?: string }).code : undefined;
    throw new ApiError(messageFrom(payload, res.status), res.status, code, payload);
  }
  return unwrap<T>(payload);
}

export const api = {
  get: <T>(path: string, query?: QueryParams, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, query }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body: body ?? {} }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body: body ?? {} }),
  delete: <T>(path: string, options?: RequestOptions) => apiRequest<T>(path, { ...options, method: "DELETE" }),
};
