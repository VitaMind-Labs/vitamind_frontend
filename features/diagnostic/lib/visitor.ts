"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getSessionUser } from "@/lib/api/tokens";

/**
 * The visitor's first name, collected gently at the start of the conversation so Mira's
 * space feels personal. Mira's agent never asks for or stores a name, so this lives purely
 * on the client and is reused only in the UI (chat rail, result page) — never injected into
 * Mira's generated messages, which would require changing her reasoning.
 *
 * Stored under a single key (the same visitor across the flow), so the chat page and the
 * decoupled result route both address the person by name.
 */
const NAME_KEY = "vitamind-visitor-name";

export function readVisitorName(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = window.localStorage.getItem(NAME_KEY);
    if (stored) return stored;
  } catch {
    /* fall through to the signed-in name */
  }
  // A signed-in patient already told us who they are: no need to ask again.
  return sanitizeName(getSessionUser()?.nickname ?? "");
}

export function sanitizeName(raw: string): string {
  // A first name only: collapse whitespace, strip control chars, cap length.
  return raw.replace(/\s+/g, " ").trim().replace(/[\u0000-\u001f]/g, "").slice(0, 40);
}

const CHANGE_EVENT = "vitamind-visitor-name-change";

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => event.key === NAME_KEY && onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Visitor first name with localStorage persistence, same-tab and cross-tab sync ("" during SSR). */
export function useVisitorName() {
  const name = useSyncExternalStore(subscribe, readVisitorName, () => "");

  const setName = useCallback((raw: string) => {
    const clean = sanitizeName(raw);
    try {
      if (clean) window.localStorage.setItem(NAME_KEY, clean);
      else window.localStorage.removeItem(NAME_KEY);
    } catch {
      /* storage unavailable — the name simply won't persist */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { name, setName };
}
