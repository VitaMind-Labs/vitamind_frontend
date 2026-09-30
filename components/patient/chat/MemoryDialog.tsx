"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { EmptyState, ErrorState, Skeleton } from "@/components/patient/ui/primitives";
import { PatientModal } from "@/components/patient/ui/PatientModal";
import { Button } from "@/components/ui/button";
import { useAgentMemories, type MemoryAgent } from "@/hooks/patient/useMemories";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import type { LuminaMemory, SparkPatternProgress } from "@/lib/api/patient-types";
import { fill } from "@/lib/i18n/patient";

function useMemoryCopy(agent: MemoryAgent) {
  const copy = usePatientCopy();
  return agent === "spark" ? copy.spark.memoryPanel : copy.chat.memory;
}

/** Why Spark's list can be empty and what fills it: attempts so far against the floor it needs. */
function SparkProgress({ progress }: { progress: SparkPatternProgress }) {
  const text = usePatientCopy().spark.memoryPanel;
  const seen = Math.min(progress.attempts, progress.neededAttempts);
  return (
    <div className="rounded-2xl border border-white/80 bg-white/60 p-3.5">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-teal-700 rtl:tracking-normal">{text.progressTitle}</p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={progress.neededAttempts}
        aria-valuenow={seen}
        aria-label={text.progressTitle}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10"
      >
        <div className="h-full rounded-full bg-teal-500 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${(seen / progress.neededAttempts) * 100}%` }} />
      </div>
      <p className="mt-2 text-sm leading-snug text-ink-soft">
        {fill(text.progress, { a: seen, na: progress.neededAttempts, d: Math.min(progress.days, progress.neededDays), nd: progress.neededDays })}
      </p>
      <p className="mt-1.5 text-xs leading-snug text-ink-muted">{text.howTo}</p>
    </div>
  );
}

/**
 * What an agent remembers - the patient decides. ACTIVE memories shape replies (Lumina) or plans
 * (Spark); CANDIDATE ones are only proposals until the patient confirms them, and "forget"
 * removes them for good. Each agent reads and writes only its own memories.
 */
export function MemoryList({ agent = "lumina", compact = false }: { agent?: MemoryAgent; compact?: boolean }) {
  const text = useMemoryCopy(agent);
  const memories = useAgentMemories(agent);
  const [busy, setBusy] = useState<string | null>(null);

  async function decide(memory: LuminaMemory, action: "CONFIRM" | "REJECT") {
    setBusy(memory.id);
    try {
      await memories.decide(memory.id, action);
    } finally {
      setBusy(null);
    }
  }

  if (memories.error && !memories.data) return <ErrorState onRetry={() => void memories.refresh()} />;
  if (!memories.data) return <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>;
  const progress = agent === "spark" ? memories.progress : undefined;
  if (!memories.data.length) {
    return (
      <div className="space-y-3">
        <EmptyState title={text.empty} />
        {progress && <SparkProgress progress={progress} />}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className={compact ? "space-y-2" : "space-y-2.5"}>
        {memories.data.map((memory) => (
          <li key={memory.id} className="rounded-2xl border border-white/80 bg-white/75 p-3.5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-teal-700 rtl:tracking-normal">
                  {memory.status === "CANDIDATE" ? text.candidate : text.active}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-ink" dir="auto">{memory.content}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {memory.status === "CANDIDATE" && (
                  <Button size="sm" variant="outline" disabled={busy === memory.id} onClick={() => void decide(memory, "CONFIRM")}>
                    <Check aria-hidden />{text.confirm}
                  </Button>
                )}
                <Button size="sm" variant="ghost" disabled={busy === memory.id} onClick={() => void decide(memory, "REJECT")} aria-label={`${text.forget}: ${memory.content}`}>
                  <Trash2 aria-hidden />{text.forget}
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {progress && <SparkProgress progress={progress} />}
    </div>
  );
}

export function MemoryDialog({ open, onOpenChange, agent = "lumina" }: { open: boolean; onOpenChange: (open: boolean) => void; agent?: MemoryAgent }) {
  const text = useMemoryCopy(agent);
  return (
    <PatientModal open={open} onOpenChange={onOpenChange} title={text.title} description={text.subtitle} size="lg">
      <div className="mt-5">
        <MemoryList agent={agent} />
      </div>
    </PatientModal>
  );
}
