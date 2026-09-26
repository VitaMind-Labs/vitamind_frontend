import {
  deleteMiraSession,
  getMiraSession,
  sendMiraMessage,
  startMiraSession,
} from "@/features/diagnostic/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function validateLanguage(language: string | undefined): language is "en" | "ar" {
  return language === "en" || language === "ar";
}

type MiraProxyBody = {
  action?: "start" | "message";
  sessionId?: string;
  session_id?: string;
  text?: string;
  message?: string;
  language?: string;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const sessionId = requestUrl.searchParams.get("sessionId") || requestUrl.searchParams.get("session_id");
  const result = await getMiraSession(sessionId);
  return Response.json(result.payload, { status: result.status });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || searchParams.get("session_id");
  if (!sessionId) return jsonError("sessionId is required", 400);

  const result = await deleteMiraSession(sessionId);
  return Response.json(result.payload, { status: result.status });
}

export async function POST(request: Request) {
  let body: MiraProxyBody;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  if (!validateLanguage(body.language)) return jsonError("language must be 'en' or 'ar'", 400);

  if (body.action === "start" || (!body.action && !body.text && !body.message)) {
    const result = await startMiraSession(body.language);
    return Response.json(result.payload, { status: result.status });
  }

  const sessionId = body.sessionId || body.session_id;
  const text = (body.text || body.message || "").trim();
  if (!sessionId) return jsonError("sessionId is required", 400);
  if (!text) return jsonError("text is required", 400);

  const result = await sendMiraMessage(sessionId, text, body.language);
  return Response.json(result.payload, { status: result.status });
}
