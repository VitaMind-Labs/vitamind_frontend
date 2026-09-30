"use client";

import { LANGS, type Lang } from "@/lib/i18n/config";

/**
 * Lumina's voice for the welcome. Uses the ElevenLabs proxy (`/api/voice`) when the server has a
 * key, otherwise the browser's own speech synthesis. Unlike the Mira helper it reports when
 * speech starts and ends, so captions, the 3D orb and the hand-off to the chat can follow it.
 */
export type SpeakCallbacks = { onStart?: () => void; onEnd?: () => void; onError?: () => void };
export type SpeakHandle = { cancel: () => void };

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function browserVoice(text: string, language: Lang, callbacks: SpeakCallbacks): SpeakHandle {
  const synth = window.speechSynthesis;
  const target = LANGS.find((item) => item.code === language)?.bcp47 ?? "en-US";
  const prefix = target.split("-")[0].toLowerCase();
  let cancelled = false;

  const start = () => {
    if (cancelled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = target;
    utterance.rate = language === "ar" ? 0.9 : 0.94;
    utterance.pitch = 1.02;
    const voices = synth.getVoices();
    const voice =
      voices.find((item) => item.lang.toLowerCase() === target.toLowerCase()) ??
      voices.find((item) => item.lang.toLowerCase().startsWith(prefix));
    if (voice) utterance.voice = voice;
    utterance.onstart = () => !cancelled && callbacks.onStart?.();
    utterance.onend = () => !cancelled && callbacks.onEnd?.();
    utterance.onerror = () => !cancelled && callbacks.onError?.();
    synth.cancel();
    synth.speak(utterance);
  };

  if (synth.getVoices().length > 0) {
    start();
  } else {
    // Voices load asynchronously in some browsers; do not wait forever.
    const timer = window.setTimeout(start, 900);
    synth.onvoiceschanged = () => {
      window.clearTimeout(timer);
      synth.onvoiceschanged = null;
      start();
    };
  }
  return {
    cancel: () => {
      cancelled = true;
      synth.cancel();
    },
  };
}

async function elevenLabsVoice(text: string, language: Lang, callbacks: SpeakCallbacks): Promise<SpeakHandle | null> {
  try {
    const status = await fetch("/api/voice", { cache: "no-store" });
    if (!status.ok || !(await status.json())?.enabled) return null;
    const response = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });
    if (!response.ok) return null;
    const url = URL.createObjectURL(await response.blob());
    const audio = new Audio(url);
    let cancelled = false;
    const release = () => URL.revokeObjectURL(url);
    audio.onplay = () => !cancelled && callbacks.onStart?.();
    audio.onended = () => {
      release();
      if (!cancelled) callbacks.onEnd?.();
    };
    audio.onerror = () => {
      release();
      if (!cancelled) callbacks.onError?.();
    };
    await audio.play();
    return {
      cancel: () => {
        cancelled = true;
        audio.pause();
        release();
      },
    };
  } catch {
    return null;
  }
}

/** Speak `text`; resolves with a handle to cancel. Falls back to the browser voice on any failure. */
export async function speakLumina(text: string, language: Lang, callbacks: SpeakCallbacks = {}): Promise<SpeakHandle | null> {
  const premium = await elevenLabsVoice(text, language, callbacks);
  if (premium) return premium;
  if (!canSpeak()) {
    callbacks.onError?.();
    return null;
  }
  return browserVoice(text, language, callbacks);
}
