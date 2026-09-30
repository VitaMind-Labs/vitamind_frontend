"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { checkinsApi, type CheckinInput } from "@/lib/api/patient";
import type { Checkin, CheckinPlan, CheckinResult } from "@/lib/api/patient-types";
import { currentStreak, localDay } from "@/lib/patient/format";
import { invalidatePatientData, usePatientResource } from "@/hooks/usePatientResource";

/** Today's check-in, or null when the patient has not checked in yet. */
export function useTodayCheckin() {
  const day = localDay();
  return usePatientResource<Checkin | null>(`checkins:today:${day}`, async () => (await checkinsApi.today(day)).data);
}

/** Which questions to ask today and what to acknowledge first (adapted server-side). */
export function useCheckinPlan() {
  const day = localDay();
  return usePatientResource<CheckinPlan>(`checkins:plan:${day}`, async () => (await checkinsApi.plan(day)).data, { staleMs: 5_000 });
}

/** The last `days` check-ins, oldest first, plus the streak they imply. */
export function useCheckinHistory(days = 30) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  const range = { from: localDay(from), to: localDay(to) };
  const resource = usePatientResource<Checkin[]>(`checkins:list:${range.from}:${range.to}`, async () => (await checkinsApi.list(range)).data);
  const streak = resource.data ? currentStreak(resource.data.map((row) => row.checkinDate)) : 0;
  return { ...resource, streak };
}

export function useSubmitCheckin() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | Error | null>(null);

  const submit = useCallback(async (input: CheckinInput): Promise<CheckinResult | null> => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await checkinsApi.create({ ...input, date: localDay() });
      invalidatePatientData("checkins");
      invalidatePatientData("lumina:state");
      invalidatePatientData("reports");
      return result;
    } catch (caught) {
      setError(caught instanceof Error ? caught : new Error("Request failed"));
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, error, clearError: () => setError(null) };
}
