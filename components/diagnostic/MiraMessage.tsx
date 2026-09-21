"use client";

import { Bot, Check, Copy, Loader2, MoreHorizontal, User, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSpeech } from "@/hooks/useSpeech";
import { RichText } from "./RichText";

interface MiraMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  index: number;
}

function Waveform() {
  return (
    <span className="flex items-center gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-primary"
          animate={{ height: [5, 12, 5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/**
 * Premium conversational message cards for Mira experience.
 * 
 * AI messages: refined floating white cards with AI WELLNESS GUIDE metadata, subtle border, soft shadow
 * User messages: small compact teal bubbles aligned to the right
 * Both: narrow (~650-700px), with AI avatar, and listen as small refined pill button
 */
export function MiraMessage({ content, role, createdAt, index }: MiraMessageProps) {
  const { dictionary, language } = useLanguage();
  const diagnostic = dictionary.diagnostic;
  const isUser = role === "user";
  const { state: speech, toggle } = useSpeech(content, language);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const time = (() => {
    try {
      return new Date(createdAt).toLocaleTimeString(language === "ar" ? "ar-SA" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  })();

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

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
    setMenuOpen(false);
  }

  const speaking = speech === "speaking" || speech === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] }}
      className={`flex w-full gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar - small floating avatar to the left of AI message */}
      {!isUser && (
        <div className="relative mt-0.5 shrink-0" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-primary/20 blur-[5px]" />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/75 text-primary shadow-[0_4px_12px_rgba(81,133,145,0.15)] backdrop-blur-md">
            <Bot className="h-4 w-4" />
          </span>
          <span className="absolute -bottom-0.5 -end-0.5 h-2 w-2 rounded-full border-1.5 border-white bg-primary" />
        </div>
      )}

      {/* Message container - narrow for AI, compact for user */}
      <div className={`flex max-w-[85%] flex-col sm:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <span className="sr-only">{isUser ? diagnostic.youLabel : diagnostic.miraLabel}</span>

        {/* AI Message - refined floating white card */}
        {!isUser && (
          <article
            aria-label={`${diagnostic.aiGuide}: ${content.slice(0, 120)}`}
            className="w-full rounded-[18px] border border-gray-100/70 bg-white/75 px-4 py-3.5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] backdrop-blur-xl"
          >
            {/* Metadata: AI WELLNESS GUIDE · time */}
            <div className="mb-2 flex items-center gap-2 border-b border-gray-100/60 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                {diagnostic.aiGuide}
              </span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-gray-200" />
              {time && (
                <time className="text-[10px] font-medium tabular-nums text-gray-400">{time}</time>
              )}
            </div>
            
            {/* Message content - clean, readable typography */}
            <RichText content={content} className="text-[15px] leading-relaxed" />

            {/* Bottom controls - listen pill button and menu */}
            <div className="mt-2.5 flex items-center gap-1.5 border-t border-gray-100/60 pt-2">
              <button
                type="button"
                onClick={toggle}
                disabled={speech === "unsupported"}
                aria-label={speaking ? diagnostic.stopListening : diagnostic.listen}
                title={speaking ? diagnostic.stopListening : diagnostic.listen}
                className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-gray-100 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-gray-500 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:text-primary hover:shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {speech === "loading" ? (
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                ) : speaking ? (
                  <Waveform />
                ) : (
                  <Volume2 className="h-3 w-3" aria-hidden />
                )}
                <span aria-live="polite">
                  {speech === "loading"
                    ? diagnostic.voiceLoading
                    : speaking
                      ? diagnostic.listening
                      : diagnostic.listen}
                </span>
                {speaking && speech === "speaking" && (
                  <VolumeX className="h-3 w-3 opacity-60" aria-hidden />
                )}
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label={diagnostic.messageMenu}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-all duration-200 hover:bg-gray-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
                </button>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.18 }}
                    role="menu"
                    className="absolute bottom-9 start-0 z-30 min-w-[160px] overflow-hidden rounded-xl border border-white/50 bg-white/90 p-1 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={copyText}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {copied ? diagnostic.copiedMessage : diagnostic.copyMessage}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </article>
        )}

        {/* User Message - small compact teal bubble */}
        {isUser && (
          <div
            aria-label={`${diagnostic.youLabel}: ${content.slice(0, 120)}`}
            className="rounded-[18px] rounded-br-lg bg-primary px-4 py-2.5 text-white shadow-[0_6px_20px_rgba(81,133,145,0.20)]"
          >
            <RichText content={content} className="text-[14.5px] leading-relaxed" />
          </div>
        )}

        {speech === "error" && !isUser && (
          <p role="alert" className="mt-1 text-[10px] text-gray-400">
            {diagnostic.voiceError}
          </p>
        )}
      </div>

      {/* User avatar - small teal circle */}
      {isUser && (
        <div
          aria-hidden
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_12px_rgba(81,133,145,0.20)]"
        >
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}
