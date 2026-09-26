"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle, Mic, MicOff, Paperclip, SendHorizontal, ShieldCheck, Square, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { copy, LANGS, type Lang } from "@/lib/i18n/config";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { createChatId } from "../lib/chat";
import { useMiraChat } from "../hooks/useMiraChat";
import { MiraAvatar, MiraMessage } from "./MiraMessage";
import { MiraResult } from "./MiraResult";
import { CompactProgress, SessionRail } from "./SessionProgress";
import { TypingIndicator } from "./TypingIndicator";

type SpeechRecognitionType = {
  new(): {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult:
    | ((
      event: {
        resultIndex: number;
        results: ArrayLike<{ isFinal: boolean } & ArrayLike<{ transcript: string }>>;
      },
    ) => void)
    | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
  };
};

function getSpeechRecognition(): SpeechRecognitionType | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition || w.webkitSpeechRecognition) as SpeechRecognitionType | null;
}

/**
 * MiraChatExperience — guided assessment layout.
 *
 * Free-text four-chapter Mira flow (MORNING → MIDDAY → EVENING → INNER_VOICE →
 * COMPLETE). Desktop: session rail (progress + chapters) beside a focused
 * conversation panel. Mobile/tablet: compact progress above the panel.
 * The conversation panel is the only scroll area while chatting.
 */
export function MiraChatExperience({
  chatId,
  languageSwitch,
}: {
  chatId: string;
  languageSwitch: { id: number; language: Lang } | null;
}) {
  const router = useRouter();
  const { language } = useLanguage();
  const [input, setInput] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [dictating, setDictating] = useState(false);
  const [dictationSupported, setDictationSupported] = useState(false);

  const {
    messages,
    sessionId,
    chapter,
    progress,
    isSending,
    isBotTyping,
    isStarting,
    error,
    safety,
    result,
    sessionLanguage,
    sendMessage,
    restart,
  } = useMiraChat(chatId, language);
  const conversationLanguage = language;
  const dictionary = copy[language];
  const diagnostic = dictionary.diagnostic;

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognizerRef = useRef<{ stop: () => void } | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const languageSwitchRef = useRef<number | null>(null);
  const busy = isSending || isBotTyping || isStarting;

  useEffect(() => {
    if (!languageSwitch || languageSwitch.id === languageSwitchRef.current) return;
    languageSwitchRef.current = languageSwitch.id;
    recognizerRef.current?.stop();
    recognizerRef.current = null;
    setDictating(false);
    setInput("");
    restart(languageSwitch.language);
  }, [languageSwitch, restart, sessionLanguage]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDictationSupported(getSpeechRecognition() !== null), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const showHint = (text: string) => {
    setHint(text);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 4000);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isBotTyping, result]);

  useEffect(() => {
    return () => {
      recognizerRef.current?.stop();
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  function handleSend() {
    const text = input.trim();
    if (!text || busy || result) return;
    stopDictation();
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    void sendMessage(text);
  }

  function handleRestart() {
    stopDictation();
    setInput("");
    restart();
    router.replace(`/diagnostic?chatId=${createChatId()}`);
  }

  function stopDictation() {
    recognizerRef.current?.stop();
    recognizerRef.current = null;
    setDictating(false);
  }

  function toggleDictation() {
    if (dictating) {
      stopDictation();
      return;
    }
    const SR = getSpeechRecognition();
    if (!SR) {
      showHint(diagnostic.composerDictationUnsupported);
      return;
    }
    try {
      const rec = new SR();
      rec.lang = LANGS.find((l) => l.code === conversationLanguage)?.bcp47 ?? "en-US";
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.onresult = (event) => {
        let chunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) chunk += res[0]?.transcript ?? "";
        }
        if (chunk.trim()) {
          setInput((prev) => {
            const base = prev.replace(/\s+$/, "");
            return `${base}${base ? " " : ""}${chunk.trim()} `;
          });
        }
      };
      rec.onerror = () => {
        stopDictation();
        showHint(diagnostic.voiceError);
      };
      rec.onend = () => {
        recognizerRef.current = null;
        setDictating(false);
      };
      recognizerRef.current = rec;
      rec.start();
      setDictating(true);
    } catch {
      showHint(diagnostic.voiceError);
    }
  }

  function handleAttachClick() {
    fileRef.current?.click();
  }

  function handleFilePicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const okType = /\.txt$|\.md$/i.test(file.name) || file.type.startsWith("text/");
    if (!okType) {
      showHint(diagnostic.composerAttachHint);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "").slice(0, 2000).trim();
      if (!text) {
        showHint(diagnostic.composerAttachHint);
        return;
      }
      setInput((prev) => `${prev}${prev.trim() ? "\n\n" : ""}--- ${file.name} ---\n${text}`);
      inputRef.current?.focus();
    };
    reader.onerror = () => showHint(diagnostic.voiceError);
    reader.readAsText(file);
  }

  const suggestionChips = diagnostic.suggestions;

  const displayMessages =
    messages.length === 0
      ? [{ id: "welcome", role: "assistant" as const, content: diagnostic.welcome, createdAt: "" }]
      : messages;

  const canSend = Boolean(input.trim()) && !busy;
  const showSuggestions = !result && !input.trim() && messages.length <= 1;

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-label={diagnostic.title}
      className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-clip text-ink"
    >
      {/* Static, low-contrast atmosphere — no looping motion behind reading content. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,rgb(81_133_145/0.10),transparent_70%),radial-gradient(45%_45%_at_100%_100%,rgb(125_168_158/0.12),transparent_70%)]"
      />

      {!result ? (
        <div className="relative mx-auto grid min-h-[34rem] w-full max-w-page flex-1 gap-6 px-3 pb-3 pt-3 sm:px-4 sm:pb-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:pb-6 lg:pt-5 xl:grid-cols-[18.5rem_minmax(0,1fr)]">
          <SessionRail chapter={chapter} progress={progress} language={conversationLanguage} className="hidden lg:flex" />

          <div className="flex min-h-0 min-w-0 flex-col gap-3">
            <CompactProgress chapter={chapter} progress={progress} language={conversationLanguage} className="lg:hidden" />

            <AnimatePresence>
              {safety.level === "urgent" && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3.5"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-rose-700">{diagnostic.urgentTitle}</p>
                    <p className="mt-1 text-[0.8125rem] leading-5 text-rose-700/90">{diagnostic.urgentBody}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Conversation panel ── */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-line bg-white/85 shadow-card backdrop-blur-sm">
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-label={diagnostic.title}
                tabIndex={0}
                className="diagnostic-scroll-area min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500"
              >
                <div className="mx-auto w-full max-w-[46rem] space-y-6 px-4 py-6 sm:px-8 sm:py-8">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                      className="flex items-start gap-3.5 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 sm:p-5"
                    >
                      <MiraAvatar />
                      <div className="min-w-0">
                        <p className="text-[0.9375rem] font-semibold text-ink">{diagnostic.welcomeTitle}</p>
                        <p className="mt-1 text-sm leading-6 text-ink-muted">{diagnostic.welcomeBody}</p>
                      </div>
                    </motion.div>
                  )}

                  {displayMessages.map((message, i) => (
                    <MiraMessage
                      key={message.id}
                      id={message.id}
                      role={message.role}
                      content={message.content}
                      language={conversationLanguage}
                      createdAt={message.createdAt}
                      index={i}
                    />
                  ))}

                  <AnimatePresence>
                    {busy && messages.length > 0 && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                        aria-label={diagnostic.thinking}
                      >
                        <MiraAvatar />
                        <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3.5 py-1">
                          <TypingIndicator />
                          <span className="text-xs text-ink-muted">{diagnostic.thinking}</span>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Composer ── */}
              <div className="border-t border-line bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pb-4">
                <div className="mx-auto w-full max-w-[46rem]">
                  <AnimatePresence initial={false}>
                    {error && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-2">
                          <p className="min-w-0 flex-1 text-[0.8125rem] font-medium text-rose-700">{error}</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => input.trim() && handleSend()}
                            className="border-rose-100 text-rose-700 hover:border-rose hover:bg-white hover:text-rose-700"
                          >
                            {diagnostic.retry}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!error && isStarting && messages.length === 0 && (
                    <p role="status" className="mb-3 text-center text-xs text-ink-muted">
                      {diagnostic.reconnecting}
                    </p>
                  )}
                  {(hint || dictating) && (
                    <p role="status" className="mb-3 text-center text-xs font-medium text-teal-700">
                      {dictating ? diagnostic.composerDictationLive : hint}
                    </p>
                  )}

                  {showSuggestions && (
                    <div className="mb-3">
                      <p className="mb-2 text-xs text-ink-muted">{diagnostic.suggestionsLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestionChips.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              setInput(chip + " ");
                              inputRef.current?.focus();
                            }}
                            className="min-h-9 cursor-pointer rounded-full border border-line bg-white px-3.5 text-[0.8125rem] text-ink-soft transition-colors duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-500"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <label htmlFor="mira-input" className="sr-only">
                    {diagnostic.inputLabel}
                  </label>
                  <div className="flex items-end gap-1 rounded-2xl border border-line-strong bg-white p-1.5 shadow-xs transition-[border-color,box-shadow] duration-200 focus-within:border-teal-500 focus-within:shadow-focus">
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".txt,.md,text/plain"
                      aria-hidden
                      tabIndex={-1}
                      className="hidden"
                      onChange={handleFilePicked}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleAttachClick}
                      aria-label={diagnostic.composerAttach}
                      title={diagnostic.composerAttach}
                      className="text-ink-muted"
                    >
                      <Paperclip aria-hidden />
                    </Button>

                    <textarea
                      id="mira-input"
                      ref={inputRef}
                      value={input}
                      rows={1}
                      onChange={(event) => {
                        setInput(event.target.value);
                        event.target.style.height = "auto";
                        event.target.style.height = `${Math.min(event.target.scrollHeight, 140)}px`;
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={diagnostic.placeholder}
                      disabled={busy}
                      aria-describedby="mira-session-meta"
                      className="max-h-[140px] min-h-10 min-w-0 flex-1 resize-none bg-transparent px-1.5 py-2 text-base leading-6 text-ink outline-none placeholder:text-ink-subtle disabled:opacity-60 sm:text-[0.9375rem]"
                    />

                    {input.trim() && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          stopDictation();
                          setInput("");
                          if (inputRef.current) inputRef.current.style.height = "auto";
                        }}
                        aria-label={dictionary.common.close}
                        className="h-10 w-10 text-ink-subtle hover:text-ink"
                      >
                        <X aria-hidden />
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={toggleDictation}
                      aria-label={dictating ? diagnostic.composerDictationLive : diagnostic.composerDictate}
                      title={dictating ? diagnostic.composerDictationLive : diagnostic.composerDictate}
                      aria-pressed={dictating}
                      className={cn(dictating ? "bg-rose-50 text-rose-700 hover:bg-rose-50 hover:text-rose-700" : "text-ink-muted")}
                    >
                      {dictating ? (
                        <Square className="fill-current" aria-hidden />
                      ) : dictationSupported ? (
                        <Mic aria-hidden />
                      ) : (
                        <MicOff aria-hidden />
                      )}
                    </Button>

                    <motion.button
                      type="button"
                      onClick={handleSend}
                      disabled={!canSend}
                      whileTap={canSend ? { scale: 0.92 } : undefined}
                      aria-label={diagnostic.send}
                      title={diagnostic.send}
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed",
                        canSend ? "bg-primary text-white shadow-brand hover:bg-teal-700" : "bg-surface-muted text-ink-subtle",
                      )}
                    >
                      <SendHorizontal className="h-[1.125rem] w-[1.125rem] rtl:-scale-x-100" aria-hidden />
                    </motion.button>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[0.6875rem] text-ink-muted">
                    <span className="tabular-nums">{input.length > 0 ? `${input.length.toLocaleString()} / 10,000` : diagnostic.questionsHint}</span>
                    <span className="hidden sm:inline">{diagnostic.enterHint}</span>
                  </div>
                </div>
              </div>
            </div>

            <p id="mira-session-meta" className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-2 text-center text-[0.6875rem] leading-4 text-ink-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-sage-700" aria-hidden />
              <span>{diagnostic.sessionMeta}</span>
              <span aria-hidden>·</span>
              <span>
                {diagnostic.session} <span className="font-mono" dir="ltr">{sessionId ? sessionId.slice(0, 8) : chatId.slice(0, 8)}</span>
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full px-3 pb-10 pt-4 sm:px-4 sm:pt-8 lg:px-8 lg:pb-14">
          <MiraResult
            result={result}
            transcript={messages}
            sessionId={sessionId || chatId}
            onRestart={handleRestart}
          />
        </div>
      )}
    </section>
  );
}
