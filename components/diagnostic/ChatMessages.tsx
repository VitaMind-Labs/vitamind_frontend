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
      className="flex-1 overflow-y-auto pb-4  space-y-6 px-2 md:px-4"
    >
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 px-4"
        >
          <div className="inline-block p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm mb-5">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 max-w-2xl mx-auto text-on-background">
            <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              {diagnostic.welcome}
            </span>
          </div>
          <p className="text-base text-on-background/70 max-w-xl mx-auto leading-relaxed">
            {diagnostic.panelPoints[0]}
          </p>
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto space-y-5">
        <AnimatePresence initial={false}>
          {displayedMessages.map((message, index) => {
            const content =
              message.role === "assistant"
                ? hideDiagnosticQuestionLabels(message.content)
                : message.content;

            return (
              message.id !== "welcome" && (
                <motion.div
                  key={message.id || `${message.role}-${index}`}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col"
                >
                  <div className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-sm">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${message.role === "user"
                        ? "bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white border border-[rgba(81,133,145,0.06)] text-on-background rounded-2xl rounded-tl-sm"
                        }`}
                      style={{ wordBreak: 'break-word' }}
                    >
                      {content}
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center shadow-sm">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  {message.role === "assistant" && message.options && message.options.length > 0 && onOptionClick && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-10">
                      {message.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => onOptionClick(option.value, getOptionLabel(option, language))}
                          className="px-5 py-2.5 rounded-xl border border-primary/30 bg-white text-primary text-sm font-medium shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 active:scale-95"
                        >
                          {getOptionLabel(option, language)}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start gap-2"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="bg-white border border-[rgba(81,133,145,0.06)] rounded-2xl rounded-tl-sm px-2 py-2 shadow-sm">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
