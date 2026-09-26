"use client";

/**
 * LEGACY PROCESSING PHASE — PRESERVED BUT INACTIVE.
 * Button-based ChatExperience (useDiagnosticChat). Kept intact; NOT rendered by
 * DiagnosticPageClient in the active Mira flow (see MiraChatExperience).
 * 
 * Updated to match premium design aesthetics while preserving functionality.
 */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAudio } from "@/contexts/AudioContext";
import { createChatId } from "../lib/chat";
import {
  speakDiagnosticText,
  stopDiagnosticVoice,
  warmUpDiagnosticVoice,
} from "../lib/voice";
import { useDiagnosticChat } from "../hooks/useDiagnosticChat";
import type { ChatMessage, ChatReport } from "../types";
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
      {/* Premium atmosphere background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#f4f6f5]" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 start-[-10%] h-[560px] w-[560px] rounded-full blur-[140px]"
          style={{ background: "rgba(81,133,145,0.08)" }}
        />
        <motion.div
          animate={{ x: [0, -36, 0], y: [0, 28, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] end-[-8%] h-[620px] w-[620px] rounded-full blur-[150px]"
          style={{ background: "rgba(125,168,158,0.10)" }}
        />
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute top-[12%] h-[280px] w-[130%] opacity-[0.25]"
          animate={{ x: ["0%", "-12%", "0%"] }}
          transition={{ duration: 44, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M0,160 C240,90 420,230 720,150 C1020,70 1200,200 1440,130"
            fill="none"
            stroke="rgba(81,133,145,0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M0,200 C260,130 460,260 740,190 C1020,120 1220,230 1440,170"
            fill="none"
            stroke="rgba(125,168,158,0.10)"
            strokeWidth="1.5"
          />
        </motion.svg>
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute bottom-[6%] h-[240px] w-[130%] opacity-[0.20]"
          animate={{ x: ["-8%", "4%", "-8%"] }}
          transition={{ duration: 52, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M0,140 C220,210 480,80 760,160 C1040,240 1240,110 1440,180"
            fill="none"
            stroke="rgba(81,133,145,0.10)"
            strokeWidth="1.5"
          />
        </motion.svg>
      </div>

      {!resolvedReport ? (
        <div className="relative z-10 mx-auto flex h-[100dvh] w-full max-w-4xl flex-col px-3 sm:px-5 pt-20 sm:pt-24 pb-4">
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
                    {error || (connectionStatus === "connecting" ? diagnostic.reconnecting : diagnostic.connectionLost)}
                  </motion.div>
                )}
                {isPreparingReport && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-lg rounded-2xl border border-primary/10 bg-primary/[0.03] px-4 py-2.5 text-center text-xs font-medium text-primary shadow-sm backdrop-blur-md"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2" />
                    {diagnostic.thinking}
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
