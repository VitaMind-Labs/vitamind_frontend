const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export type VoiceLanguage = "en" | "ar";

export function getVoiceApiUrl() {
  return ELEVENLABS_API_URL;
}

export function getVoiceApiKey() {
  return process.env.ELEVENLABS_API_KEY || process.env.VITAMIND_VOICE || process.env.VitaMind_voice;
}

export function getVoiceId(language?: VoiceLanguage) {
  if (language === "ar") {
    return process.env.ELEVENLABS_VOICE_ID_AR || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  }
  return process.env.ELEVENLABS_VOICE_ID_EN || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
}
