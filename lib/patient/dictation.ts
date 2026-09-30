"use client";

/** Browser voice typing (Web Speech API). Not everywhere: callers feature-detect with `getSpeechRecognition()`. */
export type Recognizer = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { resultIndex: number; results: ArrayLike<{ isFinal: boolean } & ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type RecognizerConstructor = new () => Recognizer;

export function getSpeechRecognition(): RecognizerConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return ((w.SpeechRecognition || w.webkitSpeechRecognition) as RecognizerConstructor | undefined) ?? null;
}
