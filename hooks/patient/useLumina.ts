"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { luminaApi, type InterventionResult } from "@/lib/api/patient";
import type { LuminaChatReply, LuminaConversation, LuminaPage, LuminaState, SafetyLevel } from "@/lib/api/patient-types";
import { useAgentMemories } from "@/hooks/patient/useMemories";
import { invalidatePatientData, usePatientResource } from "@/hooks/usePatientResource";

/** Latest longitudinal state (descriptive, never diagnostic). */
export function useLuminaState() {
  return usePatientResource<LuminaState>("lumina:state", () => luminaApi.state(), { staleMs: 60_000 });
}

export function useLuminaMemories() {
  return useAgentMemories("lumina");
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
  /** The agent's response strategy for this reply (e.g. TASK_BREAKDOWN); lets the screen offer the right next step. */
  strategy?: string | null;
  outcome?: InterventionResult;
  safetyLevel?: SafetyLevel;
  /** A check-in reply rather than a chat turn. */
  isCheckin?: boolean;
};

export type ChatSupport = { emergencyResources: string[] } | null;

const PAGE = 30;
const THREADS_KEY = "lumina:conversations";

function turnsToMessages(turns: LuminaChatReply[]): ChatMessage[] {
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
      intervention: turn.intervention,
      strategy: turn.strategy,
      safetyLevel: turn.safetyLevel,
      isCheckin: turn.kind === "CHECKIN",
    });
    return list;
  });
}

/**
 * The history sidebar: the patient's threads, most recently active first. The first page is
 * cached (and refetched after every sent message); older pages are appended on demand.
 */
export function useLuminaConversations() {
  const first = usePatientResource<LuminaPage<LuminaConversation>>(THREADS_KEY, () => luminaApi.conversations({ limit: PAGE }), { staleMs: 30_000 });
  const [older, setOlder] = useState<{ items: LuminaConversation[]; nextBefore: string | null } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const items = useMemo(() => {
    const seen = new Set<string>();
    return [...(first.data?.data ?? []), ...(older?.items ?? [])].filter((item) => !seen.has(item.id) && seen.add(item.id));
  }, [first.data, older]);
  const nextBefore = older ? older.nextBefore : (first.data?.meta.nextBefore ?? null);

  const loadMore = useCallback(async () => {
    if (!nextBefore || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await luminaApi.conversations({ limit: PAGE, before: nextBefore });
      setOlder((current) => ({ items: [...(current?.items ?? []), ...page.data], nextBefore: page.meta.nextBefore }));
    } finally {
      setLoadingMore(false);
    }
  }, [nextBefore, loadingMore]);

  return {
    items,
    isLoading: first.isLoading,
    error: first.error && !first.data ? first.error : null,
    refresh: first.refresh,
    hasMore: Boolean(nextBefore),
    loadingMore,
    loadMore,
  };
}

/**
 * One Lumina thread at a time. The screen opens on a new, empty thread (`conversationId` null):
 * its first message creates the thread server-side, and later messages continue it. Past threads
 * are opened from the sidebar and paged backwards. Sends are optimistic and safe to retry (same
 * `clientMessageId`). A reply that arrives after the patient switched threads never lands in the
 * wrong one - but crisis support is shown whichever thread is open.
 */
export function useLuminaChat() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingThread, setLoadingThread] = useState(false);
  const [threadError, setThreadError] = useState(false);
  const [nextBefore, setNextBefore] = useState<string | null>(null);
  const [isSending, setSending] = useState(false);
  const [support, setSupport] = useState<ChatSupport>(null);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  /** The reply being revealed by the typewriter; every other reply renders whole. */
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const mounted = useRef(true);
  /** Bumped whenever the open thread changes; a response for an older epoch is stale. */
  const epoch = useRef(0);
  const current = useRef<string | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const switchTo = useCallback((next: string | null) => {
    epoch.current += 1;
    current.current = next;
    setConversationId(next);
    setMessages([]);
    setNextBefore(null);
    setThreadError(false);
    setRevealingId(null);
    return epoch.current;
  }, []);

  const loadThread = useCallback(async (id: string, at: number) => {
    setLoadingThread(true);
    setThreadError(false);
    try {
      const page = await luminaApi.conversationMessages(id, { limit: PAGE });
      if (!mounted.current || at !== epoch.current) return;
      setMessages(turnsToMessages(page.data));
      setNextBefore(page.meta.nextBefore);
    } catch {
      if (mounted.current && at === epoch.current) setThreadError(true);
    } finally {
      if (mounted.current && at === epoch.current) setLoadingThread(false);
    }
  }, []);

  const openConversation = useCallback(
    (id: string) => {
      if (id === current.current) return;
      void loadThread(id, switchTo(id));
    },
    [loadThread, switchTo],
  );

  const newConversation = useCallback(() => {
    switchTo(null);
    setLoadingThread(false);
  }, [switchTo]);

  const reload = useCallback(async () => {
    if (current.current) await loadThread(current.current, epoch.current);
  }, [loadThread]);

  const loadOlder = useCallback(async () => {
    const id = current.current;
    if (!id || !nextBefore) return;
    const at = epoch.current;
    const page = await luminaApi.conversationMessages(id, { limit: PAGE, before: nextBefore });
    if (!mounted.current || at !== epoch.current) return;
    setMessages((list) => [...turnsToMessages(page.data), ...list]);
    setNextBefore(page.meta.nextBefore);
  }, [nextBefore]);

  const deliver = useCallback(async (localId: string, text: string, deep: boolean, clientMessageId: string) => {
    const at = epoch.current;
    const thread = current.current;
    setSending(true);
    setRevealingId(null);
    setMessages((list) => list.map((message) => (message.id === localId ? { ...message, status: "sending" } : message)));
    try {
      const reply = thread
        ? await luminaApi.chat({ text, deep, clientMessageId, conversationId: thread })
        : await luminaApi.startConversation({ text, deep, clientMessageId });
      if (!mounted.current) return;
      const crisis = reply.support.level === "CRISIS";
      // Safety first: support shows even if the patient has moved to another thread meanwhile.
      if (crisis) setSupport({ emergencyResources: reply.support.emergencyResources ?? [] });
      if (at === epoch.current) {
        if (!thread && reply.conversationId) {
          current.current = reply.conversationId;
          setConversationId(reply.conversationId);
        }
        setMessages((list) => [
          ...list.map((message) => (message.id === localId ? { ...message, status: "sent" as const } : message)),
          {
            id: reply.interactionId,
            role: "lumina",
            text: reply.reply,
            createdAt: reply.createdAt,
            interactionId: reply.interactionId,
            intervention: reply.intervention,
            strategy: reply.strategy,
            safetyLevel: reply.safetyLevel,
          },
        ]);
        // Crisis wording and resources appear at once, never typed out; a replay was already read.
        setRevealingId(crisis || reply.replayed ? null : reply.interactionId);
        if (!crisis) setSupport(null);
      }
      invalidatePatientData(THREADS_KEY);
      invalidatePatientData("lumina:state");
      invalidatePatientData("lumina:memories");
    } catch (caught) {
      if (!mounted.current) return;
      if (at === epoch.current) {
        setMessages((list) => list.map((message) => (message.id === localId ? { ...message, status: "failed" } : message)));
      }
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
      setMessages((list) => [
        ...list,
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
    setMessages((list) => list.map((message) => (message.id === interactionId ? { ...message, outcome: result } : message)));
    try {
      await luminaApi.interactionOutcome(interactionId, { result, engagement: "COMPLETED" });
    } catch {
      setMessages((list) => list.map((message) => (message.id === interactionId ? { ...message, outcome: undefined } : message)));
    }
  }, []);

  return {
    conversationId,
    messages,
    isLoadingThread,
    threadError,
    hasMore: Boolean(nextBefore),
    isSending,
    support,
    dismissSupport: () => setSupport(null),
    subscriptionRequired,
    revealingId,
    finishReveal: () => setRevealingId(null),
    send,
    retry,
    loadOlder,
    reload,
    openConversation,
    newConversation,
    recordOutcome,
  };
}
