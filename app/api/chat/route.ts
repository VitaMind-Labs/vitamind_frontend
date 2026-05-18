export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_SERVICE_URL =
  process.env.API_SERVICE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

type ChatProxyBody = {
  action?: "message" | "button";
  sessionId?: string;
  session_id?: string;
  message?: string;
  language?: string;
  conversation_history?: ConversationMessage[];
  conversationHistory?: ConversationMessage[];
  questionId?: string;
  question_id?: string;
  testId?: string;
  test_id?: string;
  buttonId?: string;
  button_id?: string;
  score?: number;
};

function normalizeLanguage(language?: string) {
  if (language === "en" || language === "derja") return language;
  if (language === "ar") return "derja";
  return "fr";
}

function serviceUrl(path: string) {
  return `${API_SERVICE_URL.replace(/\/$/, "")}${path}`;
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

async function proxyToBackend(path: string, body?: unknown, method = "POST", sessionId?: string) {
  const response = await fetch(serviceUrl(path), {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(sessionId ? { "x-session-id": sessionId } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };

  return Response.json(payload, { status: response.status });
}

export async function GET() {
  return proxyToBackend("/chat/health", undefined, "GET");
}

export async function POST(request: Request) {
  let body: ChatProxyBody;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const sessionId = body.sessionId || body.session_id;
  if (!sessionId) return jsonError("sessionId is required", 400);

  const language = normalizeLanguage(body.language);
  const conversationHistory = body.conversationHistory || body.conversation_history || [];
  const action = body.action || (body.questionId || body.question_id ? "button" : "message");

  if (action === "button") {
    const questionId = body.questionId || body.question_id;
    const testId = body.testId || body.test_id;
    const buttonId = body.buttonId || body.button_id;

    if (!questionId || !testId || !buttonId || typeof body.score !== "number") {
      return jsonError("questionId, testId, buttonId and score are required", 400);
    }

    return proxyToBackend("/chat/button", {
      question_id: questionId,
      test_id: testId,
      button_id: buttonId,
      score: body.score,
      language,
      conversation_history: conversationHistory,
    }, "POST", sessionId);
  }

  if (!body.message?.trim()) return jsonError("message is required", 400);

  return proxyToBackend("/chat/send", {
    message: body.message.trim(),
    language,
    conversation_history: conversationHistory,
  }, "POST", sessionId);
}

export async function DELETE(request: Request) {
  let body: Pick<ChatProxyBody, "sessionId" | "session_id">;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const sessionId = body.sessionId || body.session_id;
  if (!sessionId) return jsonError("sessionId is required", 400);

  return proxyToBackend(`/chat/session/${encodeURIComponent(sessionId)}`, undefined, "DELETE");
}
