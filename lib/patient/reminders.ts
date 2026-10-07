"use client";

/**
 * Daily check-in reminder preferences. They live on the device on purpose: browser
 * notification permission is per browser, and the reminder only fires while SynQ
 * is open (no push service yet).
 */
export type ReminderPrefs = { enabled: boolean; time: string; browser: boolean };

const PREFS_KEY = "vitamind_reminder_prefs";
const FIRED_KEY = "vitamind_reminder_fired";
const READ_KEY = "vitamind_notifications_read";
const CHANGE_EVENT = "vitamind-reminders-change";

export const DEFAULT_REMINDER: ReminderPrefs = { enabled: true, time: "20:00", browser: false };

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the preference just won't persist */
  }
}

/** Raw snapshot (a stable string) for useSyncExternalStore. */
export function readReminderSnapshot(): string {
  return read(PREFS_KEY) ?? "";
}

export function parseReminderPrefs(raw: string): ReminderPrefs {
  if (!raw) return DEFAULT_REMINDER;
  try {
    const parsed = JSON.parse(raw) as Partial<ReminderPrefs>;
    return {
      enabled: parsed.enabled ?? DEFAULT_REMINDER.enabled,
      time: /^\d{2}:\d{2}$/.test(parsed.time ?? "") ? (parsed.time as string) : DEFAULT_REMINDER.time,
      browser: parsed.browser ?? DEFAULT_REMINDER.browser,
    };
  } catch {
    return DEFAULT_REMINDER;
  }
}

export function saveReminderPrefs(prefs: ReminderPrefs) {
  write(PREFS_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeReminders(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function reminderAlreadyFired(day: string): boolean {
  return read(FIRED_KEY) === day;
}

export function markReminderFired(day: string) {
  write(FIRED_KEY, day);
}

/** Raw snapshot of the read ids (a stable string) for useSyncExternalStore. */
export function readNotificationSnapshot(): string {
  return read(READ_KEY) ?? "";
}

export function readNotificationIds(): Set<string> {
  try {
    return new Set(JSON.parse(read(READ_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function saveNotificationIds(ids: Set<string>) {
  // Only the most recent ids matter; keep the list from growing forever.
  write(READ_KEY, JSON.stringify([...ids].slice(-60)));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** minutes since midnight of an "HH:MM" string */
export function minutesOf(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
