"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowUp, Loader2, Paperclip, Mic } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ChatOption } from "@/hooks/useDiagnosticChat";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  chatId: string;
  options?: ChatOption[] | null;
  onOptionClick?: (value: string, label: string) => void;
}

export function ChatInput({ value, onChange, onSend, loading, chatId, options, onOptionClick }: ChatInputProps) {
  const { dictionary } = useLanguage();
  const diagnostic = dictionary.diagnostic;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
  }, [value]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 2200);
    return () => clearTimeout(t);
  }, [showToast]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  function handleVoiceClick() {
    setShowToast(true);
  }

  if (options && options.length > 0 && onOptionClick) {
    return (
      <div className="py-2 pb-3 w-full flex-shrink-0">
        <div className="mx-auto max-w-[680px]">
          <div className="flex flex-wrap justify-center gap-2 p-2.5 sm:p-3 bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onOptionClick(option.value, option.label)}
                disabled={loading}
                className="px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium shadow-sm hover:bg-primary hover:text-white hover:border-primary hover:shadow-md transition-all duration-300 active:scale-95 disabled:opacity-50 backdrop-blur-sm"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center mt-2 text-[10px] text-gray-300 font-medium tracking-wide">
          {diagnostic.session} · {chatId.slice(0, 8)}
        </p>
      </div>
    );
  }

  return (
    <div className="py-2 pb-3 w-full flex-shrink-0 relative">
      {/* Toast Coming Soon */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute left-1/2 -top-12 -translate-x-1/2 z-50"
          >
            <div className="px-4 py-2.5 rounded-full bg-gray-800/90 text-white text-xs font-semibold shadow-xl backdrop-blur-md flex items-center gap-2 whitespace-nowrap ring-1 ring-white/10">
              <Mic className="h-3.5 w-3.5" />
              {diagnostic.voiceUnavailable}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-[680px]">
        <div className="relative flex items-end gap-1 sm:gap-1.5 bg-white/70 backdrop-blur-2xl border border-white/60 p-2 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.08)] focus-within:border-primary/20 focus-within:bg-white/80">
          
          {/* LEFT — File Attachment */}
          <button
            type="button"
            onClick={() => setShowToast(true)}
            className="mb-0.5 ml-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-gray-400 hover:text-primary hover:bg-primary/5 transition-all duration-300"
            title={diagnostic.inputLabel}
            aria-label={diagnostic.inputLabel}
          >
            <Paperclip className="h-4.5 w-4.5" />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
            placeholder={diagnostic.placeholder}
            className="max-h-20 min-h-[38px] w-full bg-transparent border-0 outline-none px-1.5 py-2 sm:px-2 sm:py-2.5 text-[14.5px] text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-0 resize-none leading-relaxed"
          />

          {/* RIGHT — Voice & Send */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Voice */}
            <button
              type="button"
              onClick={handleVoiceClick}
              className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-[12px] text-gray-400 hover:text-primary hover:bg-primary/5 transition-all duration-300"
              title={diagnostic.unmute}
              aria-label={diagnostic.unmute}
            >
              <Mic className="h-4.5 w-4.5" />
            </button>

            {/* Send */}
            <button
              type="button"
              onClick={onSend}
              disabled={loading || !value.trim()}
              className="mb-0.5 mr-0.5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[14px] bg-primary text-white shadow-md shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <ArrowUp className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center mt-2 text-[10px] text-gray-300 font-medium tracking-wide">
        {diagnostic.session} · {chatId.slice(0, 8)}
      </p>
    </div>
  );
}
