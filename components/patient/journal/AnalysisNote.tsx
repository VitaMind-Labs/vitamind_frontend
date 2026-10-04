"use client";

import { usePatientCopy } from "@/hooks/usePatientCopy";
import type { JournalEntry } from "@/lib/api/patient-types";
import { journalLabels } from "@/lib/patient/journal-labels";
import { fill } from "@/lib/i18n/patient";
import { useJob } from "@/lib/patient/jobs";

/** A thin, inline bar (this note sits inside a paragraph): the job's progress when the API reports one. */
function Progress({ value }: { value?: number }) {
  return (
    <span aria-hidden className="ms-2 inline-block h-1 w-14 overflow-hidden rounded-full bg-teal-100 align-middle">
      <span
        className="block h-full rounded-full bg-teal-500 transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${Math.max(8, Math.min(100, value ?? 10))}%` }}
      />
    </span>
  );
}

/**
 * One line about the read of an entry: reading now (live, from the event stream), pending, done
 * (with the themes it found), failed or private.
 */
export function AnalysisNote({ entry }: { entry: Pick<JournalEntry, "id" | "analysisStatus" | "analysis" | "isPrivate"> }) {
  const copy = usePatientCopy();
  const a = copy.journal.analysis;
  const job = useJob(entry.id);
  if (entry.isPrivate || entry.analysisStatus === "SKIPPED") return <span>{a.SKIPPED}</span>;
  if (job && (job.status === "running" || job.status === "queued")) {
    return (
      <span aria-live="polite">
        {copy.live.analysis.running}
        <Progress value={job.progress} />
      </span>
    );
  }
  if (entry.analysisStatus === "PENDING") return <span>{a.PENDING}</span>;
  if (entry.analysisStatus === "FAILED") return <span>{a.FAILED}</span>;
  const labels = journalLabels(entry.analysis, copy).slice(0, 2);
  return <span dir="auto">{labels.length ? fill(a.COMPLETED, { cues: labels.join(" · ") }) : a.COMPLETED_NONE}</span>;
}
