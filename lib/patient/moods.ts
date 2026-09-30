/**
 * The five mood levels shared by the daily check-in and the Smart Journal. Each maps to
 * a 0–10 score (Lumina's contract) and carries the colour that follows it through
 * the emoji, the slider glow and the charts.
 */
export type MoodLevel = {
  level: 1 | 2 | 3 | 4 | 5;
  score: 2 | 4 | 6 | 8 | 10;
  emoji: string;
  /**
   * The hue of the level's atmosphere (see [data-mood] in globals.css), from a quiet dusk
   * lavender (low) through the brand teal (okay) to golden-hour amber (very good).
   */
  color: string;
  soft: string;
};

export const MOOD_LEVELS: readonly MoodLevel[] = [
  { level: 1, score: 2, emoji: "😔", color: "#7f78ae", soft: "#e8e6f4" },
  { level: 2, score: 4, emoji: "🙁", color: "#5583ab", soft: "#dfeaf3" },
  { level: 3, score: 6, emoji: "😐", color: "#518591", soft: "#e3eeef" },
  { level: 4, score: 8, emoji: "🙂", color: "#5f937a", soft: "#e1eee7" },
  { level: 5, score: 10, emoji: "😊", color: "#b98522", soft: "#faefd2" },
];

/** Nearest level for any 0–10 score. */
export function moodFor(score: number | null | undefined): MoodLevel | null {
  if (score === null || score === undefined || Number.isNaN(score)) return null;
  return MOOD_LEVELS.reduce((best, item) => (Math.abs(item.score - score) < Math.abs(best.score - score) ? item : best));
}

/** Colour for a 0–10 value on a smooth low→high scale (used by rings and charts). */
export function scaleColor(value: number | null | undefined, inverted = false): string {
  if (value === null || value === undefined) return "#a9c7cb";
  const v = inverted ? 10 - value : value;
  return moodFor(v)?.color ?? "#a9c7cb";
}

/** The emotion chips of the Smart Journal (stable keys; wording lives in the copy). */
export const EMOTION_KEYS = [
  "calm", "happy", "grateful", "hopeful", "proud", "energized",
  "tired", "anxious", "sad", "irritable", "overwhelmed", "lonely",
] as const;
export type EmotionKey = (typeof EMOTION_KEYS)[number];
