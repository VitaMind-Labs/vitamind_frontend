"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { EmptyState, ErrorState, Skeleton } from "@/components/patient/ui/primitives";
import { PatientModal } from "@/components/patient/ui/PatientModal";
import { Button } from "@/components/ui/button";
import { useLuminaMemories } from "@/hooks/patient/useLumina";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import type { LuminaMemory } from "@/lib/api/patient-types";

/**
 * What Lumina remembers — the patient decides. ACTIVE memories shape replies; CANDIDATE ones are
 * only proposals until the patient confirms them, and "forget" removes them for good.
 */
export function MemoryList({ compact = false }: { compact?: boolean }) {
  const copy = usePatientCopy();
  const memories = useLuminaMemories();
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
  if (!memories.data.length) return <EmptyState title={copy.chat.memory.empty} />;

  return (
    <ul className={compact ? "space-y-2" : "space-y-2.5"}>
      {memories.data.map((memory) => (
        <li key={memory.id} className="rounded-2xl border border-white/80 bg-white/75 p-3.5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-teal-700 rtl:tracking-normal">
                {memory.status === "CANDIDATE" ? copy.chat.memory.candidate : copy.chat.memory.active}
              </p>
              <p className="mt-0.5 text-sm leading-snug text-ink" dir="auto">{memory.content}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {memory.status === "CANDIDATE" && (
                <Button size="sm" variant="outline" disabled={busy === memory.id} onClick={() => void decide(memory, "CONFIRM")}>
                  <Check aria-hidden />{copy.chat.memory.confirm}
                </Button>
              )}
              <Button size="sm" variant="ghost" disabled={busy === memory.id} onClick={() => void decide(memory, "REJECT")} aria-label={`${copy.chat.memory.forget}: ${memory.content}`}>
                <Trash2 aria-hidden />{copy.chat.memory.forget}
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MemoryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const copy = usePatientCopy();
  return (
    <PatientModal open={open} onOpenChange={onOpenChange} title={copy.chat.memory.title} description={copy.chat.memory.subtitle} size="lg">
      <div className="mt-5">
        <MemoryList />
      </div>
    </PatientModal>
  );
}
