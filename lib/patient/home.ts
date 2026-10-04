import type { Checkin } from "@/lib/api/patient-types";
import type { PatientCopy } from "@/lib/i18n/patient";
import { fill } from "@/lib/i18n/patient";
import { addDaysLocal, localDay } from "@/lib/patient/format";

export type WellbeingKey = "mood" | "energy" | "sleep" | "focus";

/** The four daily measures, in the order Home shows them. */
export const WELLBEING_KEYS: WellbeingKey[] = ["mood", "energy", "focus", "sleep"];

/** Sleep hours on a 0–10 ring: a plateau around 7–9 hours, falling away on both sides. */
export function sleepScore(hours: number): number {
  return Math.max(0, Math.min(10, 10 - Math.abs(hours - 8) * 1.6));
}

/** A 1–5 check-in answer on the 0–10 ring (1→2 … 5→10, the same steps as the mood levels). */
export const ringValue = (level: number): number => level * 2;

export type WellbeingReading = {
  key: WellbeingKey;
  /** 0–10 for the ring, null when not reported today. */
  value: number | null;
  /** What to print next to it: "4/5", "7.5h". */
  display: string;
};

export function readWellbeing(key: WellbeingKey, checkin: Checkin | null): WellbeingReading {
  if (!checkin) return { key, value: null, display: "—" };
  if (key === "sleep") return { key, value: sleepScore(checkin.sleepHours), display: `${Math.round(checkin.sleepHours * 10) / 10}h` };
  const level = checkin[key];
  return { key, value: ringValue(level), display: `${level}/5` };
}

export function bandLabel(reading: WellbeingReading, copy: PatientCopy): string {
  if (reading.value === null) return copy.bands.none;
  return reading.value >= 7 ? copy.bands.good : reading.value >= 4 ? copy.bands.moderate : copy.bands.low;
}

export type SignalTone = "positive" | "neutral" | "attention";
export type Signal = { id: string; dimension: WellbeingKey | "consistency"; tone: SignalTone; text: string };

function average(values: (number | null)[]): number | null {
  const numbers = values.filter((value): value is number => value !== null);
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null;
}

/**
 * "Recent signals": plain week-on-week facts from the patient's own check-ins, compared only with
 * themselves. Non-diagnostic wording only.
 */
export function deriveSignals(checkins: Checkin[], copy: PatientCopy): Signal[] {
  const signals: Signal[] = [];
  const byDay = new Map(checkins.map((row) => [row.date.slice(0, 10), row]));
  const window = (offset: number, pick: (row: Checkin) => number) =>
    Array.from({ length: 7 }, (_, i) => {
      const row = byDay.get(localDay(addDaysLocal(new Date(), -(offset + i))));
      return row ? pick(row) : null;
    });

  const moodNow = window(0, (row) => row.mood);
  const thisWeek = average(moodNow);
  const lastWeek = average(window(7, (row) => row.mood));
  // Mood is 1–5, so half a point is the smallest change worth naming.
  if (thisWeek !== null && lastWeek !== null && moodNow.filter((v) => v !== null).length >= 3) {
    const delta = thisWeek - lastWeek;
    if (delta >= 0.5) signals.push({ id: "mood:up", dimension: "mood", tone: "positive", text: copy.home.signals.moodUp });
    else if (delta <= -0.5) signals.push({ id: "mood:down", dimension: "mood", tone: "attention", text: copy.home.signals.moodDown });
  }

  const energyNow = average(window(0, (row) => row.energy));
  const energyBefore = average(window(7, (row) => row.energy));
  if (energyNow !== null && energyBefore !== null && Math.abs(energyNow - energyBefore) >= 0.5) {
    const rising = energyNow > energyBefore;
    signals.push({
      id: "energy",
      dimension: "energy",
      tone: rising ? "positive" : "attention",
      text: fill(rising ? copy.home.signals.up : copy.home.signals.down, { dimension: copy.dimensions.energy }),
    });
  }

  // `checkins` is newest-last (as the trend charts read it). The latest night is compared with the
  // patient's own recent nights, so a 12 h or a 2 h night is never shown as a bare number.
  const lastNight = [...checkins].reverse()[0];
  if (lastNight && signals.length < 4) {
    const hours = Math.round(lastNight.sleepHours * 10) / 10;
    const h = lastNight.sleepHours;
    const earlier = checkins.filter((row) => row !== lastNight).slice(-14).map((row) => row.sleepHours);
    const usual = earlier.length >= 3 ? earlier.reduce((sum, v) => sum + v, 0) / earlier.length : null;
    const base = fill(
      h < 4 ? copy.home.signals.sleepVeryShort : h < 6 ? copy.home.signals.sleepShort : h > 10 ? copy.home.signals.sleepLong : copy.home.signals.sleepGood,
      { h: hours },
    );
    const gap = usual === null ? 0 : Math.round((h - usual) * 10) / 10;
    const text = Math.abs(gap) >= 1.5 ? fill(gap < 0 ? copy.home.signals.sleepLess : copy.home.signals.sleepMore, { base, d: Math.abs(gap) }) : base;
    signals.push({
      id: "sleep:last",
      dimension: "sleep",
      tone: h >= 7 && h <= 10 ? "positive" : h < 6 || h > 10 ? "attention" : "neutral",
      text,
    });
    if (h < 5 && lastNight.energy >= 4 && lastNight.mood >= 4 && signals.length < 4) {
      signals.push({ id: "energy:little-sleep", dimension: "energy", tone: "attention", text: copy.home.signals.energyLittleSleep });
    }
  }

  const days = moodNow.filter((value) => value !== null).length;
  if (days >= 2 && signals.length < 4) {
    signals.push({ id: "consistency", dimension: "consistency", tone: "positive", text: fill(copy.home.signals.consistent, { n: days }) });
  }

  if (!signals.length && checkins.length) {
    signals.push({ id: "calibrating", dimension: "consistency", tone: "neutral", text: copy.home.signals.calibrating });
  }
  return signals.slice(0, 4);
}
