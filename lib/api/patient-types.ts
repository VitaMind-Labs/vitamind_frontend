/** Response shapes of `/api/v1/me/*` (vitamind_backend/apps/api/src/modules/patient). */

export type PatientTrack = "ADHD" | "BIPOLAR" | "SCHIZOPHRENIA" | "UNSPECIFIED";
export type SafetyLevel = "NORMAL" | "ELEVATED" | "CRISIS";
export type Trend = "UP" | "DOWN" | "STEADY" | "UNKNOWN";
export type Confidence = "INSUFFICIENT" | "EMERGING" | "ESTABLISHED";

export type Profile = {
  id: string;
  nickname: string;
  /** The name the patient asked Lumina to use (from onboarding), when given. */
  preferredName?: string | null;
  email: string;
  language: "EN" | "AR";
  track: PatientTrack;
  hasCompletedOnboarding: boolean;
  hasLuminaAccess: boolean;
  /** Spark (the ADHD assistant) is offered on the ADHD track only - the backend decides and enforces it. */
  hasSpark: boolean;
  memberSince: string;
  subscription: { status: "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUSPENDED"; planId: string | null; trialEndDate: string | null; endDate: string | null };
  careTeam: { hasClinician: boolean; count: number };
};

export type Checkin = {
  id: string;
  checkinDate: string;
  moodScore: number;
  energyLevel: number | null;
  anxietyLevel: number | null;
  sleepHours: number | null;
  focusLevel: number | null;
  routineStability: number | null;
  socialConnection: number | null;
  taskCompletion: number | null;
  medicationTaken: boolean | null;
  luminaMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CheckinItemKey = "mood" | "energy" | "stress" | "sleep" | "focus" | "tasks" | "routine" | "social" | "medication";
export type CheckinField =
  | "moodScore" | "energyLevel" | "anxietyLevel" | "sleepHours" | "focusLevel"
  | "taskCompletion" | "routineStability" | "socialConnection" | "medicationTaken";
export type CheckinAdaptation =
  | "FIRST_CHECKIN" | "WELCOME_BACK" | "SLEEP_LOW_YESTERDAY" | "STRESS_HIGH_YESTERDAY"
  | "MOOD_LOW_YESTERDAY" | "MOOD_GOOD_YESTERDAY" | "STREAK";

export type CheckinPlan = {
  date: string;
  track: PatientTrack;
  streak: number;
  items: { key: CheckinItemKey; field: CheckinField; required: boolean; reason: "CORE" | "TRACK" | "MEDICATION" }[];
  adaptations: CheckinAdaptation[];
  yesterday: { mood: number; sleepHours: number | null; stress: number | null } | null;
  hasLuminaAccess: boolean;
  alreadyCheckedIn: boolean;
  prefill: Checkin | null;
};

export type CheckinResult = {
  checkin: Checkin;
  lumina: {
    status: "OK" | "UNAVAILABLE";
    message: string | null;
    interactionId?: string;
    strategy?: string | null;
    interventionId?: string | null;
    safetyLevel?: SafetyLevel;
    replayed?: boolean;
  };
};

/** Everyday cues Lumina may show a patient (the agent's safety categories never leave the backend). */
export type PatientCue = "anxiety" | "overload" | "sadness" | "elevated";
export type JournalFollowUp = "task_initiation" | "stress_reduction" | "mood" | "sleep_consistency" | "grounding";

export type JournalAnalysisSummary = {
  current: boolean;
  safetyLevel: SafetyLevel;
  cues: PatientCue[];
  /** The entry sounded like a hard moment: the client answers with support, never a category name. */
  heavy: boolean;
  followUps: JournalFollowUp[];
  analyzedAt: string;
} | null;

export type JournalEntry = {
  id: string;
  title: string | null;
  content: string;
  entryType: "DAILY" | "EMOTIONAL" | "THERAPY" | "GRATITUDE" | "CRISIS";
  moodScore: number | null;
  goalScore: number | null;
  emotions: string[];
  tags: string[];
  isPrivate: boolean;
  contentVersion: number;
  analysisStatus: "PENDING" | "COMPLETED" | "FAILED" | "SKIPPED";
  createdAt: string;
  updatedAt: string;
  analysis: JournalAnalysisSummary;
  excerpts?: { id: string; content: string; sharedAt: string }[];
  support?: { level: SafetyLevel; emergencyResources?: string[] };
};

export type Paginated<T> = { data: T[]; meta: { page: number; limit: number; total: number; totalPages: number } };

export type SeriesPoint = { date: string; value: number };
export type InsightSignal = "MOOD_UP" | "MOOD_DOWN" | "GOALS_UP" | "GOALS_DOWN" | "STREAK" | "CONSISTENT" | "SPARSE";

export type JournalInsights = {
  range: { from: string; to: string; days: number };
  confidence: Confidence;
  totals: { entries: number; activeDays: number; currentStreak: number; longestStreak: number; consistency: number };
  mood: { average: number | null; trend: Trend; delta: number | null; series: SeriesPoint[] };
  goals: { average: number | null; trend: Trend; delta: number | null; series: SeriesPoint[] };
  emotions: { emotion: string; count: number; share: number }[];
  cues: { cue: PatientCue; count: number }[];
  hardMoments: number;
  weekly: { weekStart: string; entries: number; moodAverage: number | null; goalAverage: number | null }[];
  recent: {
    last7: { entries: number; moodAverage: number | null; goalAverage: number | null };
    previous7: { entries: number; moodAverage: number | null; goalAverage: number | null };
  };
  calendar: { date: string; entries: number; mood: number | null }[];
  signals: InsightSignal[];
  isPartial: boolean;
};

export type LuminaTurn = {
  interactionId: string;
  kind: "CHAT" | "CHECKIN" | string;
  message: string | null;
  reply: string;
  strategy: string | null;
  interventionId: string | null;
  safetyLevel: SafetyLevel;
  createdAt: string;
  replayed?: boolean;
};

export type LuminaChatReply = LuminaTurn & {
  intervention: { id: string; title: string | null; steps: string[] | null } | null;
  support: { level: SafetyLevel; emergencyResources?: string[] };
};

// ---- Spark (ADHD assistant) - `/api/v1/me/spark/*`, ADHD patients only (403 SPARK_ADHD_ONLY otherwise)
export type SparkTaskStatus = "TODO" | "DONE" | "DEFERRED";
export type SparkTask = {
  id: string;
  /** Spark's own id for the task; a turn's plan refers to it by this. */
  taskKey: string;
  title: string;
  status: SparkTaskStatus;
  scheduledDate: string | null;
  startTime: string | null;
  deadline: string | null;
  durationMinutes: number | null;
  postponedCount: number;
  completedAt: string | null;
  createdAt: string;
};
export type SparkPlan = {
  strategy: string;
  primaryTaskKey: string | null;
  nextAction: { text: string; estimatedMinutes: number | null } | null;
  secondaryTaskKeys: string[];
  day: string | null;
} | null;
export type SparkTurn = {
  id: string;
  userMessage: string | null;
  reply: string;
  intent: string | null;
  safetyLevel: string;
  plan: SparkPlan;
  focusSession: { minutes: number; successCondition: string; basis: string } | null;
  capacity: string | null;
  friction: string[];
  clarification: string | null;
  createdAt: string;
  replayed?: boolean;
};
export type SparkChatReply = SparkTurn & {
  tasks: SparkTask[];
  support: { level: SafetyLevel; emergencyResources?: string[] };
};
export type SparkState = { available: true; tasks: SparkTask[]; lastTurn: SparkTurn | null };
export type SparkOutcomeName = "DONE" | "PARTIAL" | "NOT_STARTED" | "HELPFUL" | "NOT_HELPFUL" | "TOO_HARD" | "TOO_LONG" | "TOO_EASY" | "INTERRUPTED";

export type LuminaSignal = { dimension: string; value: number | null; quality: "observed" | "estimated" | "missing" | "unknown"; source: string; raw: number | null };
export type LuminaChange = { dimension: string; direction: string; delta: number | null; certainty: string; significance: string; persistence_days: number };

export type LuminaState = {
  data: {
    snapshotDate: string;
    capacity: "HIGH" | "NORMAL" | "REDUCED" | "VERY_LOW" | "UNKNOWN" | string;
    evidenceQuality: number;
    signals: Record<string, LuminaSignal>;
    missingDimensions: string[];
    changes: LuminaChange[];
    createdAt: string;
  } | null;
  isDiagnostic: false;
};

export type LuminaMemory = {
  id: string;
  category: string;
  content: string;
  status: "CANDIDATE" | "ACTIVE";
  confidence: number;
  confirmedAt: string | null;
  updatedAt: string;
};

export type Exercise = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "BREATHING" | "GROUNDING" | "SLEEP" | "RELAXATION" | "ACTIVITY" | "OTHER";
  durationMinutes: number | null;
  content: unknown;
};
export type AssignedExercise = {
  id: string;
  frequency: string | null;
  note: string | null;
  startsAt: string | null;
  endsAt: string | null;
  exercise: Exercise;
  completionCount: number;
  lastCompletedAt: string | null;
};

export type ReportInsightCode =
  | "LOW_DATA" | "MOOD_UP" | "MOOD_DOWN" | "MOOD_STEADY" | "SLEEP_LOW" | "SLEEP_GOOD" | "STRESS_HIGH"
  | "CONSISTENT" | "BUILD_HABIT" | "GOALS_STRONG" | "GOALS_LOW" | "EXERCISES_DONE"
  | "MEDICATION_STEADY" | "MEDICATION_MISSED";
export type ReportInsight = { code: ReportInsightCode; tone: "positive" | "neutral" | "attention"; value: number | null };

export type ReportListItem = {
  weekStart: string;
  weekEnd: string;
  status: "READY" | "IN_PROGRESS";
  hasEnoughData: boolean;
  checkinDays: number;
  journalEntries: number;
  moodAverage: number | null;
  moodDelta: number | null;
  consistency: number;
  moodSeries: (number | null)[];
  highlights: ReportInsight[];
  clinicianReleased: boolean;
};

export type ReportDetail = {
  weekStart: string;
  weekEnd: string;
  status: "READY" | "IN_PROGRESS";
  checkinDays: number;
  journalEntries: number;
  journalDays: number;
  activeDays: number;
  consistency: number;
  averages: { mood: number | null; energy: number | null; stress: number | null; sleepHours: number | null; focus: number | null; routine: number | null; social: number | null; tasks: number | null };
  journal: { moodAverage: number | null; goalAverage: number | null };
  moodDelta: number | null;
  days: { date: string; mood: number | null; sleepHours: number | null; checkedIn: boolean; journaled: boolean }[];
  bestDay: { date: string; mood: number } | null;
  hardestDay: { date: string; mood: number } | null;
  topEmotions: { emotion: string; count: number }[];
  exercisesCompleted: number;
  medication: { taken: number; missed: number; skipped: number; adherence: number | null };
  insights: ReportInsight[];
  hasEnoughData: boolean;
  clinician: { id: string; headline: string | null; content: unknown; note: string | null; patientNote: string | null; releasedAt: string } | null;
};

export type Consent = {
  assignmentId: string;
  status: "PENDING" | "ACTIVE" | string;
  assignedAt: string;
  consentedAt: string | null;
  clinician: { firstName: string; lastName: string; role: string };
  monitoring: { clinicName: string | null; emergencyNumber: string | null };
  categories: { diagnostics: boolean; mood: boolean; sleep: boolean; medication: boolean; exercises: boolean; journal: "NONE" | "FLAGGED_EXCERPTS" | "FULL" };
  safetyAlertsConsentAt: string | null;
  monitoringNoticeAckAt: string | null;
};

export type SubscriptionInfo = {
  hasActiveSubscription?: boolean;
  status?: string;
  plan?: { id?: string; name?: string } | null;
  [key: string]: unknown;
};
