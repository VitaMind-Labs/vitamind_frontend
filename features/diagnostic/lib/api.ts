export type ProxyResult = {
  payload: unknown;
  status: number;
};

const API_SERVICE_URL =
  process.env.API_SERVICE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

function serviceUrl(path: string) {
  return `${API_SERVICE_URL.replace(/\/$/, "")}${path}`;
}

async function forward(path: string, init?: RequestInit): Promise<ProxyResult> {
  const response = await fetch(serviceUrl(path), {
    ...init,
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  return { payload, status: response.status };
}

export function getMiraSession(sessionId?: string | null) {
  return forward(
    sessionId
      ? `/mira/session/${encodeURIComponent(sessionId)}`
      : "/mira/health",
    { method: "GET" },
  );
}

export function deleteMiraSession(sessionId: string) {
  return forward(`/mira/session/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
  });
}

export function startMiraSession(language: string) {
  return forward("/mira/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language }),
  });
}

export function sendMiraMessage(sessionId: string, text: string, language: string) {
  return forward(`/mira/session/${encodeURIComponent(sessionId)}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
}

export function createDiagnosticSession(sessionId: string, language?: string) {
  return forward("/chat/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, language }),
  });
}
