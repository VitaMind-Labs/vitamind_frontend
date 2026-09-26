import type { Lang } from "@/lib/i18n/config";

export type MiraChapter = "MORNING" | "MIDDAY" | "EVENING" | "INNER_VOICE" | "COMPLETE" | "SAFETY";

export type MiraSafety = {
  level: "routine" | "urgent";
  flags: string[];
};

export type MiraAssessmentResult = {
  assessment_complete: boolean;
  recommended_pathway: string;
  match_strength: "LOW" | "MODERATE" | "HIGH";
  condition_scores: Record<string, number>;
  supporting_features: string[];
  contradictory_features: string[];
  other_signals: string[];
  missing_information: string[];
  safety: MiraSafety;
  recommended_test?: string | null;
  requires_clinician_review: boolean;
  orientation: string;
  disclaimer: string;
  language: Lang;
};

export type MiraMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  chapter?: MiraChapter;
  createdAt: string;
};

export type ChatOption = {
  id: string;
  label: string;
  labelEn?: string;
  labelFr?: string;
  labelDerja?: string;
  labelAr?: string;
  value: string;
  score: number;
  questionId?: string;
  testId?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  options?: ChatOption[];
  createdAt: string;
};

export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export type AssessmentResult = {
  score: number;
  max: number;
  prediction: string;
  positive_items?: number;
};

export type ChatReport = {
  primary: string;
  confidence: string;
  summary: string;
  signals: string[];
  recommendation: string;
  reportText?: string;
  assessments: {
    asrs: AssessmentResult;
    bipolar: AssessmentResult;
    psychosis: AssessmentResult;
  };
  rawScores?: Record<string, number>;
};
