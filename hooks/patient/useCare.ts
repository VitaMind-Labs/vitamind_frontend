"use client";

import { useCallback, useState } from "react";
import { careApi, clinicalApi, profileApi, type ConsentInput } from "@/lib/api/patient";
import { CONSENT_VERSION } from "@/lib/patient/consent";
import type { AssignedExercise, Consent, Exercise, OrientationConsent } from "@/lib/api/patient-types";
import { invalidatePatientData, usePatientResource } from "@/hooks/usePatientResource";

/** Exercises assigned by the care team (empty for patients without one). */
export function useAssignedExercises() {
  return usePatientResource<AssignedExercise[]>("care:assigned", async () => (await careApi.exercises()).data, { staleMs: 30_000 });
}

/** Self-guided exercises anyone can do. */
export function useExerciseCatalog() {
  return usePatientResource<Exercise[]>("care:catalog", async () => (await careApi.exerciseCatalog()).data, { staleMs: 300_000 });
}

/** Exercise ids the patient already completed today. */
export function useCompletedToday() {
  return usePatientResource<string[]>("care:today", async () => (await careApi.completionsToday()).data.map((row) => row.exerciseId), { staleMs: 15_000 });
}

export function useCompleteExercise() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const complete = useCallback(async (input: { exerciseId: string; assignmentId?: string; durationSeconds?: number }) => {
    setBusyId(input.exerciseId);
    try {
      await careApi.completeExercise(input);
      invalidatePatientData("care");
      invalidatePatientData("reports");
    } finally {
      setBusyId(null);
    }
  }, []);
  return { complete, busyId };
}

export function useConsents() {
  const resource = usePatientResource<Consent[]>("clinical:consents", async () => (await clinicalApi.consents()).data, { staleMs: 20_000 });

  const update = useCallback(async (assignmentId: string, input: ConsentInput) => {
    await clinicalApi.updateConsent(assignmentId, input);
    invalidatePatientData("clinical:consents");
  }, []);

  const reconfirm = useCallback(async (assignmentId: string, input?: ConsentInput) => {
    await clinicalApi.reconfirm(assignmentId, input);
    invalidatePatientData("clinical:consents");
  }, []);

  return { ...resource, update, reconfirm };
}

/** The consent to orientation and follow-up on file; accepting or withdrawing it updates the screen. */
export function useOrientationConsent() {
  const resource = usePatientResource<OrientationConsent>("profile:orientation-consent", async () => (await profileApi.orientationConsent()).data, { staleMs: 20_000 });
  const set = useCallback(async (granted: boolean) => {
    await profileApi.setOrientationConsent(granted, granted ? CONSENT_VERSION : undefined);
    invalidatePatientData("profile:orientation-consent");
  }, []);
  return { ...resource, set };
}
