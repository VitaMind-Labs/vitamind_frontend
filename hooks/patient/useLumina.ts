"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { luminaApi, type InterventionResult } from "@/lib/api/patient";
import type { LuminaChatReply, LuminaMemory, LuminaState, LuminaTurn, SafetyLevel } from "@/lib/api/patient-types";
import { invalidatePatientData, usePatientResource } from "@/hooks/usePatientResource";

/** Latest longitudinal state (descriptive, never diagnostic). */
export function useLuminaState() {
  return usePatientResource<LuminaState>("lumina:state", () => luminaApi.state(), { staleMs: 60_000 });
}

export function useLuminaMemories() {
  const resource = usePatientResource<LuminaMemory[]>("lumina:memories", async () => (await luminaApi.memories()).data, { staleMs: 15_000 });
  const { setData } = resource;

  const decide = useCallback(
    async (id: string, action: "CONFIRM" | "REJECT") => {
      await luminaApi.decideMemory(id, action);
      setData((current) =>
        (current ?? [])
          .map((memory) => (memory.id === id ? { ...memory, status: "ACTIVE" as const, confirmedAt: new Date().toISOString() } : memory))
          .filter((memory) => !(action === "REJECT" && memory.id === id)),
      );
    },
    [setData],
  );

  return { ...resource, decide };
}

export type ChatMessage = {
  id: string;
  role: "user" | "lumina";
  text: string;
  createdAt: string;
  /** Only for the patient's own messages. */
  status?: "sending" | "sent" | "failed";
  clientMessageId?: string;
  deep?: boolean;
  interactionId?: string;
  intervention?: LuminaChatReply["intervention"];
  outcome?: InterventionResult;
  safetyLevel?: SafetyLevel;
  /** A check-in reply rather than a chat turn. */
  isCheckin?: boolean;
};

export type ChatSupport = { emergencyResources: string[] } | null;

const PAGE = 30;

function turnsToMessages(turns: LuminaTurn[]): ChatMessage[] {
  return turns.flatMap((turn): ChatMessage[] => {
    const list: ChatMessage[] = [];
    if (turn.message) {
      list.push({ id: `${turn.interactionId}:user`, role: "user", text: turn.message, createdAt: turn.createdAt, status: "sent" });
    }
    list.push({
      id: turn.interactionId,
      role: "lumina",
      text: turn.reply,
      createdAt: turn.createdAt,
      interactionId: turn.interactionId,
      safetyLevel: turn.safetyLevel,
      isCheckin: turn.kind === "CHECKIN",
    });
    return list;
  });
}

/**
 * The Lumina conversation: history (oldest first, paged backwards), optimistic sends that are
 * safe to retry (same `clientMessageId`), the intervention Lumina offered and crisis support.
 */
export function useLuminaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(false);
  const [nextBefore, setNextBefore] = useState<string | null>(null);
  const [isSending, setSending] = useState(false);
  const [support, setSupport] = useState<ChatSupport>(null);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    setHistoryError(false);
    try {
      const page = await luminaApi.history({ limit: PAGE });
      if (!mounted.current) return;
      setMessages(turnsToMessages(page.data));
      setNextBefore(page.meta.nextBefore);
    } catch {
      if (mounted.current) setHistoryError(true);
    } finally {
      if (mounted.current) setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    // Initial load of the conversation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadHistory();
  }, [loadHistory]);

  const loadOlder = useCallback(async () => {
    if (!nextBefore) return;
    const page = await luminaApi.history({ limit: PAGE, before: nextBefore });
    setMessages((current) => [...turnsToMessages(page.data), ...current]);
    setNextBefore(page.meta.nextBefore);
  }, [nextBefore]);

  const deliver = useCallback(async (userId: string, text: string, deep: boolean, clientMessageId: string) => {
    setSending(true);
    setMessages((current) => current.map((message) => (message.id === userId ? { ...message, status: "sending" } : message)));
    try {
      const reply = await luminaApi.chat({ text, deep, clientMessageId });
      if (!mounted.current) return;
      setMessages((current) => [
        ...current.map((message) => (message.id === userId ? { ...message, status: "sent" as const } : message)),
        {
          id: reply.interactionId,
          role: "lumina",
          text: reply.reply,
          createdAt: reply.createdAt,
          interactionId: reply.interactionId,
          intervention: reply.intervention,
          safetyLevel: reply.safetyLevel,
        },
      ]);
      setSupport(reply.support.level === "CRISIS" ? { emergencyResources: reply.support.emergencyResources ?? [] } : null);
      invalidatePatientData("lumina:state");
      invalidatePatientData("lumina:memories");
    } catch (caught) {
      if (!mounted.current) return;
      setMessages((current) => current.map((message) => (message.id === userId ? { ...message, status: "failed" } : message)));
      if (caught instanceof ApiError) {
        const payload = caught.payload as { code?: string; emergencyResources?: string[] } | undefined;
        if (payload?.code === "SUBSCRIPTION_REQUIRED") setSubscriptionRequired(true);
        if (payload?.code === "LUMINA_UNAVAILABLE") setSupport({ emergencyResources: payload.emergencyResources ?? [] });
      }
    } finally {
      if (mounted.current) setSending(false);
    }
  }, []);

  const send = useCallback(
    async (raw: string, options: { deep?: boolean } = {}) => {
      const text = raw.trim();
      if (!text || isSending) return;
      const clientMessageId = crypto.randomUUID();
      const id = `local:${clientMessageId}`;
      setMessages((current) => [
        ...current,
        { id, role: "user", text, createdAt: new Date().toISOString(), status: "sending", clientMessageId, deep: options.deep },
      ]);
      await deliver(id, text, Boolean(options.deep), clientMessageId);
    },
    [deliver, isSending],
  );

  const retry = useCallback(
    async (id: string) => {
      const message = messages.find((item) => item.id === id);
      if (!message?.clientMessageId || isSending) return;
      await deliver(id, message.text, Boolean(message.deep), message.clientMessageId);
    },
    [deliver, isSending, messages],
  );

  const recordOutcome = useCallback(async (interactionId: string, result: InterventionResult) => {
    setMessages((current) => current.map((message) => (message.id === interactionId ? { ...message, outcome: result } : message)));
    try {
      await luminaApi.interactionOutcome(interactionId, { result, engagement: "COMPLETED" });
    } catch {
      setMessages((current) => current.map((message) => (message.id === interactionId ? { ...message, outcome: undefined } : message)));
    }
  }, []);

  return {
    messages,
    isLoadingHistory,
    historyError,
    hasMore: Boolean(nextBefore),
    isSending,
    support,
    dismissSupport: () => setSupport(null),
    subscriptionRequired,
    send,
    retry,
    loadOlder,
    reload: loadHistory,
    recordOutcome,
  };
}
