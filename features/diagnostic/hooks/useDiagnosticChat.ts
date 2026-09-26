"use client";

import { getSocket } from "@/features/diagnostic/lib/socket";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import type {
  AssessmentResult,
  ChatMessage,
  ChatOption,
  ChatReport,
  ConnectionStatus,
} from "../types";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

type BackendButton = {
  id: string;
  label: string;
  label_fr?: string;
  label_derja?: string;
  label_ar?: string;
  score: number;
};

type BackendReportContent = {
  asrs: AssessmentResult;
  bipolar: AssessmentResult;
  psychosis: AssessmentResult;
  raw_scores?: Record<string, number>;
  report_text?: string;
  summary?: string;
  recommendation?: string;
};

type BackendResponse = {
  session_id?: string;
  message?: string;
  buttons?: BackendButton[];
  question_id?: string;
  test_id?: string;
  show_report?: boolean;
  report_content?: BackendReportContent;
  stage?: string;
  language?: string;
};

type BackendQuestion = {
  message?: string;
  buttons?: BackendButton[];
  question_id?: string;
  test_id?: string;
};

type BackendReport = {
  message?: string;
  report_content?: BackendReportContent | string;
};

const REPORT_RECOMMENDATION = {
  fr: "Ce résultat est un dépistage d'orientation, pas un diagnostic médical. Pour une évaluation fiable, partage ces résultats avec un professionnel de santé mentale.",
  en: "This result is an orientation screening, not a medical diagnosis. For a reliable evaluation, share these results with a mental health professional.",
  derja: "هاذي غربلة توجيهية، موش تشخيص طبي. باش التقييم يكون اثبت، وري النتائج لمختص في الصحة النفسية.",
};

function mapOptions(
  buttons: BackendButton[] | undefined,
  questionId?: string,
  testId?: string,
): ChatOption[] | undefined {
  if (!buttons?.length) return undefined;

  return buttons.map((button) => ({
    id: button.id,
    label: button.label,
    labelEn: button.label,
    labelFr: button.label_fr,
    labelDerja: button.label_derja,
    labelAr: button.label_ar,
    value: button.id,
    score: button.score,
    questionId,
    testId,
  }));
}

function scoreLine(label: string, result: AssessmentResult) {
  return `${label}: ${result.score}/${result.max} - ${result.prediction}`;
}

function extractReportFromText(content: string, language = "fr"): ChatReport | null {
  const labels = {
    fr: ["TDAH", "Trouble bipolaire", "Risque psychotique"],
    en: ["ADHD", "Bipolar disorder", "Psychosis risk"],
    derja: ["تشتّت الانتباه", "ثنائي القطب", "خطر الذهان"],
  }[language as "fr" | "en" | "derja"] || ["TDAH", "Trouble bipolaire", "Risque psychotique"];

  const scoreMatches = [...content.matchAll(/(?:ADHD|TDAH|Bipolar|Bipolaire|Psychosis|Psychotique|الانتباه|القطب|الذهان)[^0-9]*(\d+)\s*\/\s*(\d+)/gi)];
  if (scoreMatches.length < 3) return null;

  const [asrsMatch, bipolarMatch, psychosisMatch] = scoreMatches;
  const asrs = { score: Number(asrsMatch[1]), max: Number(asrsMatch[2]), prediction: labels[0] };
  const bipolar = { score: Number(bipolarMatch[1]), max: Number(bipolarMatch[2]), prediction: labels[1] };
  const psychosis = { score: Number(psychosisMatch[1]), max: Number(psychosisMatch[2]), prediction: labels[2] };

  return normalizeReport({ asrs, bipolar, psychosis, report_text: content }, language);
}

function normalizeReport(content?: BackendReportContent | string, language = "fr"): ChatReport | null {
  if (!content) return null;
  if (typeof content === "string") return extractReportFromText(content, language);

  const labels = {
    fr: ["TDAH", "Trouble bipolaire", "Risque psychotique"],
    en: ["ADHD", "Bipolar disorder", "Psychosis risk"],
    derja: ["تشتّت الانتباه", "ثنائي القطب", "خطر الذهان"],
  }[language as "fr" | "en" | "derja"] || ["TDAH", "Trouble bipolaire", "Risque psychotique"];

  if (!content.asrs || !content.bipolar || !content.psychosis) return null;

  const scored = [
    { label: labels[0], value: content.asrs },
    { label: labels[1], value: content.bipolar },
    { label: labels[2], value: content.psychosis },
  ];
  const top = [...scored].sort(
    (a, b) => b.value.score / b.value.max - a.value.score / a.value.max,
  )[0];

  return {
    primary: top.label,
    confidence: `${top.value.score}/${top.value.max}`,
    summary: content.summary || scored.map((item) => scoreLine(item.label, item.value)).join("\n"),
    signals: scored.map((item) => scoreLine(item.label, item.value)),
    recommendation:
      content.recommendation ||
      REPORT_RECOMMENDATION[language as "fr" | "en" | "derja"] || REPORT_RECOMMENDATION.fr,
    reportText: content.report_text,
    assessments: {
      asrs: content.asrs,
      bipolar: content.bipolar,
      psychosis: content.psychosis,
    },
    rawScores: content.raw_scores,
  };
}

function makeServerMessageId(data: BackendResponse | BackendQuestion) {
  if (data.question_id) return `question-${data.question_id}`;
  if ("show_report" in data && data.show_report) return "report-summary";
  return `response-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useDiagnosticChat(
  initialSessionId?: string | null,
  token?: string | null,
  language = "fr",
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [isSending, setIsSending] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ChatReport | null>(null);
  const [activeOptions, setActiveOptions] = useState<ChatOption[] | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const sessionRef = useRef<string | null>(initialSessionId || null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const messageIdsRef = useRef<Set<string>>(new Set());
  const activeOptionsRef = useRef<ChatOption[] | null>(null);
  const currentQuestionRef = useRef<{ questionId?: string; testId?: string }>({});

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    activeOptionsRef.current = activeOptions;
  }, [activeOptions]);

  const buildConversationHistory = useCallback((): ConversationMessage[] => {
    return messagesRef.current
      .filter((message) => message.id !== "welcome")
      .map((message) => ({
        role: message.role,
        content: message.content,
        timestamp: message.createdAt,
      }));
  }, []);

  const addUserMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const addAssistantMessage = useCallback((data: BackendResponse | BackendQuestion) => {
    if (!data.message) return;

    const id = makeServerMessageId(data);
    if (messageIdsRef.current.has(id)) return;
    messageIdsRef.current.add(id);

    const options = mapOptions(data.buttons, data.question_id, data.test_id);
    if (data.question_id || data.test_id) {
      currentQuestionRef.current = {
        questionId: data.question_id,
        testId: data.test_id,
      };
    }

    setMessages((prev) => [
      ...prev,
      {
        id,
        role: "assistant",
        content: data.message || "",
        options,
        createdAt: new Date().toISOString(),
      },
    ]);

    setActiveOptions(options || null);
  }, []);

  const handleBackendResponse = useCallback(
    (data: BackendResponse) => {
      if (data.session_id) {
        setSessionId(data.session_id);
        sessionRef.current = data.session_id;
      }

      addAssistantMessage(data);

      if (data.show_report) {
        const normalized = normalizeReport(data.report_content, data.language || language);
        if (normalized) setReport(normalized);
        setActiveOptions(null);
      }

      setIsBotTyping(false);
      setIsSending(false);
      setError(null);
    },
    [addAssistantMessage, language],
  );

  // Keep callbacks updated with refs to avoid useEffect re-runs
  const callbacksRef = useRef({
    handleBackendResponse,
    addAssistantMessage,
    buildConversationHistory,
  });

  useEffect(() => {
    callbacksRef.current = {
      handleBackendResponse,
      addAssistantMessage,
      buildConversationHistory,
    };
  }, [handleBackendResponse, addAssistantMessage, buildConversationHistory]);

  const postToApi = useCallback(
    async (body: Record<string, unknown>) => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || data.message || "Diagnostic API unavailable");
        }

        handleBackendResponse(data);
      } catch (apiError) {
        setConnectionStatus("error");
        setError(apiError instanceof Error ? apiError.message : "Diagnostic API unavailable");
        setIsBotTyping(false);
        setIsSending(false);
      }
    },
    [handleBackendResponse],
  );

  const sendMessage = useCallback(
    (content: string) => {
      const msg = content.trim();
      const socket = socketRef.current;

      if (!sessionRef.current || !msg || isSending) return;

      const history = buildConversationHistory();
      addUserMessage(msg);
      setIsSending(true);
      setIsBotTyping(true);
      setActiveOptions(null);

      if (!socket?.connected) {
        void postToApi({
          action: "message",
          sessionId: sessionRef.current,
          message: msg,
          language,
          conversationHistory: history,
        });
        return;
      }

      socket.emit("chat:message", {
        message: msg,
        language,
        conversation_history: history,
      });
    },
    [addUserMessage, buildConversationHistory, isSending, language, postToApi],
  );

  const sendButtonClick = useCallback(
    (value: string, label: string) => {
      const socket = socketRef.current;
      const option = activeOptionsRef.current?.find((item) => item.value === value);
      const questionId = option?.questionId || currentQuestionRef.current.questionId;
      const testId = option?.testId || currentQuestionRef.current.testId || "COMBINED";

      if (!sessionRef.current || isSending || !questionId) return;

      addUserMessage(label);
      setIsSending(true);
      setIsBotTyping(true);
      setActiveOptions(null);

      if (!socket?.connected) {
        void postToApi({
          action: "button",
          sessionId: sessionRef.current,
          questionId,
          testId,
          buttonId: option?.id || value,
          score: option?.score ?? 0,
          language,
          conversationHistory: buildConversationHistory(),
        });
        return;
      }

      socket.emit("chat:button", {
        question_id: questionId,
        test_id: testId,
        button_id: option?.id || value,
        score: option?.score ?? 0,
        language,
        conversation_history: buildConversationHistory(),
      });
    },
    [addUserMessage, buildConversationHistory, isSending, language, postToApi],
  );

  const createNewSession = useCallback(() => {
    const socket = socketRef.current;

    setMessages([]);
    setSessionId(null);
    sessionRef.current = null;
    setIsSending(false);
    setIsBotTyping(false);
    setError(null);
    setReport(null);
    setActiveOptions(null);
    messageIdsRef.current.clear();
    currentQuestionRef.current = {};

    if (socket?.connected) {
      socket.emit("chat:reset");
    }
  }, []);

  useEffect(() => {
    const sid = initialSessionId;
    if (!sid) return;

    let isActive = true;
    sessionRef.current = sid;

    const socket = getSocket({ sessionId: sid, token });
    socketRef.current = socket;

    if (socket.connected) {
      queueMicrotask(() => {
        if (!isActive) return;
        setConnectionStatus("connected");
        setError(null);
      });
      return () => {
        isActive = false;
        socket.disconnect();
        socketRef.current = null;
      };
    }

    const onConnect = () => {
      setConnectionStatus("connected");
      setError(null);
    };

    const onConnected = (data: { sessionId?: string }) => {
      if (!data.sessionId) return;
      setSessionId(data.sessionId);
      sessionRef.current = data.sessionId;
    };

    const onDisconnect = () => {
      setConnectionStatus("disconnected");
    };

    const onConnectError = () => {
      setConnectionStatus("error");
      setError("Cannot reach the chat websocket. Please verify the API is running.");
    };

    const onReconnectAttempt = () => {
      setConnectionStatus("connecting");
    };

    const onReconnectFailed = () => {
      setConnectionStatus("error");
    };

    const onResponse = (data: BackendResponse) => {
      callbacksRef.current.handleBackendResponse(data);
    };

    const onQuestion = (data: BackendQuestion) => {
      callbacksRef.current.addAssistantMessage(data);
      setIsBotTyping(false);
      setIsSending(false);
    };

    const onReport = (data: BackendReport) => {
      if (data.message) callbacksRef.current.addAssistantMessage({ message: data.message, show_report: true });
      const normalized = normalizeReport(data.report_content, language);
      if (normalized) setReport(normalized);
      setIsBotTyping(false);
      setIsSending(false);
      setActiveOptions(null);
    };

    const onErrorEvent = (data: { message?: string; detail?: string }) => {
      setError(data.detail || data.message || "An error occurred");
      setIsBotTyping(false);
      setIsSending(false);
      setActiveOptions(null);
    };

    socket.on("connect", onConnect);
    socket.on("connected", onConnected);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.io.on("reconnect_failed", onReconnectFailed);
    socket.on("chat:response", onResponse);
    socket.on("chat:question", onQuestion);
    socket.on("chat:report", onReport);
    socket.on("chat:error", onErrorEvent);

    queueMicrotask(() => {
      if (isActive) {
        setConnectionStatus("connecting");
        socket.connect();
      }
    });

    return () => {
      isActive = false;
      socket.off("connect", onConnect);
      socket.off("connected", onConnected);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.io.off("reconnect_failed", onReconnectFailed);
      socket.off("chat:response", onResponse);
      socket.off("chat:question", onQuestion);
      socket.off("chat:report", onReport);
      socket.off("chat:error", onErrorEvent);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [initialSessionId, token, language]);

  return {
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
  };
}
