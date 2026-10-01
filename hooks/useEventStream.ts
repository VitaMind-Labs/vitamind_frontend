"use client";

import { useEffect, useRef, useState } from "react";
import { EventStreamContentType, fetchEventSource } from "@microsoft/fetch-event-source";
import { refreshSession } from "@/lib/api/client";
import { apiUrl } from "@/lib/api/config";
import { getAccessToken } from "@/lib/api/tokens";

/**
 * One server-sent event stream for the whole signed-in shell: `GET /api/v1/events`.
 *
 * - Talks to the API directly. SSE must never pass through a Next.js rewrite or route handler
 *   (Vercel would cut the stream).
 * - Reconnects forever with exponential backoff and full jitter, resuming with `Last-Event-ID`
 *   so nothing published in the gap is lost (the API keeps a short replay buffer).
 * - Quiet by design: a drop, a server restart (`shutdown`) or a full house (429) never surfaces
 *   an error; `state` only drives a subtle "reconnecting" hint.
 * - Stops for good when `enabled` turns false (sign-out) or the session is gone.
 */

/** The envelope the API writes in every event frame's `data`. */
export type StreamEnvelope<T = unknown> = { id: number; type: string; ts: string; data: T };

export type ReportReadyData = { reportId: string | null; weekStart: string; audience: "psychologist" | "patient"; trafficLight?: string | null };
export type JobProgressData = {
  jobId: string;
  kind: string;
  status: "queued" | "running" | "completed" | "failed";
  progress?: number;
};

export type LiveEvent =
  | { type: "report.ready"; id: number; data: ReportReadyData }
  | { type: "job.progress"; id: number; data: JobProgressData }
  | { type: string; id: number; data: unknown };

export type StreamState = "connecting" | "open" | "reconnecting" | "offline";

const BASE_DELAY_MS = 1_000;
const MAX_DELAY_MS = 30_000;
/** 429 means this account already holds its maximum streams: wait longer, and never complain. */
const TOO_MANY_DELAY_MS = 20_000;
const DEFAULT_HEARTBEAT_S = 15;

class Reconnect extends Error {
  constructor(readonly delayMs: number | null, readonly reason: "retry" | "tooMany" | "auth" | "ended") {
    super(reason);
  }
}

/** Full jitter: a random point below the exponential ceiling, so many tabs never reconnect in lockstep. */
export function backoffDelay(attempt: number, random: () => number = Math.random): number {
  const ceiling = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
  return Math.round(ceiling / 2 + random() * (ceiling / 2));
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });

/** Resolves when the browser is back online (or immediately if it already is). */
function whenOnline(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (navigator.onLine) return resolve();
    const done = () => {
      window.removeEventListener("online", done);
      resolve();
    };
    window.addEventListener("online", done, { once: true });
    signal.addEventListener("abort", done, { once: true });
  });
}

/** Wraps fetch so the idle watchdog can see any byte, comments and heartbeats included. */
function trackedFetch(onActivity: () => void): typeof fetch {
  return async (input, init) => {
    const response = await fetch(input, init);
    if (!response.body) return response;
    const body = response.body.pipeThrough(
      new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          onActivity();
          controller.enqueue(chunk);
        },
      }),
    );
    return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
  };
}

export function useEventStream({
  enabled,
  onEvent,
}: {
  enabled: boolean;
  onEvent: (event: LiveEvent) => void;
}): { state: StreamState } {
  const [state, setState] = useState<StreamState>("connecting");
  const handler = useRef(onEvent);
  useEffect(() => {
    handler.current = onEvent;
  });

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const { signal } = controller;
    let lastEventId: string | undefined;
    let attempt = 0;
    let lastActivity = Date.now();
    let heartbeatMs = DEFAULT_HEARTBEAT_S * 1000;

    async function connect(): Promise<void> {
      const token = getAccessToken();
      if (!token) throw new Reconnect(null, "auth");
      const connection = new AbortController();
      const stop = () => connection.abort();
      signal.addEventListener("abort", stop, { once: true });
      lastActivity = Date.now();
      // The API sends a heartbeat every few seconds: silence for three beats means a dead connection.
      const watchdog = setInterval(() => {
        if (Date.now() - lastActivity > heartbeatMs * 3) connection.abort();
      }, heartbeatMs);

      const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
      if (lastEventId) headers["Last-Event-ID"] = lastEventId;

      try {
        await fetchEventSource(apiUrl("/events"), {
          method: "GET",
          headers,
          signal: connection.signal,
          fetch: trackedFetch(() => (lastActivity = Date.now())),
          openWhenHidden: true,
          async onopen(res) {
            if (res.ok && (res.headers.get("content-type") ?? "").startsWith(EventStreamContentType)) {
              attempt = 0;
              setState("open");
              return;
            }
            if (res.status === 401) throw new Reconnect(0, "auth");
            if (res.status === 429) throw new Reconnect(TOO_MANY_DELAY_MS, "tooMany");
            throw new Reconnect(null, "retry");
          },
          onmessage(message) {
            if (message.event === "ready") {
              const beat = (safeParse(message.data) as { heartbeatSeconds?: unknown } | undefined)?.heartbeatSeconds;
              if (typeof beat === "number" && beat > 0) heartbeatMs = beat * 1000;
              return;
            }
            if (message.event === "shutdown") throw new Reconnect(300, "ended");
            if (!message.event) return;
            const envelope = safeParse(message.data) as StreamEnvelope | undefined;
            if (!envelope || typeof envelope !== "object") return;
            if (message.id) lastEventId = message.id;
            else if (typeof envelope.id === "number") lastEventId = String(envelope.id);
            handler.current({ type: message.event, id: envelope.id, data: envelope.data } as LiveEvent);
          },
          onclose() {
            throw new Reconnect(null, "retry");
          },
          onerror(error) {
            throw error;
          },
        });
        if (!signal.aborted) throw new Reconnect(null, "retry");
      } finally {
        clearInterval(watchdog);
        signal.removeEventListener("abort", stop);
      }
    }

    async function run() {
      while (!signal.aborted) {
        if (!navigator.onLine) {
          setState("offline");
          await whenOnline(signal);
          if (signal.aborted) return;
        }
        try {
          await connect();
        } catch (error) {
          if (signal.aborted) return;
          if (error instanceof Reconnect) {
            if (error.reason === "auth") {
              // A stale token: renew it once, otherwise leave (the shell signs the patient out).
              if (error.delayMs === 0 && (await refreshSession())) continue;
              return;
            }
            setState("reconnecting");
            const delay = error.delayMs ?? backoffDelay(attempt++);
            await sleep(error.reason === "tooMany" ? delay + Math.random() * 10_000 : delay, signal);
            continue;
          }
          setState(navigator.onLine ? "reconnecting" : "offline");
          await sleep(backoffDelay(attempt++), signal);
        }
      }
    }

    void run();
    const onOffline = () => setState("offline");
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("offline", onOffline);
      controller.abort();
    };
  }, [enabled]);

  return { state };
}

function safeParse(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
}
