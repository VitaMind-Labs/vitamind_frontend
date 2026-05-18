export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

type VoiceBody = {
  text?: string;
  language?: "fr" | "en" | "derja";
};

function getApiKey() {
  return (
    process.env.ELEVENLABS_API_KEY ||
    process.env.VITAMIND_VOICE ||
    process.env.VitaMind_voice ||
    process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
  );
}

function getVoiceId(language: VoiceBody["language"]) {
  if (language === "fr") return process.env.ELEVENLABS_VOICE_ID_FR || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  if (language === "derja") return process.env.ELEVENLABS_VOICE_ID_DERJA || process.env.ELEVENLABS_VOICE_ID_AR || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  return process.env.ELEVENLABS_VOICE_ID_EN || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
}

export async function GET() {
  return Response.json({
    enabled: Boolean(getApiKey()),
    provider: "elevenlabs",
  });
}

export async function POST(request: Request) {
  const apiKey = getApiKey();

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

  const voiceId = getVoiceId(body.language);
  const response = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
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
