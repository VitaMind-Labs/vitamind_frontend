import type { OnboardingKey } from "@/lib/api/patient";
import type { PatientTrack } from "@/lib/api/patient-types";

/**
 * Lumina's first conversation. Each step maps to a backend memory key (see
 * ONBOARDING_QUESTIONS on the API) and is asked in a track-aware order: everyone gets the
 * core questions; the rest reflect what each track's daily state actually tracks.
 *
 *  - `name`   : confirm or change what Lumina calls the patient;
 *  - `single` / `multi` : choices (no free text, nothing to screen);
 *  - `text`   : free text — sent through Lumina's chat as well, so its safety layer sees it.
 */
export type StepKind = "name" | "single" | "multi" | "text";
export type OnboardingStep = { key: OnboardingKey; kind: StepKind; copyKey: string };

const step = (key: OnboardingKey, kind: StepKind, copyKey: string = key): OnboardingStep => ({ key, kind, copyKey });

const OPENING: OnboardingStep[] = [
  step("preferred_name", "name"),
  step("tone", "single"),
  step("main_goal", "text"),
  step("good_day", "single"),
  step("sleep_pattern", "single"),
  step("daily_rhythm", "single"),
];

const BY_TRACK: Record<PatientTrack, OnboardingStep[]> = {
  ADHD: [step("focus_challenge", "multi")],
  BIPOLAR: [step("energy_rhythm", "single"), step("early_signs", "multi")],
  SCHIZOPHRENIA: [step("early_signs", "multi"), step("social_life", "single"), step("medication_routine", "single")],
  UNSPECIFIED: [],
};

const CLOSING: OnboardingStep[] = [
  step("stressors", "multi"),
  step("support_people", "multi"),
  step("helps", "multi"),
  step("checkin_time", "single"),
  step("anything_else", "text", "closing"),
];

export function onboardingSteps(track: PatientTrack): OnboardingStep[] {
  return [...OPENING, ...BY_TRACK[track], ...CLOSING];
}

const WELCOME_SEEN_KEY = "vitamind_welcome_seen";

/** The immersive welcome is forced once per patient; after that they may leave the first conversation. */
export function hasSeenWelcome(userId: string): boolean {
  try {
    return window.localStorage.getItem(`${WELCOME_SEEN_KEY}:${userId}`) === "1";
  } catch {
    return false;
  }
}

export function markWelcomeSeen(userId: string) {
  try {
    window.localStorage.setItem(`${WELCOME_SEEN_KEY}:${userId}`, "1");
  } catch {
    /* storage unavailable — the welcome may show again, which is harmless */
  }
}
