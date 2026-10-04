"use client";

import { useSyncExternalStore } from "react";
import type { JobProgressData } from "@/hooks/useEventStream";

/**
 * Background work the API reports on the event stream (`job.progress`), keyed by job id. For the
 * journal the job id is the entry id, so a screen can ask "is this entry being read right now?".
 * Finished jobs linger briefly so the screen can settle, then disappear.
 */
export type JobState = JobProgressData & { at: number };

const SETTLE_MS = 6_000;
const jobs = new Map<string, JobState>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function recordJob(job: JobProgressData) {
  jobs.set(job.jobId, { ...job, at: Date.now() });
  notify();
  if (job.status === "completed" || job.status === "failed") {
    setTimeout(() => {
      const current = jobs.get(job.jobId);
      if (current && current.status === job.status) {
        jobs.delete(job.jobId);
        notify();
      }
    }, SETTLE_MS);
  }
}

export function clearJobs() {
  jobs.clear();
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The latest state of one job, or undefined when nothing is known (or it has settled). */
export function useJob(jobId: string | null | undefined): JobState | undefined {
  return useSyncExternalStore(
    subscribe,
    () => (jobId ? jobs.get(jobId) : undefined),
    () => undefined,
  );
}
