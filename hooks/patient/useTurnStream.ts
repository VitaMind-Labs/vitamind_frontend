"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Text is painted at most this often: smooth for the eye, cheap for a long conversation. */
const FLUSH_MS = 45;

/**
 * The live half of a streamed agent turn: the text received so far (painted in small, steady steps),
 * the abort handle behind the Stop button, and what was received, whenever you ask for it.
 * `begin()` starts a turn; `finish()` ends it once the final body has been applied.
 */
export function useTurnStream() {
  const [text, setText] = useState("");
  const received = useRef("");
  const timer = useRef<number | null>(null);
  const controller = useRef<AbortController | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => () => {
    clearTimer();
    controller.current?.abort();
  }, [clearTimer]);

  const begin = useCallback(
    (accept: () => boolean = () => true) => {
      clearTimer();
      received.current = "";
      setText("");
      const next = new AbortController();
      controller.current = next;
      return {
        signal: next.signal,
        onDelta: (delta: string) => {
          received.current += delta;
          // A thread switch hides a turn that is still running in the background.
          if (!accept() || timer.current !== null) return;
          timer.current = window.setTimeout(() => {
            timer.current = null;
            setText(received.current);
          }, FLUSH_MS);
        },
      };
    },
    [clearTimer],
  );

  const finish = useCallback(() => {
    clearTimer();
    controller.current = null;
    setText("");
  }, [clearTimer]);

  /** Everything received so far, even what has not been painted yet. */
  const snapshot = useCallback(() => received.current, []);
  const stop = useCallback(() => controller.current?.abort(), []);
  const hide = useCallback(() => {
    clearTimer();
    setText("");
  }, [clearTimer]);

  return { text, begin, finish, stop, snapshot, hide };
}
