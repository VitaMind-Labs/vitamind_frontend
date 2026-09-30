import type { Lang } from "@/lib/i18n/config";
import type { Exercise, PatientTrack } from "@/lib/api/patient-types";

export type BreathingPattern = { inhale: number; hold: number; exhale: number; cycles: number };
export type LocalizedExercise = {
  id: string;
  slug: string;
  type: Exercise["type"];
  title: string;
  description: string;
  steps: string[];
  minutes: number | null;
  pattern: BreathingPattern | null;
};

type ExerciseContent = {
  steps?: string[];
  pattern?: BreathingPattern;
  i18n?: Partial<Record<Lang, { title?: string; description?: string; steps?: string[] }>>;
};

/** The exercise in the patient's language (English lives on the row, Arabic in `content.i18n`). */
export function localizeExercise(exercise: Exercise, language: Lang): LocalizedExercise {
  const content = (exercise.content && typeof exercise.content === "object" ? exercise.content : {}) as ExerciseContent;
  const translated = language === "en" ? undefined : content.i18n?.[language];
  return {
    id: exercise.id,
    slug: exercise.slug,
    type: exercise.type,
    title: translated?.title ?? exercise.title,
    description: translated?.description ?? exercise.description ?? "",
    steps: translated?.steps ?? content.steps ?? [],
    minutes: exercise.durationMinutes,
    pattern: content.pattern ?? null,
  };
}

/** Which catalog exercises suit each track first (by slug). */
const TRACK_PICKS: Record<PatientTrack, string[]> = {
  ADHD: ["focus-sprint", "box-breathing", "short-walk"],
  BIPOLAR: ["sleep-wind-down", "morning-light", "breathing-4-7-8"],
  SCHIZOPHRENIA: ["grounding-5-4-3-2-1", "short-walk", "body-scan"],
  UNSPECIFIED: ["breathing-4-7-8", "short-walk", "body-scan"],
};

export type ExerciseNeed = { stress: number | null; sleepHours: number | null };

/**
 * The one exercise to recommend now: breathing when stress is high, a wind-down after a short
 * night, otherwise the track's first pick. Falls back to any breathing exercise, then the first.
 */
export function recommendExercise(catalog: Exercise[], track: PatientTrack, need: ExerciseNeed): Exercise | null {
  if (!catalog.length) return null;
  const bySlug = (slug: string) => catalog.find((item) => item.slug === slug);
  if (need.stress !== null && need.stress >= 6) return bySlug("breathing-4-7-8") ?? catalog.find((item) => item.type === "BREATHING") ?? catalog[0];
  if (need.sleepHours !== null && need.sleepHours < 6) return bySlug("sleep-wind-down") ?? catalog[0];
  for (const slug of TRACK_PICKS[track]) {
    const found = bySlug(slug);
    if (found) return found;
  }
  return catalog[0];
}

/** The track's suggested exercises, without the one already recommended. */
export function suggestedExercises(catalog: Exercise[], track: PatientTrack, excludeId?: string, limit = 3): Exercise[] {
  const ordered = TRACK_PICKS[track].map((slug) => catalog.find((item) => item.slug === slug)).filter((item): item is Exercise => Boolean(item));
  const rest = catalog.filter((item) => !ordered.includes(item));
  return [...ordered, ...rest].filter((item) => item.id !== excludeId).slice(0, limit);
}
