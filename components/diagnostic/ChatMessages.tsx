"use client";

import { Sparkles, Bot, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { TypingIndicator } from "./TypingIndicator";

type Message = { role: "user" | "assistant"; content: string };

interface ChatMessagesProps {
  messages: Message[];
  displayedMessages: Message[];
  isTyping: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ messages, displayedMessages, isTyping, scrollRef }: ChatMessagesProps) {
  const { dictionary } = useLanguage();
  const diagnostic = dictionary.diagnostic;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto pb-4 scrollbar-hide space-y-6 px-2 md:px-4"
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
          <div className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 max-w-2xl mx-auto">
            <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              {diagnostic.welcome}
            </span>
          </div>
          <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            {diagnostic.panelPoints[0]}
          </p>
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto space-y-5">
        <AnimatePresence initial={false}>
          {displayedMessages.map((message, index) => (
            index > 0 && (
              <motion.div
                key={`${message.role}-${index}`}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm"
                  }`}
                >
                  {message.content}
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center shadow-sm">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          ))}
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
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-2 py-2 shadow-sm">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}