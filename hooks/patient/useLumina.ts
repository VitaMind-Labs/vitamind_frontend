"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { luminaApi, type InterventionResult } from "@/lib/api/patient";
import type { LuminaChatReply, LuminaConversation, LuminaPage, LuminaState, SafetyLevel } from "@/lib/api/patient-types";
import { useAgentMemories } from "@/hooks/patient/useMemories";
import { useTurnStream } from "@/hooks/patient/useTurnStream";
import { classifyTurnFailure, type TurnFailureKind } from "@/lib/patient/turn-errors";
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
  /** Only for the patient's own messages. "stopped": the patient stopped the reply before any of it arrived. */
  status?: "sending" | "sent" | "failed" | "stopped";
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
  /** The reply is still being written: text grows as it arrives. */
  streaming?: boolean;
  /** An unfinished reply that was kept (stopped by the patient, or cut short by the connection). */
  partial?: "stopped" | "interrupted";
  /** Stable React key: a streamed reply keeps it from its first word to its final form, so it never remounts. */
  renderKey?: string;
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
  /** The calm, inline reason the last turn did not complete (never raw error text). */
  const [failure, setFailure] = useState<TurnFailureKind | null>(null);
  const { text: streamText, begin: beginStream, finish: finishStream, stop: stopStream, snapshot: streamSnapshot, hide: hideStream } = useTurnStream();
  /** The reply being written (stable key + when it began); null when nothing is streaming. */
  const [writing, setWriting] = useState<{ key: string; startedAt: string } | null>(null);
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

  const displayMessages = useMemo<ChatMessage[]>(
    () =>
      writing && streamText
        ? [...messages, { id: writing.key, renderKey: writing.key, role: "lumina", text: streamText, createdAt: writing.startedAt, streaming: true }]
        : messages,
    [messages, writing, streamText],
  );

  const switchTo = useCallback((next: string | null) => {
    epoch.current += 1;
    current.current = next;
    setConversationId(next);
    setMessages([]);
    setNextBefore(null);
    setThreadError(false);
    setRevealingId(null);
    setFailure(null);
    // A turn still running for the thread we left keeps going, unseen.
    hideStream();
    setWriting(null);
    return epoch.current;
  }, [hideStream]);

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
    const key = `stream:${clientMessageId}`;
    // Only the thread the patient is looking at paints the text as it arrives.
    const live = beginStream(() => at === epoch.current);
    let streamed = false;
    setSending(true);
    setRevealingId(null);
    setFailure(null);
    setMessages((list) => list.map((message) => (message.id === localId ? { ...message, status: "sending" } : message)));
    try {
      const reply = await luminaApi.chatStream(
        { text, deep, clientMessageId, ...(thread ? { conversationId: thread } : {}) },
        {
          signal: live.signal,
          onDelta: (delta) => {
            if (!streamed && at === epoch.current) setWriting({ key, startedAt: new Date().toISOString() });
            streamed = true;
            live.onDelta(delta);
          },
        },
      );
      if (!mounted.current) return;
      const crisis = reply.support.level === "CRISIS";
      // Safety first: support shows even if the patient has moved to another thread meanwhile.
      if (crisis) setSupport({ emergencyResources: reply.support.emergencyResources ?? [] });
      if (at === epoch.current) {
        if (!thread && reply.conversationId) {
          current.current = reply.conversationId;
          setConversationId(reply.conversationId);
        }
        // The final body is the source of truth for the finished message; a streamed reply keeps its key so it never remounts.
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
            renderKey: streamed ? key : undefined,
          },
        ]);
        // Crisis wording and resources appear at once, never typed out. A reply that already streamed in, or a
        // replay, was read; one that came whole (no deltas) is revealed gently, exactly as before.
        setRevealingId(crisis || reply.replayed || streamed ? null : reply.interactionId);
        if (!crisis) setSupport(null);
      }
      invalidatePatientData(THREADS_KEY);
      invalidatePatientData("lumina:state");
      invalidatePatientData("lumina:memories");
    } catch (caught) {
      if (!mounted.current) return;
      const stopped = live.signal.aborted;
      const problem = classifyTurnFailure(caught);
      // Whatever was already written stays on screen, so the patient never loses what they read.
      const partialText = (streamSnapshot() || problem.partialText).trim();
      if (at === epoch.current) {
        setMessages((list) => {
          const settled = list.map((message) =>
            message.id === localId ? { ...message, status: partialText ? ("sent" as const) : stopped ? ("stopped" as const) : ("failed" as const) } : message,
          );
          return partialText
            ? [...settled, { id: key, renderKey: key, role: "lumina" as const, text: partialText, createdAt: new Date().toISOString(), partial: stopped ? ("stopped" as const) : ("interrupted" as const) }]
            : settled;
        });
      }
      if (!stopped) {
        if (problem.kind === "subscription") setSubscriptionRequired(true);
        else if (problem.kind === "support") setSupport({ emergencyResources: problem.emergencyResources });
        else setFailure(problem.kind);
      }
    } finally {
      finishStream();
      if (mounted.current) {
        setWriting(null);
        setSending(false);
      }
    }
  }, [beginStream, finishStream, streamSnapshot]);

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

  /** Send the same message again: from its failed/stopped bubble, or from the unfinished reply that followed it. */
  const retry = useCallback(
    async (id: string) => {
      if (isSending) return;
      const index = messages.findIndex((item) => item.id === id);
      const target = messages[index];
      if (!target) return;
      const message = target.role === "user" ? target : [...messages.slice(0, index)].reverse().find((item) => item.role === "user");
      if (!message?.clientMessageId) return;
      // The unfinished reply is replaced by the new attempt.
      if (target.partial) setMessages((list) => list.filter((item) => item.id !== id));
      await deliver(message.id, message.text, Boolean(message.deep), message.clientMessageId);
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
    /** Words of the reply are arriving (the typing indicator gives way to the text). */
    isStreaming: displayMessages.length > messages.length,
    /** The conversation as shown: what was said, plus the reply that is still being written. */
    displayMessages,
    failure,
    dismissFailure: () => setFailure(null),
    stop: stopStream,
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
