"use client";

import { billingApi, type MySubscription } from "@/lib/api/billing";
import { isAuthenticated } from "@/lib/api/tokens";
import { usePatientResource } from "@/hooks/usePatientResource";

/**
 * The signed-in patient's subscription, read from the database (`/me/subscription`).
 * `data` is undefined while loading and for visitors who are not signed in.
 * After a payment call `invalidatePatientData("billing")` to refresh it everywhere.
 */
export function useCurrentSubscription() {
  return usePatientResource<MySubscription | null>(
    isAuthenticated() ? "billing:subscription" : null,
    () => billingApi.mySubscription(),
    { staleMs: 10_000 },
  );
}
