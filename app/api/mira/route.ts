import { miraApi } from "@/lib/api/mira";
import { FINGERPRINT_HEADER } from "@/lib/api/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function validateLanguage(language: string | undefined): language is "en" | "ar" {
  return language === "en" || language === "ar";
}

/** Anti-abuse identity extracted from the browser request and passed through to Nest. */
function identity(request: Request) {
  const fingerprint = request.headers.get(FINGERPRINT_HEADER);
  const forwarded = request.headers.get("x-forwarded-for");
  const clientIp = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  // The patient's token, when signed in: Nest treats an invalid one as anonymous.
  const authorization = request.headers.get("authorization");
  return { fingerprint, clientIp, authorization };
}

type MiraProxyBody = {
  action?: "start" | "message" | "finalize";
  sessionId?: string;
  session_id?: string;
  text?: string;
  message?: string;
  language?: string;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const resource = requestUrl.searchParams.get("resource");
  const id = identity(request);

  if (resource === "attempts") {
    const result = await miraApi.attempts(id);
    return Response.json(result.payload, { status: result.status });
  }

  const sessionId = requestUrl.searchParams.get("sessionId") || requestUrl.searchParams.get("session_id");

  if (resource === "history") {
    if (!sessionId) return jsonError("sessionId is required", 400);
    const result = await miraApi.history(sessionId, id);
    return Response.json(result.payload, { status: result.status });
  }

  const result = sessionId ? await miraApi.get(sessionId, id) : await miraApi.health();
  return Response.json(result.payload, { status: result.status });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || searchParams.get("session_id");
  if (!sessionId) return jsonError("sessionId is required", 400);

  const result = await miraApi.remove(sessionId, identity(request));
  return Response.json(result.payload, { status: result.status });
}

export async function POST(request: Request) {
  let body: MiraProxyBody;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const id = identity(request);

  // Finalize ("download report"): consumes one attempt. No language required.
  if (body.action === "finalize") {
    const sessionId = body.sessionId || body.session_id;
    if (!sessionId) return jsonError("sessionId is required", 400);
    const result = await miraApi.finalize(sessionId, id);
    return Response.json(result.payload, { status: result.status });
  }

  if (!validateLanguage(body.language)) return jsonError("language must be 'en' or 'ar'", 400);

  if (body.action === "start" || (!body.action && !body.text && !body.message)) {
    const result = await miraApi.start(body.language, id);
    return Response.json(result.payload, { status: result.status });
  }

  const sessionId = body.sessionId || body.session_id;
  const rawText = body.text ?? body.message ?? "";
  // Spaces only are forwarded as they are: Mira answers them kindly (nothing was counted) instead of an API error.
  const text = rawText.trim() || (rawText.length > 0 ? " " : "");
  if (!sessionId) return jsonError("sessionId is required", 400);
  if (!text) return jsonError("text is required", 400);

  const result = await miraApi.message(sessionId, text, body.language, id);
  return Response.json(result.payload, { status: result.status });
}
