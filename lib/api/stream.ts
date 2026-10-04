import { EventStreamContentType, fetchEventSource } from "@microsoft/fetch-event-source";
import { ApiError, messageFrom, readJson, refreshSession, unwrap } from "./client";
import { apiUrl } from "./config";
import { getAccessToken } from "./tokens";

/**
 * Streamed agent turns (Mira): `POST …/stream` answers with server-sent events
 *   `delta` { text }*   then   `final` <the synchronous endpoint's body>   or   `error` { statusCode, message, code?, emergencyResources? }
 *
 * The browser talks to the API directly: SSE must never go through a Next.js rewrite or route
 * (Vercel would cut the stream). `fetch` is used (not EventSource) because the request carries
 * a bearer token and a JSON body.
 *
 * Failure model, so callers can decide what is safe to do silently:
 *  - `StreamUnavailable`  the stream never opened -> nothing happened server-side, use the sync endpoint;
 *  - `ApiError`           a normal JSON refusal before the stream opened (403, 409, validation, 429...);
 *  - `StreamTurnError`    the agent turn failed after the stream opened (an `error` event);
 *  - `StreamInterrupted`  the connection dropped mid-answer, no `final` -> the turn may or may not exist;
 *  - an `AbortError`      the caller stopped it.
 */

/** The stream could not be opened (network, timeout, 404/405/5xx, or not an event stream). */
export class StreamUnavailable extends Error {
  constructor(message = "The live connection could not be opened.") {
    super(message);
    this.name = "StreamUnavailable";
  }
}

/** The connection dropped after the answer had started, before `final` arrived. */
export class StreamInterrupted extends Error {
  constructor(public readonly partialText: string) {
    super("The connection was interrupted.");
    this.name = "StreamInterrupted";
  }
}

/** An `error` event: the turn failed after the stream was already open. */
export class StreamTurnError extends ApiError {
  constructor(
    message: string,
    status: number,
    code: string | undefined,
    payload: unknown,
    public readonly emergencyResources: string[],
    public readonly partialText: string,
  ) {
    super(message, status, code, payload);
    this.name = "StreamTurnError";
  }
}

const OPEN_TIMEOUT_MS = 15_000;
/** Statuses that mean "this route is not available here", not "the request was refused". */
const FALLBACK_STATUSES = new Set([404, 405, 408, 500, 502, 503, 504]);

class RetryWithFreshToken extends Error {}

type Deliver = { text?: unknown };

export type StreamTurnOptions = {
  /** Path under /api/v1, e.g. "/mira/chat/stream". */
  path: string;
  body: unknown;
  headers?: Record<string, string>;
  /** Attach the patient bearer token (default true). */
  auth?: boolean;
  signal?: AbortSignal;
  onDelta?: (text: string) => void;
};

function resourcesOf(payload: unknown): string[] {
  const list = payload && typeof payload === "object" ? (payload as { emergencyResources?: unknown }).emergencyResources : undefined;
  return Array.isArray(list) ? list.filter((item): item is string => typeof item === "string") : [];
}

function parse(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
}

async function attempt<T>(options: StreamTurnOptions, retryAuth: boolean): Promise<T> {
  const token = options.auth === false ? null : getAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const onCallerAbort = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  else options.signal?.addEventListener("abort", onCallerAbort, { once: true });

  let opened = false;
  let openTimedOut = false;
  const openTimer = setTimeout(() => {
    if (opened) return;
    openTimedOut = true;
    controller.abort();
  }, OPEN_TIMEOUT_MS);

  let partial = "";
  let final: { body: unknown } | null = null;
  let failure: { payload: unknown } | null = null;

  try {
    await fetchEventSource(apiUrl(options.path), {
      method: "POST",
      headers,
      body: JSON.stringify(options.body ?? {}),
      signal: controller.signal,
      // A conversation must keep streaming when the patient glances at another tab.
      openWhenHidden: true,
      async onopen(res) {
        opened = true;
        clearTimeout(openTimer);
        if (res.ok && (res.headers.get("content-type") ?? "").startsWith(EventStreamContentType)) return;
        if (res.status === 401 && retryAuth && token) throw new RetryWithFreshToken();
        if (res.ok || FALLBACK_STATUSES.has(res.status)) throw new StreamUnavailable();
        // A normal JSON refusal (access, conflict, validation, rate limit): no stream, no fallback.
        const payload = await readJson(res);
        const code = payload && typeof payload === "object" ? (payload as { code?: string }).code : undefined;
        throw new ApiError(messageFrom(payload, res.status), res.status, code, payload);
      },
      onmessage(event) {
        if (event.event === "delta") {
          const text = (parse(event.data) as Deliver | undefined)?.text;
          if (typeof text === "string" && text) {
            partial += text;
            options.onDelta?.(text);
          }
        } else if (event.event === "final") {
          final = { body: parse(event.data) };
          controller.abort();
        } else if (event.event === "error") {
          failure = { payload: parse(event.data) };
          controller.abort();
        }
      },
      onclose() {
        // The server ended the stream. Never let the library reconnect and re-run a turn.
        throw new StreamInterrupted(partial);
      },
      onerror(error) {
        // Throwing stops the library's automatic retry.
        throw error;
      },
    });
  } catch (error) {
    if (final || failure) {
      // Our own abort after a terminal event: fall through to the result below.
    } else if (error instanceof RetryWithFreshToken) {
      if (await refreshSession()) return attempt<T>(options, false);
      throw new ApiError(messageFrom(null, 401), 401);
    } else if (error instanceof ApiError || error instanceof StreamUnavailable) {
      throw error;
    } else if (options.signal?.aborted) {
      throw new DOMException("Stopped", "AbortError");
    } else if (openTimedOut || !opened) {
      throw new StreamUnavailable();
    } else if (error instanceof StreamInterrupted) {
      throw error;
    } else {
      throw new StreamInterrupted(partial);
    }
  } finally {
    clearTimeout(openTimer);
    options.signal?.removeEventListener("abort", onCallerAbort);
  }

  // fetchEventSource resolves quietly when aborted: tell a stop, a stalled open and a dropped stream apart.
  if (!final && !failure) {
    if (options.signal?.aborted) throw new DOMException("Stopped", "AbortError");
    if (openTimedOut || !opened) throw new StreamUnavailable();
  }
  if (final) return unwrap<T>((final as { body: unknown }).body);
  if (failure) {
    const payload = (failure as { payload: unknown }).payload;
    const status = payload && typeof payload === "object" && typeof (payload as { statusCode?: unknown }).statusCode === "number"
      ? (payload as { statusCode: number }).statusCode
      : 500;
    const code = payload && typeof payload === "object" ? (payload as { code?: string }).code : undefined;
    throw new StreamTurnError(messageFrom(payload, status), status, code, payload, resourcesOf(payload), partial);
  }
  throw new StreamInterrupted(partial);
}

/** Open the stream, deliver text as it arrives, and resolve with the `final` body (the source of truth). */
export function streamTurn<T>(options: StreamTurnOptions): Promise<T> {
  return attempt<T>(options, true);
}

/**
 * The streamed turn with a silent safety net: if the stream cannot open, the synchronous endpoint
 * answers instead and the patient just sees the reply arrive whole.
 * `resumable` turns carry a client message id the API de-duplicates on, so after a dropped
 * connection the same sync call is safe too (it returns the stored turn or runs it once).
 */
export async function streamWithFallback<T>(
  options: StreamTurnOptions & { sync: () => Promise<T>; resumable?: boolean },
): Promise<T> {
  const { sync, resumable = false, ...stream } = options;
  try {
    return await streamTurn<T>(stream);
  } catch (error) {
    if (stream.signal?.aborted) throw error;
    if (error instanceof StreamUnavailable || (resumable && error instanceof StreamInterrupted)) return sync();
    throw error;
  }
}
