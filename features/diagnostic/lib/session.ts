import type { Lang } from "@/lib/i18n/config";

const STORAGE_KEY = "vitamind-diagnostic-session-id";

export function storeDiagnosticSessionId(sessionId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, sessionId);
}

export function getStoredDiagnosticSessionId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export async function ensureDiagnosticSession(sessionId: string, language: Lang) {
  storeDiagnosticSessionId(sessionId);

  const response = await fetch("/api/diagnostic/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, language }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Unable to prepare diagnostic session");
  }

  return response.json();
}
