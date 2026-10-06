"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ensureSession } from "@/lib/api/client";
import { getSessionState, subscribeSession, type SessionState } from "@/lib/api/tokens";

/**
 * Whether the patient is signed in: `null` while the session is still being restored from the HttpOnly cookie
 * (and on the server), then `true` / `false`. The first component to use it starts the restore.
 */
export function useSessionState(): SessionState {
  const state = useSyncExternalStore(subscribeSession, getSessionState, () => null);
  useEffect(() => {
    void ensureSession();
  }, []);
  return state;
}
