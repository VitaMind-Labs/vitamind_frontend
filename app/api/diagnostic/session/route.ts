export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_SERVICE_URL =
  process.env.API_SERVICE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

function serviceUrl(path: string) {
  return `${API_SERVICE_URL.replace(/\/$/, "")}${path}`;
}

export async function POST(request: Request) {
  let body: { sessionId?: string; language?: string };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.sessionId) {
    return Response.json({ error: "sessionId is required" }, { status: 400 });
  }

  const response = await fetch(serviceUrl("/chat/session"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: body.sessionId,
      language: body.language,
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  return Response.json(payload, { status: response.status });
}
