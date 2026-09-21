"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle, Mic, MicOff, Paperclip, SendHorizontal, Square, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { createChatId } from "@/lib/chat";
import { useMiraChat, type MiraChapter } from "@/hooks/useMiraChat";
import { MiraMessage } from "./MiraMessage";
import { MiraResult } from "./MiraResult";
import { TypingIndicator } from "./TypingIndicator";

const CHAPTER_ORDER: MiraChapter[] = ["MORNING", "MIDDAY", "EVENING", "INNER_VOICE"];

type SpeechRecognitionType = {
  new (): {
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
 * MiraChatExperience — PREMIUM diagnostic UI (wellness edition).
 *
 * Free-text four-chapter Mira flow (MORNING → MIDDAY → EVENING → INNER_VOICE →
 * COMPLETE): atmospheric calm background with subtle mint/teal gradients,
 * floating glass progress panel with checkpoints, premium narrow message cards,
 * and a compact glass composer pill.
 *
 * Visual direction: minimal, premium, calm, spacious, elegant, futuristic wellness AI.
 */
export function MiraChatExperience({ chatId }: { chatId: string }) {
  const router = useRouter();
  const { dictionary, direction, language } = useLanguage();
  const diagnostic = dictionary.diagnostic;
  const [input, setInput] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [dictating, setDictating] = useState(false);

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
    sendMessage,
    restart,
  } = useMiraChat(null, language);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognizerRef = useRef<{ stop: () => void } | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = isSending || isBotTyping || isStarting;
  const activeChapterIndex = chapter === "COMPLETE" ? CHAPTER_ORDER.length : CHAPTER_ORDER.indexOf(chapter);
  const dictationSupported = getSpeechRecognition() !== null;

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
      rec.lang = language === "ar" ? "ar-SA" : "en-US";
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

  const displayMessages =
    messages.length === 0
      ? [{ id: "welcome", role: "assistant" as const, content: diagnostic.welcome, createdAt: new Date().toISOString() }]
      : messages;

  return (
    <section
      dir={direction}
      aria-label={diagnostic.title}
      className="relative w-full min-h-[100dvh] overflow-x-hidden text-[#2c3e3b]"
    >
      {/* ── Atmosphere: soft off-white base, extremely subtle mint/teal atmospheric gradients, organic flowing curves ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Base off-white background */}
        <div className="absolute inset-0 bg-[#f4f6f5]" />
        
        {/* Extremely subtle mint/teal atmospheric gradients - almost invisible */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 start-[-10%] h-[560px] w-[560px] rounded-full blur-[140px]"
          style={{ background: "rgba(81,133,145,0.08)" }}
        />
        <motion.div
          animate={{ x: [0, -36, 0], y: [0, 28, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] end-[-8%] h-[620px] w-[620px] rounded-full blur-[150px]"
          style={{ background: "rgba(125,168,158,0.10)" }}
        />
        <motion.div
          animate={{ x: [0, 24, 0] }}
          transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[38%] start-[30%] h-[420px] w-[420px] rounded-full blur-[130px]"
          style={{ background: "rgba(81,133,145,0.05)" }}
        />
        
        {/* Very large, extremely faint organic flowing curves/waves - decorative only */}
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute top-[12%] h-[280px] w-[130%] opacity-[0.25]"
          animate={{ x: ["0%", "-12%", "0%"] }}
          transition={{ duration: 44, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M0,160 C240,90 420,230 720,150 C1020,70 1200,200 1440,130"
            fill="none"
            stroke="rgba(81,133,145,0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M0,200 C260,130 460,260 740,190 C1020,120 1220,230 1440,170"
            fill="none"
            stroke="rgba(125,168,158,0.10)"
            strokeWidth="1.5"
          />
        </motion.svg>
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-[6%] h-[240px] w-[130%] opacity-[0.20]"
          animate={{ x: ["-8%", "4%", "-8%"] }}
          transition={{ duration: 52, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M0,140 C220,210 480,80 760,160 C1040,240 1240,110 1440,180"
            fill="none"
            stroke="rgba(81,133,145,0.10)"
            strokeWidth="1.5"
          />
        </motion.svg>
      </div>

      {!result ? (
        <div className="relative z-10 mx-auto flex h-[100dvh] w-full max-w-4xl flex-col px-3 sm:px-5 pt-20 sm:pt-24 pb-4">
          
          {/* ── Floating glass progress panel - compact, centered ── */}
          <div className="mx-auto w-full max-w-[680px] rounded-[20px] border border-white/60 bg-white/55 px-4 py-3.5 shadow-[0_8px_32px_rgba(15,23,42,0.05)] backdrop-blur-2xl sm:px-5 sm:py-4">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                {diagnostic.chapterLabel}{" "}
                <span className="text-[13px] font-bold normal-case tracking-normal text-primary">
                  {chapter === "COMPLETE"
                    ? diagnostic.chapters.COMPLETE
                    : (diagnostic.chapters[chapter as keyof typeof diagnostic.chapters] ?? chapter)}
                </span>
              </p>
              <p className="text-[13px] font-bold tabular-nums text-primary" aria-hidden>
                {Math.round(progress * 100)}%
              </p>
            </div>
            <div
              role="progressbar"
              aria-label={diagnostic.progressLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              className="relative"
            >
              <div className="h-[2.5px] overflow-hidden rounded-full bg-primary/10">
                <motion.div
                  animate={{ width: `${Math.round(progress * 100)}%` }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <ol className="mt-2 flex items-center justify-between" aria-label={diagnostic.chapterLabel}>
                {CHAPTER_ORDER.map((step, i) => {
                  const done = i < activeChapterIndex;
                  const current = i === activeChapterIndex;
                  return (
                    <li key={step} className="flex flex-1 items-center last:flex-none" title={diagnostic.chapters[step]}>
                      <span className="flex items-center gap-1">
                        <motion.span
                          aria-current={current ? "step" : undefined}
                          initial={false}
                          animate={current ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className={`flex h-2.5 w-2.5 items-center justify-center rounded-full transition-colors duration-300 ${
                            done
                              ? "bg-primary"
                              : current
                                ? "bg-primary shadow-[0_0_0_3px_rgba(81,133,145,0.15),0_0_10px_rgba(81,133,145,0.40)]"
                                : "bg-primary/15"
                          }`}
                        >
                          {done && (
                            <svg viewBox="0 0 10 10" className="h-1.5 w-1.5 text-white" aria-hidden>
                              <path d="M1.5 5.5l2.2 2.2L8.5 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          )}
                        </motion.span>
                        <span
                          className={`hidden text-[10px] font-semibold md:inline ${
                            current ? "text-primary" : done ? "text-gray-400" : "text-gray-300"
                          }`}
                        >
                          {diagnostic.chapters[step]}
                        </span>
                      </span>
                      {i < CHAPTER_ORDER.length - 1 && (
                        <span
                          aria-hidden
                          className={`mx-1.5 h-px flex-1 transition-colors duration-500 sm:mx-2 ${
                            i < activeChapterIndex ? "bg-primary/50" : "bg-primary/10"
                          }`}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {safety.level === "urgent" && (
            <div
              role="alert"
              className="mx-auto mt-3 w-full max-w-[680px] flex items-start gap-2.5 rounded-[18px] border border-red-200/70 bg-red-50/80 px-4 py-3 shadow-[0_8px_24px_rgba(220,38,38,0.08)] backdrop-blur-xl"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
              <div>
                <p className="text-[13px] font-bold text-red-700">{diagnostic.urgentTitle}</p>
                <p className="mt-0.5 text-xs leading-5 text-red-600">{diagnostic.urgentBody}</p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key="mira-chat-view"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="flex w-full flex-1 flex-col min-h-0"
            >
              {/* Chat messages area - narrow and centered */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-label={diagnostic.title}
                tabIndex={0}
                className="flex-1 space-y-4 overflow-y-auto px-1 sm:px-2 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <div className="max-w-[680px] mx-auto w-full space-y-4">
                  {displayMessages.map((message, i) => (
                    <MiraMessage
                      key={message.id}
                      id={message.id}
                      role={message.role}
                      content={message.content}
                      createdAt={message.createdAt}
                      index={i}
                    />
                  ))}
                  {busy && messages.length > 0 && (
                    <div className="flex w-full justify-start">
                      <div
                        className="flex items-center gap-2 rounded-[18px] rounded-bl-lg border border-white/60 bg-white/75 px-4 py-2.5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl"
                        aria-label={diagnostic.thinking}
                      >
                        <TypingIndicator />
                        <span className="sr-only">{diagnostic.thinking}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status messages */}
              <div className="flex-shrink-0 space-y-2 px-1">
                {error && (
                  <div
                    role="alert"
                    className="mx-auto mb-2.5 flex w-full max-w-[680px] items-center justify-center gap-3 rounded-[16px] border border-red-100 bg-red-50/80 px-4 py-2.5 text-center shadow-sm backdrop-blur-xl"
                  >
                    <p className="text-xs font-medium text-red-600">{error}</p>
                    <button
                      type="button"
                      onClick={() => input.trim() && handleSend()}
                      className="shrink-0 rounded-full bg-white px-3.5 py-1.5 min-h-[34px] text-xs font-bold text-red-600 shadow-sm transition-all hover:shadow focus-visible:outline-2 focus-visible:outline-red-500"
                    >
                      {diagnostic.retry}
                    </button>
                  </div>
                )}
              {!error && isStarting && messages.length === 0 && (
                <p role="status" className="mx-auto mb-2.5 rounded-full bg-white/70 px-4 py-2 text-center text-xs font-medium text-gray-400 shadow-sm backdrop-blur-xl">
                  {diagnostic.reconnecting}
                </p>
              )}
              {(hint || dictating) && (
                <p role="status" className="mx-auto mb-2.5 rounded-full bg-white/80 px-4 py-2 text-center text-xs font-medium text-primary shadow-sm backdrop-blur-xl">
                  {dictating ? diagnostic.composerDictationLive : hint}
                </p>
              )}
              </div>

              {/* ── Compact floating glass composer pill - width ~550-650px, height ~50-65px ── */}
              <div className="mx-auto w-full max-w-[620px]">
                <div className="rounded-[28px] border border-white/60 bg-white/70 p-2 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                  <label htmlFor="mira-input" className="sr-only">
                    {diagnostic.inputLabel}
                  </label>
                  <div className="relative flex items-center gap-1">
                    {/* LEFT - Attachment button */}
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".txt,.md,text/plain"
                      aria-hidden
                      tabIndex={-1}
                      className="hidden"
                      onChange={handleFilePicked}
                    />
                    <button
                      type="button"
                      onClick={handleAttachClick}
                      aria-label={diagnostic.composerAttach}
                      title={diagnostic.composerAttach}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:bg-primary/5 hover:text-primary active:scale-90 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <Paperclip className="h-4.5 w-4.5" aria-hidden />
                    </button>

                    {/* CENTER - Textarea */}
                    <textarea
                      id="mira-input"
                      ref={inputRef}
                      value={input}
                      rows={1}
                      onChange={(event) => {
                        setInput(event.target.value);
                        event.target.style.height = "auto";
                        event.target.style.height = `${Math.min(event.target.scrollHeight, 100)}px`;
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
                      className="max-h-[100px] min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 text-[#2c3e3b] outline-none placeholder:text-gray-300 disabled:opacity-60"
                    />

                    {/* RIGHT - Voice & Send */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={toggleDictation}
                        aria-label={dictating ? diagnostic.composerDictationLive : diagnostic.composerDictate}
                        title={dictating ? diagnostic.composerDictationLive : diagnostic.composerDictate}
                        aria-pressed={dictating}
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 active:scale-90 focus-visible:outline-2 focus-visible:outline-primary ${
                          dictating
                            ? "bg-red-50 text-red-500 shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"
                            : "text-gray-400 hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        {dictating ? (
                          <Square className="h-4 w-4 fill-current" aria-hidden />
                        ) : dictationSupported ? (
                          <Mic className="h-4.5 w-4.5" aria-hidden />
                        ) : (
                          <MicOff className="h-4.5 w-4.5" aria-hidden />
                        )}
                      </button>
                      {dictating && (
                        <span className="flex items-center gap-[2px]" aria-hidden>
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-[2.5px] rounded-full bg-red-400"
                              animate={{ height: [4, 10, 4] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </span>
                      )}
                      
                      {/* Teal circular send button */}
                      {input.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            stopDictation();
                            setInput("");
                            if (inputRef.current) inputRef.current.style.height = "auto";
                          }}
                          aria-label={dictionary.common.close}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-all hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <X className="h-4 w-4" aria-hidden />
                        </button>
                      )}
                      <motion.button
                        type="button"
                        onClick={handleSend}
                        disabled={!input.trim() || busy}
                        whileTap={!input.trim() || busy ? undefined : { scale: 0.88 }}
                        whileHover={!input.trim() || busy ? undefined : { scale: 1.06 }}
                        transition={{ duration: 0.2 }}
                        aria-label={diagnostic.send}
                        title={diagnostic.send}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_24px_rgba(81,133,145,0.30)] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(81,133,145,0.40)] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <SendHorizontal className="h-4.5 w-4.5 rtl:-scale-x-100" aria-hidden />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Footer - privacy/session info */}
                <p id="mira-session-meta" className="mt-2 text-center text-[10px] leading-4 text-gray-300">
                  {diagnostic.sessionMeta} · {diagnostic.session} {sessionId ? sessionId.slice(0, 8) : chatId.slice(0, 8)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="relative z-10 min-h-screen px-3 sm:px-5 pt-24 sm:pt-28 pb-12">
          <MiraResult result={result} sessionId={sessionId || chatId} onRestart={handleRestart} />
        </div>
      )}
    </section>
  );
}
