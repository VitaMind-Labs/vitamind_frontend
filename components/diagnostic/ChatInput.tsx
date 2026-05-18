"use client";

import { useRef, useEffect } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  if (options && options.length > 0 && onOptionClick) {
    return (
      <div className="py-4 pb-4 md:pb-6 w-full flex-shrink-0">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-wrap justify-center gap-2 p-4 bg-white/70 backdrop-blur-sm border border-primary/10 rounded-2xl shadow-sm">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onOptionClick(option.value, option.label)}
                disabled={loading}
                className="px-6 py-3 rounded-xl border border-primary/25 bg-white text-primary text-sm font-medium shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center mt-3 text-xs text-on-background/40 font-medium">
          {diagnostic.session} · {chatId.slice(0, 8)}
        </p>
      </div>
    );
  }

  return (
    <div className="py-4 pb-4 md:pb-6 w-full flex-shrink-0">
      <div className="relative mx-auto max-w-2xl group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-full opacity-30 group-hover:opacity-50 transition duration-500 blur" />
        <div className="relative flex items-end gap-2 bg-surface/90 backdrop-blur-xl border border-primary/15 p-2 rounded-3xl shadow-lg shadow-primary/10 transition-all focus-within:shadow-xl focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
            placeholder={diagnostic.placeholder}
            className="max-h-32 min-h-[48px] w-full bg-transparent border-0 outline-none px-4 py-3 text-[15px] text-on-background placeholder-on-background/40 focus:outline-none focus:ring-0 resize-none leading-relaxed"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={loading || !value.trim()}
            className="mb-1 mr-1 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/90 text-white shadow-md transition-all duration-300 hover:from-primary/90 hover:to-tertiary hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <p className="text-center mt-3 text-xs text-on-background/40 font-medium">
        {diagnostic.session} · {chatId.slice(0, 8)}
      </p>
    </div>
  );
}
