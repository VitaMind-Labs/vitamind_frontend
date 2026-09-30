"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/** Per word, bounded so a long reply never keeps the patient waiting. */
const MS_PER_WORD = 42;
const MIN_MS = 450;
const MAX_MS = 2400;

/**
 * Reveals a finished reply word by word (the reply already exists in full - Lumina answers in one
 * piece - so this is presentation only). Words, not letters: Arabic letters join, and revealing
 * half a word would redraw its shape at every step. Under reduced motion, or when `active` is
 * false, the text is shown whole at once.
 */
export function useTypewriter(text: string, active: boolean, onDone?: () => void, onProgress?: () => void) {
  const reduce = useReducedMotion();
  const animate = active && !reduce;
  // Only the animation writes this; when not animating the whole text is shown (derived below).
  const [typed, setTyped] = useState("");
  const done = useRef(onDone);
  const progress = useRef(onProgress);

  useEffect(() => {
    done.current = onDone;
    progress.current = onProgress;
  });

  useEffect(() => {
    if (!animate) return;
    // Keep each separator with the word before it, so the layout never jumps between frames.
    const parts = text.match(/\S+\s*|\s+/g) ?? [text];
    const duration = Math.min(MAX_MS, Math.max(MIN_MS, parts.length * MS_PER_WORD));
    const started = performance.now();
    let frame = 0;
    let count = -1;
    const tick = (now: number) => {
      const next = Math.min(parts.length, Math.ceil(((now - started) / duration) * parts.length));
      if (next !== count) {
        count = next;
        setTyped(parts.slice(0, next).join(""));
        progress.current?.();
      }
      if (next < parts.length) frame = requestAnimationFrame(tick);
      else done.current?.();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, text]);

  const shown = animate ? typed : text;
  return { shown, typing: animate && shown.length < text.length };
}

/**
 * For a reply that was typed out (`typed`), the visible text is decorative (`aria-hidden`) and
 * assistive tech reads the full reply from a hidden copy - announced once, rather than a live
 * region re-announcing every partial sentence. The structure stays the same after typing ends,
 * so finishing does not announce the reply a second time.
 */
export function TypedText({ text, shown, typed, children }: { text: string; shown: string; typed: boolean; children: (value: string) => ReactNode }) {
  if (!typed) return <>{children(text)}</>;
  return (
    <>
      <p className="sr-only">{text}</p>
      <div aria-hidden>{children(shown)}</div>
    </>
  );
}
