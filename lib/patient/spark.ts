import { useSyncExternalStore } from "react";
import { localDay } from "@/lib/patient/format";

/**
 * Spark — the ADHD momentum helper. One thing to do today, cut into tiny steps, plus a short focus timer.
 * It lives on this device only (nothing is sent anywhere) and starts fresh each day.
 */
export type SparkStep = { id: string; text: string; done: boolean };
export type SparkState = { day: string; task: string; steps: SparkStep[]; focusRuns: number; focusMinutes: number };

const KEY = "vitamind_spark";
const MAX_STEPS = 5;
const MAX_TASK = 140;

const empty = (day: string): SparkState => ({ day, task: "", steps: [], focusRuns: 0, focusMinutes: 0 });
const listeners = new Set<() => void>();
let cache: { raw: string | null; state: SparkState } | null = null;

function read(): SparkState {
  const day = localDay(new Date());
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(KEY); } catch { /* private mode */ }
  if (cache && cache.raw === raw && cache.state.day === day) return cache.state;
  let state = empty(day);
  try {
    const parsed = raw ? (JSON.parse(raw) as SparkState) : null;
    if (parsed && parsed.day === day && Array.isArray(parsed.steps)) state = parsed;
  } catch { /* corrupt value: start again */ }
  cache = { raw, state };
  return state;
}

function write(state: SparkState) {
  const raw = JSON.stringify(state);
  try { window.localStorage.setItem(KEY, raw); } catch { /* not saved: still shown this visit */ }
  cache = { raw, state };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useSpark(): SparkState | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** "email Sam, book the dentist then tidy my desk" → three pieces; a single task gets a gentle 3-step path. */
export function splitIntoSteps(task: string, template: readonly [string, string, string]): string[] {
  const clean = task.trim().replace(/\s+/g, " ").slice(0, MAX_TASK);
  if (!clean) return [];
  const pieces = clean
    .split(/\s*(?:[,;،؛\n]|\bthen\b|\band then\b|\bafter that\b|\bثم\b|\bبعدها\b)\s*/i)
    .map((piece) => piece.trim().replace(/^(and|و)\s+/i, ""))
    .filter((piece) => piece.length > 1);
  if (pieces.length > 1) return pieces.slice(0, MAX_STEPS).map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1));
  return template.map((line) => line.replace("{task}", clean));
}

const id = () => Math.random().toString(36).slice(2, 9);

export const sparkActions = {
  plan(task: string, steps: string[]) {
    const state = read();
    write({ ...state, task: task.trim().slice(0, MAX_TASK), steps: steps.map((text) => ({ id: id(), text, done: false })) });
  },
  toggle(stepId: string) {
    const state = read();
    write({ ...state, steps: state.steps.map((step) => (step.id === stepId ? { ...step, done: !step.done } : step)) });
  },
  reset() {
    const state = read();
    write({ ...empty(state.day), focusRuns: state.focusRuns, focusMinutes: state.focusMinutes });
  },
  focusDone(minutes: number) {
    const state = read();
    write({ ...state, focusRuns: state.focusRuns + 1, focusMinutes: state.focusMinutes + minutes });
  },
};
