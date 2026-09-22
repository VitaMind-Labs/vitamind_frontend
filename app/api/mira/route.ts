export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ACTIVE Mira proxy: Next.js → Nest MiraController → official Mira ai-service.
// Legacy processing-phase proxy (buttons / show_report) stays in
// app/api/chat/route.ts as preserved-but-inactive code and is NOT used here.

const API_SERVICE_URL =
  process.env.API_SERVICE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

function serviceUrl(path: string) {
  return `${API_SERVICE_URL.replace(/\/$/, "")}${path}`;
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function validateLanguage(language: string | undefined): language is "en" | "ar" {
  return language === "en" || language === "ar";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const sessionId = requestUrl.searchParams.get("sessionId") || requestUrl.searchParams.get("session_id");
  const response = await fetch(
    serviceUrl(sessionId ? `/mira/session/${encodeURIComponent(sessionId)}` : "/mira/health"),
    { cache: "no-store" },
  );
  const payload = await response.json().catch(() => ({}));
  return Response.json(payload, { status: response.status });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || searchParams.get("session_id");
  if (!sessionId) return jsonError("sessionId is required", 400);
  const response = await fetch(serviceUrl(`/mira/session/${encodeURIComponent(sessionId)}`), {
    method: "DELETE",
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  return Response.json(payload, { status: response.status });
}

type MiraProxyBody = {
  action?: "start" | "message";
  sessionId?: string;
  session_id?: string;
  text?: string;
  message?: string;
  language?: string;
};

export async function POST(request: Request) {
  let body: MiraProxyBody;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (!validateLanguage(body.language)) return jsonError("language must be 'en' or 'ar'", 400);

  if (body.action === "start" || (!body.action && !body.text && !body.message)) {
    const response = await fetch(serviceUrl("/mira/session"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: body.language }),
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({}));
    return Response.json(payload, { status: response.status });
  }

  const sessionId = body.sessionId || body.session_id;
  const text = (body.text || body.message || "").trim();
  if (!sessionId) return jsonError("sessionId is required", 400);
  if (!text) return jsonError("text is required", 400);

  const response = await fetch(
    serviceUrl(`/mira/session/${encodeURIComponent(sessionId)}/message`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language: body.language }),
      cache: "no-store",
    },
  );
  const payload = await response.json().catch(() => ({}));
  return Response.json(payload, { status: response.status });
}
