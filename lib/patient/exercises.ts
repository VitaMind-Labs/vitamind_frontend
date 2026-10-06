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

/** Every catalogue exercise, ordered by how well it suits each track (by slug). */
const TRACK_ORDER: Record<PatientTrack, string[]> = {
  ADHD: ["focus-sprint", "box-breathing", "short-walk", "morning-light", "body-scan", "breathing-4-7-8", "grounding-5-4-3-2-1", "sleep-wind-down"],
  BIPOLAR: ["sleep-wind-down", "morning-light", "breathing-4-7-8", "body-scan", "short-walk", "box-breathing", "grounding-5-4-3-2-1", "focus-sprint"],
  SCHIZOPHRENIA: ["grounding-5-4-3-2-1", "short-walk", "body-scan", "breathing-4-7-8", "sleep-wind-down", "box-breathing", "morning-light", "focus-sprint"],
  UNSPECIFIED: ["breathing-4-7-8", "short-walk", "body-scan", "box-breathing", "grounding-5-4-3-2-1", "morning-light", "sleep-wind-down", "focus-sprint"],
};

export type ExerciseNeed = { sleepHours: number | null };

/**
 * The one exercise to recommend now: a wind-down after a short night, otherwise the track's
 * first pick. Falls back to the first exercise of the catalogue.
 */
export function recommendExercise(catalog: Exercise[], track: PatientTrack, need: ExerciseNeed): Exercise | null {
  if (!catalog.length) return null;
  const bySlug = (slug: string) => catalog.find((item) => item.slug === slug);
  if (need.sleepHours !== null && need.sleepHours < 6) return bySlug("sleep-wind-down") ?? catalog[0];
  for (const slug of TRACK_ORDER[track]) {
    const found = bySlug(slug);
    if (found) return found;
  }
  return catalog[0];
}

/** The track's suggested exercises, without the one already recommended. */
export function suggestedExercises(catalog: Exercise[], track: PatientTrack, excludeId?: string, limit = 3): Exercise[] {
  const ordered = TRACK_ORDER[track].map((slug) => catalog.find((item) => item.slug === slug)).filter((item): item is Exercise => Boolean(item));
  const rest = catalog.filter((item) => !ordered.includes(item));
  return [...ordered, ...rest].filter((item) => item.id !== excludeId).slice(0, limit);
}

/**
 * The whole catalogue, best fit first for this patient: a wind-down leads after a short night, then the track's
 * own order, then anything the order does not name.
 */
export function rankedExercises(catalog: Exercise[], track: PatientTrack, need: ExerciseNeed): Exercise[] {
  const ordered = TRACK_ORDER[track].map((slug) => catalog.find((item) => item.slug === slug)).filter((item): item is Exercise => Boolean(item));
  const all = [...ordered, ...catalog.filter((item) => !ordered.includes(item))];
  if (need.sleepHours !== null && need.sleepHours < 6) {
    const sleep = all.find((item) => item.slug === "sleep-wind-down");
    if (sleep) return [sleep, ...all.filter((item) => item !== sleep)];
  }
  return all;
}
