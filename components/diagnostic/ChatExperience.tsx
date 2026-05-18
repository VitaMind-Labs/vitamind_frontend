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
      className="relative w-full bg-transparent text-on-background overflow-x-hidden"
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-tertiary/15 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-surface/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(187,27%,40%,0.06),transparent_25%),radial-gradient(circle_at_80%_15%,hsl(45,93%,47%,0.04),transparent_20%)]" />
        <div className="grain-overlay absolute inset-0 opacity-[0.03]" />
      </div>

      {!resolvedReport ? (
        <div className="relative z-10 mx-auto flex h-[100dvh] max-w-7xl flex-col px-4 sm:px-6 lg:px-8 pt-24 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="chat-view"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-1 flex-col min-h-0"
            >
              <ChatMessages
                scrollRef={scrollRef}
                messages={messages}
                displayedMessages={displayMessages}
                isTyping={isBotTyping || isPreparingReport}
                onOptionClick={handleOptionClick}
              />
              {(error || connectionStatus === "connecting" || connectionStatus === "disconnected") && (
                <div className="mx-auto mb-2 max-w-2xl rounded-xl border border-primary/15 bg-white/80 px-4 py-2 text-center text-xs font-medium text-on-background/60 shadow-sm backdrop-blur-sm">
                  {error || (connectionStatus === "connecting" ? "Connexion a MIRA..." : "Connexion interrompue, tentative de reprise...")}
                </div>
              )}
              {isPreparingReport && (
                <div className="mx-auto mb-2 max-w-2xl rounded-xl border border-[#475569]/30 bg-black/70 px-4 py-2 text-center text-xs font-medium text-white/60 shadow-sm backdrop-blur-sm">
                  Analyse des reponses en cours. La synthese clinique apparaitra dans quelques secondes.
                </div>
              )}
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
        <div className="relative z-10 min-h-screen pt-28 pb-12">
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
