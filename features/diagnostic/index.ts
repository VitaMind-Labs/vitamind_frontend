export { DiagnosticPageClient } from "./components/DiagnosticPageClient";
export { DiagnosticHeader } from "./components/DiagnosticHeader";
export { MiraChatExperience } from "./components/MiraChatExperience";
export { MiraMessage } from "./components/MiraMessage";
export { MiraResult } from "./components/MiraResult";
export { TypingIndicator } from "./components/TypingIndicator";
export { useMiraChat } from "./hooks/useMiraChat";
export { useDiagnosticChat } from "./hooks/useDiagnosticChat";
export { createChatId } from "./lib/chat";
export { ensureDiagnosticSession, getStoredDiagnosticSessionId, storeDiagnosticSessionId } from "./lib/session";
export { speakDiagnosticText, stopDiagnosticVoice, warmUpDiagnosticVoice } from "./lib/voice";
export type {
  AssessmentResult,
  ChatMessage,
  ChatOption,
  ChatReport,
  ConnectionStatus,
  MiraAssessmentResult,
  MiraChapter,
  MiraMessage as MiraMessageData,
  MiraSafety,
} from "./types";
