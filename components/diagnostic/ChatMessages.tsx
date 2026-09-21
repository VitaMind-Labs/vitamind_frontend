"use client";

import { Sparkles, Bot, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage, ChatOption } from "@/hooks/useDiagnosticChat";
import type { Lang } from "@/lib/i18n";

interface ChatMessagesProps {
  messages: ChatMessage[];
  displayedMessages: ChatMessage[];
  isTyping: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onOptionClick?: (value: string, label: string) => void;
}

const DIAGNOSTIC_LABEL_PATTERN =
  /(TDAH|ADHD|Trouble\s+Bipolaire|Trouble\s+bipolaire|Trouble\s+bi?polaire|Bipolarite|Bipolarité|Bipolar|Risque\s+Psychotique|Risque\s+psychotique|Risque\s+psychose|Psychosis|Psychose)/gi;

function hideDiagnosticQuestionLabels(content: string) {
  return content
    .replace(new RegExp(`\\[\\s*${DIAGNOSTIC_LABEL_PATTERN.source}\\s*\\]\\s*`, "gi"), "")
    .split("\n")
    .map((line) =>
      line.replace(new RegExp(`^\\s*${DIAGNOSTIC_LABEL_PATTERN.source}\\s*[:\\-–—]\\s*`, "i"), ""),
    )
    .join("\n")
    .trim();
}

function getOptionLabel(option: ChatOption, language: Lang) {
  if (language === "derja") return option.labelDerja || option.labelAr || option.label;
  if (language === "fr") return option.labelFr || option.label;
  return option.labelEn || option.label;
}

export function ChatMessages({ messages, displayedMessages, isTyping, scrollRef, onOptionClick }: ChatMessagesProps) {
  const { dictionary, language } = useLanguage();
  const diagnostic = dictionary.diagnostic;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto pb-4 space-y-6 px-1 sm:px-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
    >
      {/* Welcome State */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-center py-12 sm:py-16 px-4"
        >
          <div className="inline-flex p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight mb-3 max-w-lg mx-auto leading-snug text-gray-800">
            {diagnostic.welcome}
          </h1>
          <p className="text-sm sm:text-[15px] text-gray-400 max-w-md mx-auto leading-relaxed font-medium">
            {diagnostic.panelPoints?.[0] || "Le chat recueille quelques réponses guidées."}
          </p>
        </motion.div>
      )}

      {/* Messages List */}
      <div className="max-w-5xl mx-auto space-y-5">
        <AnimatePresence initial={false}>
          {displayedMessages.map((message, index) => {
            const content =
              message.role === "assistant"
                ? hideDiagnosticQuestionLabels(message.content)
                : message.content;

            if (message.id === "welcome") return null;

            return (
              <motion.div
                key={message.id || `${message.role}-${index}`}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col"
              >
                <div className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"} gap-2.5 sm:gap-3 items-end`}>
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 mb-0.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-sm ring-2 ring-white">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[75%] px-4 py-3 sm:px-5 sm:py-3.5 text-[15px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-[20px] rounded-br-md shadow-primary/10"
                        : "bg-white/80 border border-gray-100/80 text-gray-700 rounded-[20px] rounded-bl-md shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm"
                      }`}
                    style={{ wordBreak: "break-word" }}
                  >
                    {content}
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 mb-0.5">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shadow-sm ring-2 ring-white">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Options Buttons */}
                {message.role === "assistant" && message.options && message.options.length > 0 && onOptionClick && (
                  <div className="flex flex-wrap gap-2 mt-3 ml-11 sm:ml-12">
                    {message.options.map((option) => (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        key={option.value}
                        type="button"
                        onClick={() => onOptionClick(option.value, getOptionLabel(option, language))}
                        className="px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl border border-gray-200 bg-white/90 text-gray-600 text-sm font-medium shadow-sm hover:border-primary/30 hover:bg-primary hover:text-white hover:shadow-md transition-all duration-300 backdrop-blur-sm"
                      >
                        {getOptionLabel(option, language)}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex justify-start gap-2.5 sm:gap-3 items-end"
            >
              <div className="flex-shrink-0 mb-0.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-sm ring-2 ring-white">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="bg-white/80 border border-gray-100/80 rounded-[20px] rounded-bl-md px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-6" />
    </div>
  );
}