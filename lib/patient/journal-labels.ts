import type { JournalAnalysisSummary } from "@/lib/api/patient-types";
import type { PatientCopy } from "@/lib/i18n/patient";

/**
 * The everyday words for what the Journal engine found in an entry: its themes first, then its
 * signals. The engine's label sets are closed (see `JournalThemeLabel` / `JournalSignalLabel`); an
 * unknown label falls back to a readable form of itself rather than disappearing.
 */
export function journalLabels(analysis: JournalAnalysisSummary | undefined, copy: PatientCopy): string[] {
  if (!analysis) return [];
  const themes = analysis.themes.map((label) => themeLabel(label, copy));
  const signals = analysis.signals.map((label) => signalLabel(label, copy));
  return [...themes, ...signals];
}

const readable = (label: string) => label.replace(/_/g, " ");

export const themeLabel = (label: string, copy: PatientCopy): string =>
  (copy.journal.labels.themes as Record<string, string>)[label] ?? readable(label);

export const signalLabel = (label: string, copy: PatientCopy): string =>
  (copy.journal.labels.signals as Record<string, string>)[label] ?? readable(label);
