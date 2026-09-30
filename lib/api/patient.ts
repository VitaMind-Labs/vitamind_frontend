import { api } from "./client";
import type {
  AssignedExercise,
  Checkin,
  CheckinPlan,
  CheckinResult,
  Consent,
  Exercise,
  JournalEntry,
  JournalInsights,
  LuminaChatReply,
  LuminaConversation,
  LuminaMemory,
  LuminaPage,
  LuminaState,
  LuminaTurn,
  Paginated,
  Profile,
  ReportDetail,
  ReportListItem,
  SparkChatReply,
  SparkMemory,
  SparkPatternProgress,
  SparkOutcomeName,
  SparkState,
  SparkTask,
  SparkTaskStatus,
  SparkTurn,
} from "./patient-types";

/**
 * Signed-in patient space — `/api/v1/me/*` (patient-daily, patient-care and
 * patient-clinical controllers). Every call is authorized by the patient token;
 * the backend derives ownership from it, never from ids in the body.
 */

type Scale = number; // 0–10 self-report
export type LocalDay = string; // YYYY-MM-DD
export type DayRange = { from?: LocalDay; to?: LocalDay };

export type JournalEntryType = "DAILY" | "EMOTIONAL" | "THERAPY" | "GRATITUDE" | "CRISIS";
export type IntakeStatus = "TAKEN" | "MISSED" | "SKIPPED";
export type InterventionResult = "EFFECTIVE" | "PARTIALLY_EFFECTIVE" | "INEFFECTIVE" | "UNCERTAIN";
export type InterventionEngagement = "OFFERED" | "ACCEPTED" | "STARTED" | "COMPLETED" | "DECLINED" | "UNKNOWN";
export type JournalShareLevel = "NONE" | "FLAGGED_EXCERPTS" | "FULL";

export type OnboardingKey =
  | "preferred_name" | "tone" | "checkin_time" | "main_goal" | "good_day" | "sleep_pattern" | "daily_rhythm"
  | "energy_rhythm" | "focus_challenge" | "early_signs" | "stressors" | "support_people" | "medication_routine"
  | "social_life" | "helps" | "anything_else";

export type CheckinInput = {
  date?: LocalDay;
  moodScore: Scale;
  energyLevel?: Scale;
  anxietyLevel?: Scale;
  focusLevel?: Scale;
  routineStability?: Scale;
  socialConnection?: Scale;
  taskCompletion?: Scale;
  sleepHours?: number;
  medicationTaken?: boolean;
};

export type JournalEntryInput = {
  title?: string;
  content: string;
  entryType?: JournalEntryType;
  moodScore?: Scale;
  /** 1–10: how much of the day's goals were achieved. */
  goalScore?: number;
  emotions?: string[];
  tags?: string[];
  isPrivate?: boolean;
};

export type ConsentInput = {
  shareDiagnostics?: boolean;
  shareMoodData?: boolean;
  shareSleepData?: boolean;
  shareMedication?: boolean;
  shareExercises?: boolean;
  journalShare?: JournalShareLevel;
  safetyAlertsConsent?: boolean;
  monitoringNoticeAccepted?: boolean;
};

const id = (value: string) => encodeURIComponent(value);

export const profileApi = {
  get: () => api.get<Profile>("/me"),
  update: (input: { nickname?: string; language?: "EN" | "AR" }) => api.patch<Profile>("/me", input),
  saveAnswers: (answers: { key: OnboardingKey; value: string }[]) =>
    api.post<{ saved: number }>("/me/onboarding/answers", { answers }),
  completeOnboarding: () => api.post<Profile>("/me/onboarding/complete"),
};

export const checkinsApi = {
  create: (input: CheckinInput) => api.post<CheckinResult>("/me/checkins", input),
  plan: (date?: LocalDay) => api.get<{ data: CheckinPlan }>("/me/checkins/plan", { date }),
  today: (date?: LocalDay) => api.get<{ data: Checkin | null }>("/me/checkins/today", { date }),
  list: (range: DayRange = {}) => api.get<{ data: Checkin[]; meta: { from: string; to: string; count: number } }>("/me/checkins", range),
};

export const journalApi = {
  create: (input: JournalEntryInput) => api.post<JournalEntry>("/me/journal", input),
  list: (query: DayRange & { page?: number; limit?: number } = {}) => api.get<Paginated<JournalEntry>>("/me/journal", query),
  insights: (days = 30) => api.get<{ data: JournalInsights }>("/me/journal/insights", { days }),
  get: (entryId: string) => api.get<JournalEntry>(`/me/journal/${id(entryId)}`),
  update: (entryId: string, input: Partial<JournalEntryInput>) => api.patch<JournalEntry>(`/me/journal/${id(entryId)}`, input),
  analyze: (entryId: string) => api.post<JournalEntry>(`/me/journal/${id(entryId)}/analyze`),
  remove: (entryId: string) => api.delete<{ success: boolean }>(`/me/journal/${id(entryId)}`),
  /** The excerpt must be copied verbatim from the entry. */
  shareExcerpt: (entryId: string, excerpt: string) =>
    api.post<{ id: string; content: string; sharedAt: string }>(`/me/journal/${id(entryId)}/excerpts`, { excerpt }),
  unshareExcerpt: (excerptId: string) => api.delete<{ success: boolean }>(`/me/journal/excerpts/${id(excerptId)}`),
};

export const luminaApi = {
  /**
   * One turn. With `conversationId` it continues that thread; without one the backend opens a new
   * thread (returned as `conversationId`). Reuse the same `clientMessageId` (UUID) when retrying.
   */
  chat: (input: { text: string; deep?: boolean; clientMessageId?: string; conversationId?: string }) =>
    api.post<LuminaChatReply>("/me/lumina/chat", input),
  /** Open a new thread with its first message (a thread never exists empty). */
  startConversation: (input: { text: string; deep?: boolean; clientMessageId?: string }) =>
    api.post<LuminaChatReply>("/me/lumina/conversations", input),
  conversations: (query: { limit?: number; before?: string } = {}) =>
    api.get<LuminaPage<LuminaConversation>>("/me/lumina/conversations", query),
  /** One thread's turns, oldest first, with intervention cards and crisis resources restored. */
  conversationMessages: (conversationId: string, query: { limit?: number; before?: string } = {}) =>
    api.get<LuminaPage<LuminaChatReply> & { conversation: Omit<LuminaConversation, "turnCount"> }>(
      `/me/lumina/conversations/${id(conversationId)}/messages`, query),
  /** Every turn across threads, check-in replies included. */
  history: (query: { limit?: number; before?: string } = {}) => api.get<LuminaPage<LuminaTurn>>("/me/lumina/history", query),
  state: () => api.get<LuminaState>("/me/lumina/state"),
  memories: () => api.get<{ data: LuminaMemory[] }>("/me/lumina/memories"),
  decideMemory: (memoryId: string, action: "CONFIRM" | "REJECT") =>
    api.patch<{ id: string; status: string }>(`/me/lumina/memories/${id(memoryId)}`, { action }),
  interactionOutcome: (interactionId: string, input: { result: InterventionResult; engagement?: InterventionEngagement }) =>
    api.post<{ id: string; result: InterventionResult }>(`/me/lumina/interactions/${id(interactionId)}/outcome`, input),
};

/**
 * Spark, the ADHD assistant. Every route is refused (403, code SPARK_ADHD_ONLY) unless the
 * backend's own record says the patient is on the ADHD track - nothing here sends a condition.
 */
export const sparkApi = {
  /** Reuse the same `clientMessageId` (UUID) when retrying so the turn is not duplicated. */
  chat: (input: { text: string; clientMessageId?: string; localDate?: LocalDay; localTime?: string; availableMinutes?: number }) =>
    api.post<SparkChatReply>("/me/spark/chat", input),
  state: () => api.get<SparkState>("/me/spark/state"),
  history: (query: { limit?: number; before?: string } = {}) =>
    api.get<{ data: SparkTurn[]; meta: { limit: number; nextBefore: string | null } }>("/me/spark/history", query),
  tasks: (status: SparkTaskStatus = "TODO") => api.get<{ data: SparkTask[] }>("/me/spark/tasks", { status }),
  completeTask: (taskId: string) => api.post<SparkTask>(`/me/spark/tasks/${id(taskId)}/complete`, {}),
  recordOutcome: (input: { outcome: SparkOutcomeName; taskId?: string; focusMinutes?: 5 | 10 | 15 | 25; localHour?: number; attemptId?: string }) =>
    api.post<{ id: string; attemptId: string; replayed: boolean }>("/me/spark/outcomes", input),
  /** What Spark learned (ACTIVE) or proposes (CANDIDATE) - Spark's own memories only. */
  memories: () => api.get<{ data: SparkMemory[]; progress?: SparkPatternProgress }>("/me/spark/memories"),
  /** Confirming only activates a pattern; its evidence and confidence stay as Spark observed them. */
  decideMemory: (memoryId: string, action: "CONFIRM" | "REJECT") =>
    api.patch<{ id: string; status: string }>(`/me/spark/memories/${id(memoryId)}`, { action }),
};

export const careApi = {
  medications: () => api.get<{ data: { id: string; name: string; dosage: string | null; frequency: string | null }[] }>("/me/medications"),
  intakes: (range: DayRange = {}) => api.get<{ data: { id: string; medicationId: string; scheduledAt: string; status: IntakeStatus }[] }>("/me/medications/intakes", range),
  logIntake: (medicationId: string, input: { scheduledAt: string; status: IntakeStatus; takenAt?: string }) =>
    api.post<unknown>(`/me/medications/${id(medicationId)}/intakes`, input),
  exercises: () => api.get<{ data: AssignedExercise[] }>("/me/exercises"),
  exerciseCatalog: () => api.get<{ data: Exercise[] }>("/me/exercises/catalog"),
  completionsToday: () => api.get<{ data: { id: string; exerciseId: string; assignmentId: string | null; completedAt: string }[] }>("/me/exercises/completions/today"),
  completeExercise: (input: { exerciseId: string; assignmentId?: string; durationSeconds?: number }) =>
    api.post<{ id: string; completedAt: string }>("/me/exercises/completions", input),
  messages: (assignmentId: string) => api.get<unknown>("/me/messages", { assignmentId }),
  sendMessage: (input: { assignmentId: string; content: string; isUrgent?: boolean }) => api.post<unknown>("/me/messages", input),
};

export const reportsApi = {
  list: (limit = 12) => api.get<{ data: ReportListItem[]; meta: { firstWeek: string; currentWeek: string; count: number } }>("/me/reports", { limit }),
  get: (weekStart: LocalDay) => api.get<{ data: ReportDetail }>(`/me/reports/${id(weekStart)}`),
};

export const clinicalApi = {
  consents: () => api.get<{ data: Consent[] }>("/me/consents"),
  consent: (assignmentId: string) => api.get<Consent>(`/me/consents/${id(assignmentId)}`),
  updateConsent: (assignmentId: string, input: ConsentInput) => api.patch<unknown>(`/me/consents/${id(assignmentId)}`, input),
  latestWeeklyReport: () => api.get<unknown>("/me/weekly-reports/latest"),
  weeklyNote: (note: string) => api.patch<unknown>("/me/weekly-note", { note }),
  sessionPreNote: (sessionId: string, note: string) => api.patch<unknown>(`/me/sessions/${id(sessionId)}/pre-note`, { note }),
};
