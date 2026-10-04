import type { PatientTrack } from "@/lib/api/patient-types";

/**
 * Which patients have a reading library. The articles themselves are no longer listed here: the Smart Library
 * recommends them from the backend (`useLibrary`), from the catalog of approved articles for the patient's own
 * track. "PSYCHOSIS" is accepted for the day Mira can orient to it; today it is the schizophrenia library.
 */
export type HomeTrack = PatientTrack | "PSYCHOSIS";

/** Bipolar / schizophrenia / psychosis get a reading library. */
export function showsReads(track: HomeTrack): boolean {
  return track === "BIPOLAR" || track === "SCHIZOPHRENIA" || track === "PSYCHOSIS";
}

/** Home shows exactly this many articles, then a way into the library. */
export const HOME_ARTICLE_COUNT = 2;
