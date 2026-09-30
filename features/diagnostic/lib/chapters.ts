import type { MiraChapter } from "../types";

/** The four visible chapters of the guided journey, in order. */
export const CHAPTER_SEQUENCE: MiraChapter[] = ["MORNING", "MIDDAY", "EVENING", "INNER_VOICE"];

/** Mira's default session length (agent DEFAULT_SESSION_QUESTIONS). The visitor may ask for more. */
export const ESTIMATED_QUESTIONS = 10;

/**
 * Present the four-chapter journey by mapping global progress (0..1) onto the sequence.
 *
 * Mira's agent keeps its own `chapter` fixed at "MORNING" for the whole conversation
 * (verified in vitamind_agent), and we must not change its reasoning. So the sidebar's
 * active chapter is derived here — pure display wiring, never sent back to the agent.
 */
export function deriveChapter(
  progress: number,
  opts: { complete?: boolean; urgent?: boolean } = {},
): MiraChapter {
  if (opts.urgent) return "SAFETY";
  if (opts.complete || progress >= 1) return "COMPLETE";
  const clamped = Math.max(0, Math.min(0.999, Number.isFinite(progress) ? progress : 0));
  const index = Math.min(CHAPTER_SEQUENCE.length - 1, Math.floor(clamped * CHAPTER_SEQUENCE.length));
  return CHAPTER_SEQUENCE[index];
}

/** Chapter a question belongs to, given how many answers the visitor had given before it. */
export function chapterAtTurn(answersBefore: number): MiraChapter {
  return deriveChapter(answersBefore / ESTIMATED_QUESTIONS);
}

/** Answers given so far and the question currently being asked (1-based, capped at the estimate). */
export function questionPosition(progress: number) {
  const answered = Math.max(0, Math.min(ESTIMATED_QUESTIONS, Math.round(progress * ESTIMATED_QUESTIONS)));
  return {
    answered,
    current: Math.min(ESTIMATED_QUESTIONS, answered + 1),
    total: ESTIMATED_QUESTIONS,
    remaining: Math.max(0, ESTIMATED_QUESTIONS - answered),
  };
}
