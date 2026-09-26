"use client";

import { Check, Copy, Leaf, Loader2, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS } from "@/lib/i18n/config";
import { EASE_OUT } from "@/lib/motion";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/lib/utils";
import { RichText } from "./RichText";

interface MiraMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  index: number;
  language: "en" | "ar";
}

export function MiraAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-teal-500),var(--color-teal-700))] text-white shadow-brand",
        className,
      )}
    >
      <Leaf className="h-4 w-4" strokeWidth={2} />
    </span>
  );
}

function Waveform() {
  return (
    <span className="flex h-3 items-center gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-teal-600"
          animate={{ height: [4, 11, 4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

const ACTION_CLASS =
  "inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-ink-muted transition-colors duration-200 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Assessment message.
 * Mira: an open "question" block (avatar + name + readable text + quiet actions).
 * User: a soft teal answer bubble aligned to the end edge.
 */
export function MiraMessage({ content, role, createdAt, index, language }: MiraMessageProps) {
  const { dictionary } = useLanguage();
  const diagnostic = dictionary.diagnostic;
  const isUser = role === "user";
  const { state: speech, toggle } = useSpeech(content, language);
  const [copied, setCopied] = useState(false);

  const time = (() => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";
    const locale = LANGS.find((l) => l.code === language)?.bcp47 ?? "en-US";
    return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  })();

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const speaking = speech === "speaking" || speech === "loading";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="flex w-full justify-end"
      >
        <div className="flex max-w-[88%] flex-col items-end gap-1 sm:max-w-[80%]">
          <span className="px-1 text-[0.6875rem] font-medium text-ink-muted">
            {diagnostic.youLabel}
            {time && <time className="ms-1.5 tabular-nums">{time}</time>}
          </span>
          <div className="max-w-full rounded-2xl rounded-se-md border border-teal-100 bg-teal-50 px-4 py-2.5 text-ink">
            <RichText content={content} className="text-[0.9375rem] leading-7 break-words" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.article
      aria-label={diagnostic.miraLabel}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2), ease: EASE_OUT }}
      className="flex w-full gap-3 sm:gap-3.5"
    >
      <MiraAvatar className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-xs">
          <span className="font-semibold text-ink">{diagnostic.miraLabel}</span>
          <span className="text-ink-muted">{diagnostic.aiGuide}</span>
          {time && <time className="tabular-nums text-ink-subtle">{time}</time>}
        </p>

        <RichText content={content} className="mt-1.5 text-base leading-7 text-ink break-words sm:text-[1.0625rem] sm:leading-8" />

        <div className="-ms-2.5 mt-1.5 flex flex-wrap items-center gap-0.5">
          <button
            type="button"
            onClick={toggle}
            disabled={speech === "unsupported"}
            aria-label={speaking ? diagnostic.stopListening : diagnostic.listen}
            className={cn(ACTION_CLASS, speaking && "bg-teal-50 text-teal-800")}
          >
            {speech === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : speaking ? (
              <Waveform />
            ) : (
              <Volume2 className="h-3.5 w-3.5" aria-hidden />
            )}
            <span aria-live="polite">
              {speech === "loading" ? diagnostic.voiceLoading : speaking ? diagnostic.listening : diagnostic.listen}
            </span>
            {speech === "speaking" && <VolumeX className="h-3.5 w-3.5 opacity-60" aria-hidden />}
          </button>

          <button type="button" onClick={copyText} className={ACTION_CLASS} aria-label={copied ? diagnostic.copiedMessage : diagnostic.copyMessage}>
            {copied ? <Check className="h-3.5 w-3.5 text-sage-700" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            <span className="hidden sm:inline">{copied ? diagnostic.copiedMessage : diagnostic.copyMessage}</span>
          </button>
        </div>

        {speech === "error" && (
          <p role="alert" className="mt-1 text-xs text-rose-700">
            {diagnostic.voiceError}
          </p>
        )}
      </div>
    </motion.article>
  );
}
