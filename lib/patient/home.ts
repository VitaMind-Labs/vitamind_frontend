import type { Checkin, LuminaState, PatientTrack } from "@/lib/api/patient-types";
import type { PatientCopy } from "@/lib/i18n/patient";
import { fill } from "@/lib/i18n/patient";
import { addDaysLocal, localDay } from "@/lib/patient/format";

export type WellbeingKey = "mood" | "energy" | "stress" | "sleep" | "focus" | "routine" | "social" | "tasks";

/** Which four dimensions Home shows first for each track. */
export const WELLBEING_BY_TRACK: Record<PatientTrack, WellbeingKey[]> = {
  ADHD: ["mood", "energy", "focus", "tasks"],
  BIPOLAR: ["mood", "energy", "sleep", "stress"],
  SCHIZOPHRENIA: ["mood", "sleep", "routine", "social"],
  UNSPECIFIED: ["mood", "energy", "stress", "sleep"],
};

/** Sleep hours on a 0–10 ring: a plateau around 7–9 hours, falling away on both sides. */
export function sleepScore(hours: number): number {
  return Math.max(0, Math.min(10, 10 - Math.abs(hours - 8) * 1.6));
}

export type WellbeingReading = {
  key: WellbeingKey;
  /** 0–10 for the ring, null when not reported today. */
  value: number | null;
  /** What to print next to it: "6", "7.5h". */
  display: string;
  inverted: boolean;
};

export function readWellbeing(key: WellbeingKey, checkin: Checkin | null): WellbeingReading {
  const inverted = key === "stress";
  const raw = (() => {
    if (!checkin) return null;
    switch (key) {
      case "mood": return checkin.moodScore;
      case "energy": return checkin.energyLevel;
      case "stress": return checkin.anxietyLevel;
      case "focus": return checkin.focusLevel;
      case "routine": return checkin.routineStability;
      case "social": return checkin.socialConnection;
      case "tasks": return checkin.taskCompletion;
      case "sleep": return checkin.sleepHours;
    }
  })();
  if (raw === null || raw === undefined) return { key, value: null, display: "—", inverted };
  if (key === "sleep") return { key, value: sleepScore(raw), display: `${Math.round(raw * 10) / 10}h`, inverted };
  return { key, value: raw, display: `${raw}/10`, inverted };
}

export function bandLabel(reading: WellbeingReading, copy: PatientCopy): string {
  if (reading.value === null) return copy.bands.none;
  if (reading.inverted) return reading.value <= 3 ? copy.bands.calm : reading.value <= 6 ? copy.bands.moderate : copy.bands.high;
  return reading.value >= 7 ? copy.bands.good : reading.value >= 4 ? copy.bands.moderate : copy.bands.low;
}

export type SignalTone = "positive" | "neutral" | "attention";
export type Signal = { id: string; dimension: WellbeingKey | "consistency"; tone: SignalTone; text: string };

/** Lumina's dimension names → the ones the UI uses. */
const DIMENSION_MAP: Record<string, WellbeingKey> = {
  sleep: "sleep", energy: "energy", stress: "stress", mood: "mood", focus: "focus",
  routine_stability: "routine", social_connection: "social", task_completion: "tasks",
};

function average(values: (number | null)[]): number | null {
  const numbers = values.filter((value): value is number => value !== null);
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null;
}

/**
 * "Recent signals": what Lumina detected against the patient's own baseline (never against a
 * population), plus plain week-on-week facts from their check-ins. Non-diagnostic wording only.
 */
export function deriveSignals(state: LuminaState["data"] | null | undefined, checkins: Checkin[], copy: PatientCopy): Signal[] {
  const signals: Signal[] = [];

  for (const change of state?.changes ?? []) {
    const dimension = DIMENSION_MAP[change.dimension];
    if (!dimension) continue;
    const rising = change.direction === "INCREASE";
    const worse = dimension === "stress" ? rising : !rising;
    signals.push({
      id: `change:${change.dimension}`,
      dimension,
      tone: worse ? "attention" : "positive",
      text: fill(rising ? copy.home.signals.up : copy.home.signals.down, { dimension: copy.dimensions[dimension] }),
    });
  }

  const byDay = new Map(checkins.map((row) => [row.checkinDate.slice(0, 10), row]));
  const window = (offset: number) =>
    Array.from({ length: 7 }, (_, i) => byDay.get(localDay(addDaysLocal(new Date(), -(offset + i))))?.moodScore ?? null);
  const thisWeek = average(window(0));
  const lastWeek = average(window(7));
  if (thisWeek !== null && lastWeek !== null && window(0).filter((v) => v !== null).length >= 3) {
    const delta = thisWeek - lastWeek;
    if (delta >= 1) signals.push({ id: "mood:up", dimension: "mood", tone: "positive", text: copy.home.signals.moodUp });
    else if (delta <= -1) signals.push({ id: "mood:down", dimension: "mood", tone: "attention", text: copy.home.signals.moodDown });
  }

  const lastNight = [...checkins].reverse().find((row) => row.sleepHours !== null);
  if (lastNight && lastNight.sleepHours !== null && signals.length < 4) {
    const hours = Math.round(lastNight.sleepHours * 10) / 10;
    const good = lastNight.sleepHours >= 7;
    signals.push({
      id: "sleep:last",
      dimension: "sleep",
      tone: good ? "positive" : lastNight.sleepHours < 6 ? "attention" : "neutral",
      text: fill(good ? copy.home.signals.sleepGood : copy.home.signals.sleepShort, { h: hours }),
    });
  }

  const days = window(0).filter((value) => value !== null).length;
  if (days >= 2 && signals.length < 4) {
    signals.push({ id: "consistency", dimension: "consistency", tone: "positive", text: fill(copy.home.signals.consistent, { n: days }) });
  }

  if (!signals.length && state && state.changes.length === 0) {
    signals.push({ id: "calibrating", dimension: "consistency", tone: "neutral", text: copy.home.signals.calibrating });
  }
  return signals.slice(0, 4);
}
