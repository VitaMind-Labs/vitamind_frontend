"use client";

import { useCallback } from "react";
import { luminaApi, sparkApi } from "@/lib/api/patient";
import type { LuminaMemory, SparkMemory, SparkPatternProgress } from "@/lib/api/patient-types";
import { usePatientResource } from "@/hooks/usePatientResource";

/** Whose memories: each agent has its own list and its own confirm/forget route. */
export type MemoryAgent = "lumina" | "spark";

type Memory = LuminaMemory | SparkMemory;
type Loaded = { items: Memory[]; progress?: SparkPatternProgress };

const SOURCES = {
  lumina: { list: async (): Promise<Loaded> => ({ items: (await luminaApi.memories()).data }), decide: luminaApi.decideMemory },
  spark: {
    list: async (): Promise<Loaded> => {
      const { data, progress } = await sparkApi.memories();
      return { items: data, progress };
    },
    decide: sparkApi.decideMemory,
  },
} as const;

/**
 * One agent's memories and the patient's decision on each. Confirming makes a proposal ACTIVE;
 * forgetting removes it from the list (the backend keeps it REJECTED so it is not proposed again).
 * Pass `enabled: false` for an agent the patient cannot use (Spark off the ADHD track).
 * `progress` (Spark only) says how many focus attempts Spark has seen against the floor it needs
 * before it suggests anything, so an empty list can explain itself.
 */
export function useAgentMemories(agent: MemoryAgent, { enabled = true }: { enabled?: boolean } = {}) {
  const resource = usePatientResource<Loaded>(enabled ? `${agent}:memories` : null, SOURCES[agent].list, { staleMs: 15_000 });
  const { data: loaded, setData } = resource;

  const decide = useCallback(
    async (id: string, action: "CONFIRM" | "REJECT") => {
      await SOURCES[agent].decide(id, action);
      setData((current) => ({
        ...(current ?? { items: [] }),
        items: (current?.items ?? []).flatMap((memory) => {
          if (memory.id !== id) return [memory];
          return action === "REJECT" ? [] : [{ ...memory, status: "ACTIVE" as const, confirmedAt: new Date().toISOString() }];
        }),
      }));
    },
    [agent, setData],
  );

  return { ...resource, data: loaded?.items, progress: loaded?.progress, decide };
}
