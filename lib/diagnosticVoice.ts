"use client";

import { LANGS, type Lang } from "@/lib/i18n";

let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
let voicesLoaded = false;
let elevenLabsEnabled: boolean | null = null;

function releaseCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
}

function getSpeechVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) voicesLoaded = true;
  return voices;
}

function loadBrowserVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = getSpeechVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const handler = () => {
      const updated = getSpeechVoices();
      if (updated.length > 0) {
        window.speechSynthesis.onvoiceschanged = null;
        resolve(updated);
      }
    };

    window.speechSynthesis.onvoiceschanged = handler;
    setTimeout(() => {
      window.speechSynthesis.onvoiceschanged = null;
      resolve(getSpeechVoices());
    }, 2500);
  });
}

export function warmUpDiagnosticVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("");
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.cancel();
  } catch {
    // Browsers can reject silent warmups; real playback has its own fallback.
  }
}

async function speakWithBrowserVoice(text: string, language: Lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const target = LANGS.find((item) => item.code === language)?.bcp47 ?? "en-US";
  const langPrefix = target.split("-")[0].toLowerCase();
  utterance.lang = target;
  utterance.rate = language === "ar" ? 0.9 : 0.95;
  utterance.pitch = 1;

  const voices = voicesLoaded ? getSpeechVoices() : await loadBrowserVoices();
  const matchedVoice =
    voices.find((voice) => voice.lang.toLowerCase() === target.toLowerCase()) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix));

  if (matchedVoice) utterance.voice = matchedVoice;
  window.speechSynthesis.speak(utterance);
}

async function canUseElevenLabs() {
  if (elevenLabsEnabled !== null) return elevenLabsEnabled;

  // ElevenLabs disabled by default - use browser speech synthesis
  elevenLabsEnabled = false;

  // Uncomment below to enable ElevenLabs when API key is configured
  // try {
  //   const response = await fetch("/api/voice", { method: "GET", cache: "no-store" });
  //   const data = await response.json();
  //   elevenLabsEnabled = Boolean(data?.enabled);
  // } catch {
  //   elevenLabsEnabled = false;
  // }

  return elevenLabsEnabled;
}


export async function speakDiagnosticText(text: string, language: Lang) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  if (!cleanText) return;

  stopDiagnosticVoice();

  try {
    const elevenEnabled = await canUseElevenLabs();

    if (!elevenEnabled) {
      console.log("🎙️ Using browser speech synthesis (ElevenLabs disabled or no API key)");
      await speakWithBrowserVoice(cleanText, language);
      return;
    }

    console.log("🎙️ Attempting ElevenLabs API call...");
    const response = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanText, language }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn(`⚠️ ElevenLabs API error (${response.status}):`, error);
      throw new Error(`Voice API returned ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    currentObjectUrl = url;
    currentAudio = audio;

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        releaseCurrentAudio();
        resolve();
      };
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        releaseCurrentAudio();
        reject(new Error("Audio playback failed"));
      };
      void audio.play().catch(reject);
    });
  } catch (error) {
    console.warn("⚠️ ElevenLabs failed, falling back to browser voice:", error);
    elevenLabsEnabled = false; // Cache que ElevenLabs ne fonctionne pas
    releaseCurrentAudio();
    await speakWithBrowserVoice(cleanText, language);
  }
}
export function stopDiagnosticVoice() {
  releaseCurrentAudio();

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
