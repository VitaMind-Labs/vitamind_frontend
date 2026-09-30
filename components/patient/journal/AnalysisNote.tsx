"use client";

import { usePatientCopy } from "@/hooks/usePatientCopy";
import type { JournalEntry } from "@/lib/api/patient-types";
import { fill } from "@/lib/i18n/patient";

/** One line about Lumina's read of an entry: pending, done (with everyday cues), failed or private. */
export function AnalysisNote({ entry }: { entry: Pick<JournalEntry, "analysisStatus" | "analysis" | "isPrivate"> }) {
  const copy = usePatientCopy();
  const a = copy.journal.analysis;
  if (entry.isPrivate || entry.analysisStatus === "SKIPPED") return <span>{a.SKIPPED}</span>;
  if (entry.analysisStatus === "PENDING") return <span>{a.PENDING}</span>;
  if (entry.analysisStatus === "FAILED") return <span>{a.FAILED}</span>;
  const cues = (entry.analysis?.cues ?? []).slice(0, 2).map((cue) => copy.journal.cues[cue]);
  return <span dir="auto">{cues.length ? fill(a.COMPLETED, { cues: cues.join(" · ") }) : a.COMPLETED_NONE}</span>;
}
