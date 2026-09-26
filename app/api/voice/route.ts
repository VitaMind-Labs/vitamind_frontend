import {
  getVoiceApiKey,
  getVoiceApiUrl,
  getVoiceId,
  type VoiceLanguage,
} from "@/lib/config/voice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoiceBody = {
  text?: string;
  language?: VoiceLanguage;
};

export async function GET() {
  return Response.json({
    enabled: Boolean(getVoiceApiKey()),
    provider: "elevenlabs",
  });
}

export async function POST(request: Request) {
  const apiKey = getVoiceApiKey();

  if (!apiKey) {
    return Response.json({ error: "ElevenLabs API key is not configured" }, { status: 503 });
  }

  let body: VoiceBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body.text?.replace(/\s+/g, " ").trim().slice(0, 4500);
  if (!text) {
    return Response.json({ error: "Text is required" }, { status: 400 });
  }

  const response = await fetch(`${getVoiceApiUrl()}/${getVoiceId(body.language)}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.15,
        use_speaker_boost: true,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    return Response.json(
      { error: "ElevenLabs request failed", detail },
      { status: response.status },
    );
  }

  const audio = await response.arrayBuffer();
  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
