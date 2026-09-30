"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Sparkles, X } from "lucide-react";
import { MemoryDialog } from "@/components/patient/chat/MemoryDialog";
import {
  ChatSpaceActions, LuminaComposer, LuminaLogo, LuminaMessage, LuminaMotes, LuminaWelcome, TrustRow, TypingRow,
} from "@/components/patient/chat/LuminaParts";
import { ErrorState, PageIntro, Skeleton, SubscriptionGate } from "@/components/patient/ui/primitives";
import { Button } from "@/components/ui/button";
import { AudioProvider } from "@/contexts/AudioContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/hooks/patient/usePatient";
import { useLuminaChat } from "@/hooks/patient/useLumina";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { formatDay, localDay } from "@/lib/patient/format";

/** The screen fills the viewport under the top bar (and above the tab bar on small screens). */
const FRAME = "h-[calc(100dvh-12.25rem)] min-h-[34rem] lg:h-[calc(100dvh-8rem)]";
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

function ChatScreen({ initialPrompt }: { initialPrompt?: string }) {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const router = useRouter();
  const { name } = usePatient();
  const chat = useLuminaChat();
  const [draft, setDraft] = useState("");
  const [deep, setDeep] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);
  const { messages, isLoadingHistory, isSending } = chat;

  useEffect(() => {
    if (!initialPrompt || sentInitial.current || isLoadingHistory) return;
    sentInitial.current = true;
    void chat.send(initialPrompt);
    router.replace("/dashboard/lumina");
  }, [initialPrompt, isLoadingHistory, chat, router]);

  useLayoutEffect(() => {
    bottom.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages.length, isSending]);

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

  function send() {
    const text = draft.trim();
    if (!text || isSending) return;
    setDraft("");
    void chat.send(text, { deep });
  }

  if (chat.subscriptionRequired) return <SubscriptionGate />;

  const empty = !isLoadingHistory && messages.length === 0 && !chat.historyError;

  return (
    <div className={`lm-rise flex flex-col ${FRAME}`}>
      <PageIntro
        className="mb-4"
        eyebrow={copy.shell.eyebrows.lumina}
        icon={Sparkles}
        title={copy.chat.title}
        subtitle={copy.chat.subtitle}
        action={<ChatSpaceActions onOpenMemory={() => setMemoryOpen(true)} />}
      />

      <section aria-label={copy.chat.title} className="lm-sanctuary flex min-h-0 flex-1 flex-col">
        <LuminaMotes />

        {!empty && !isLoadingHistory && (
          <div className="flex items-center gap-3.5 border-b border-white/70 bg-white/40 px-4 py-3 backdrop-blur-sm sm:px-6">
            <LuminaLogo size={40} presence />
            <div className="min-w-0 leading-tight">
              <p className="text-[0.9375rem] font-semibold text-ink">{copy.chat.title}</p>
              <p aria-live="polite" className={`mt-0.5 truncate text-xs ${isSending ? "text-teal-700" : "text-ink-muted"}`}>
                {isSending ? copy.chat.thinking : copy.chat.status}
              </p>
            </div>
            <p className="ms-auto hidden items-center gap-1.5 rounded-full border border-white/90 bg-white/70 px-3 py-1.5 text-xs text-ink-muted shadow-xs md:inline-flex">
              <ShieldCheck className="size-3.5 text-sage-700" aria-hidden />{copy.chat.space.privacy}
            </p>
          </div>
        )}

        <div role="log" aria-live="polite" aria-label={copy.chat.title} tabIndex={0} className="diagnostic-scroll-area flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500">
          {chat.historyError && <div className={`${COLUMN} p-4`}><ErrorState onRetry={() => void chat.reload()} /></div>}

          {isLoadingHistory ? (
            <div className={`${COLUMN} space-y-6 px-4 py-8`} aria-hidden>
              <div className="flex gap-4"><Skeleton className="size-10 shrink-0 rounded-full" /><Skeleton className="h-24 w-3/4" /></div>
              <Skeleton className="ms-auto h-12 w-1/2" />
              <div className="flex gap-4"><Skeleton className="size-10 shrink-0 rounded-full" /><Skeleton className="h-20 w-4/5" /></div>
            </div>
          ) : empty ? (
            <LuminaWelcome name={name} disabled={isSending} onStart={(prompt) => void chat.send(prompt)} />
          ) : (
            <div className={`${COLUMN} space-y-8 px-4 py-6 sm:px-6 sm:py-10`}>
              {chat.hasMore && (
                <div className="flex justify-center"><Button variant="ghost" size="sm" onClick={() => void chat.loadOlder()}>{copy.chat.older}</Button></div>
              )}
              {rows.map(({ message, dayKey, showDay }, index) => (
                <div key={message.id} className="space-y-8">
                  {showDay && (
                    <p className="flex items-center gap-3 text-xs font-medium text-ink-muted before:h-px before:flex-1 before:bg-gradient-to-r before:from-transparent before:to-ink/10 after:h-px after:flex-1 after:bg-gradient-to-l after:from-transparent after:to-ink/10">
                      <span className="rounded-full border border-white/90 bg-white/70 px-3 py-1 shadow-xs">
                        {dayKey === localDay() ? copy.chat.today : formatDay(new Date(message.createdAt), language, { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                    </p>
                  )}
                  <LuminaMessage message={message} index={index} onRetry={() => void chat.retry(message.id)} onOutcome={(result) => void chat.recordOutcome(message.id, result)} />
                </div>
              ))}
              <AnimatePresence>{isSending && <TypingRow key="typing" />}</AnimatePresence>
              <div ref={bottom} />
            </div>
          )}
        </div>

        <AnimatePresence>
          {chat.support && (
            <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`${COLUMN} overflow-hidden px-3 sm:px-6`}>
              <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/95 px-4 py-3.5">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-rose-700" aria-hidden />
                <div className="min-w-0 flex-1 text-sm text-rose-700">
                  <p className="font-semibold">{copy.chat.crisisTitle}</p>
                  <p className="mt-0.5">{copy.chat.crisisBody}</p>
                  {chat.support.emergencyResources.length > 0 && (
                    <ul className="mt-1.5 list-inside list-disc" dir="auto">{chat.support.emergencyResources.map((resource) => <li key={resource}>{resource}</li>)}</ul>
                  )}
                </div>
                <button type="button" onClick={chat.dismissSupport} aria-label={copy.common.close} className="rounded-full p-1 text-rose-700 hover:bg-rose-100"><X className="size-4" aria-hidden /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`${COLUMN} px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-6 sm:pt-4`}>
          <LuminaComposer
            value={draft}
            onChange={setDraft}
            onSend={send}
            busy={isSending}
            deep={deep}
            onDeepChange={setDeep}
            placeholder={copy.chat.placeholder}
          />
          <p className="mt-2 px-2 text-[0.6875rem] leading-snug text-muted-foreground sm:hidden">{copy.chat.disclaimer}</p>
          <TrustRow />
        </div>
      </section>

      <MemoryDialog open={memoryOpen} onOpenChange={setMemoryOpen} />
    </div>
  );
}
