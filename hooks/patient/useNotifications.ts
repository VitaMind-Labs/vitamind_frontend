"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReports } from "@/hooks/patient/useReports";
import { useTodayCheckin } from "@/hooks/patient/useCheckin";
import { fill } from "@/lib/i18n/patient";
import { formatRange, localDay } from "@/lib/patient/format";
import {
  markReminderFired,
  minutesOf,
  parseReminderPrefs,
  readNotificationIds,
  readNotificationSnapshot,
  readReminderSnapshot,
  reminderAlreadyFired,
  saveNotificationIds,
  subscribeReminders,
} from "@/lib/patient/reminders";

export type AppNotification = {
  id: string;
  kind: "checkin" | "report";
  title: string;
  body: string;
  href: string;
  read: boolean;
};

const serverSnapshot = () => "";

export function useReminderPrefs() {
  const raw = useSyncExternalStore(subscribeReminders, readReminderSnapshot, serverSnapshot);
  return useMemo(() => parseReminderPrefs(raw), [raw]);
}

/**
 * The patient's notification center, derived from what is true right now:
 *  - "time for your daily check-in" while today's check-in is missing;
 *  - "your weekly report is ready" for the latest finished week they have not opened.
 * Read state lives on the device. When the browser permission is granted, the same
 * reminder also fires as a system notification at the chosen time (while the app is open).
 */
export function useNotifications() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const router = useRouter();
  const prefs = useReminderPrefs();
  const today = useTodayCheckin();
  const reports = useReports(2);
  // The read-state snapshot re-renders us whenever it changes on this or another tab.
  const readSnapshot = useSyncExternalStore(subscribeReminders, readNotificationSnapshot, serverSnapshot);

  const items = useMemo<AppNotification[]>(() => {
    const read = new Set<string>(readSnapshot ? (JSON.parse(readSnapshot) as string[]) : []);
    const list: AppNotification[] = [];
    if (today.data === null) {
      const id = `checkin:${localDay()}`;
      list.push({ id, kind: "checkin", title: copy.shell.notifications.checkinTitle, body: copy.shell.notifications.checkinBody, href: "/dashboard/check-in", read: read.has(id) });
    }
    const ready = reports.data?.data.find((report) => report.status === "READY" && report.hasEnoughData);
    if (ready) {
      const id = `report:${ready.weekStart}`;
      list.push({
        id,
        kind: "report",
        title: copy.shell.notifications.reportTitle,
        body: fill(copy.shell.notifications.reportBody, { range: formatRange(ready.weekStart, ready.weekEnd, language) }),
        href: "/dashboard/reports",
        read: read.has(id),
      });
    }
    return list;
  }, [today.data, reports.data, copy, language, readSnapshot]);

  const markRead = useCallback((id: string) => {
    const ids = readNotificationIds();
    ids.add(id);
    saveNotificationIds(ids);
  }, []);

  const markAllRead = useCallback(() => {
    const ids = readNotificationIds();
    items.forEach((item) => ids.add(item.id));
    saveNotificationIds(ids);
  }, [items]);

  // System notification at the reminder time, at most once a day, only while a check-in is due.
  const dueToday = today.data === null && !today.isLoading;
  useEffect(() => {
    if (!prefs.enabled || !prefs.browser || !dueToday) return;
    if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return;

    const tick = () => {
      const now = new Date();
      const day = localDay(now);
      if (reminderAlreadyFired(day)) return;
      if (now.getHours() * 60 + now.getMinutes() < minutesOf(prefs.time)) return;
      markReminderFired(day);
      const notification = new Notification(copy.shell.notifications.checkinTitle, {
        body: copy.shell.notifications.checkinBody,
        icon: "/logo.png",
        tag: `vitamind-checkin-${day}`,
      });
      notification.onclick = () => {
        window.focus();
        router.push("/dashboard/check-in");
        notification.close();
      };
    };
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [prefs.enabled, prefs.browser, prefs.time, dueToday, copy, router]);

  const visible = prefs.enabled ? items : items.filter((item) => item.kind !== "checkin");
  return { items: visible, unreadCount: visible.filter((item) => !item.read).length, markRead, markAllRead };
}
