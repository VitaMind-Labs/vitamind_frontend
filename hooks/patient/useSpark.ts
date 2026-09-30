"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { sparkApi } from "@/lib/api/patient";
import type { SafetyLevel, SparkOutcomeName, SparkTask, SparkTurn } from "@/lib/api/patient-types";
import { invalidatePatientData } from "@/hooks/usePatientResource";
import { localDay } from "@/lib/patient/format";

export type SparkMessage = {
  id: string;
  role: "user" | "lumina";
  text: string;
  createdAt: string;
  status?: "sending" | "sent" | "failed";
  clientMessageId?: string;
  safetyLevel?: SafetyLevel;
  /** Spark's plan for this reply: the next step and the focus block it suggests. */
  turn?: SparkTurn;
};

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

  const deliver = useCallback(async (userId: string, text: string, clientMessageId: string) => {
    setSending(true);
    setUnavailable(false);
    setMessages((current) => current.map((message) => (message.id === userId ? { ...message, status: "sending" } : message)));
    try {
      const now = new Date();
      const reply = await sparkApi.chat({
        text,
        clientMessageId,
        // The patient's own clock: dates like "tomorrow" mean their tomorrow.
        localDate: localDay(now),
        localTime: now.toTimeString().slice(0, 5),
      });
      if (!mounted.current) return;
      setMessages((current) => [
        ...current.map((message) => (message.id === userId ? { ...message, status: "sent" as const } : message)),
        { id: reply.id, role: "lumina", text: reply.reply, createdAt: reply.createdAt, safetyLevel: toSafety(reply.safetyLevel), turn: reply },
      ]);
      setTasks(reply.tasks);
      setSupport(reply.support.level === "CRISIS" ? { emergencyResources: reply.support.emergencyResources ?? [] } : null);
      invalidatePatientData("lumina:memories");
    } catch (caught) {
      if (!mounted.current) return;
      setMessages((current) => current.map((message) => (message.id === userId ? { ...message, status: "failed" } : message)));
      inspect(caught);
    } finally {
      if (mounted.current) setSending(false);
    }
  }, [inspect]);

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

  const retry = useCallback(
    async (id: string) => {
      const message = messages.find((item) => item.id === id);
      if (!message?.clientMessageId || isSending) return;
      await deliver(id, message.text, message.clientMessageId);
    },
    [deliver, isSending, messages],
  );

  const completeTask = useCallback(async (taskId: string) => {
    const before = tasks;
    setTasks((current) => current.filter((task) => task.id !== taskId));
    try {
      await sparkApi.completeTask(taskId);
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
        if (mounted.current) setTasks(state.tasks);
      } catch (caught) {
        inspect(caught);
        throw caught;
      }
    },
    [messages, tasks, inspect],
  );

  return {
    messages, tasks, isLoading, loadError, hasMore: Boolean(nextBefore), isSending, support, unavailable,
    dismissSupport: () => setSupport(null),
    notAllowed, subscriptionRequired,
    send, retry, loadOlder, reload: load, completeTask, recordOutcome,
  };
}
