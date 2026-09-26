"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copy, type Lang } from "@/lib/i18n/config";
import type { MiraAssessmentResult, MiraChapter, MiraMessage, MiraSafety } from "../types";

type StartResponse = {
  session_id: string;
  chapter: MiraChapter;
  assistant_message: string;
  language: Lang;
};

type SendResponse = {
  assistant_message: string;
  chapter: MiraChapter;
  chapter_progress: number;
  assessment_complete: boolean;
  safety: MiraSafety;
  result?: MiraAssessmentResult | null;
  language: Lang;
};

type SessionResponse = {
  session_id: string;
  chapter: MiraChapter;
  chapter_progress: number;
  assessment_complete: boolean;
  complete: boolean;
  safety: MiraSafety;
  result: MiraAssessmentResult | null;
  assistant_message: string | null;
  language: Lang;
};

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * useMiraChat — ACTIVE diagnostic hook.
 *
 * Talks REST-only to the Next proxy `/api/mira` (actions: start | message),
 * which forwards to Nest `MiraController` (`/mira/*`), which forwards to the
 * official Mira AI service (`/api/v1/mira/*`).
 *
 * It never uses the legacy processing-phase path: no socket.io `/chat`
 * namespace, no `POST /api/chat` button flow, no `show_report`/`question_id`
 * payloads. That legacy flow stays implemented in `useDiagnosticChat` +
 * `ChatExperience`/`ChatResult` as preserved-but-inactive code.
 */
export function useMiraChat(chatId?: string | null, lang: Lang = "en") {
  const errors = copy[lang].diagnostic.errors;
  const storageKey = chatId ? `vitamind-mira-session:${chatId}` : null;
  const [messages, setMessages] = useState<MiraMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chapter, setChapter] = useState<MiraChapter>("MORNING");
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [safety, setSafety] = useState<MiraSafety>({ level: "routine", flags: [] });
  const [result, setResult] = useState<MiraAssessmentResult | null>(null);
  const [sessionLanguage, setSessionLanguage] = useState<Lang | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  const sessionRef = useRef<string | null>(null);
  const sessionLanguageRef = useRef<Lang | null>(null);
  const startedRef = useRef(false);

  const pushAssistant = useCallback((content: string, msgChapter?: MiraChapter) => {
    setMessages((prev) => [
      ...prev,
      { id: uid("mira"), role: "assistant", content, chapter: msgChapter, createdAt: new Date().toISOString() },
    ]);
  }, []);

  const start = useCallback(async (requestedLanguage: Lang = lang) => {
    if (startedRef.current || isStarting) return;
    startedRef.current = true;
    setIsStarting(true);
    setIsBotTyping(true);
    setError(null);
    try {
      const response = await fetch("/api/mira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", language: requestedLanguage }),
      });
      const data = (await response.json()) as StartResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || copy[requestedLanguage].diagnostic.errors.start);
      sessionRef.current = data.session_id;
      sessionLanguageRef.current = data.language;
      setSessionLanguage(data.language);
      setSessionReady(true);
      if (storageKey) window.localStorage.setItem(storageKey, data.session_id);
      setSessionId(data.session_id);
      setChapter(data.chapter);
      setProgress(0);
      pushAssistant(data.assistant_message, data.chapter);
    } catch (err) {
      startedRef.current = false;
      setError(err instanceof Error ? err.message : copy[requestedLanguage].diagnostic.errors.start);
    } finally {
      setIsStarting(false);
      setIsBotTyping(false);
    }
  }, [isStarting, lang, pushAssistant, storageKey]);

  useEffect(() => {
    const storedSessionId = storageKey ? window.localStorage.getItem(storageKey) : null;
    if (!storedSessionId) {
      window.setTimeout(() => void start(), 0);
      return;
    }
    sessionRef.current = storedSessionId;
    window.setTimeout(() => setSessionReady(false), 0);
    window.setTimeout(() => setSessionId(storedSessionId), 0);
    startedRef.current = true;
    void fetch(`/api/mira?sessionId=${encodeURIComponent(storedSessionId)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as SessionResponse & { error?: string };
        if (!response.ok) throw new Error(data.error || "session expired, please restart");
        sessionLanguageRef.current = data.language;
        setSessionLanguage(data.language);
        setSessionReady(true);
        setChapter(data.chapter);
        setProgress(data.chapter_progress);
        setSafety(data.safety);
        if (data.assistant_message && data.assessment_complete === false) {
          setMessages([{ id: uid("mira-resync"), role: "assistant", content: data.assistant_message, chapter: data.chapter, createdAt: new Date().toISOString() }]);
        }
        if (data.complete && data.result) setResult(data.result);
      })
      .catch(() => {
        if (storageKey) window.localStorage.removeItem(storageKey);
        sessionRef.current = null;
        sessionLanguageRef.current = null;
        setSessionLanguage(null);
        setSessionReady(false);
        setSessionId(null);
        startedRef.current = false;
        void start();
      });
  }, [start, storageKey]);

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim();
      const sid = sessionRef.current;
      const requestLanguage = sessionLanguageRef.current;
      if (!text || !sid || !requestLanguage || !sessionReady || isSending || result) return;
      setIsSending(true);
      setIsBotTyping(true);
      setError(null);
      setMessages((prev) => [
        ...prev,
        { id: uid("local"), role: "user", content: text, chapter, createdAt: new Date().toISOString() },
      ]);
      try {
        const response = await fetch("/api/mira", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "message", sessionId: sid, text, language: requestLanguage }),
        });
        const data = (await response.json()) as SendResponse & { error?: string };
        if (!response.ok) throw new Error(data.error || data.assistant_message || errors.send);
        setChapter(data.chapter);
        setProgress(data.chapter_progress);
        setSafety(data.safety);
        pushAssistant(data.assistant_message, data.chapter);
        if (data.assessment_complete && data.result) setResult(data.result);
      } catch (err) {
        setError(err instanceof Error ? err.message : errors.send);
      } finally {
        setIsSending(false);
        setIsBotTyping(false);
      }
    },
    [chapter, errors.send, isSending, pushAssistant, result, sessionReady],
  );

  const restart = useCallback((nextLanguage?: Lang) => {
    sessionRef.current = null;
    sessionLanguageRef.current = null;
    startedRef.current = false;
    setMessages([]);
    setSessionId(null);
    setChapter("MORNING");
    setProgress(0);
    setSafety({ level: "routine", flags: [] });
    setResult(null);
    setSessionLanguage(null);
    setSessionReady(false);
    setError(null);
    if (storageKey) window.localStorage.removeItem(storageKey);
    void start(nextLanguage);
  }, [start, storageKey]);

  return {
    messages,
    sessionId,
    sessionLanguage: sessionLanguage ?? lang,
    chapter,
    progress,
    isSending,
    isBotTyping,
    isStarting,
    error,
    safety,
    result,
    assessmentComplete: Boolean(result),
    sendMessage,
    restart,
  };
}
