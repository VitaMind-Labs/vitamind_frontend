import { createDiagnosticSession } from "@/features/diagnostic/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const result = await createDiagnosticSession(body.sessionId, body.language);
  return Response.json(result.payload, { status: result.status });
}
