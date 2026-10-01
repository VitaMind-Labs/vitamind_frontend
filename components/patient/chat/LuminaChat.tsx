"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import {
  ChatSpaceActions, LuminaComposer, LuminaLogo, LuminaMessage, LuminaMotes, LuminaWelcome, TrustRow, TypingRow,
} from "@/components/patient/chat/LuminaParts";
import { ErrorState, Skeleton, SubscriptionGate } from "@/components/patient/ui/primitives";
import { SupportCard } from "@/components/patient/ui/SupportCard";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/contexts/AudioContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/hooks/patient/usePatient";
import { ThreadHeaderActions, ThreadRail, ThreadSheet } from "@/components/patient/chat/LuminaThreads";
import { useLuminaChat, useLuminaConversations } from "@/hooks/patient/useLumina";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { formatDay, localDay } from "@/lib/patient/format";
import { failureMessage } from "@/lib/patient/turn-errors";

/** Full view: the conversation takes the whole height beside the rail (and sits above the tab bar on small screens). */
const FRAME = "h-[calc(100dvh-9.5rem)] min-h-[32rem] lg:h-[calc(100dvh-4rem)]";
/** One reading column for the welcome, the thread and the composer. */
const COLUMN = "mx-auto w-full max-w-3xl";

/**
 * The conversation with Lumina — the heart of the app. The shared page header carries the
 * check-in status and memory; below it a single luminous pane holds the conversation in one
 * calm reading column. Empty, Lumina welcomes the patient with four gentle ways to begin.
 * `initialPrompt` (from Home) is sent once the history has loaded.
 */
export function LuminaChat({ initialPrompt }: { initialPrompt?: string }) {
  return (
    <AudioProvider>
      <ChatScreen initialPrompt={initialPrompt} />
    </AudioProvider>
  );
}

const RAIL_KEY = "vitamind_lumina_rail";

function readRail() {
  try {
    return window.localStorage.getItem(RAIL_KEY) === "open";
  } catch {
    return false;
  }
}

function ChatScreen({ initialPrompt }: { initialPrompt?: string }) {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const router = useRouter();
  const { name, profile } = usePatient();
  const chat = useLuminaChat();
  const threads = useLuminaConversations();
  const [draft, setDraft] = useState("");
  const [deep, setDeep] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  // Collapsed by default; the patient's choice is remembered on this device.
  const [railOpen, setRailOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);
  // The conversation as shown includes the reply that is still being written.
  const { displayMessages: messages, isLoadingThread, isSending, isStreaming } = chat;

  useEffect(() => {
    const timer = window.setTimeout(() => setRailOpen(readRail()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggleRail(open: boolean) {
    setRailOpen(open);
    try {
      window.localStorage.setItem(RAIL_KEY, open ? "open" : "closed");
    } catch {
      /* storage unavailable: the choice lasts for this visit */
    }
  }

  // A prompt from Home opens as the first message of a fresh conversation.
  useEffect(() => {
    if (!initialPrompt || sentInitial.current || isLoadingThread) return;
    sentInitial.current = true;
    void chat.send(initialPrompt);
    router.replace("/dashboard/lumina");
  }, [initialPrompt, isLoadingThread, chat, router]);

  useLayoutEffect(() => {
    bottom.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages.length, isSending, isStreaming]);

  // While a reply is typed out, keep its newest line in view - unless the patient scrolled up to read.
  function followReveal() {
    const el = scroller.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 160) el.scrollTop = el.scrollHeight;
  }

  function startNew() {
    chat.newConversation();
    setDraft("");
  }

  // Each message knows whether it starts a new day, so the render below has no running state.
  const rows = useMemo(
    () =>
      messages.map((message, index) => {
        const dayKey = localDay(new Date(message.createdAt));
        const previous = index > 0 ? localDay(new Date(messages[index - 1].createdAt)) : null;
        return { message, dayKey, showDay: dayKey !== previous };
      }),
    [messages],
  );

  // ADHD patients have Spark for planning: a planning reply offers to continue there, with the patient's
  // own words as the first message. Nobody else is offered it (their profile has no Spark).
  function handoffFor(index: number) {
    const message = messages[index];
    if (!profile.hasSpark || message.role !== "lumina" || message.isCheckin || message.strategy !== "TASK_BREAKDOWN") return undefined;
    const asked = messages.slice(0, index).reverse().find((item) => item.role === "user")?.text.trim();
    return {
      href: asked ? `/dashboard/spark?prompt=${encodeURIComponent(asked.slice(0, 1000))}` : "/dashboard/spark",
      label: copy.spark.handoff.cta,
      hint: copy.spark.handoff.hint,
    };
  }

  function send() {
    const text = draft.trim();
    if (!text || isSending) return;
    setDraft("");
    void chat.send(text, { deep });
  }

  if (chat.subscriptionRequired) return <SubscriptionGate />;

  const empty = !isLoadingThread && messages.length === 0 && !chat.threadError;
  const inThread = Boolean(chat.conversationId) || messages.length > 0;
  const open = threads.items.find((thread) => thread.id === chat.conversationId);
  const title = open ? (open.title ?? copy.chat.threads.earlier) : inThread ? copy.chat.title : copy.chat.threads.newThread;
  const historyActions = <ThreadHeaderActions onOpenHistory={() => setHistoryOpen(true)} onNew={startNew} showNew={inThread} />;

  return (
    <div className={`lm-rise flex flex-col ${FRAME}`}>
      <h1 className="sr-only">{copy.chat.title}</h1>

      <section aria-label={copy.chat.title} className="lm-sanctuary flex min-h-0 flex-1">
        <LuminaMotes />
        <ThreadRail
          open={railOpen}
          onOpenChange={toggleRail}
          threads={threads}
          activeId={chat.conversationId}
          onSelect={chat.openConversation}
          onNew={startNew}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {empty ? (
            // The welcome carries Lumina's mark; the history and today's check-in stay within reach.
            <div className="flex items-center justify-between gap-2 px-3 pt-3 sm:px-5">
              <div className="flex items-center gap-2 lg:hidden">{historyActions}</div>
              <div className="ms-auto"><ChatSpaceActions /></div>
            </div>
          ) : (
            <div className="flex items-center gap-3.5 border-b border-white/70 bg-white/40 px-3 py-3 backdrop-blur-sm sm:px-6">
              {historyActions}
              <LuminaLogo size={40} presence />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[0.9375rem] font-semibold text-ink" dir="auto">{title}</p>
                <p aria-live="polite" className={`mt-0.5 truncate text-xs ${isSending ? "text-teal-700" : "text-ink-muted"}`}>
                  {isSending ? copy.chat.thinking : copy.chat.status}
                </p>
              </div>
              <div className="ms-auto flex items-center gap-2">
                <p className="hidden items-center gap-1.5 rounded-full border border-white/90 bg-white/70 px-3 py-1.5 text-xs text-ink-muted shadow-xs xl:inline-flex">
                  <ShieldCheck className="size-3.5 text-sage-700" aria-hidden />{copy.chat.space.privacy}
                </p>
                <ChatSpaceActions />
              </div>
            </div>
          )}

          <div ref={scroller} role="log" aria-live="polite" aria-label={copy.chat.title} tabIndex={0} className="diagnostic-scroll-area flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500">
            {chat.threadError && <div className={`${COLUMN} p-4`}><ErrorState onRetry={() => void chat.reload()} /></div>}

            {isLoadingThread ? (
              <div className={`${COLUMN} space-y-6 px-4 py-8`} aria-hidden>
                <div className="flex gap-4"><Skeleton className="size-10 shrink-0 rounded-full" /><Skeleton className="h-24 w-3/4" /></div>
                <Skeleton className="ms-auto h-12 w-1/2" />
                <div className="flex gap-4"><Skeleton className="size-10 shrink-0 rounded-full" /><Skeleton className="h-20 w-4/5" /></div>
              </div>
            ) : empty ? (
              <LuminaWelcome name={name} />
            ) : (
              <div className={`${COLUMN} space-y-8 px-4 py-6 sm:px-6 sm:py-10`}>
                {chat.hasMore && (
                  <div className="flex justify-center"><Button variant="ghost" size="sm" onClick={() => void chat.loadOlder()}>{copy.chat.older}</Button></div>
                )}
                {rows.map(({ message, dayKey, showDay }, index) => (
                  <div key={message.renderKey ?? message.id} className="space-y-8">
                    {showDay && (
                      <p className="flex items-center gap-3 text-xs font-medium text-ink-muted before:h-px before:flex-1 before:bg-gradient-to-r before:from-transparent before:to-ink/10 after:h-px after:flex-1 after:bg-gradient-to-l after:from-transparent after:to-ink/10">
                        <span className="rounded-full border border-white/90 bg-white/70 px-3 py-1 shadow-xs">
                          {dayKey === localDay() ? copy.chat.today : formatDay(new Date(message.createdAt), language, { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                      </p>
                    )}
                    <LuminaMessage
                      message={message}
                      index={index}
                      handoff={handoffFor(index)}
                      onRetry={() => void chat.retry(message.id)}
                      onOutcome={(result) => void chat.recordOutcome(message.id, result)}
                      reveal={message.id === chat.revealingId}
                      onRevealed={chat.finishReveal}
                      onRevealProgress={followReveal}
                    />
                  </div>
                ))}
                <AnimatePresence>{isSending && !isStreaming && <TypingRow key="typing" />}</AnimatePresence>
                <div ref={bottom} />
              </div>
            )}
          </div>

          {chat.support && (
            <div className={`${COLUMN} px-3 pb-1 sm:px-6`}>
              <SupportCard resources={chat.support.emergencyResources} labels={copy.live.support} onHide={chat.dismissSupport} />
            </div>
          )}

          <AnimatePresence>
            {chat.failure && failureMessage(chat.failure, copy.live, copy.common.genericError) && (
              <motion.div role="status" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`${COLUMN} overflow-hidden px-3 sm:px-6`}>
                <p className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/80 px-4 py-3 text-sm text-teal-900">
                  <span className="min-w-0 flex-1">{failureMessage(chat.failure, copy.live, copy.common.genericError)}</span>
                  <button type="button" onClick={chat.dismissFailure} aria-label={copy.common.close} className="-m-1.5 inline-flex size-9 items-center justify-center rounded-full text-teal-800 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-teal-500"><X className="size-4" aria-hidden /></button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`${COLUMN} px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-6 sm:pt-4`}>
            <LuminaComposer
              value={draft}
              onChange={setDraft}
              onSend={send}
              busy={isSending}
              onStop={chat.stop}
              deep={deep}
              onDeepChange={setDeep}
              placeholder={copy.chat.placeholder}
            />
            <p className="mt-2 px-2 text-[0.6875rem] leading-snug text-muted-foreground sm:hidden">{copy.chat.disclaimer}</p>
            <TrustRow />
          </div>
        </div>
      </section>

      <ThreadSheet
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        threads={threads}
        activeId={chat.conversationId}
        onSelect={chat.openConversation}
        onNew={startNew}
      />
    </div>
  );
}
