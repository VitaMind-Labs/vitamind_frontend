"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { createChatId } from "@/lib/chat";
import {
  speakDiagnosticText,
  stopDiagnosticVoice,
  warmUpDiagnosticVoice,
} from "@/lib/diagnosticVoice";
import { useDiagnosticChat, type ChatMessage, type ChatReport } from "@/hooks/useDiagnosticChat";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatResult } from "./ChatResult";

const RESULT_REVEAL_DELAY_MS = 10000;

export function ChatExperience({ chatId }: { chatId: string }) {
  const router = useRouter();
  const { dictionary, language, direction } = useLanguage();
  const diagnostic = dictionary.diagnostic;
  const { isSoundEnabled } = useAudio();

  const [token] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("vitamind_token");
  });
  const [input, setInput] = useState("");
  const [visibleReport, setVisibleReport] = useState<ChatReport | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const spokenWelcomeRef = useRef<string | null>(null);
  const spokenReportRef = useRef<string | null>(null);

  const {
    messages,
    sessionId,
    isSending,
    isBotTyping,
    connectionStatus,
    error,
    report,
    activeOptions,
    sendMessage,
    sendButtonClick,
    createNewSession,
  } = useDiagnosticChat(chatId, token, language);

  const displayMessages: ChatMessage[] =
    messages.length === 0
      ? [{ id: "welcome", role: "assistant", content: diagnostic.welcome, createdAt: new Date().toISOString() }]
      : messages;
  const resolvedReport = visibleReport === report ? visibleReport : null;
  const isPreparingReport = Boolean(report && !resolvedReport);

  useEffect(() => {
    const welcomeKey = `${language}:${diagnostic.welcome}`;
    if (!isSoundEnabled) {
      stopDiagnosticVoice();
      return;
    }
    if (spokenWelcomeRef.current === welcomeKey) return;
    spokenWelcomeRef.current = welcomeKey;
    warmUpDiagnosticVoice();
    const timeout = setTimeout(() => {
      void speakDiagnosticText(diagnostic.welcome, language);
    }, 600);
    return () => { clearTimeout(timeout); };
  }, [diagnostic.welcome, isSoundEnabled, language]);

  useEffect(() => {
    if (!isSoundEnabled) {
      stopDiagnosticVoice();
      return;
    }
    if (!visibleReport) return;
    const reportKey = `${sessionId || chatId}:${language}`;
    if (spokenReportRef.current === reportKey) return;
    spokenReportRef.current = reportKey;

    const reportText = [
      diagnostic.closing,
      visibleReport.summary,
      visibleReport.recommendation,
    ]
      .filter(Boolean)
      .join(". ");

    void speakDiagnosticText(reportText, language);
  }, [chatId, diagnostic.closing, isSoundEnabled, language, sessionId, visibleReport]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isBotTyping, report, visibleReport]);

  useEffect(() => {
    if (!report) return;
    const timeout = setTimeout(() => {
      setVisibleReport(report);
    }, RESULT_REVEAL_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [report]);

  function handleSend() {
    const text = input.trim();
    if (!text || isSending || isPreparingReport) return;
    warmUpDiagnosticVoice();
    setInput("");
    sendMessage(text);
  }

  function handleOptionClick(value: string, label: string) {
    if (isPreparingReport) return;
    warmUpDiagnosticVoice();
    sendButtonClick(value, label);
  }

  function handleRestart() {
    stopDiagnosticVoice();
    router.replace(`/diagnostic?chatId=${createChatId()}`);
    createNewSession();
    setVisibleReport(null);
    setInput("");
    spokenWelcomeRef.current = null;
    spokenReportRef.current = null;
  }

  return (
    <div
      dir={direction}
      className="relative w-full min-h-[100dvh] overflow-x-hidden text-gray-700"
    >
    

      {!resolvedReport ? (
        <div className="relative z-10 mx-auto flex h-[100dvh] w-full flex-col px-3 sm:px-5 pt-20 sm:pt-24 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="chat-view"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-1 flex-col min-h-0"
            >
              <ChatMessages
                scrollRef={scrollRef}
                messages={messages}
                displayedMessages={displayMessages}
                isTyping={isBotTyping || isPreparingReport}
                onOptionClick={handleOptionClick}
              />

              {/* Status Bar */}
              <div className="flex-shrink-0 space-y-2 px-1">
                {(error || connectionStatus === "connecting" || connectionStatus === "disconnected") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white/70 px-4 py-2.5 text-center text-xs font-medium text-gray-400 shadow-sm backdrop-blur-md"
                  >
                    {error || (connectionStatus === "connecting" ? "Connexion à MIRA..." : "Connexion interrompue, tentative de reprise...")}
                  </motion.div>
                )}
                {isPreparingReport && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-lg rounded-2xl border border-primary/10 bg-primary/[0.03] px-4 py-2.5 text-center text-xs font-medium text-primary shadow-sm backdrop-blur-md"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2" />
                    Analyse des réponses en cours. La synthèse clinique apparaîtra dans quelques secondes.
                  </motion.div>
                )}
              </div>

              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                loading={isSending || isPreparingReport}
                chatId={sessionId || chatId}
                options={isPreparingReport ? null : activeOptions}
                onOptionClick={handleOptionClick}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="relative z-10 min-h-screen pt-24 sm:pt-28 pb-12 px-3 sm:px-5">
          <ChatResult
            result={resolvedReport}
            chatId={sessionId || chatId}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
}