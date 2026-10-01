"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { sparkApi } from "@/lib/api/patient";
import type { SafetyLevel, SparkOutcomeName, SparkTask, SparkTurn } from "@/lib/api/patient-types";
import { useTurnStream } from "@/hooks/patient/useTurnStream";
import { invalidatePatientData, usePatientResource } from "@/hooks/usePatientResource";
import { classifyTurnFailure, type TurnFailureKind } from "@/lib/patient/turn-errors";
import { localDay } from "@/lib/patient/format";

export type SparkMessage = {
  id: string;
  role: "user" | "lumina";
  text: string;
  createdAt: string;
  status?: "sending" | "sent" | "failed" | "stopped";
  clientMessageId?: string;
  safetyLevel?: SafetyLevel;
  /** The reply is still being written: text grows as it arrives. */
  streaming?: boolean;
  /** An unfinished reply that was kept (stopped by the patient, or cut short by the connection). */
  partial?: "stopped" | "interrupted";
  /** Stable React key: a streamed reply keeps it from its first word to its final form. */
  renderKey?: string;
  /** Spark's plan for this reply: the next step and the focus block it suggests. */
  turn?: SparkTurn;
};

/** What Spark is keeping open for the patient (Home). Pass `enabled: false` off the ADHD track: no request is made. */
export function useSparkTasks({ enabled = true }: { enabled?: boolean } = {}) {
  return usePatientResource<SparkTask[]>(enabled ? "spark:tasks" : null, async () => (await sparkApi.tasks("TODO")).data, { staleMs: 15_000 });
}

export type SparkSupport = { emergencyResources: string[] } | null;
const PAGE = 30;

function toSafety(level: string): SafetyLevel {
  return level === "CRITICAL" ? "CRISIS" : level === "HIGH" || level === "MODERATE" ? "ELEVATED" : "NORMAL";
}

function turnsToMessages(turns: SparkTurn[]): SparkMessage[] {
  return turns.flatMap((turn): SparkMessage[] => {
    const list: SparkMessage[] = [];
    if (turn.userMessage) list.push({ id: `${turn.id}:user`, role: "user", text: turn.userMessage, createdAt: turn.createdAt, status: "sent" });
    list.push({ id: turn.id, role: "lumina", text: turn.reply, createdAt: turn.createdAt, safetyLevel: toSafety(turn.safetyLevel), turn });
    return list;
  });
}

/**
 * The Spark conversation and the patient's tasks, both restored from the backend on load (the
 * agent keeps nothing, so a reload or a new device shows exactly the same screen). Sends are
 * optimistic and safe to retry: the same `clientMessageId` never creates a second turn.
 *
 * `notAllowed` is true when the backend refuses Spark for this patient (403 SPARK_ADHD_ONLY):
 * the screen then leaves, whatever the local profile said.
 */
export function useSparkChat() {
  const [messages, setMessages] = useState<SparkMessage[]>([]);
  const [tasks, setTasks] = useState<SparkTask[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [nextBefore, setNextBefore] = useState<string | null>(null);
  const [isSending, setSending] = useState(false);
  const [support, setSupport] = useState<SparkSupport>(null);
  const [notAllowed, setNotAllowed] = useState(false);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [failure, setFailure] = useState<TurnFailureKind | null>(null);
  const { text: streamText, begin: beginStream, finish: finishStream, stop: stopStream, snapshot: streamSnapshot } = useTurnStream();
  const [writing, setWriting] = useState<{ key: string; startedAt: string } | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const inspect = useCallback((caught: unknown) => {
    if (!(caught instanceof ApiError)) return;
    const payload = caught.payload as { code?: string; emergencyResources?: string[] } | undefined;
    if (payload?.code === "SPARK_ADHD_ONLY") setNotAllowed(true);
    if (payload?.code === "SUBSCRIPTION_REQUIRED") setSubscriptionRequired(true);
    if (payload?.code === "SPARK_UNAVAILABLE") {
      setUnavailable(true);
      setSupport({ emergencyResources: payload.emergencyResources ?? [] });
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [page, state] = await Promise.all([sparkApi.history({ limit: PAGE }), sparkApi.state()]);
      if (!mounted.current) return;
      setMessages(turnsToMessages(page.data));
      setNextBefore(page.meta.nextBefore);
      setTasks(state.tasks);
    } catch (caught) {
      if (!mounted.current) return;
      inspect(caught);
      setLoadError(true);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [inspect]);

  useEffect(() => {
    // Initial load of the conversation and the task list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const loadOlder = useCallback(async () => {
    if (!nextBefore) return;
    const page = await sparkApi.history({ limit: PAGE, before: nextBefore });
    setMessages((current) => [...turnsToMessages(page.data), ...current]);
    setNextBefore(page.meta.nextBefore);
  }, [nextBefore]);

  const displayMessages = useMemo<SparkMessage[]>(
    () =>
      writing && streamText
        ? [...messages, { id: writing.key, renderKey: writing.key, role: "lumina", text: streamText, createdAt: writing.startedAt, streaming: true }]
        : messages,
    [messages, writing, streamText],
  );

  const deliver = useCallback(async (userId: string, text: string, clientMessageId: string) => {
    const key = `stream:${clientMessageId}`;
    const live = beginStream();
    let streamed = false;
    setSending(true);
    setUnavailable(false);
    setFailure(null);
    setMessages((current) => current.map((message) => (message.id === userId ? { ...message, status: "sending" } : message)));
    try {
      const now = new Date();
      const reply = await sparkApi.chatStream(
        {
          text,
          clientMessageId,
          // The patient's own clock: dates like "tomorrow" mean their tomorrow.
          localDate: localDay(now),
          localTime: now.toTimeString().slice(0, 5),
        },
        {
          signal: live.signal,
          onDelta: (delta) => {
            if (!streamed) setWriting({ key, startedAt: new Date().toISOString() });
            streamed = true;
            live.onDelta(delta);
          },
        },
      );
      if (!mounted.current) return;
      // The final body is the source of truth; a streamed reply keeps its key so it never remounts.
      setMessages((current) => [
        ...current.map((message) => (message.id === userId ? { ...message, status: "sent" as const } : message)),
        { id: reply.id, role: "lumina", text: reply.reply, createdAt: reply.createdAt, safetyLevel: toSafety(reply.safetyLevel), turn: reply, renderKey: streamed ? key : undefined },
      ]);
      setTasks(reply.tasks);
      setSupport(reply.support.level === "CRISIS" ? { emergencyResources: reply.support.emergencyResources ?? [] } : null);
      invalidatePatientData("spark:memories");
      invalidatePatientData("spark:tasks");
    } catch (caught) {
      if (!mounted.current) return;
      const stopped = live.signal.aborted;
      const problem = classifyTurnFailure(caught);
      const partialText = (streamSnapshot() || problem.partialText).trim();
      setMessages((current) => {
        const settled = current.map((message) =>
          message.id === userId ? { ...message, status: partialText ? ("sent" as const) : stopped ? ("stopped" as const) : ("failed" as const) } : message,
        );
        return partialText
          ? [...settled, { id: key, renderKey: key, role: "lumina" as const, text: partialText, createdAt: new Date().toISOString(), partial: stopped ? ("stopped" as const) : ("interrupted" as const) }]
          : settled;
      });
      if (!stopped) {
        inspect(caught);
        if (problem.kind === "support") {
          setUnavailable(true);
          setSupport({ emergencyResources: problem.emergencyResources });
        } else if (problem.kind !== "subscription" && problem.kind !== "notAllowed") setFailure(problem.kind);
      }
    } finally {
      finishStream();
      if (mounted.current) {
        setWriting(null);
        setSending(false);
      }
    }
  }, [beginStream, finishStream, streamSnapshot, inspect]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || isSending) return;
      const clientMessageId = crypto.randomUUID();
      const id = `local:${clientMessageId}`;
      setMessages((current) => [...current, { id, role: "user", text, createdAt: new Date().toISOString(), status: "sending", clientMessageId }]);
      await deliver(id, text, clientMessageId);
    },
    [deliver, isSending],
  );

  /** Send the same message again: from its failed/stopped bubble, or from the unfinished reply that followed it. */
  const retry = useCallback(
    async (id: string) => {
      if (isSending) return;
      const index = messages.findIndex((item) => item.id === id);
      const target = messages[index];
      if (!target) return;
      const message = target.role === "user" ? target : [...messages.slice(0, index)].reverse().find((item) => item.role === "user");
      if (!message?.clientMessageId) return;
      if (target.partial) setMessages((current) => current.filter((item) => item.id !== id));
      await deliver(message.id, message.text, message.clientMessageId);
    },
    [deliver, isSending, messages],
  );

  const completeTask = useCallback(async (taskId: string) => {
    const before = tasks;
    setTasks((current) => current.filter((task) => task.id !== taskId));
    try {
      await sparkApi.completeTask(taskId);
      invalidatePatientData("spark:tasks");
    } catch (caught) {
      if (mounted.current) {
        setTasks(before);
        inspect(caught);
      }
    }
  }, [tasks, inspect]);

  /** "How did it go?" on a focus block. Spark learns the patient's rhythm from these. */
  const recordOutcome = useCallback(
    async (turnId: string, outcome: SparkOutcomeName) => {
      const turn = messages.find((message) => message.id === turnId)?.turn;
      const primaryKey = turn?.plan?.primaryTaskKey;
      const primary = primaryKey ? tasks.find((task) => task.taskKey === primaryKey) : undefined;
      try {
        await sparkApi.recordOutcome({
          outcome,
          ...(primary ? { taskId: primary.id } : {}),
          ...(turn?.focusSession?.minutes && [5, 10, 15, 25].includes(turn.focusSession.minutes)
            ? { focusMinutes: turn.focusSession.minutes as 5 | 10 | 15 | 25 }
            : {}),
          localHour: new Date().getHours(),
          attemptId: crypto.randomUUID(),
        });
        // A DONE attempt closes the task on the next turn; refresh the list now.
        const state = await sparkApi.state();
        invalidatePatientData("spark:tasks");
        if (mounted.current) setTasks(state.tasks);
      } catch (caught) {
        inspect(caught);
        throw caught;
      }
    },
    [messages, tasks, inspect],
  );

  return {
    messages: displayMessages, tasks, isLoading, loadError, hasMore: Boolean(nextBefore), isSending, support, unavailable,
    isStreaming: displayMessages.length > messages.length,
    failure, dismissFailure: () => setFailure(null), stop: stopStream,
    dismissSupport: () => setSupport(null),
    notAllowed, subscriptionRequired,
    send, retry, loadOlder, reload: load, completeTask, recordOutcome,
  };
}
