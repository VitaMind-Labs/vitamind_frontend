'use client';

import { DiseaseType } from './diseases';

const KEYS = {
  USER: 'lumina_user',
  DISEASE: 'lumina_disease',
  SUBSCRIPTION: 'lumina_subscription',
  JOURNAL_ENTRIES: 'lumina_journal_entries',
  CHAT_MESSAGES: 'lumina_chat_messages',
  JOURNAL_RATINGS: 'lumina_journal_ratings',
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail
  }
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  password: string;
  disease: DiseaseType;
  createdAt: string;
}

export interface SubscriptionData {
  plan: 'essential' | 'pro';
  price: number;
  startDate: string;
  status: 'active' | 'inactive';
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

// User
export function getUser(): UserData | null {
  return getItem<UserData | null>(KEYS.USER, null);
}

export function setUser(user: UserData): void {
  setItem(KEYS.USER, user);
}

export function clearUser(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(KEYS.USER);
}

// Disease
export function getDisease(): DiseaseType | null {
  return getItem<DiseaseType | null>(KEYS.DISEASE, null);
}

export function setDisease(disease: DiseaseType): void {
  setItem(KEYS.DISEASE, disease);
}

// Subscription
export function getSubscription(): SubscriptionData | null {
  return getItem<SubscriptionData | null>(KEYS.SUBSCRIPTION, null);
}

export function setSubscription(sub: SubscriptionData): void {
  setItem(KEYS.SUBSCRIPTION, sub);
}

// Journal
export function getJournalEntries(): JournalEntry[] {
  return getItem<JournalEntry[]>(KEYS.JOURNAL_ENTRIES, []);
}

export function addJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries();
  entries.unshift(entry);
  setItem(KEYS.JOURNAL_ENTRIES, entries);
}

// Chat
export function getChatMessages(): ChatMessage[] {
  return getItem<ChatMessage[]>(KEYS.CHAT_MESSAGES, []);
}

export function addChatMessage(msg: ChatMessage): void {
  const msgs = getChatMessages();
  msgs.push(msg);
  setItem(KEYS.CHAT_MESSAGES, msgs);
}

export function clearChatMessages(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(KEYS.CHAT_MESSAGES);
}
