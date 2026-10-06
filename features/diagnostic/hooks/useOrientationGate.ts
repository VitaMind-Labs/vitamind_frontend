"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { api } from "@/lib/api/client";
import { hasValidSession } from "@/lib/api/tokens";

/**
 * Where a visitor stands with Mira, which needs an account and runs once per account:
 * - `signed-out` — no session: sign up (or sign in) first;
 * - `done`       — the account already completed its orientation: on to the dashboard;
 * - `open`       — signed in, orientation still to do.
 */
export type OrientationGate = "checking" | "signed-out" | "done" | "open";

const noSubscribe = () => () => {};

export function useOrientationGate(): OrientationGate {
  // `null` on the server and first paint: the tokens live in localStorage.
  const signedIn = useSyncExternalStore(noSubscribe, hasValidSession, () => null);
  const [answer, setAnswer] = useState<"done" | "open" | "signed-out" | null>(null);

  useEffect(() => {
    if (signedIn !== true) return;
    let cancelled = false;
    // 401 after a failed refresh: the session is gone. Anything else: let the chat's own error handling speak.
    api
      .get<{ blocked?: boolean }>("/mira/attempts")
      .then((state) => !cancelled && setAnswer(state.blocked ? "done" : "open"))
      .catch((error: { status?: number }) => !cancelled && setAnswer(error?.status === 401 ? "signed-out" : "open"));
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  if (signedIn === null) return "checking";
  if (signedIn === false) return "signed-out";
  return answer ?? "checking";
}
