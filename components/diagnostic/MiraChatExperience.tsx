"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle, Mic, MicOff, Paperclip, SendHorizontal, Square, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { copy, LANGS, type Lang } from "@/lib/i18n";
import { createChatId } from "@/lib/chat";
import { useMiraChat, type MiraChapter } from "@/hooks/useMiraChat";
import { MiraMessage } from "./MiraMessage";
import { MiraResult } from "./MiraResult";
import { TypingIndicator } from "./TypingIndicator";

const CHAPTER_ORDER: MiraChapter[] = ["MORNING", "MIDDAY", "EVENING", "INNER_VOICE"];

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
 * MiraChatExperience — PREMIUM diagnostic UI (wellness edition).
 *
 * Free-text four-chapter Mira flow (MORNING → MIDDAY → EVENING → INNER_VOICE →
 * COMPLETE): atmospheric calm background with subtle mint/teal gradients,
 * floating glass progress panel with checkpoints, premium narrow message cards,
 * and a compact glass composer pill.
 *
 * Visual direction: minimal, premium, calm, spacious, elegant, futuristic wellness AI.
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
  const activeChapterIndex = chapter === "COMPLETE" ? CHAPTER_ORDER.length : CHAPTER_ORDER.indexOf(chapter);

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

  const suggestionChips = conversationLanguage === "ar"
    ? ["أجد صعوبة في التركيز", "مزاجي يتغير بسرعة", "أنام قليلاً بدون تعب", "أشعر بالقلق"]
    : ["I have trouble focusing", "My mood shifts quickly", "I sleep little without feeling tired", "I feel anxious"];

  const displayMessages =
    messages.length === 0
      ? [{ id: "welcome", role: "assistant" as const, content: diagnostic.welcome, createdAt: "" }]
      : messages;

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-label={diagnostic.title}
      className={`relative w-full text-[#2c3e3b] bg-[#f4f6f5] ${result ? "min-h-[100dvh] overflow-x-hidden" : "h-[100dvh] min-h-[100svh] overflow-hidden"}`}
    >
      {/* ── Atmosphere: responsive, no horizontal overflow ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#f4f6f5]" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 sm:-top-40 start-0 sm:start-[-6%] h-[380px] w-[380px] sm:h-[560px] sm:w-[560px] rounded-full blur-[100px] sm:blur-[140px]"
          style={{ background: "rgba(81,133,145,0.07)" }}
        />
        <motion.div
          animate={{ x: [0, -28, 0], y: [0, 20, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] end-0 sm:end-[-6%] h-[420px] w-[420px] sm:h-[620px] sm:w-[620px] rounded-full blur-[110px] sm:blur-[150px]"
          style={{ background: "rgba(125,168,158,0.09)" }}
        />
        <motion.div
          animate={{ x: [0, 18, 0] }}
          transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[38%] start-[20%] sm:start-[30%] h-[300px] w-[300px] sm:h-[420px] sm:w-[420px] rounded-full blur-[90px] sm:blur-[130px]"
          style={{ background: "rgba(81,133,145,0.045)" }}
        />
        {/* Decorative waves - constrained to viewport */}
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute top-[10%] inset-x-0 h-[180px] sm:h-[280px] w-full opacity-[0.22]"
          animate={{ x: ["0%", "-4%", "0%"] }}
          transition={{ duration: 44, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M0,160 C240,90 420,230 720,150 C1020,70 1200,200 1440,130" fill="none" stroke="rgba(81,133,145,0.11)" strokeWidth="1.4" />
          <path d="M0,200 C260,130 460,260 740,190 C1020,120 1220,230 1440,170" fill="none" stroke="rgba(125,168,158,0.09)" strokeWidth="1.4" />
        </motion.svg>
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-[4%] inset-x-0 h-[160px] sm:h-[240px] w-full opacity-[0.18]"
          animate={{ x: ["-3%", "3%", "-3%"] }}
          transition={{ duration: 52, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M0,140 C220,210 480,80 760,160 C1040,240 1240,110 1440,180" fill="none" stroke="rgba(81,133,145,0.09)" strokeWidth="1.4" />
        </motion.svg>
      </div>

      {!result ? (
        <main className="relative z-10 mx-auto flex h-[100dvh] min-h-0 w-full max-w-6xl flex-col overflow-y-auto overflow-x-hidden px-3 sm:px-4 lg:px-6 pt-[calc(4.5rem+env(safe-area-inset-top))] sm:pt-[calc(5.5rem+env(safe-area-inset-top))] pb-3 sm:pb-4">

          {/* ── Floating glass progress panel - enhanced ── */}
          <div className="mx-auto w-full max-w-[760px] rounded-[16px] sm:rounded-[20px] border border-white/60 bg-white/70 px-3 sm:px-5 py-3 sm:py-4 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 truncate flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse hidden sm:inline-block" aria-hidden />
                {diagnostic.chapterLabel}{" "}
                <span className="text-[12px] sm:text-[13px] font-bold normal-case tracking-normal text-primary">
                  {chapter === "COMPLETE"
                    ? diagnostic.chapters.COMPLETE
                    : (diagnostic.chapters[chapter as keyof typeof diagnostic.chapters] ?? chapter)}
                </span>
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold tabular-nums text-primary shrink-0" aria-hidden>
                <span className="hidden sm:inline text-[10px] font-medium tracking-wide text-gray-400">
                  {progress < 1 ? `${Math.max(0, 10 - Math.round(progress * 10))} ${conversationLanguage === "ar" ? "متبقية" : "left"}` : ""}
                </span>
                {Math.round(progress * 100)}%
              </span>
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
                          className={`flex h-2.5 w-2.5 items-center justify-center rounded-full transition-colors duration-300 ${done
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
                          className={`hidden text-[10px] font-semibold md:inline ${current ? "text-primary" : done ? "text-gray-400" : "text-gray-300"
                            }`}
                        >
                          {diagnostic.chapters[step]}
                        </span>
                      </span>
                      {i < CHAPTER_ORDER.length - 1 && (
                        <span
                          aria-hidden
                          className={`mx-1.5 h-px flex-1 transition-colors duration-500 sm:mx-2 ${i < activeChapterIndex ? "bg-primary/50" : "bg-primary/10"
                            }`}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="mx-auto mt-3 sm:mt-4 flex w-full max-w-[760px] flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-1">
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight text-[#2c3e3b] leading-tight">{diagnostic.title}</h1>
              <p className="mt-0.5 text-xs text-gray-400 sm:text-sm leading-snug line-clamp-2 sm:truncate">{diagnostic.subtitle}</p>
            </div>
            <span className="hidden sm:inline-flex shrink-0 self-start sm:self-auto rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5a7d76] shadow-sm backdrop-blur-md">
              {diagnostic.session}
            </span>
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
              className="flex w-full min-h-0 flex-1 flex-col gap-2 sm:gap-3 pt-2"
            >
              {/* Chat messages area - flex-1 scroll with proper min-height */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-label={diagnostic.title}
                tabIndex={0}
                className="diagnostic-scroll-area min-h-[clamp(10rem,24dvh,24rem)] flex-1 space-y-3 overflow-y-auto overscroll-contain scroll-smooth rounded-[22px] border border-white/55 bg-white/20 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-[2px] sm:space-y-4 sm:px-3 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <div className="max-w-[680px] mx-auto w-full space-y-3 sm:space-y-4 pb-2">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[18px] border border-primary/10 bg-gradient-to-br from-white via-white to-primary/5 p-4 sm:p-5 shadow-sm backdrop-blur-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">✦</div>
                        <div>
                          <p className="text-sm font-semibold text-[#2c3e3b]">{conversationLanguage === "ar" ? "مرحباً، أنا ميرا" : "Hi, I'm Mira"}</p>
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {conversationLanguage === "ar"
                              ? "مساحة هادئة وآمنة — أجيبيني بحرية، بالعربية أو الإنجليزية. سأطرح حوالي 10 أسئلة، ويمكنك طلب المزيد."
                              : "A calm, safe space — answer freely in English or Arabic. I'll ask about 10 questions; you can ask for more."}
                          </p>
                        </div>
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
                    className="mx-auto flex w-full max-w-[680px] flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 rounded-[14px] sm:rounded-[16px] border border-red-100 bg-red-50/80 px-3 sm:px-4 py-2.5 text-center shadow-sm backdrop-blur-xl"
                  >
                    <p className="text-xs font-medium text-red-600 flex-1">{error}</p>
                    <button
                      type="button"
                      onClick={() => input.trim() && handleSend()}
                      className="shrink-0 rounded-full bg-white px-3.5 py-1.5 min-h-[32px] text-xs font-bold text-red-600 shadow-sm transition-all hover:shadow focus-visible:outline-2 focus-visible:outline-red-500"
                    >
                      {diagnostic.retry}
                    </button>
                  </div>
                )}
                {!error && isStarting && messages.length === 0 && (
                  <p role="status" className="mx-auto rounded-full bg-white/70 px-3 sm:px-4 py-2 text-center text-xs font-medium text-gray-400 shadow-sm backdrop-blur-xl max-w-fit">
                    {diagnostic.reconnecting}
                  </p>
                )}
                {(hint || dictating) && (
                  <p role="status" className="mx-auto rounded-full bg-white/80 px-3 sm:px-4 py-2 text-center text-xs font-medium text-primary shadow-sm backdrop-blur-xl max-w-fit">
                    {dictating ? diagnostic.composerDictationLive : hint}
                  </p>
                )}
              </div>

              {/* ── Suggestion chips · quick start */}
              {!result && !input.trim() && messages.length <= 1 && (
                <div className="mx-auto w-full max-w-[680px] flex flex-wrap gap-1.5 sm:gap-2 justify-center px-1 mb-2">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setInput(chip + " ");
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-primary/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-primary/80 shadow-sm backdrop-blur-md transition-all hover:bg-primary hover:text-white hover:shadow-md active:scale-[0.97]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Responsive floating glass composer · enhanced */}
              <div className="mx-auto w-full max-w-[680px] pb-[env(safe-area-inset-bottom,0px)]">
                <div className="rounded-[22px] sm:rounded-[28px] border border-white/60 bg-white/80 p-1.5 sm:p-2 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl ring-1 ring-white/40">
                  <label htmlFor="mira-input" className="sr-only">
                    {diagnostic.inputLabel}
                  </label>
                  <div className="relative flex items-end sm:items-center gap-1">
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

                    {/* RIGHT - Voice & Send - responsive */}
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 pb-1 sm:pb-0">
                      <button
                        type="button"
                        onClick={toggleDictation}
                        aria-label={dictating ? diagnostic.composerDictationLive : diagnostic.composerDictate}
                        title={dictating ? diagnostic.composerDictationLive : diagnostic.composerDictate}
                        aria-pressed={dictating}
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 active:scale-90 focus-visible:outline-2 focus-visible:outline-primary ${dictating
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

                {/* Composer meta · char count + hint */}
                <div className="mx-auto w-full max-w-[680px] flex items-center justify-between px-2 mt-1.5">
                  <span className="text-[10px] tracking-wide text-gray-400 tabular-nums">
                    {input.length > 0 ? `${input.length.toLocaleString()} / 10,000` : ""}
                  </span>
                  <span className="hidden sm:inline text-[10px] text-gray-400">
                    {input.length === 0 ? (conversationLanguage === "ar" ? "حوالي 10 أسئلة · يمكنك طلب المزيد" : "About 10 questions · ask for more if needed") : (conversationLanguage === "ar" ? "اضغط Enter للإرسال" : "Press Enter to send")}
                  </span>
                </div>

                {/* Footer - privacy/session info · enhanced with copy */}
                <p id="mira-session-meta" className="mt-1.5 text-center text-[10px] leading-4 text-gray-400">
                  {diagnostic.sessionMeta} · {diagnostic.session} {sessionId ? sessionId.slice(0, 8) : chatId.slice(0, 8)} · {diagnostic.confidential}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      ) : (
        <div className="relative z-10 min-h-[100dvh] overflow-y-auto px-3 sm:px-4 lg:px-6 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-[calc(6rem+env(safe-area-inset-top))] pb-8 sm:pb-12">
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
