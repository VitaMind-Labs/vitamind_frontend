"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowUp, Loader2, Paperclip, Mic } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import type { ChatOption } from "../types";

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
               <Button
                 key={option.value}
                 type="button"
                 variant="outline"
                 onClick={() => onOptionClick(option.value, option.label)}
                 disabled={loading}
                 className="rounded-xl px-4 py-2.5 text-sm text-gray-600 shadow-sm backdrop-blur-sm hover:bg-primary hover:text-white sm:px-5"
               >
                 {option.label}
               </Button>
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
           <Button
             type="button"
             variant="ghost"
             size="icon"
             onClick={() => setShowToast(true)}
             className="ms-0.5 h-9 w-9 shrink-0 text-gray-400 hover:text-primary"
             title={diagnostic.inputLabel}
             aria-label={diagnostic.inputLabel}
           >
             <Paperclip className="h-4.5 w-4.5" />
           </Button>

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
             <Button
               type="button"
               variant="ghost"
               size="icon"
               onClick={handleVoiceClick}
               className="h-9 w-9 text-gray-400 hover:text-primary"
               title={diagnostic.unmute}
               aria-label={diagnostic.unmute}
             >
               <Mic className="h-4.5 w-4.5" />
             </Button>

            {/* Send */}
             <Button
               type="button"
               variant="default"
               size="icon"
               onClick={onSend}
               disabled={loading || !value.trim()}
               className="me-0.5 h-9 w-9 shadow-md sm:h-10 sm:w-10"
             >
              {loading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
               ) : (
                 <ArrowUp className="h-4.5 w-4.5" />
               )}
             </Button>
          </div>
        </div>
      </div>

      <p className="text-center mt-2 text-[10px] text-gray-300 font-medium tracking-wide">
        {diagnostic.session} · {chatId.slice(0, 8)}
      </p>
    </div>
  );
}
