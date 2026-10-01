"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check, Copy, Heart, HeartPulse, Lock, Mic, MicOff, RotateCcw,
  SendHorizontal, ShieldCheck, Sparkle, Sparkles, Square, TrendingUp, Volume2, VolumeX, X, Zap,
} from "lucide-react";
import { TypedText, useTypewriter } from "@/components/patient/chat/Typewriter";
import { LuminaLogo } from "@/components/patient/ui/LuminaLogo";
import { RichText } from "@/features/diagnostic/components/RichText";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTodayCheckin } from "@/hooks/patient/useCheckin";
import { type ChatMessage } from "@/hooks/patient/useLumina";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { useSpeech } from "@/hooks/useSpeech";
import type { InterventionResult } from "@/lib/api/patient";
import { LANGS } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/patient";
import { getSpeechRecognition, type Recognizer } from "@/lib/patient/dictation";
import { dayPart, formatTime } from "@/lib/patient/format";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LogoSpinner } from "@/components/shared/LogoLoader";

export { LuminaLogo };

const OUTCOMES: InterventionResult[] = ["EFFECTIVE", "PARTIALLY_EFFECTIVE", "INEFFECTIVE"];

function Waveform() {
  return (
    <span className="flex h-3 items-center gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span key={i} className="w-[2px] rounded-full bg-teal-600" animate={{ height: [4, 11, 4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
      ))}
    </span>
  );
}

const ACTION_CLASS =
  "inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium text-ink-soft transition-[background-color,color] duration-200 hover:bg-white/80 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4";

type RevealProps = {
  /** Type this reply out (the reply that just arrived). Never set for crisis replies. */
  reveal?: boolean;
  onRevealed?: () => void;
  /** Called as the typed text grows, so the thread can keep the newest line in view. */
  onRevealProgress?: () => void;
};

/**
 * One message, in the Mira reading style: Lumina gets its mark, a quiet frosted card and
 * Listen / Copy actions; the patient gets a teal bubble on the end edge. `plain` drops the
 * actions (used by the first conversation).
 */
export function LuminaMessage({
  message,
  index = 0,
  plain = false,
  onRetry,
  onOutcome,
  agentLabel,
  handoff,
  ...reveal
}: {
  message: Pick<ChatMessage, "id" | "role" | "text" | "createdAt"> & Partial<ChatMessage>;
  index?: number;
  plain?: boolean;
  onRetry?: () => void;
  onOutcome?: (result: InterventionResult) => void;
  /** Another agent speaking in this pane (Spark) names itself instead of Lumina. */
  agentLabel?: { title: string; role: string };
  /** A way to continue this reply in another agent (Lumina -> Spark for planning, ADHD track only). */
  handoff?: Handoff;
} & RevealProps) {
  return message.role === "user"
    ? <UserBubble message={message} onRetry={onRetry} />
    : <LuminaBubble message={message} index={index} plain={plain} onOutcome={onOutcome} onRetry={onRetry} agentLabel={agentLabel} handoff={handoff} {...reveal} />;
}

function UserBubble({ message, onRetry }: { message: Pick<ChatMessage, "text" | "createdAt"> & Partial<ChatMessage>; onRetry?: () => void }) {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: EASE_OUT }} className="flex w-full justify-end">
      <div className="flex max-w-[88%] flex-col items-end gap-1 sm:max-w-[78%]">
        <span className="px-1 text-[0.6875rem] font-medium text-ink-muted">
          {copy.chat.you}
          <time className="ms-1.5 tabular-nums text-ink-subtle">{formatTime(message.createdAt, language)}</time>
        </span>
        <div className={cn("max-w-full rounded-[1.375rem] rounded-se-md bg-[linear-gradient(135deg,var(--color-teal-600),var(--color-teal-800))] px-5 py-3 text-white shadow-[0_12px_28px_-14px_rgb(47_83_90/0.65)]", message.status === "sending" && "opacity-70")}>
          <div dir="auto"><RichText content={message.text} className="break-words text-[0.9375rem] leading-7 sm:text-base" /></div>
        </div>
        {message.status === "stopped" && onRetry && (
          <button type="button" onClick={onRetry} className="inline-flex min-h-9 items-center gap-1 px-1 text-xs font-medium text-teal-800 hover:underline">
            <RotateCcw className="size-3" aria-hidden />{copy.live.stream.stopped} {copy.live.stream.tryAgain}
          </button>
        )}
        {message.status === "failed" && onRetry && (
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 px-1 text-xs font-medium text-rose-700 hover:underline">
            <RotateCcw className="size-3" aria-hidden />{copy.chat.failed} {copy.chat.retry}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export type Handoff = { href: string; label: string; hint: string };

function LuminaBubble({
  message,
  index,
  plain,
  onOutcome,
  onRetry,
  agentLabel,
  handoff,
  reveal = false,
  onRevealed,
  onRevealProgress,
}: {
  message: Pick<ChatMessage, "text" | "createdAt"> & Partial<ChatMessage>;
  index: number;
  plain: boolean;
  onOutcome?: (result: InterventionResult) => void;
  onRetry?: () => void;
  agentLabel?: { title: string; role: string };
  handoff?: Handoff;
} & RevealProps) {
  const copy = usePatientCopy();
  const c = copy.chat;
  const [doneSteps, setDoneSteps] = useState<ReadonlySet<string>>(new Set());
  const { language } = useLanguage();
  const { state: speech, toggle } = useSpeech(message.text, language);
  const [copied, setCopied] = useState(false);
  const speaking = speech === "speaking" || speech === "loading";
  // Decided once, on mount: a reply that arrived live keeps its typed structure (see TypedText).
  const [typed] = useState(reveal);
  const { shown, typing } = useTypewriter(message.text, reveal, onRevealed, onRevealProgress);
  const streaming = Boolean(message.streaming);
  const progress = useRef(onRevealProgress);
  useEffect(() => {
    progress.current = onRevealProgress;
  });
  // A reply that is being written keeps its newest line in view (unless the patient scrolled up to read).
  useEffect(() => {
    if (streaming) progress.current?.();
  }, [streaming, message.text]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <motion.article
      aria-label={agentLabel?.title ?? c.title}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2), ease: EASE_OUT }}
      className="flex w-full gap-3 sm:gap-4"
    >
      <LuminaLogo size={40} className="mt-0.5" />
      <div className="min-w-0 max-w-[92%] flex-1 sm:max-w-[85%]">
        <p className="flex flex-wrap items-baseline gap-x-2.5 px-1 pt-1">
          <span className="text-base font-semibold text-ink sm:text-[1.0625rem]">{agentLabel?.title ?? c.title}</span>
          <span className="text-xs text-ink-muted sm:text-[0.8125rem]">{agentLabel?.role ?? c.role}</span>
          <time className="text-xs tabular-nums text-ink-subtle sm:text-[0.8125rem]">{formatTime(message.createdAt, language)}</time>
        </p>

        <div
          onClick={typing ? onRevealed : undefined}
          className={cn("relative mt-2 overflow-hidden rounded-[1.375rem] rounded-ss-md border border-teal-100/70 bg-white/85 px-5 py-4 ps-6 shadow-soft backdrop-blur-sm before:absolute before:inset-y-3 before:start-0 before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-gold before:via-sage before:to-teal-500 sm:px-6 sm:ps-7", typing && "cursor-pointer")}
        >
          {/* Polite live region, busy while the reply is being written: assistive tech reads it once it is complete. */}
          <div dir="auto" aria-live="polite" aria-busy={streaming || undefined}>
            <TypedText text={message.text} shown={shown} typed={typed}>
              {(value) => <RichText content={value} className="break-words text-base leading-7 text-ink-soft sm:text-[1.0625rem] sm:leading-8" />}
            </TypedText>
          </div>
          {streaming && <StreamingDots label={c.thinking} />}
        </div>

        {message.partial && onRetry && (
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs text-ink-muted" role="status">
            <span>{message.partial === "stopped" ? copy.live.stream.stopped : copy.live.stream.interrupted}</span>
            <button type="button" onClick={onRetry} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-teal-200 bg-white px-3.5 text-xs font-medium text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500">
              <RotateCcw className="size-3" aria-hidden />{copy.live.stream.tryAgain}
            </button>
          </p>
        )}

        {message.intervention && !typing && (
          <motion.div
            initial={typed ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="mt-3 rounded-2xl border border-gold-100 bg-gradient-to-br from-gold-50/90 to-teal-50/70 p-4"
          >
            <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-gold-700 rtl:tracking-normal"><Sparkles className="size-3" aria-hidden />{c.suggestion}</p>
            {message.intervention.title && <p className="mt-1 text-sm font-semibold text-ink" dir="auto">{message.intervention.title}</p>}
            {message.intervention.steps && message.intervention.steps.some((step) => !message.text.includes(step)) && (
              <ul className="mt-2 space-y-1.5 text-sm text-ink-soft" dir="auto">
                {message.intervention.steps.filter((step) => !message.text.includes(step)).map((step) => {
                  const done = doneSteps.has(step);
                  return (
                    <li key={step}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={done}
                        onClick={() => setDoneSteps((current) => { const next = new Set(current); if (done) next.delete(step); else next.add(step); return next; })}
                        className="flex w-full cursor-pointer items-start gap-2.5 rounded-lg text-start transition-colors hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                      >
                        <span className={cn("mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-teal-500", done ? "bg-teal-500 text-white" : "text-transparent")}><Check className="size-2.5" aria-hidden /></span>
                        <span className={cn(done && "text-ink-muted line-through")}>{step}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {message.outcome ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-sage-700"><Check className="size-3.5" aria-hidden />{c.thanks}</span>
              ) : onOutcome ? (
                <>
                  <span className="text-xs font-medium text-ink-soft">{c.helped}</span>
                  {OUTCOMES.map((result) => (
                    <button key={result} type="button" onClick={() => onOutcome(result)} className="rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100">
                      {c.outcome[result as keyof typeof c.outcome]}
                    </button>
                  ))}
                </>
              ) : null}
            </div>
          </motion.div>
        )}

        {handoff && !typing && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 px-1">
            <Link href={handoff.href} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 text-sm font-medium text-teal-800 shadow-xs transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500">
              <Zap className="size-3.5" aria-hidden />{handoff.label}
            </Link>
            <span className="text-xs text-ink-muted">{handoff.hint}</span>
          </div>
        )}

        {!plain && !typing && !streaming && !message.partial && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <button type="button" onClick={toggle} disabled={speech === "unsupported"} aria-label={speaking ? c.stopListening : c.listen} className={cn(ACTION_CLASS, speaking && "bg-white text-teal-800")}>
              {speech === "loading" ? <LogoSpinner size={18} /> : speaking ? <Waveform /> : <Volume2 aria-hidden />}
              <span aria-live="polite">{speaking ? c.listening : c.listen}</span>
              {speech === "speaking" && <VolumeX className="opacity-60" aria-hidden />}
            </button>
            <button type="button" onClick={() => void copyText()} className={ACTION_CLASS} aria-label={copied ? c.copied : c.copy}>
              {copied ? <Check className="text-sage-700" aria-hidden /> : <Copy aria-hidden />}
              <span className="hidden sm:inline">{copied ? c.copied : c.copy}</span>
            </button>
          </div>
        )}
        {speech === "error" && <p role="alert" className="mt-1 px-1 text-xs text-rose-700">{c.voiceError}</p>}
      </div>
    </motion.article>
  );
}

/** Three soft dots in the bubble's own padding: no layout change when they leave. Still under reduced motion. */
function StreamingDots({ label }: { label: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="pointer-events-none absolute bottom-1.5 end-5 flex items-center gap-1" role="presentation" title={label}>
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          aria-hidden
          className="size-1 rounded-full bg-teal-500/80"
          animate={reduce ? { opacity: 0.7 } : { opacity: [0.25, 1, 0.25] }}
          transition={reduce ? undefined : { duration: 1.2, repeat: Infinity, delay: dot * 0.18 }}
        />
      ))}
    </span>
  );
}

export function TypingRow() {
  const copy = usePatientCopy();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 sm:gap-4" role="status" aria-label={copy.chat.thinking}>
      <LuminaLogo size={40} glow />
      <div className="flex items-center gap-2.5 rounded-full border border-white/90 bg-white/70 px-5 py-3 shadow-soft">
        <span className="flex items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <motion.span key={dot} className="size-1.5 rounded-full bg-teal-500" animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.16 }} />
          ))}
        </span>
        <span className="text-sm text-ink-muted">{copy.chat.thinking}</span>
      </div>
    </motion.div>
  );
}

/** The composer: dictation, an optional deeper-reflection mode and the round send button. */
export function LuminaComposer({
  value,
  onChange,
  onSend,
  busy = false,
  deep,
  onDeepChange,
  placeholder,
  maxLength = 4000,
  hint,
  onStop,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  busy?: boolean;
  deep?: boolean;
  onDeepChange?: (deep: boolean) => void;
  placeholder: string;
  maxLength?: number;
  hint?: ReactNode;
  /** While a reply is being written, the send button becomes "Stop" (the partial reply is kept). */
  onStop?: () => void;
}) {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const [dictating, setDictating] = useState(false);
  const [supported, setSupported] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const recognizer = useRef<Recognizer | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const canSend = Boolean(value.trim()) && !busy;
  const multiline = value.includes("\n") || value.length > 90;

  useEffect(() => {
    const timer = window.setTimeout(() => setSupported(getSpeechRecognition() !== null), 0);
    return () => {
      window.clearTimeout(timer);
      recognizer.current?.stop();
    };
  }, []);

  function stopDictation() {
    recognizer.current?.stop();
    recognizer.current = null;
    setDictating(false);
  }

  function toggleDictation() {
    if (dictating) return stopDictation();
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setNote(copy.chat.dictateUnsupported);
      window.setTimeout(() => setNote(null), 4000);
      return;
    }
    try {
      const rec = new Recognition();
      rec.lang = LANGS.find((item) => item.code === language)?.bcp47 ?? "en-US";
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.onresult = (event) => {
        let chunk = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result.isFinal) chunk += result[0]?.transcript ?? "";
        }
        if (chunk.trim()) onChange(`${value.replace(/\s+$/, "")}${value.trim() ? " " : ""}${chunk.trim()} `);
      };
      rec.onerror = () => {
        stopDictation();
        setNote(copy.chat.voiceError);
      };
      rec.onend = () => {
        recognizer.current = null;
        setDictating(false);
      };
      recognizer.current = rec;
      rec.start();
      setDictating(true);
    } catch {
      setNote(copy.chat.voiceError);
    }
  }

  return (
    <div>
      {(note || dictating) && <p role="status" className="mb-3 text-center text-xs font-medium text-teal-700">{dictating ? copy.chat.dictating : note}</p>}
      <label htmlFor="lumina-input" className="sr-only">{placeholder}</label>
      <div
        className={cn(
          "flex items-end gap-1 border border-white bg-white/90 p-2 shadow-soft transition-[border-color,box-shadow,border-radius] duration-300 ease-out-soft focus-within:border-teal-200 focus-within:shadow-[0_0_0_4px_rgb(81_133_145/0.12),var(--shadow-soft)] sm:p-2.5",
          multiline ? "rounded-[1.75rem]" : "rounded-full",
        )}
      >
        <LuminaLogo size={32} className="mb-1.5 ms-1 hidden sm:inline-flex" />
        <textarea
          id="lumina-input"
          ref={input}
          value={value}
          rows={1}
          maxLength={maxLength}
          dir="auto"
          placeholder={placeholder}
          disabled={busy}
          onChange={(event) => {
            onChange(event.target.value);
            event.target.style.height = "auto";
            event.target.style.height = `${Math.min(event.target.scrollHeight, 140)}px`;
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              if (canSend) {
                stopDictation();
                onSend();
              }
            }
          }}
          className="max-h-[140px] min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-base leading-6 text-ink outline-none placeholder:text-ink-subtle disabled:opacity-60 sm:text-[1.0625rem]"
        />
        {value.trim() && (
          <button type="button" onClick={() => onChange("")} aria-label={copy.common.close} className="inline-flex size-11 items-center justify-center rounded-full text-ink-subtle hover:text-ink">
            <X className="size-4" aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={toggleDictation}
          aria-label={dictating ? copy.chat.dictating : copy.chat.dictate}
          title={dictating ? copy.chat.dictating : copy.chat.dictate}
          aria-pressed={dictating}
          className={cn("inline-flex size-11 items-center justify-center rounded-full", dictating ? "bg-rose-50 text-rose-700" : "text-ink-muted hover:bg-teal-50 hover:text-teal-800")}
        >
          {dictating ? <Square className="size-4 fill-current" aria-hidden /> : supported ? <Mic className="size-5" aria-hidden /> : <MicOff className="size-5" aria-hidden />}
        </button>
        {busy && onStop ? (
          <motion.button
            type="button"
            onClick={onStop}
            whileTap={{ scale: 0.92 }}
            aria-label={copy.live.stream.stop}
            title={copy.live.stream.stop}
            className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-teal-200 bg-white text-teal-800 shadow-[0_0_0_5px_rgb(227_176_28/0.12)] transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            <Square className="size-4 fill-current" aria-hidden />
          </motion.button>
        ) : (
        <motion.button
          type="button"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          whileHover={canSend ? { scale: 1.05 } : undefined}
          whileTap={canSend ? { scale: 0.92 } : undefined}
          aria-label={copy.chat.send}
          title={copy.chat.send}
          className={cn(
            "inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-[box-shadow,opacity] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed",
            "bg-[radial-gradient(circle_at_30%_25%,var(--color-teal-500),var(--color-teal-700)_60%,var(--color-teal-800))]",
            canSend ? "shadow-[0_0_0_5px_rgb(227_176_28/0.2),0_10px_24px_-8px_rgb(47_83_90/0.6)]" : "opacity-60 shadow-[0_0_0_5px_rgb(227_176_28/0.08)]",
          )}
        >
          {busy ? <LogoSpinner size={20} /> : <SendHorizontal className="size-5 rtl:-scale-x-100" aria-hidden />}
        </motion.button>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-ink-muted">
        <div className="flex items-center gap-3">
          {onDeepChange && (
            <button
              type="button"
              aria-pressed={deep}
              onClick={() => onDeepChange(!deep)}
              title={copy.chat.deepHint}
              className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium transition-colors", deep ? "border-gold-100 bg-gold-50 text-gold-700" : "border-line-strong bg-white/70 text-ink-muted hover:text-ink")}
            >
              <Sparkles className="size-3" aria-hidden />{deep ? copy.chat.deepOn : copy.chat.deep}
            </button>
          )}
          {value.length > 0 && <span className="tabular-nums">{value.length.toLocaleString()} / {maxLength.toLocaleString()}</span>}
        </div>
        <span className="hidden sm:inline">{hint ?? copy.chat.enterHint}</span>
      </div>
    </div>
  );
}

const TRUST_ICONS = [Lock, TrendingUp, ShieldCheck, Heart];

export function TrustRow() {
  const copy = usePatientCopy();
  return (
    <ul className="mt-4 hidden items-center justify-center text-[0.6875rem] text-ink-muted md:flex xl:text-xs">
      {copy.chat.trust.map((label, index) => {
        const Icon = TRUST_ICONS[index] ?? ShieldCheck;
        return (
          <li key={label} className="inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 xl:gap-2 xl:px-4 [&:not(:first-child)]:border-s [&:not(:first-child)]:border-line-strong/70">
            <Icon className="size-3.5 text-ink-subtle xl:size-4" aria-hidden />{label}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The empty conversation: Lumina's mark inside a slow gold orbit and a greeting for the time of
 * day, nothing more. Lumina speaks first only when the patient does.
 */
export function LuminaWelcome({ name }: { name: string }) {
  const copy = usePatientCopy();
  const reduce = useReducedMotion();
  return (
    <div className="my-auto flex flex-col items-center px-4 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
        className="relative grid size-36 shrink-0 place-items-center sm:size-44"
      >
        <span className="lm-orbit" />
        <span className="lm-orbit lm-orbit-soft inset-[-16%]" />
        <Sparkle className="absolute end-[6%] top-[4%] size-4 fill-gold text-gold motion-safe:animate-pulse" aria-hidden />
        <LuminaLogo size={92} glow presence />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
        className="mt-6 text-[clamp(1.5rem,1.1rem+1.6vw,2.375rem)] font-semibold leading-tight tracking-tight text-teal-800"
      >
        {fill(copy.shell.greeting[dayPart()], { name })}
      </motion.h2>
    </div>
  );
}

const MOTES = [
  { size: 7, top: "16%", start: "14%", delay: "0s" },
  { size: 5, top: "34%", start: "86%", delay: "-5s" },
  { size: 9, top: "66%", start: "7%", delay: "-9s" },
  { size: 6, top: "72%", start: "90%", delay: "-2s" },
  { size: 4, top: "12%", start: "70%", delay: "-12s" },
];

/** Soft points of light drifting behind the conversation (still under reduced motion). */
export function LuminaMotes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {MOTES.map((mote, index) => (
        <span
          key={index}
          className="lm-mote"
          style={{ width: mote.size * 3, height: mote.size * 3, top: mote.top, insetInlineStart: mote.start, animationDelay: mote.delay }}
        />
      ))}
    </div>
  );
}

/** Today's check-in status: a quiet pill in the conversation header. */
export function ChatSpaceActions() {
  const copy = usePatientCopy();
  const s = copy.chat.space;
  const today = useTodayCheckin();
  const done = Boolean(today.data);
  return (
    <Link
      href="/dashboard/check-in"
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
        done ? "border-sage-100 bg-sage-50/90 text-sage-700" : "border-gold-100 bg-gold-50/90 text-gold-700 hover:bg-gold-100",
      )}
    >
      {done ? <Check className="size-4" aria-hidden /> : <HeartPulse className="size-4" aria-hidden />}
      {done ? s.checkinDone : s.checkinPending}
    </Link>
  );
}
